import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { 
  INSTRUCTION_CATEGORIES, 
  INSTRUCTION_AGENT_TYPES,
  INSTRUCTION_DIFFICULTIES,
  InstructionCategory,
  Instruction
} from "@/lib/supabase/types";
import { CodeBlock } from "@/components/ui/code-block";
import { InstructionCardCompact } from "@/components/vibe/InstructionCard";
import { ChevronLeft, Copy, Download, ExternalLink, Eye, Clock, User } from "lucide-react";
import { InstructionActions } from "./InstructionActions";

const validCategories: InstructionCategory[] = ["command", "agent", "skill", "hook", "rule", "prompt"];

interface DetailPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const supabase = await createClient();
  
  const { data: instruction } = await supabase
    .from("instructions")
    .select("*")
    .eq("category", category)
    .eq("slug", slug)
    .single();

  if (!instruction) {
    return { title: "Not Found" };
  }

  return {
    title: `${instruction.title} | Instructions Hub | Vibe Architect Central`,
    description: instruction.description,
    openGraph: {
      title: instruction.title,
      description: instruction.description,
      type: "article",
    },
  };
}

export default async function InstructionDetailPage({ params }: DetailPageProps) {
  const { category, slug } = await params;
  
  // Validate category
  if (!validCategories.includes(category as InstructionCategory)) {
    notFound();
  }

  const supabase = await createClient();

  // Get instruction
  const { data, error } = await supabase
    .from("instructions")
    .select("*")
    .eq("category", category)
    .eq("slug", slug)
    .single();

  if (!data || error) {
    notFound();
  }

  const instruction = data as Instruction;

  // Increment view count
  await supabase.rpc("increment_instruction_view", { instruction_id: instruction.id });

  const categoryMeta = INSTRUCTION_CATEGORIES[instruction.category];
  const difficultyMeta = INSTRUCTION_DIFFICULTIES[instruction.difficulty];

  // Get related instructions (same category or similar tags)
  const { data: relatedData } = await supabase
    .from("instructions")
    .select("*")
    .eq("category", category)
    .neq("id", instruction.id)
    .order("view_count", { ascending: false })
    .limit(5);

  const related = (relatedData || []) as Instruction[];

  // Format date
  const createdDate = new Date(instruction.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/instructions" className="hover:text-primary">
            Instructions
          </Link>
          <span>/</span>
          <Link href={`/instructions/${category}`} className="hover:text-primary">
            {categoryMeta.label}
          </Link>
          <span>/</span>
          <span className="text-foreground">{instruction.title}</span>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl">{categoryMeta.icon}</span>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {instruction.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {instruction.description}
                </p>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {/* Category Badge */}
              <span className={`px-3 py-1 rounded-full border ${categoryMeta.color} border-current/20`}>
                {categoryMeta.icon} {categoryMeta.label.slice(0, -1)}
              </span>

              {/* Difficulty */}
              <span className={`${difficultyMeta.color}`}>
                {difficultyMeta.label}
              </span>

              {/* Agent Types */}
              <div className="flex gap-1">
                {instruction.agent_types.map((agentType) => {
                  const meta = INSTRUCTION_AGENT_TYPES[agentType];
                  return (
                    <span 
                      key={agentType}
                      className={`px-2 py-0.5 rounded text-xs text-white/90 ${meta.color}`}
                    >
                      {meta.icon} {meta.label}
                    </span>
                  );
                })}
              </div>

              {/* Stats */}
              <span className="flex items-center gap-1 text-muted-foreground">
                <Eye className="w-4 h-4" />
                {instruction.view_count} views
              </span>

              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                {createdDate}
              </span>
            </div>

            {/* Tags */}
            {instruction.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {instruction.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Action Buttons */}
          <InstructionActions instruction={instruction} />

          {/* Usage Example */}
          {instruction.usage_example && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Usage</h2>
              <CodeBlock 
                code={instruction.usage_example} 
                language="bash"
              />
            </section>
          )}

          {/* Main Content */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Instruction Content</h2>
            <CodeBlock 
              code={instruction.content}
              language={instruction.file_format === "markdown" ? "markdown" : instruction.file_format}
              filename={`${instruction.slug}.${instruction.file_format === "markdown" ? "md" : instruction.file_format}`}
              showLineNumbers
            />
          </section>

          {/* Source Link */}
          {instruction.source_url && (
            <section className="mb-8">
              <a 
                href={instruction.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                View original source
              </a>
            </section>
          )}
        </main>

        {/* Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Quick Actions */}
            <div className="vibe-glass rounded-industrial border border-border p-4">
              <h3 className="text-sm font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  onClick={() => {}}
                >
                  <Copy className="w-4 h-4" />
                  Copy to Clipboard
                </button>
                <button 
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded border border-border hover:bg-muted transition-colors"
                  onClick={() => {}}
                >
                  <Download className="w-4 h-4" />
                  Download File
                </button>
              </div>
            </div>

            {/* Related Instructions */}
            {related && related.length > 0 && (
              <div className="vibe-glass rounded-industrial border border-border p-4">
                <h3 className="text-sm font-semibold mb-3">Related {categoryMeta.label}</h3>
                <div className="space-y-1">
                  {related.map((item) => (
                    <InstructionCardCompact key={item.id} instruction={item} />
                  ))}
                </div>
              </div>
            )}

            {/* Category Navigation */}
            <div className="vibe-glass rounded-industrial border border-border p-4">
              <h3 className="text-sm font-semibold mb-3">Browse Categories</h3>
              <div className="space-y-1">
                {Object.entries(INSTRUCTION_CATEGORIES).map(([key, meta]) => (
                  <Link
                    key={key}
                    href={`/instructions/${key}`}
                    className={`flex items-center gap-2 px-2 py-1 rounded text-sm transition-colors ${
                      key === category 
                        ? "bg-primary/20 text-primary" 
                        : "hover:bg-muted"
                    }`}
                  >
                    <span>{meta.icon}</span>
                    <span>{meta.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
