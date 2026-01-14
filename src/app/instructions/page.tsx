import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { 
  INSTRUCTION_CATEGORIES, 
  InstructionCategory,
  Instruction 
} from "@/lib/supabase/types";
import { InstructionCard } from "@/components/vibe/InstructionCard";
import { SearchInput } from "@/components/ui/search-input";
import { Book, Sparkles, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Instructions Hub | Vibe Architect Central",
  description: "Discover AI agent instructions, commands, skills, hooks, and rules for Copilot, Claude, ChatGPT, Cursor, and more.",
};

interface InstructionsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function InstructionsPage({ searchParams }: InstructionsPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  
  // Get instructions count by category
  const { data: allInstructions } = await supabase
    .from("instructions")
    .select("*")
    .order("view_count", { ascending: false });

  const instructions = allInstructions || [];

  // Group by category
  const instructionsByCategory = instructions.reduce((acc, instruction) => {
    if (!acc[instruction.category]) {
      acc[instruction.category] = [];
    }
    acc[instruction.category].push(instruction);
    return acc;
  }, {} as Record<string, Instruction[]>);

  // Get featured/popular instructions
  const featured = instructions.slice(0, 6);

  // Search results if query provided
  let searchResults: Instruction[] = [];
  if (params.q) {
    const { data } = await supabase
      .rpc("search_instructions", { search_query: params.q });
    searchResults = data || [];
  }

  const categoryOrder: InstructionCategory[] = ["command", "agent", "skill", "hook", "rule", "prompt"];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Book className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">
            Instructions Hub
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Discover and share AI agent configurations, commands, skills, and workflows 
          for GitHub Copilot, Claude, ChatGPT, Cursor, and more.
        </p>

        {/* Search */}
        <div className="max-w-md mx-auto">
          <SearchInput 
            placeholder="Search instructions..." 
            paramName="q"
          />
        </div>
      </div>

      {/* Search Results */}
      {params.q && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Search results for &quot;{params.q}&quot;
          </h2>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((instruction) => (
                <InstructionCard key={instruction.id} instruction={instruction} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No instructions found.</p>
          )}
        </div>
      )}

      {/* Category Cards */}
      {!params.q && (
        <>
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              Browse by Category
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryOrder.map((category) => {
                const meta = INSTRUCTION_CATEGORIES[category];
                const count = instructionsByCategory[category]?.length || 0;
                
                return (
                  <Link 
                    key={category}
                    href={`/instructions/${category}`}
                    className="group vibe-glass rounded-industrial border border-border p-6 transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">{meta.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`text-xl font-semibold ${meta.color} group-hover:brightness-125 transition-all`}>
                            {meta.label}
                          </h3>
                          <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {count}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {meta.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Featured Instructions */}
          {featured.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Popular Instructions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featured.map((instruction) => (
                  <InstructionCard key={instruction.id} instruction={instruction} />
                ))}
              </div>
            </div>
          )}

          {/* Getting Started */}
          <div className="vibe-glass rounded-industrial border border-border p-8">
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">1. Browse Categories</h3>
                <p className="text-sm text-muted-foreground">
                  Explore commands, agents, skills, hooks, rules, and prompts for your favorite AI tools.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">2. Copy or Download</h3>
                <p className="text-sm text-muted-foreground">
                  Copy instructions to your clipboard or download as files ready to use.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">3. Contribute</h3>
                <p className="text-sm text-muted-foreground">
                  Share your own instructions to help the community of Vibe Architects.
                </p>
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <Link 
                href="/submit?type=instruction"
                className="vibe-button-primary px-4 py-2 rounded text-sm font-medium"
              >
                Submit Instruction
              </Link>
              <Link 
                href="/instructions/command"
                className="vibe-button-secondary px-4 py-2 rounded text-sm font-medium"
              >
                Browse Commands
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
