import Link from "next/link";
import { BookOpen, ArrowLeft, Sparkles, Terminal } from "lucide-react";
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
      <main className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
        {/* Header Section */}
        <section className="mb-12 space-y-4 border-l-4 border-[var(--terminal-purple)] pl-6 py-4">
          <span className="text-[var(--terminal-purple)] font-mono text-sm uppercase">
            /DIRECTORY/PROMPTS/
          </span>
          <h1 className="text-4xl font-bold tracking-tight uppercase font-mono text-[var(--terminal-green)] glitch-text">
            Prompt_Vault
          </h1>
          <p className="text-[var(--terminal-text-muted)] max-w-2xl font-mono">
            &gt; Browse {result.count} orchestration prompts for AI mastery
          </p>
        </section>

        {/* Filters */}
        <section className="space-y-6 mb-12">
          <div className="flex-1 max-w-md">
            <SearchInput placeholder="Search prompts..." paramName="search" />
          </div>

          <div className="flex flex-wrap gap-6">
            {/* Technique Filter */}
            <div className="space-y-2">
              <span className="text-[var(--terminal-text-muted)] font-mono text-xs uppercase">Technique:</span>
              <div className="flex gap-2 flex-wrap">
                <Link
                  href={buildFilterUrl(undefined, targetAi)}
                  className={`px-3 py-1.5 border-2 text-sm font-mono uppercase transition-colors ${
                    !technique
                      ? "bg-[var(--terminal-green)] text-[var(--terminal-bg)] border-[var(--terminal-green)]"
                      : "border-[var(--terminal-border-muted)] text-[var(--terminal-text-muted)] hover:border-[var(--terminal-green)] hover:text-[var(--terminal-green)]"
                  }`}
                >
                  All
                </Link>
                {techniques.map((t) => (
                  <Link
                    key={t}
                    href={buildFilterUrl(t, targetAi)}
                    className={`px-3 py-1.5 border-2 text-sm font-mono transition-colors ${
                      technique === t
                        ? "bg-[var(--terminal-green)] text-[var(--terminal-bg)] border-[var(--terminal-green)]"
                        : "border-[var(--terminal-border-muted)] text-[var(--terminal-text-muted)] hover:border-[var(--terminal-green)] hover:text-[var(--terminal-green)]"
                    }`}
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>

            {/* Target AI Filter */}
            <div className="space-y-2">
              <span className="text-[var(--terminal-text-muted)] font-mono text-xs uppercase">Target AI:</span>
              <div className="flex gap-2 flex-wrap">
                <Link
                  href={buildFilterUrl(technique, undefined)}
                  className={`px-3 py-1.5 border-2 text-sm font-mono uppercase transition-colors ${
                    !targetAi
                      ? "bg-[var(--terminal-green)] text-[var(--terminal-bg)] border-[var(--terminal-green)]"
                      : "border-[var(--terminal-border-muted)] text-[var(--terminal-text-muted)] hover:border-[var(--terminal-green)] hover:text-[var(--terminal-green)]"
                  }`}
                >
                  All
                </Link>
                {targetAis.map((ai) => (
                  <Link
                    key={ai}
                    href={buildFilterUrl(technique, ai)}
                    className={`px-3 py-1.5 border-2 text-sm font-mono transition-colors ${
                      targetAi === ai
                        ? "bg-[var(--terminal-green)] text-[var(--terminal-bg)] border-[var(--terminal-green)]"
                        : "border-[var(--terminal-border-muted)] text-[var(--terminal-text-muted)] hover:border-[var(--terminal-green)] hover:text-[var(--terminal-green)]"
                    }`}
                  >
                    {ai}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

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
          <div className="border-2 border-[var(--terminal-green)]/30 p-12 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-[var(--terminal-purple)]" />
            <h2 className="text-xl font-bold mb-2 uppercase font-mono text-[var(--terminal-green)]">No prompts found</h2>
            <p className="text-[var(--terminal-text-muted)] mb-4 font-mono">
              {search
                ? `No results for "${search}". Try a different search term.`
                : "No prompts match the selected filters."}
            </p>
            <Link
              href="/prompts"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--terminal-green)] text-[var(--terminal-bg)] font-bold uppercase font-mono hover:bg-[var(--terminal-hover-bg)] hover:text-[var(--terminal-hover-text)] transition-colors"
            >
              View all prompts
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
