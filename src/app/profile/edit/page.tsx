import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileEditForm } from "./ProfileEditForm";

export default async function ProfileEditPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, bio, vibe_level")
    .eq("id", user.id)
    .single();

  return (
    <ProfileEditForm
      userId={user.id}
      initialData={{
        display_name: profile?.display_name || null,
        bio: profile?.bio || null,
        vibe_level: profile?.vibe_level || null,
      }}
    />
  );
}
