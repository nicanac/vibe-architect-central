"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Search,
  Wrench,
  FileText,
  Sparkles,
  Zap,
  Rocket,
  Plus,
  Bot,
} from "lucide-react";
import { Tool, Prompt, VibeLevel } from "@/lib/supabase/types";

interface CommandSearchProps {
  tools: Tool[];
  prompts: Prompt[];
}

const vibeLevelIcon: Record<VibeLevel, React.ReactNode> = {
  "no-code": <Sparkles className="h-4 w-4 text-emerald-400" />,
  "low-code": <Zap className="h-4 w-4 text-blue-400" />,
  "agentic": <Bot className="h-4 w-4 text-purple-400" />,
  "pro-orchestration": <Rocket className="h-4 w-4 text-amber-400" />,
};

export function CommandSearch({ tools, prompts }: CommandSearchProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleToolSelect = (tool: Tool) => {
    setOpen(false);
    window.open(tool.url, "_blank");
  };

  const handlePromptSelect = (prompt: Prompt) => {
    setOpen(false);
    // Copy prompt to clipboard
    navigator.clipboard.writeText(prompt.content);
  };

  const handleNavigate = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-surface/50 border border-white/10 rounded-md hover:bg-surface hover:border-primary-accent/50 transition-all group"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-white/20 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search tools, prompts, or actions..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => handleNavigate("/submit")}>
              <Plus className="mr-2 h-4 w-4 text-neon-success" />
              <span>Submit New Tool or Prompt</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Tools">
            {tools.map((tool) => (
              <CommandItem
                key={tool.id}
                value={`tool-${tool.name}-${tool.description}`}
                onSelect={() => handleToolSelect(tool)}
              >
                <Wrench className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="flex-1">{tool.name}</span>
                {vibeLevelIcon[tool.vibe_level]}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Prompts">
            {prompts.map((prompt) => (
              <CommandItem
                key={prompt.id}
                value={`prompt-${prompt.title}-${prompt.technique}`}
                onSelect={() => handlePromptSelect(prompt)}
              >
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="flex-1">{prompt.title}</span>
                <span className="text-xs text-muted-foreground">
                  {prompt.target_ai}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
