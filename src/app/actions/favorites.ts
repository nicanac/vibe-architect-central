"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleFavoriteTool(toolId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to favorite tools" };
  }

  // Check if already favorited
  const { data: existing } = await supabase
    .from("favorite_tools")
    .select("id")
    .eq("user_id", user.id)
    .eq("tool_id", toolId)
    .single();

  if (existing) {
    // Remove favorite
    const { error } = await supabase
      .from("favorite_tools")
      .delete()
      .eq("id", existing.id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/profile");
    return { success: true, isFavorited: false };
  } else {
    // Add favorite
    const { error } = await supabase.from("favorite_tools").insert({
      user_id: user.id,
      tool_id: toolId,
    });

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/profile");
    return { success: true, isFavorited: true };
  }
}

export async function toggleFavoritePrompt(promptId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to favorite prompts" };
  }

  // Check if already favorited
  const { data: existing } = await supabase
    .from("favorite_prompts")
    .select("id")
    .eq("user_id", user.id)
    .eq("prompt_id", promptId)
    .single();

  if (existing) {
    // Remove favorite
    const { error } = await supabase
      .from("favorite_prompts")
      .delete()
      .eq("id", existing.id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/profile");
    return { success: true, isFavorited: false };
  } else {
    // Add favorite
    const { error } = await supabase.from("favorite_prompts").insert({
      user_id: user.id,
      prompt_id: promptId,
    });

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/profile");
    return { success: true, isFavorited: true };
  }
}

export async function getUserFavorites() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { toolIds: [], promptIds: [] };
  }

  const [{ data: favoriteTools }, { data: favoritePrompts }] =
    await Promise.all([
      supabase.from("favorite_tools").select("tool_id").eq("user_id", user.id),
      supabase
        .from("favorite_prompts")
        .select("prompt_id")
        .eq("user_id", user.id),
    ]);

  return {
    toolIds: favoriteTools?.map((f) => f.tool_id) || [],
    promptIds: favoritePrompts?.map((f) => f.prompt_id) || [],
  };
}
