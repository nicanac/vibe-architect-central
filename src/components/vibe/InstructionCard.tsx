"use client";

import Link from "next/link";
import { 
  Instruction, 
  INSTRUCTION_CATEGORIES, 
  INSTRUCTION_AGENT_TYPES,
  INSTRUCTION_DIFFICULTIES 
} from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { Copy, Download, ExternalLink, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVibeClipboard } from "@/lib/hooks/useVibeClipboard";

interface InstructionCardProps {
  instruction: Instruction;
  showContent?: boolean;
}

export function InstructionCard({ instruction, showContent = false }: InstructionCardProps) {
  const { copy } = useVibeClipboard({ successMessage: `${instruction.title} copied!` });
  const categoryMeta = INSTRUCTION_CATEGORIES[instruction.category];
  const difficultyMeta = INSTRUCTION_DIFFICULTIES[instruction.difficulty];

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await copy(instruction.content);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const extension = instruction.file_format === "markdown" ? "md" : instruction.file_format;
    const filename = `${instruction.slug}.${extension}`;
    const blob = new Blob([instruction.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Link 
      href={`/instructions/${instruction.category}/${instruction.slug}`}
      className="group block"
    >
      <article className="vibe-glass rounded-industrial border border-border p-4 h-full transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {/* Category Icon */}
            <span className="text-xl" title={categoryMeta.label}>
              {categoryMeta.icon}
            </span>
            
            {/* Title */}
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {instruction.title}
            </h3>
          </div>
          
          {/* Difficulty Badge */}
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full border border-current/20",
            difficultyMeta.color
          )}>
            {difficultyMeta.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {instruction.description}
        </p>

        {/* Agent Types */}
        <div className="flex flex-wrap gap-1 mb-3">
          {instruction.agent_types.map((agentType) => {
            const meta = INSTRUCTION_AGENT_TYPES[agentType];
            return (
              <span 
                key={agentType}
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full text-white/90",
                  meta.color
                )}
                title={meta.label}
              >
                {meta.icon} {meta.label}
              </span>
            );
          })}
        </div>

        {/* Tags */}
        {instruction.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {instruction.tags.slice(0, 4).map((tag) => (
              <span 
                key={tag}
                className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
            {instruction.tags.length > 4 && (
              <span className="text-xs text-muted-foreground">
                +{instruction.tags.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Preview Content */}
        {showContent && (
          <div className="mb-3 p-2 bg-muted/50 rounded border border-border">
            <pre className="text-xs text-muted-foreground overflow-hidden line-clamp-3 font-mono">
              {instruction.content.slice(0, 200)}...
            </pre>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {instruction.view_count}
            </span>
            <span className="flex items-center gap-1">
              <Copy className="w-3 h-3" />
              {instruction.copy_count}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={handleDownload}
              title="Download file"
            >
              <Download className="w-3.5 h-3.5" />
            </Button>
            {instruction.source_url && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(instruction.source_url!, "_blank");
                }}
                title="View source"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

// Compact version for sidebars and lists
export function InstructionCardCompact({ instruction }: { instruction: Instruction }) {
  const categoryMeta = INSTRUCTION_CATEGORIES[instruction.category];

  return (
    <Link 
      href={`/instructions/${instruction.category}/${instruction.slug}`}
      className="group flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors"
    >
      <span className="text-lg">{categoryMeta.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground group-hover:text-primary truncate">
          {instruction.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {instruction.description}
        </p>
      </div>
    </Link>
  );
}
