"use server";

import { createClient } from "@/lib/supabase/server";
import {
  toolSubmissionSchema,
  promptSubmissionSchema,
} from "@/lib/validations/submissions";
import type {
  ToolSubmission,
  PromptSubmission,
} from "@/lib/validations/submissions";

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function submitTool(
  data: ToolSubmission
): Promise<ActionResult<{ id: string }>> {
  try {
    // Validate input
    const validatedData = toolSubmissionSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.issues[0]?.message || "Invalid data",
      };
    }

    const supabase = await createClient();

    // Insert into database
    const { data: insertedTool, error } = await supabase
      .from("tools")
      .insert({
        name: validatedData.data.name,
        description: validatedData.data.description,
        url: validatedData.data.url,
        vibe_level: validatedData.data.vibe_level,
        pricing: validatedData.data.pricing,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        error: "Failed to submit tool. Please try again.",
      };
    }

    return {
      success: true,
      data: { id: insertedTool.id },
    };
  } catch (err) {
    console.error("Submit tool error:", err);
    return {
      success: false,
      error: "An unexpected error occurred.",
    };
  }
}

export async function submitPrompt(
  data: PromptSubmission
): Promise<ActionResult<{ id: string }>> {
  try {
    // Validate input
    const validatedData = promptSubmissionSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.issues[0]?.message || "Invalid data",
      };
    }

    const supabase = await createClient();

    // Get current user (optional - for tracking submissions)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Insert into database
    const { data: insertedPrompt, error } = await supabase
      .from("prompts")
      .insert({
        title: validatedData.data.title,
        content: validatedData.data.content,
        target_ai: validatedData.data.target_ai,
        technique: validatedData.data.technique,
        created_by: user?.id || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        error: "Failed to submit prompt. Please try again.",
      };
    }

    return {
      success: true,
      data: { id: insertedPrompt.id },
    };
  } catch (err) {
    console.error("Submit prompt error:", err);
    return {
      success: false,
      error: "An unexpected error occurred.",
    };
  }
}
