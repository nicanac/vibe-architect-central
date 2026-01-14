import Link from "next/link";
import { BookOpen, ArrowLeft, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { PromptCard } from "@/components/vibe/PromptCard";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import {
  getPromptsPaginated,
  getUniqueTechniques,
  getUniqueTargetAis,
} from "@/lib/supabase/queries";
import { getUserFavorites } from "@/app/actions/favorites";

interface PromptsPageProps {
  searchParams: Promise<{
    page?: string;
    technique?: string;
    ai?: string;
    search?: string;
  }>;
}

export default async function PromptsPage({ searchParams }: PromptsPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const technique = params.technique;
  const targetAi = params.ai;
  const search = params.search;

  const [result, favorites, techniques, targetAis] = await Promise.all([
    getPromptsPaginated(page, 12, technique, targetAi, search),
    getUserFavorites(),
    getUniqueTechniques(),
    getUniqueTargetAis(),
  ]);

  const currentParams: Record<string, string> = {};
  if (technique) currentParams.technique = technique;
  if (targetAi) currentParams.ai = targetAi;
  if (search) currentParams.search = search;

  const buildFilterUrl = (
    newTechnique?: string,
    newAi?: string
  ) => {
    const parts: string[] = [];
    if (newTechnique) parts.push(`technique=${encodeURIComponent(newTechnique)}`);
    if (newAi) parts.push(`ai=${encodeURIComponent(newAi)}`);
    if (search) parts.push(`search=${encodeURIComponent(search)}`);
    return `/prompts${parts.length ? "?" + parts.join("&") : ""}`;
  };

  return (
    <>
      <Header />
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
            <div className="p-2 rounded-md bg-neon-success/10">
              <BookOpen className="w-6 h-6 text-neon-success" />
            </div>
            <h1 className="text-3xl font-bold">Prompt Vault</h1>
          </div>
          <p className="text-muted-foreground">
            Browse {result.count} orchestration prompts for AI mastery
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-8">
          <div className="flex-1 max-w-md">
            <SearchInput placeholder="Search prompts..." paramName="search" />
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Technique Filter */}
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Technique:</span>
              <div className="flex gap-2 flex-wrap">
                <Link
                  href={buildFilterUrl(undefined, targetAi)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    !technique
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All
                </Link>
                {techniques.map((t) => (
                  <Link
                    key={t}
                    href={buildFilterUrl(t, targetAi)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      technique === t
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>

            {/* Target AI Filter */}
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Target AI:</span>
              <div className="flex gap-2 flex-wrap">
                <Link
                  href={buildFilterUrl(technique, undefined)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    !targetAi
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All
                </Link>
                {targetAis.map((ai) => (
                  <Link
                    key={ai}
                    href={buildFilterUrl(technique, ai)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      targetAi === ai
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {ai}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {result.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              {result.data.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  isFavorited={favorites.promptIds.includes(prompt.id)}
                />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={result.totalPages}
              baseUrl="/prompts"
              searchParams={currentParams}
            />
          </>
        ) : (
          <div className="vibe-card p-12 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No prompts found</h2>
            <p className="text-muted-foreground mb-4">
              {search
                ? `No results for "${search}". Try a different search term.`
                : "No prompts match the selected filters."}
            </p>
            <Link
              href="/prompts"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              View all prompts
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
