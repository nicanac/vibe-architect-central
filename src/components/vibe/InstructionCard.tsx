
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Instruction } from '@/lib/supabase/types';
import {
  Terminal,
  Bot,
  Zap,
  Anchor,
  Ruler,
  MessageSquare,
  ArrowRight,
  Workflow
} from 'lucide-react';

interface InstructionCardProps {
  instruction: Instruction;
  className?: string;
  index?: number;
}

const CATEGORY_ICONS = {
  command: Terminal,
  workflow: Workflow,
  agent: Bot,
  skill: Zap,
  hook: Anchor,
  rule: Ruler,
  prompt: MessageSquare,
};

const DIFFICULTY_COLORS = {
  beginner: 'border-[var(--terminal-green)] text-[var(--terminal-green)] bg-[var(--terminal-green)]/10',
  intermediate: 'border-[var(--terminal-purple)] text-[var(--terminal-purple)] bg-[var(--terminal-purple)]/10',
  advanced: 'border-red-500 text-red-500 bg-red-500/10',
};

export function InstructionCard({ instruction, className, index = 0 }: InstructionCardProps) {
  const Icon = CATEGORY_ICONS[instruction.category] || Terminal;
  const hexIndex = `0x${(index + 1).toString(16).padStart(2, '0').toUpperCase()}`;

  return (
    <div className={cn(
      "group flex flex-col h-full border-2 border-[var(--terminal-green)]/30 hover:border-[var(--terminal-green)] transition-all p-6 relative",
      className
    )}>
      {/* Hex ID */}
      <span className="absolute top-2 right-2 text-xs text-[var(--terminal-green)]/30 font-mono">
        {hexIndex}
      </span>

      {/* Header */}
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="p-2 border-2 border-[var(--terminal-purple)] text-[var(--terminal-purple)]">
          <Icon className="w-5 h-5" />
        </div>
        <Badge variant="outline" className={cn("capitalize font-mono", DIFFICULTY_COLORS[instruction.difficulty])}>
          {instruction.difficulty}
        </Badge>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold mb-4">
        <Link 
          href={`/instructions/${instruction.category}/${instruction.slug}`}
          className="group-hover:text-[var(--terminal-green)] transition-colors line-clamp-2 uppercase font-mono text-white hover:underline decoration-2 underline-offset-4"
        >
          {instruction.title}
        </Link>
      </h3>

      {/* Description */}
      <p className="text-[var(--terminal-green)]/70 text-sm line-clamp-3 mb-4 font-mono flex-grow">
        {instruction.description}
      </p>

      {/* Agent Types */}
      <div className="flex flex-wrap gap-2 mb-4">
        {instruction.agent_types.slice(0, 3).map((agent) => (
          <Badge 
            key={agent} 
            variant="outline" 
            className="text-xs border-[var(--terminal-green)]/50 text-[var(--terminal-green)]/70 font-mono"
          >
            {agent}
          </Badge>
        ))}
        {instruction.agent_types.length > 3 && (
          <Badge 
            variant="outline" 
            className="text-xs border-[var(--terminal-green)]/50 text-[var(--terminal-green)]/70 font-mono"
          >
            +{instruction.agent_types.length - 3}
          </Badge>
        )}
      </div>

      {/* Footer */}
      <div className="border-t-2 border-[var(--terminal-green)]/30 pt-4 mt-auto">
        <Link
          href={`/instructions/${instruction.category}/${instruction.slug}`}
          className="w-full flex items-center justify-center gap-2 py-2 border-2 border-[var(--terminal-green)] text-[var(--terminal-green)] hover:bg-[var(--terminal-green)] hover:text-[var(--terminal-bg)] transition-all text-sm font-bold uppercase font-mono"
        >
          View_Instructions <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
