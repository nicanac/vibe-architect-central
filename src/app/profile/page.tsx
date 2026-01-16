import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Calendar,
  Wrench,
  FileText,
  Heart,
  Settings,
  Pencil,
  ExternalLink,
} from "lucide-react";

async function getProfileData(userId: string) {
  const supabase = await createClient();

  const [
    { data: profile },
    { data: submittedTools },
    { data: submittedPrompts },
    { data: favoriteTools },
    { data: favoritePrompts },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase.from("tools").select("*").eq("submitted_by", userId),
    supabase.from("prompts").select("*").eq("submitted_by", userId),
    supabase
      .from("favorite_tools")
      .select("*, tool:tools(*)")
      .eq("user_id", userId),
    supabase
      .from("favorite_prompts")
      .select("*, prompt:prompts(*)")
      .eq("user_id", userId),
  ]);

  return {
    profile,
    submittedTools: submittedTools || [],
    submittedPrompts: submittedPrompts || [],
    favoriteTools: favoriteTools || [],
    favoritePrompts: favoritePrompts || [],
  };
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { profile, submittedTools, submittedPrompts, favoriteTools, favoritePrompts } =
    await getProfileData(user.id);

  const stats = [
    {
      label: "Tools_Submitted",
      value: submittedTools.length,
      icon: Wrench,
      href: "#submitted-tools",
    },
    {
      label: "Prompts_Shared",
      value: submittedPrompts.length,
      icon: FileText,
      href: "#submitted-prompts",
    },
    {
      label: "Favorites",
      value: favoriteTools.length + favoritePrompts.length,
      icon: Heart,
      href: "#favorites",
    },
  ];

  const vibeLevelColors = {
    "no-code": "border-[var(--terminal-green)] text-[var(--terminal-green)] bg-[var(--terminal-green)]/10",
    "low-code": "border-blue-500 text-blue-400 bg-blue-500/10",
    agentic: "border-[var(--terminal-purple)] text-[var(--terminal-purple)] bg-[var(--terminal-purple)]/10",
    "pro-orchestration": "border-orange-500 text-orange-400 bg-orange-500/10",
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-12xl">
        {/* Profile Header */}
        <div className="border-2 border-[var(--terminal-green)] p-6 mb-8">
          {/* Terminal Header */}
          <div className="flex items-center justify-between border-b-2 border-[var(--terminal-green)]/30 pb-4 -mt-2 -mx-2 px-2 mb-6">
            <span className="text-[var(--terminal-purple)] font-mono text-xs uppercase">
              PROFILE_MODULE.exe
            </span>
            <div className="flex gap-2">
              <div className="w-3 h-3 border border-[var(--terminal-green)]" />
              <div className="w-3 h-3 border border-[var(--terminal-green)]" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            {/* Avatar */}
            <div className="w-20 h-20 border-2 border-[var(--terminal-purple)] flex items-center justify-center flex-shrink-0">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-[var(--terminal-purple)]" />
              )}
            </div>

            {/* Info */}
            <div className="flex-grow space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold uppercase font-mono text-white">
                  {profile?.display_name || user.email?.split("@")[0]}
                </h1>
                {profile?.vibe_level && (
                  <span
                    className={`px-2 py-1 text-xs font-bold uppercase font-mono border ${vibeLevelColors[profile.vibe_level as keyof typeof vibeLevelColors]}`}
                  >
                    {profile.vibe_level}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-[var(--terminal-green)]/70 font-mono">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined{" "}
                  {new Date(user.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              {profile?.bio && (
                <p className="text-[var(--terminal-green)]/70 font-mono text-sm">
                  &gt; {profile.bio}
                </p>
              )}
            </div>

            {/* Edit Button */}
            <Link
              href="/profile/edit"
              className="flex items-center gap-2 px-4 py-2 border-2 border-[var(--terminal-purple)] text-[var(--terminal-purple)] hover:bg-[var(--terminal-purple)] hover:text-white transition-all font-bold uppercase font-mono text-sm"
            >
              <Settings className="w-4 h-4" />
              Edit_Profile
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-0 mb-8">
          {stats.map((stat) => (
            <a
              key={stat.label}
              href={stat.href}
              className="border-2 border-[var(--terminal-green)]/30 p-4 text-center hover:border-[var(--terminal-green)] transition-colors"
            >
              <stat.icon className="w-6 h-6 mx-auto mb-2 text-[var(--terminal-purple)]" />
              <div className="text-2xl font-bold font-mono text-[var(--terminal-green)]">
                {stat.value}
              </div>
              <div className="text-sm text-[var(--terminal-green)]/70 font-mono uppercase">
                {stat.label}
              </div>
            </a>
          ))}
        </div>

        {/* Submitted Tools */}
        <section id="submitted-tools" className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 uppercase font-mono text-white">
            <Wrench className="w-5 h-5 text-[var(--terminal-purple)]" />
            Submitted_Tools
          </h2>
          {submittedTools.length > 0 ? (
            <div className="space-y-0">
              {submittedTools.map((tool) => (
                <div key={tool.id} className="border-2 border-[var(--terminal-green)]/30 p-4 hover:border-[var(--terminal-green)] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold font-mono text-white uppercase">{tool.name}</h3>
                      <p className="text-sm text-[var(--terminal-green)]/70 line-clamp-1 font-mono">
                        {tool.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span
                        className={`px-2 py-1 text-xs font-bold uppercase font-mono border ${vibeLevelColors[tool.vibe_level as keyof typeof vibeLevelColors]}`}
                      >
                        {tool.vibe_level}
                      </span>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-[var(--terminal-green)]/50 hover:text-[var(--terminal-purple)] transition-colors"
                        title="Visit tool"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <Link
                        href={`/tools/${tool.id}/edit`}
                        className="p-2 text-[var(--terminal-green)]/50 hover:text-[var(--terminal-purple)] transition-colors"
                        title="Edit tool"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-[var(--terminal-green)]/30 p-8 text-center">
              <Wrench className="w-10 h-10 mx-auto mb-3 text-[var(--terminal-purple)]" />
              <p className="text-[var(--terminal-green)]/70 mb-4 font-mono">
                &gt; You haven&apos;t submitted any tools yet.
              </p>
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--terminal-green)] text-[var(--terminal-bg)] font-bold uppercase font-mono text-sm pixel-border-sm"
              >
                Submit_a_Tool
              </Link>
            </div>
          )}
        </section>

        {/* Submitted Prompts */}
        <section id="submitted-prompts" className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 uppercase font-mono text-white">
            <FileText className="w-5 h-5 text-[var(--terminal-purple)]" />
            Shared_Prompts
          </h2>
          {submittedPrompts.length > 0 ? (
            <div className="space-y-0">
              {submittedPrompts.map((prompt) => (
                <div key={prompt.id} className="border-2 border-[var(--terminal-green)]/30 p-4 hover:border-[var(--terminal-green)] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold font-mono text-white uppercase">{prompt.title}</h3>
                      <p className="text-sm text-[var(--terminal-green)]/70 font-mono">
                        {prompt.target_ai} • {prompt.technique}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Link
                        href={`/prompts/${prompt.id}/edit`}
                        className="p-2 text-[var(--terminal-green)]/50 hover:text-[var(--terminal-purple)] transition-colors"
                        title="Edit prompt"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-[var(--terminal-green)]/30 p-8 text-center">
              <FileText className="w-10 h-10 mx-auto mb-3 text-[var(--terminal-purple)]" />
              <p className="text-[var(--terminal-green)]/70 mb-4 font-mono">
                &gt; You haven&apos;t shared any prompts yet.
              </p>
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--terminal-green)] text-[var(--terminal-bg)] font-bold uppercase font-mono text-sm pixel-border-sm"
              >
                Share_a_Prompt
              </Link>
            </div>
          )}
        </section>

        {/* Favorites */}
        <section id="favorites">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 uppercase font-mono text-white">
            <Heart className="w-5 h-5 text-[var(--terminal-purple)]" />
            Favorites
          </h2>
          {favoriteTools.length > 0 || favoritePrompts.length > 0 ? (
            <div className="space-y-0">
              {favoriteTools.map((fav) => (
                <div key={fav.id} className="border-2 border-[var(--terminal-green)]/30 p-4 hover:border-[var(--terminal-green)] transition-colors">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-[var(--terminal-purple)]" />
                    <span className="font-bold font-mono text-white uppercase">{fav.tool?.name}</span>
                  </div>
                </div>
              ))}
              {favoritePrompts.map((fav) => (
                <div key={fav.id} className="border-2 border-[var(--terminal-green)]/30 p-4 hover:border-[var(--terminal-green)] transition-colors">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[var(--terminal-purple)]" />
                    <span className="font-bold font-mono text-white uppercase">{fav.prompt?.title}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-[var(--terminal-green)]/30 p-8 text-center">
              <Heart className="w-10 h-10 mx-auto mb-3 text-[var(--terminal-purple)]" />
              <p className="text-[var(--terminal-green)]/70 font-mono">
                &gt; No favorites yet. Browse tools and prompts to add some!
              </p>
            </div>
          )}
        </section>
      </main>
  );
}
