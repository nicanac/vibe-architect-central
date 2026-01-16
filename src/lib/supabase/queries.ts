import { createClient } from "@/lib/supabase/server";
import type { Tool, Prompt, VibeLevel } from "@/lib/supabase/types";

export async function getTools(): Promise<Tool[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tools:", error);
    return [];
  }

  return data || [];
}

export async function getPrompts(): Promise<Prompt[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching prompts:", error);
    return [];
  }

  return data || [];
}

export async function getToolsByVibeLevel(
  vibeLevel: VibeLevel
): Promise<Tool[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .eq("vibe_level", vibeLevel)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tools by vibe level:", error);
    return [];
  }

  return data || [];
}

// Paginated queries
export interface PaginatedResult<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getToolsPaginated(
  page: number = 1,
  pageSize: number = 12,
  vibeLevel?: VibeLevel,
  search?: string
): Promise<PaginatedResult<Tool>> {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from("tools").select("*", { count: "exact" });

  if (vibeLevel) {
    query = query.eq("vibe_level", vibeLevel);
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching paginated tools:", error);
    return { data: [], count: 0, page, pageSize, totalPages: 0 };
  }

  const totalCount = count || 0;

  return {
    data: data || [],
    count: totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export async function getPromptsPaginated(
  page: number = 1,
  pageSize: number = 12,
  technique?: string,
  targetAi?: string,
  search?: string
): Promise<PaginatedResult<Prompt>> {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from("prompts").select("*", { count: "exact" });

  if (technique) {
    query = query.eq("technique", technique);
  }

  if (targetAi) {
    query = query.eq("target_ai", targetAi);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching paginated prompts:", error);
    return { data: [], count: 0, page, pageSize, totalPages: 0 };
  }

  const totalCount = count || 0;

  return {
    data: data || [],
    count: totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

// Search functions
export async function searchTools(query: string): Promise<Tool[]> {
  const supabase = await createClient();

  // Use simple ilike search (works without full-text migration)
  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error searching tools:", error);
    return [];
  }

  return data || [];
}

export async function searchPrompts(query: string): Promise<Prompt[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error searching prompts:", error);
    return [];
  }

  return data || [];
}

// Get unique values for filters
export async function getUniqueTargetAis(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("prompts").select("target_ai");

  if (!data) return [];

  const unique = [...new Set(data.map((p) => p.target_ai))].filter(Boolean);
  return unique.sort();
}

export async function getUniqueTechniques(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("prompts").select("technique");

  if (!data) return [];

  const unique = [...new Set(data.map((p) => p.technique))].filter(Boolean);
  return unique.sort();
}
// Instructions Queries
import { Instruction, InstructionCategory } from "@/lib/supabase/types";

export interface PaginatedInstructionsResult {
  data: Instruction[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getInstructionsPaginated(
  page: number = 1,
  pageSize: number = 12,
  category?: InstructionCategory,
  search?: string,
  agent?: string,
  difficulty?: string,
  tags?: string[]
): Promise<PaginatedInstructionsResult> {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from("instructions").select("*", { count: "exact" });

  if (category) {
    query = query.eq("category", category);
  }

  if (difficulty) {
    query = query.eq("difficulty", difficulty);
  }

  if (agent) {
    query = query.contains("agent_types", [agent]);
  }

  if (tags && tags.length > 0) {
    query = query.contains("tags", tags);
  }

  if (search) {
    // Use the search_vector if available, or fallback to ilike
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching instructions:", error);
    return { data: [], count: 0, page, pageSize, totalPages: 0 };
  }

  return {
    data: data || [],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getInstructionBySlug(slug: string): Promise<Instruction | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("instructions")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching instruction by slug:", error);
    return null;
  }

  return data;
}

export async function getRecentInstructions(limit: number = 5): Promise<Instruction[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('instructions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching recent instructions:', error);
        return [];
    }
    return data || [];
}
