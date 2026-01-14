"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { updatePrompt, deletePrompt } from "@/app/actions/content";
import { Prompt } from "@/lib/supabase/types";

const editPromptSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().min(20, "Prompt content must be at least 20 characters"),
  target_ai: z.string().min(1, "Please select a target AI"),
});

type EditPromptValues = z.infer<typeof editPromptSchema>;

const TARGET_AIS = [
  "Claude",
  "ChatGPT",
  "Cursor",
  "Bolt.new",
  "v0",
  "Replit",
  "GitHub Copilot",
  "Windsurf",
  "Universal",
];

interface EditPromptFormProps {
  prompt: Prompt;
}

export function EditPromptForm({ prompt }: EditPromptFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<EditPromptValues>({
    resolver: zodResolver(editPromptSchema),
    defaultValues: {
      title: prompt.title,
      description: prompt.description || "",
      content: prompt.content,
      target_ai: prompt.target_ai,
    },
  });

  async function onSubmit(values: EditPromptValues) {
    setIsSubmitting(true);
    try {
      const result = await updatePrompt(prompt.id, values);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Prompt updated successfully!");
      router.push("/profile");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const result = await deletePrompt(prompt.id);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Prompt deleted successfully!");
      router.push("/profile");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Senior Vibe Architect System Prompt"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Briefly describe what this prompt does..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A short summary of the prompt&apos;s purpose.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the full prompt content here..."
                  className="min-h-[250px] font-mono text-sm"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The full prompt text. Supports Markdown formatting.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="target_ai"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target AI</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target AI platform" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TARGET_AIS.map((ai) => (
                    <SelectItem key={ai} value={ai}>
                      {ai}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Which AI platform is this prompt designed for?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between pt-6 border-t border-border">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive" disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Prompt
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this prompt?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  prompt &ldquo;{prompt.title}&rdquo; from our database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
