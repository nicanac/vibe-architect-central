import { z } from "zod";

// Tool submission schema
export const toolSubmissionSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(500, "Description must be less than 500 characters"),
  url: z
    .string()
    .url("Please enter a valid URL")
    .refine((url) => url.startsWith("https://"), {
      message: "URL must use HTTPS",
    }),
  vibe_level: z.enum(["no-code", "low-code", "agentic", "pro-orchestration"], {
    message: "Please select a vibe level",
  }),
  pricing: z
    .string()
    .min(1, "Please enter pricing information")
    .max(50, "Pricing must be less than 50 characters"),
});

// Prompt submission schema
export const promptSubmissionSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  content: z
    .string()
    .min(20, "Prompt content must be at least 20 characters")
    .max(5000, "Prompt content must be less than 5000 characters"),
  target_ai: z.string().min(1, "Please specify the target AI"),
  technique: z.enum(
    [
      "Chain of Thought",
      "ReAct",
      "Persona",
      "Tree of Thoughts",
      "Few-Shot",
      "Zero-Shot",
      "Other",
    ],
    {
      message: "Please select a technique",
    }
  ),
});

export type ToolSubmission = z.infer<typeof toolSubmissionSchema>;
export type PromptSubmission = z.infer<typeof promptSubmissionSchema>;
