"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Terminal } from "lucide-react";
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
      label: "NO_CODE",
      description: "Building with visual tools and AI generators",
    },
    {
      value: "low-code",
      label: "LOW_CODE",
      description: "Combining AI tools with light customization",
    },
    {
      value: "agentic",
      label: "AGENTIC",
      description: "Orchestrating AI agents for complex tasks",
    },
    {
      value: "pro-orchestration",
      label: "PRO_ORCHESTRATION",
      description: "Advanced prompt engineering and multi-agent systems",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Back Link */}
      <Link
        href="/profile"
        className="inline-flex items-center gap-2 text-[var(--terminal-green)] hover:text-[var(--terminal-purple)] mb-6 transition-colors font-mono uppercase text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        cd ../profile
      </Link>

      {/* Terminal Card */}
      <div className="bg-[var(--terminal-bg)] border-2 border-[var(--terminal-green)] p-6">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[var(--terminal-green)]/30">
          <Terminal className="w-5 h-5 text-[var(--terminal-green)]" />
          <h1 className="text-xl font-bold text-[var(--terminal-green)] uppercase tracking-wider font-mono">
            profile.edit()
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Name */}
          <div className="space-y-2">
            <label
              htmlFor="displayName"
              className="text-sm font-mono uppercase text-[var(--terminal-green)]"
            >
              display_name:
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name..."
              className="w-full px-4 py-3 bg-black/50 border-2 border-[var(--terminal-green)]/50 text-[var(--terminal-green)] placeholder:text-[var(--terminal-green)]/30 font-mono focus:outline-none focus:border-[var(--terminal-green)] transition-colors"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label
              htmlFor="bio"
              className="text-sm font-mono uppercase text-[var(--terminal-green)]"
            >
              bio:
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about your vibe coding journey..."
              rows={4}
              className="w-full px-4 py-3 bg-black/50 border-2 border-[var(--terminal-green)]/50 text-[var(--terminal-green)] placeholder:text-[var(--terminal-green)]/30 font-mono focus:outline-none focus:border-[var(--terminal-green)] resize-none transition-colors"
            />
          </div>

          {/* Vibe Level */}
          <div className="space-y-3">
            <label className="text-sm font-mono uppercase text-[var(--terminal-green)]">
              vibe_level:
            </label>
            <div className="grid gap-3">
              {vibeLevels.map((level) => (
                <label
                  key={level.value}
                  className={`flex items-start gap-3 p-4 border-2 cursor-pointer transition-all font-mono ${
                    vibeLevel === level.value
                      ? "border-[var(--terminal-purple)] bg-[var(--terminal-purple)]/10"
                      : "border-[var(--terminal-green)]/30 hover:border-[var(--terminal-green)]/60"
                  }`}
                >
                  <input
                    type="radio"
                    name="vibeLevel"
                    value={level.value}
                    checked={vibeLevel === level.value}
                    onChange={(e) => setVibeLevel(e.target.value as VibeLevel)}
                    className="mt-1 accent-[var(--terminal-purple)]"
                  />
                  <div>
                    <div className="font-bold text-[var(--terminal-green)]">
                      {level.label}
                    </div>
                    <div className="text-sm text-[var(--terminal-green)]/60">
                      {level.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-[var(--terminal-green)]/30">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-[var(--terminal-green)] text-black font-bold uppercase font-mono hover:bg-[var(--terminal-green)]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  PROCESSING...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  SAVE_CHANGES
                </>
              )}
            </button>

            <Link
              href="/profile"
              className="px-6 py-3 border-2 border-[var(--terminal-green)]/50 text-[var(--terminal-green)] font-bold uppercase font-mono hover:border-[var(--terminal-green)] hover:bg-[var(--terminal-green)]/10 transition-colors"
            >
              ABORT
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
