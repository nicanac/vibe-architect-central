export type VibeLevel =
  | "no-code"
  | "low-code"
  | "agentic"
  | "pro-orchestration";

export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  technique: string;
  vibe_level: VibeLevel;
  pricing: string;
  logo_url: string | null;
  submitted_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Prompt {
  id: string;
  title: string;
  description: string | null;
  content: string;
  target_ai: string;
  technique: string;
  submitted_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  vibe_level: VibeLevel | null;
  created_at: string;
  updated_at: string;
}

export interface FavoriteTool {
  id: string;
  user_id: string;
  tool_id: string;
  created_at: string;
  tool?: Tool;
}

export interface FavoritePrompt {
  id: string;
  user_id: string;
  prompt_id: string;
  created_at: string;
  prompt?: Prompt;
}

// ============================================
// Instructions Types
// ============================================

export type InstructionCategory = 
  | "command"   // Slash commands (/commit, /review)
  | "agent"     // Specialized AI personas
  | "skill"     // Multi-step workflows (SKILL.md)
  | "hook"      // Event-driven automation
  | "rule"      // Project-wide instructions (.cursorrules, CLAUDE.md)
  | "prompt";   // System prompts & persona definitions

export type InstructionAgentType = 
  | "copilot"     // GitHub Copilot
  | "claude"      // Claude (Anthropic)
  | "claude-code" // Claude Code CLI
  | "chatgpt"     // ChatGPT (OpenAI)
  | "gemini"      // Gemini (Google)
  | "cursor"      // Cursor IDE
  | "windsurf"    // Windsurf IDE
  | "other";      // Other AI tools

export type InstructionDifficulty = "beginner" | "intermediate" | "advanced";

export type InstructionFileFormat = "markdown" | "json" | "yaml" | "toml" | "text";

export interface Instruction {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: InstructionCategory;
  agent_types: InstructionAgentType[];
  difficulty: InstructionDifficulty;
  file_format: InstructionFileFormat;
  tags: string[];
  usage_example: string | null;
  source_url: string | null;
  submitted_by: string | null;
  view_count: number;
  copy_count: number;
  created_at: string;
  updated_at: string;
}

export interface InstructionFavorite {
  id: string;
  user_id: string;
  instruction_id: string;
  created_at: string;
  instruction?: Instruction;
}

// Category metadata for UI
export const INSTRUCTION_CATEGORIES: Record<InstructionCategory, {
  label: string;
  icon: string;
  description: string;
  color: string;
}> = {
  command: {
    label: "Commands",
    icon: "🔧",
    description: "Slash commands for quick tasks",
    color: "text-blue-400"
  },
  agent: {
    label: "Agents",
    icon: "🤖",
    description: "Specialized AI personas for specific domains",
    color: "text-purple-400"
  },
  skill: {
    label: "Skills",
    icon: "⚡",
    description: "Complex multi-step workflows",
    color: "text-yellow-400"
  },
  hook: {
    label: "Hooks",
    icon: "🪝",
    description: "Event-driven automation triggers",
    color: "text-green-400"
  },
  rule: {
    label: "Rules",
    icon: "📏",
    description: "Project-wide instructions and standards",
    color: "text-orange-400"
  },
  prompt: {
    label: "Prompts",
    icon: "💬",
    description: "System prompts and persona definitions",
    color: "text-pink-400"
  }
};

// Agent type metadata for UI
export const INSTRUCTION_AGENT_TYPES: Record<InstructionAgentType, {
  label: string;
  icon: string;
  color: string;
}> = {
  copilot: { label: "GitHub Copilot", icon: "🐙", color: "bg-gray-700" },
  claude: { label: "Claude", icon: "🟠", color: "bg-orange-600" },
  "claude-code": { label: "Claude Code", icon: "🟠", color: "bg-orange-500" },
  chatgpt: { label: "ChatGPT", icon: "🟢", color: "bg-green-600" },
  gemini: { label: "Gemini", icon: "🔵", color: "bg-blue-600" },
  cursor: { label: "Cursor", icon: "⬛", color: "bg-slate-700" },
  windsurf: { label: "Windsurf", icon: "🌊", color: "bg-cyan-600" },
  other: { label: "Other", icon: "🔷", color: "bg-zinc-600" }
};

// Difficulty metadata for UI
export const INSTRUCTION_DIFFICULTIES: Record<InstructionDifficulty, {
  label: string;
  color: string;
}> = {
  beginner: { label: "Beginner", color: "text-green-400" },
  intermediate: { label: "Intermediate", color: "text-yellow-400" },
  advanced: { label: "Advanced", color: "text-red-400" }
};

export interface Database {
  public: {
    Tables: {
      tools: {
        Row: Tool;
        Insert: Omit<Tool, "id" | "created_at">;
        Update: Partial<Omit<Tool, "id" | "created_at">>;
      };
      prompts: {
        Row: Prompt;
        Insert: Omit<Prompt, "id" | "created_at">;
        Update: Partial<Omit<Prompt, "id" | "created_at">>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at">>;
      };
      favorite_tools: {
        Row: FavoriteTool;
        Insert: Omit<FavoriteTool, "id" | "created_at">;
        Update: never;
      };
      favorite_prompts: {
        Row: FavoritePrompt;
        Insert: Omit<FavoritePrompt, "id" | "created_at">;
        Update: never;
      };
      instructions: {
        Row: Instruction;
        Insert: Omit<Instruction, "id" | "created_at" | "updated_at" | "view_count" | "copy_count">;
        Update: Partial<Omit<Instruction, "id" | "created_at" | "view_count" | "copy_count">>;
      };
      instruction_favorites: {
        Row: InstructionFavorite;
        Insert: Omit<InstructionFavorite, "id" | "created_at">;
        Update: never;
      };
    };
  };
}
