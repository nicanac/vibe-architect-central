"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteTool(toolId: string) {
  const supabase = await createClient();

  // Check if user is authenticated and owns the tool
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to delete a tool" };
  }

  // Check ownership
  const { data: tool } = await supabase
    .from("tools")
    .select("submitted_by")
    .eq("id", toolId)
    .single();

  if (!tool) {
    return { error: "Tool not found" };
  }

  if (tool.submitted_by !== user.id) {
    return { error: "You can only delete your own submissions" };
  }

  // Delete the tool
  const { error } = await supabase.from("tools").delete().eq("id", toolId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/tools");
  revalidatePath("/profile");
  revalidatePath("/");

  return { success: true };
}

export async function deletePrompt(promptId: string) {
  const supabase = await createClient();

  // Check if user is authenticated and owns the prompt
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to delete a prompt" };
  }

  // Check ownership
  const { data: prompt } = await supabase
    .from("prompts")
    .select("submitted_by")
    .eq("id", promptId)
    .single();

  if (!prompt) {
    return { error: "Prompt not found" };
  }

  if (prompt.submitted_by !== user.id) {
    return { error: "You can only delete your own submissions" };
  }

  // Delete the prompt
  const { error } = await supabase.from("prompts").delete().eq("id", promptId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/prompts");
  revalidatePath("/profile");
  revalidatePath("/");

  return { success: true };
}

export async function updateTool(
  toolId: string,
  data: {
    name?: string;
    description?: string;
    url?: string;
    technique?: string;
    logo_url?: string;
  }
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to update a tool" };
  }

  // Check ownership
  const { data: tool } = await supabase
    .from("tools")
    .select("submitted_by")
    .eq("id", toolId)
    .single();

  if (!tool) {
    return { error: "Tool not found" };
  }

  if (tool.submitted_by !== user.id) {
    return { error: "You can only edit your own submissions" };
  }

  const { error } = await supabase
    .from("tools")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", toolId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/tools");
  revalidatePath("/profile");
  revalidatePath("/");

  return { success: true };
}

export async function updatePrompt(
  promptId: string,
  data: {
    title?: string;
    description?: string;
    content?: string;
    target_ai?: string;
  }
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to update a prompt" };
  }

  // Check ownership
  const { data: prompt } = await supabase
    .from("prompts")
    .select("submitted_by")
    .eq("id", promptId)
    .single();

  if (!prompt) {
    return { error: "Prompt not found" };
  }

  if (prompt.submitted_by !== user.id) {
    return { error: "You can only edit your own submissions" };
  }

  const { error } = await supabase
    .from("prompts")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", promptId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/prompts");
  revalidatePath("/profile");
  revalidatePath("/");

  return { success: true };
}

export async function uploadImage(formData: FormData): Promise<{
  url?: string;
  error?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to upload images" };
  }

  const file = formData.get("file") as File;

  if (!file) {
    return { error: "No file provided" };
  }

  // Validate file type
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/svg+xml",
  ];
  if (!allowedTypes.includes(file.type)) {
    return {
      error: "Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed",
    };
  }

  // Validate file size (max 2MB)
  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    return { error: "File too large. Maximum size is 2MB" };
  }

  // Generate unique filename
  const ext = file.name.split(".").pop();
  const filename = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { data, error } = await supabase.storage
    .from("tool-logos")
    .upload(filename, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    return { error: error.message };
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("tool-logos").getPublicUrl(data.path);

  return { url: publicUrl };
}
