import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Calendar,
  Zap,
  Wrench,
  FileText,
  Heart,
  Settings,
  LogOut,
  Pencil,
  ExternalLink,
} from "lucide-react";
import { signOut } from "@/lib/supabase/auth";

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
      label: "Tools Submitted",
      value: submittedTools.length,
      icon: Wrench,
      href: "#submitted-tools",
    },
    {
      label: "Prompts Shared",
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
    "no-code": "bg-emerald-500/20 text-emerald-400",
    "low-code": "bg-blue-500/20 text-blue-400",
    agentic: "bg-purple-500/20 text-purple-400",
    "pro-orchestration": "bg-orange-500/20 text-orange-400",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Zap className="w-6 h-6 text-primary" />
            <span>Vibe Architect</span>
          </Link>

          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="vibe-card p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name || "User"}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-primary" />
              )}
            </div>

            {/* Info */}
            <div className="flex-grow space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">
                  {profile?.display_name || user.email?.split("@")[0]}
                </h1>
                {profile?.vibe_level && (
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${vibeLevelColors[profile.vibe_level as keyof typeof vibeLevelColors]}`}
                  >
                    {profile.vibe_level}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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
                <p className="text-muted-foreground">{profile.bio}</p>
              )}
            </div>

            {/* Edit Button */}
            <Link
              href="/profile/edit"
              className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-md text-sm font-medium transition-colors"
            >
              <Settings className="w-4 h-4" />
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <a
              key={stat.label}
              href={stat.href}
              className="vibe-card p-4 text-center hover:border-primary/50 transition-colors"
            >
              <stat.icon className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </a>
          ))}
        </div>

        {/* Submitted Tools */}
        <section id="submitted-tools" className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Submitted Tools
          </h2>
          {submittedTools.length > 0 ? (
            <div className="grid gap-4">
              {submittedTools.map((tool) => (
                <div key={tool.id} className="vibe-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium">{tool.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {tool.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${vibeLevelColors[tool.vibe_level as keyof typeof vibeLevelColors]}`}
                      >
                        {tool.vibe_level}
                      </span>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-secondary rounded-md transition-colors"
                        title="Visit tool"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <Link
                        href={`/tools/${tool.id}/edit`}
                        className="p-2 hover:bg-secondary rounded-md transition-colors"
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
            <div className="vibe-card p-8 text-center">
              <Wrench className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                You haven&apos;t submitted any tools yet.
              </p>
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Submit a Tool
              </Link>
            </div>
          )}
        </section>

        {/* Submitted Prompts */}
        <section id="submitted-prompts" className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Shared Prompts
          </h2>
          {submittedPrompts.length > 0 ? (
            <div className="grid gap-4">
              {submittedPrompts.map((prompt) => (
                <div key={prompt.id} className="vibe-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium">{prompt.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {prompt.target_ai} • {prompt.technique}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Link
                        href={`/prompts/${prompt.id}/edit`}
                        className="p-2 hover:bg-secondary rounded-md transition-colors"
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
            <div className="vibe-card p-8 text-center">
              <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                You haven&apos;t shared any prompts yet.
              </p>
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Share a Prompt
              </Link>
            </div>
          )}
        </section>

        {/* Favorites */}
        <section id="favorites">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Favorites
          </h2>
          {favoriteTools.length > 0 || favoritePrompts.length > 0 ? (
            <div className="space-y-4">
              {favoriteTools.map((fav) => (
                <div key={fav.id} className="vibe-card p-4">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{fav.tool?.name}</span>
                  </div>
                </div>
              ))}
              {favoritePrompts.map((fav) => (
                <div key={fav.id} className="vibe-card p-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{fav.prompt?.title}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="vibe-card p-8 text-center">
              <Heart className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">
                No favorites yet. Browse tools and prompts to add some!
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
