"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { VibeLevel } from "@/lib/supabase/types";

interface ProfileEditFormProps {
  userId: string;
  initialData: {
    display_name: string | null;
    bio: string | null;
    vibe_level: VibeLevel | null;
  };
}

export function ProfileEditForm({ userId, initialData }: ProfileEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState(initialData.display_name || "");
  const [bio, setBio] = useState(initialData.bio || "");
  const [vibeLevel, setVibeLevel] = useState<VibeLevel>(
    initialData.vibe_level || "low-code"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        bio,
        vibe_level: vibeLevel,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    } else {
      toast.success("Profile updated successfully!");
      router.push("/profile");
      router.refresh();
    }
  }

  const vibeLevels: { value: VibeLevel; label: string; description: string }[] = [
    {
      value: "no-code",
      label: "No-Code",
      description: "Building with visual tools and AI generators",
    },
    {
      value: "low-code",
      label: "Low-Code",
      description: "Combining AI tools with light customization",
    },
    {
      value: "agentic",
      label: "Agentic",
      description: "Orchestrating AI agents for complex tasks",
    },
    {
      value: "pro-orchestration",
      label: "Pro Orchestration",
      description: "Advanced prompt engineering and multi-agent systems",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Zap className="w-6 h-6 text-primary" />
            <span>Vibe Architect</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>

        <div className="vibe-card p-6">
          <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Display Name */}
            <div className="space-y-2">
              <label htmlFor="displayName" className="text-sm font-medium">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
                className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself and your vibe coding journey..."
                rows={4}
                className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Vibe Level */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Your Vibe Level</label>
              <div className="grid gap-3">
                {vibeLevels.map((level) => (
                  <label
                    key={level.value}
                    className={`flex items-start gap-3 p-4 rounded-md border cursor-pointer transition-colors ${
                      vibeLevel === level.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="vibeLevel"
                      value={level.value}
                      checked={vibeLevel === level.value}
                      onChange={(e) => setVibeLevel(e.target.value as VibeLevel)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">{level.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {level.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>

              <Link
                href="/profile"
                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md font-medium hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
