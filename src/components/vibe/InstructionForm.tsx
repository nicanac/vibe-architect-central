"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  INSTRUCTION_CATEGORIES, 
  INSTRUCTION_AGENT_TYPES,
  INSTRUCTION_DIFFICULTIES,
  InstructionCategory,
  InstructionAgentType,
  InstructionDifficulty,
  InstructionFileFormat,
  Instruction
} from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { createInstruction, updateInstruction } from "@/app/actions/instructions";
import { CodeBlock } from "@/components/ui/code-block";
import { cn } from "@/lib/utils";
import { Eye, Code, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface InstructionFormProps {
  instruction?: Instruction;
  mode?: "create" | "edit";
}

export function InstructionForm({ instruction, mode = "create" }: InstructionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState(instruction?.title || "");
  const [description, setDescription] = useState(instruction?.description || "");
  const [content, setContent] = useState(instruction?.content || "");
  const [category, setCategory] = useState<InstructionCategory>(instruction?.category || "skill");
  const [agentTypes, setAgentTypes] = useState<InstructionAgentType[]>(instruction?.agent_types || ["other"]);
  const [difficulty, setDifficulty] = useState<InstructionDifficulty>(instruction?.difficulty || "intermediate");
  const [fileFormat, setFileFormat] = useState<InstructionFileFormat>(instruction?.file_format || "markdown");
  const [tags, setTags] = useState(instruction?.tags?.join(", ") || "");
  const [usageExample, setUsageExample] = useState(instruction?.usage_example || "");

  const toggleAgentType = (type: InstructionAgentType) => {
    if (agentTypes.includes(type)) {
      if (agentTypes.length > 1) {
        setAgentTypes(agentTypes.filter(t => t !== type));
      }
    } else {
      setAgentTypes([...agentTypes, type]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("description", description);
    formData.set("content", content);
    formData.set("category", category);
    formData.set("difficulty", difficulty);
    formData.set("file_format", fileFormat);
    formData.set("tags", tags);
    formData.set("usage_example", usageExample);
    agentTypes.forEach(type => formData.append("agent_types", type));

    startTransition(async () => {
      const result = mode === "edit" && instruction
        ? await updateInstruction(instruction.id, formData)
        : await createInstruction(formData);

      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success(mode === "edit" ? "Instruction updated!" : "Instruction created!");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., /apex - Systematic Implementation Workflow"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A brief description of what this instruction does..."
          rows={2}
          required
        />
      </div>

      {/* Category & Difficulty Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category */}
        <div className="space-y-2">
          <Label>Category *</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as InstructionCategory)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(INSTRUCTION_CATEGORIES).map(([key, meta]) => (
                <SelectItem key={key} value={key}>
                  {meta.icon} {meta.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <Label>Difficulty *</Label>
          <Select value={difficulty} onValueChange={(v) => setDifficulty(v as InstructionDifficulty)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(INSTRUCTION_DIFFICULTIES).map(([key, meta]) => (
                <SelectItem key={key} value={key}>
                  <span className={meta.color}>{meta.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Agent Types */}
      <div className="space-y-2">
        <Label>Compatible Agents *</Label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(INSTRUCTION_AGENT_TYPES).map(([key, meta]) => {
            const isSelected = agentTypes.includes(key as InstructionAgentType);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleAgentType(key as InstructionAgentType)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm transition-colors border",
                  isSelected
                    ? `${meta.color} text-white border-transparent`
                    : "bg-transparent border-border hover:border-primary"
                )}
              >
                {meta.icon} {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* File Format */}
      <div className="space-y-2">
        <Label>File Format *</Label>
        <Select value={fileFormat} onValueChange={(v) => setFileFormat(v as InstructionFileFormat)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="markdown">Markdown (.md)</SelectItem>
            <SelectItem value="json">JSON (.json)</SelectItem>
            <SelectItem value="yaml">YAML (.yaml)</SelectItem>
            <SelectItem value="toml">TOML (.toml)</SelectItem>
            <SelectItem value="text">Plain Text (.txt)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="git, automation, workflow, debugging"
        />
      </div>

      {/* Usage Example */}
      <div className="space-y-2">
        <Label htmlFor="usage_example">Usage Example (optional)</Label>
        <Textarea
          id="usage_example"
          value={usageExample}
          onChange={(e) => setUsageExample(e.target.value)}
          placeholder="/apex add user authentication"
          rows={2}
          className="font-mono text-sm"
        />
      </div>

      {/* Content with Preview Toggle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="content">Instruction Content *</Label>
          <div className="flex gap-1">
            <Button
              type="button"
              variant={!showPreview ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowPreview(false)}
            >
              <Code className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              type="button"
              variant={showPreview ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowPreview(true)}
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
          </div>
        </div>
        
        {showPreview ? (
          <CodeBlock 
            code={content || "// Enter your instruction content..."} 
            language={fileFormat}
            showLineNumbers
          />
        ) : (
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="# Your Instruction Content

Enter the full instruction, command definition, skill workflow, or agent configuration here.

Use markdown formatting for best results."
            rows={15}
            className="font-mono text-sm"
            required
          />
        )}
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isPending} className="flex-1 sm:flex-none">
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {mode === "edit" ? "Updating..." : "Creating..."}
            </>
          ) : (
            mode === "edit" ? "Update Instruction" : "Submit Instruction"
          )}
        </Button>
        <Button 
          type="button" 
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
