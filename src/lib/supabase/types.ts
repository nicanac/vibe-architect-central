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
    };
  };
}
