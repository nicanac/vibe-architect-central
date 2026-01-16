import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { EditPromptForm } from "./EditPromptForm";
import { MainContainer } from "@/components/layout/main-container";

export const metadata: Metadata = {
  title: "Edit Prompt",
  description: "Edit your submitted prompt",
};

interface EditPromptPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPromptPage({ params }: EditPromptPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch prompt
  const { data: prompt, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !prompt) {
    notFound();
  }

  // Check ownership
  if (prompt.submitted_by !== user.id) {
    redirect("/profile");
  }

  return (
    <MainContainer maxWidth="2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Edit Prompt</h1>
        <p className="text-muted-foreground">
          Update your prompt submission details.
        </p>
      </div>

      <EditPromptForm prompt={prompt} />
    </MainContainer>
  );
}
