import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { 
  INSTRUCTION_CATEGORIES, 
  INSTRUCTION_AGENT_TYPES,
  InstructionCategory,
  InstructionAgentType,
  Instruction 
} from "@/lib/supabase/types";
import { InstructionCard, InstructionCardCompact } from "@/components/vibe/InstructionCard";
import { SearchInput } from "@/components/ui/search-input";
import { Pagination } from "@/components/ui/pagination";
import { ChevronLeft, Filter } from "lucide-react";

const ITEMS_PER_PAGE = 12;

const validCategories: InstructionCategory[] = ["command", "agent", "skill", "hook", "rule", "prompt"];

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ 
    q?: string; 
    agent?: string; 
    page?: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  
  if (!validCategories.includes(category as InstructionCategory)) {
    return { title: "Not Found" };
  }

  const meta = INSTRUCTION_CATEGORIES[category as InstructionCategory];
  
  return {
    title: `${meta.label} | Instructions Hub | Vibe Architect Central`,
    description: meta.description,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const { q, agent, page } = await searchParams;
  
  // Validate category
  if (!validCategories.includes(category as InstructionCategory)) {
    notFound();
  }

  const categoryMeta = INSTRUCTION_CATEGORIES[category as InstructionCategory];
  const currentPage = parseInt(page || "1");
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const supabase = await createClient();

  // Build query
  let query = supabase
    .from("instructions")
    .select("*", { count: "exact" })
    .eq("category", category)
    .order("view_count", { ascending: false });

  // Filter by agent type if provided
  if (agent && Object.keys(INSTRUCTION_AGENT_TYPES).includes(agent)) {
    query = query.contains("agent_types", [agent]);
  }

  // Apply pagination
  query = query.range(offset, offset + ITEMS_PER_PAGE - 1);

  const { data: instructions, count } = await query;

  // Get all instructions for sidebar
  const { data: allInCategory } = await supabase
    .from("instructions")
    .select("id, title, slug, category")
    .eq("category", category)
    .order("title");

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  // Get agent type counts for filtering
  const agentTypeCounts: Record<string, number> = {};
  if (allInCategory) {
    // We'd need to aggregate this properly, for now show all agent types
    for (const agentType of Object.keys(INSTRUCTION_AGENT_TYPES)) {
      agentTypeCounts[agentType] = 0;
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link 
          href="/instructions" 
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Instructions
        </Link>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Category Info */}
            <div className="vibe-glass rounded-industrial border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{categoryMeta.icon}</span>
                <h2 className={`text-lg font-semibold ${categoryMeta.color}`}>
                  {categoryMeta.label}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                {categoryMeta.description}
              </p>
            </div>

            {/* Agent Type Filters */}
            <div className="vibe-glass rounded-industrial border border-border p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter by Agent
              </h3>
              <div className="space-y-1">
                <Link
                  href={`/instructions/${category}`}
                  className={`block text-sm px-2 py-1 rounded transition-colors ${
                    !agent ? "bg-primary/20 text-primary" : "hover:bg-muted"
                  }`}
                >
                  All Agents
                </Link>
                {Object.entries(INSTRUCTION_AGENT_TYPES).map(([key, meta]) => (
                  <Link
                    key={key}
                    href={`/instructions/${category}?agent=${key}`}
                    className={`block text-sm px-2 py-1 rounded transition-colors ${
                      agent === key ? "bg-primary/20 text-primary" : "hover:bg-muted"
                    }`}
                  >
                    {meta.icon} {meta.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            {allInCategory && allInCategory.length > 0 && (
              <div className="vibe-glass rounded-industrial border border-border p-4">
                <h3 className="text-sm font-semibold mb-3">
                  In this category
                </h3>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {allInCategory.slice(0, 15).map((instruction) => (
                    <Link
                      key={instruction.id}
                      href={`/instructions/${category}/${instruction.slug}`}
                      className="block text-sm text-muted-foreground hover:text-primary truncate"
                    >
                      {instruction.title}
                    </Link>
                  ))}
                  {allInCategory.length > 15 && (
                    <p className="text-xs text-muted-foreground pt-2">
                      +{allInCategory.length - 15} more
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <span>{categoryMeta.icon}</span>
                <span className={categoryMeta.color}>{categoryMeta.label}</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                {count || 0} {(count || 0) === 1 ? "instruction" : "instructions"}
                {agent && ` for ${INSTRUCTION_AGENT_TYPES[agent as InstructionAgentType]?.label}`}
              </p>
            </div>

            <div className="w-full sm:w-64">
              <SearchInput 
                placeholder={`Search ${categoryMeta.label.toLowerCase()}...`}
                paramName="q"
              />
            </div>
          </div>

          {/* Instructions Grid */}
          {instructions && instructions.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {instructions.map((instruction) => (
                  <InstructionCard key={instruction.id} instruction={instruction} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages}
                  baseUrl={`/instructions/${category}`}
                  searchParams={agent ? { agent } : undefined}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12 vibe-glass rounded-industrial border border-border">
              <p className="text-lg text-muted-foreground">
                No {categoryMeta.label.toLowerCase()} found.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Be the first to submit one!
              </p>
              <Link 
                href="/submit?type=instruction"
                className="inline-block mt-4 vibe-button-primary px-4 py-2 rounded text-sm font-medium"
              >
                Submit {categoryMeta.label.slice(0, -1)}
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
