import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { MainContainer } from "@/components/layout/main-container";
import { EditToolForm } from "./EditToolForm";

export const metadata: Metadata = {
  title: "Edit Tool",
  description: "Edit your submitted tool",
};

interface EditToolPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditToolPage({ params }: EditToolPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch tool
  const { data: tool, error } = await supabase
    .from("tools")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !tool) {
    notFound();
  }

  // Check ownership
  if (tool.submitted_by !== user.id) {
    redirect("/profile");
  }

  return (
    <MainContainer maxWidth="2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Edit Tool</h1>
          <p className="text-muted-foreground">
            Update your tool submission details.
          </p>
        </div>

        <EditToolForm tool={tool} />
    </MainContainer>
  );
}
