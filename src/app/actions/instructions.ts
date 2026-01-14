"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type {
  InstructionCategory,
  InstructionAgentType,
  InstructionDifficulty,
  InstructionFileFormat,
} from "@/lib/supabase/types";

const instructionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500),
  content: z.string().min(20, "Content must be at least 20 characters"),
  category: z.enum(["command", "agent", "skill", "hook", "rule", "prompt"]),
  agent_types: z
    .array(
      z.enum([
        "copilot",
        "claude",
        "claude-code",
        "chatgpt",
        "gemini",
        "cursor",
        "windsurf",
        "other",
      ])
    )
    .min(1, "Select at least one agent type"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  file_format: z.enum(["markdown", "json", "yaml", "toml", "text"]),
  tags: z.array(z.string()).optional(),
  usage_example: z.string().optional(),
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 60);
}

export async function createInstruction(formData: FormData) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in to submit an instruction" };
  }

  // Parse form data
  const rawData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    content: formData.get("content") as string,
    category: formData.get("category") as InstructionCategory,
    agent_types: formData.getAll("agent_types") as InstructionAgentType[],
    difficulty: formData.get("difficulty") as InstructionDifficulty,
    file_format: formData.get("file_format") as InstructionFileFormat,
    tags:
      (formData.get("tags") as string)
        ?.split(",")
        .map((t) => t.trim())
        .filter(Boolean) || [],
    usage_example: (formData.get("usage_example") as string) || undefined,
  };

  // Validate
  const result = instructionSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const data = result.data;
  const slug = slugify(data.title);

  // Check for duplicate slug
  const { data: existing } = await supabase
    .from("instructions")
    .select("id")
    .eq("slug", slug)
    .single();

  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  // Insert
  const { error } = await supabase.from("instructions").insert({
    title: data.title,
    slug: finalSlug,
    description: data.description,
    content: data.content,
    category: data.category,
    agent_types: data.agent_types,
    difficulty: data.difficulty,
    file_format: data.file_format,
    tags: data.tags,
    usage_example: data.usage_example || null,
    submitted_by: user.id,
  });

  if (error) {
    console.error("Failed to create instruction:", error);
    return { error: "Failed to create instruction. Please try again." };
  }

  revalidatePath("/instructions");
  revalidatePath(`/instructions/${data.category}`);
  redirect(`/instructions/${data.category}/${finalSlug}`);
}

export async function updateInstruction(id: string, formData: FormData) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in" };
  }

  // Check ownership
  const { data: instruction } = await supabase
    .from("instructions")
    .select("*")
    .eq("id", id)
    .single();

  if (!instruction || instruction.submitted_by !== user.id) {
    return { error: "You can only edit your own instructions" };
  }

  // Parse form data
  const rawData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    content: formData.get("content") as string,
    category: formData.get("category") as InstructionCategory,
    agent_types: formData.getAll("agent_types") as InstructionAgentType[],
    difficulty: formData.get("difficulty") as InstructionDifficulty,
    file_format: formData.get("file_format") as InstructionFileFormat,
    tags:
      (formData.get("tags") as string)
        ?.split(",")
        .map((t) => t.trim())
        .filter(Boolean) || [],
    usage_example: (formData.get("usage_example") as string) || undefined,
  };

  // Validate
  const result = instructionSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const data = result.data;

  // Update
  const { error } = await supabase
    .from("instructions")
    .update({
      title: data.title,
      description: data.description,
      content: data.content,
      category: data.category,
      agent_types: data.agent_types,
      difficulty: data.difficulty,
      file_format: data.file_format,
      tags: data.tags,
      usage_example: data.usage_example || null,
    })
    .eq("id", id);

  if (error) {
    return { error: "Failed to update instruction" };
  }

  revalidatePath("/instructions");
  revalidatePath(`/instructions/${data.category}`);
  revalidatePath(`/instructions/${data.category}/${instruction.slug}`);
  redirect(`/instructions/${data.category}/${instruction.slug}`);
}

export async function deleteInstruction(id: string) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in" };
  }

  // Check ownership
  const { data: instruction } = await supabase
    .from("instructions")
    .select("*")
    .eq("id", id)
    .single();

  if (!instruction || instruction.submitted_by !== user.id) {
    return { error: "You can only delete your own instructions" };
  }

  const { error } = await supabase.from("instructions").delete().eq("id", id);

  if (error) {
    return { error: "Failed to delete instruction" };
  }

  revalidatePath("/instructions");
  revalidatePath(`/instructions/${instruction.category}`);
  redirect("/instructions");
}
