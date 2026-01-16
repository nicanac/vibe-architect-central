import Link from "next/link";
import { Wrench, ArrowLeft, Sparkles } from "lucide-react";
import { ToolCard } from "@/components/vibe/ToolCard";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { getToolsPaginated } from "@/lib/supabase/queries";
import { getUserFavorites } from "@/app/actions/favorites";
import type { VibeLevel } from "@/lib/supabase/types";

interface ToolsPageProps {
  searchParams: Promise<{
    page?: string;
    level?: string;
    search?: string;
  }>;
}

const vibeLevels: { value: VibeLevel | "all"; label: string }[] = [
  { value: "all", label: "All Levels" },
  { value: "no-code", label: "No-Code" },
  { value: "low-code", label: "Low-Code" },
  { value: "agentic", label: "Agentic" },
  { value: "pro-orchestration", label: "Pro Orchestration" },
];

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const level = params.level as VibeLevel | undefined;
  const search = params.search;

  const [result, favorites] = await Promise.all([
    getToolsPaginated(page, 12, level, search),
    getUserFavorites(),
  ]);

  const currentParams: Record<string, string> = {};
  if (level) currentParams.level = level;
  if (search) currentParams.search = search;

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-md bg-primary/10">
              <Wrench className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Tools Directory</h1>
          </div>
          <p className="text-muted-foreground">
            Discover {result.count} AI tools for every vibe level
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 max-w-md">
            <SearchInput placeholder="Search tools..." paramName="search" />
          </div>

          <div className="flex gap-2 flex-wrap">
            {vibeLevels.map((vl) => {
              const isActive =
                (vl.value === "all" && !level) || vl.value === level;
              const href =
                vl.value === "all"
                  ? `/tools${search ? `?search=${search}` : ""}`
                  : `/tools?level=${vl.value}${search ? `&search=${search}` : ""}`;

              return (
                <Link
                  key={vl.value}
                  href={href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {vl.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Results */}
        {result.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {result.data.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorited={favorites.toolIds.includes(tool.id)}
                />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={result.totalPages}
              baseUrl="/tools"
              searchParams={currentParams}
            />
          </>
        ) : (
          <div className="vibe-card p-12 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No tools found</h2>
            <p className="text-muted-foreground mb-4">
              {search
                ? `No results for "${search}". Try a different search term.`
                : "No tools match the selected filter."}
            </p>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              View all tools
            </Link>
          </div>
        )}
      </main>
  );
}
