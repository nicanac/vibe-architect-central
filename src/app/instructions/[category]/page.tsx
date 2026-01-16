
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getInstructionsPaginated } from '@/lib/supabase/queries';
import { InstructionCard } from '@/components/vibe/InstructionCard';
import { INSTRUCTION_CATEGORIES, InstructionCategory } from '@/lib/supabase/types';


interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const { page = '1', search = '' } = await searchParams;

  // Validate category
  if (!Object.keys(INSTRUCTION_CATEGORIES).includes(categorySlug)) {
    notFound();
  }

  const categoryKey = categorySlug as InstructionCategory;
  const categoryInfo = INSTRUCTION_CATEGORIES[categoryKey];

  const currentPage = parseInt(page);
  const { data: instructions, totalPages } = await getInstructionsPaginated(
    currentPage,
    12,
    categoryKey,
    search
  );

  return (
    <section className="space-y-16">
      {/* Header Section */}
      <section className="space-y-4 border-l-4 border-[var(--terminal-purple)] pl-6 py-4">
        <span className="text-[var(--terminal-purple)] font-mono text-sm uppercase">
          /DIRECTORY/INSTRUCTIONS/{categoryKey.toUpperCase()}/
        </span>
        <h1 className="text-4xl font-bold tracking-tight uppercase font-mono text-[var(--terminal-green)] glitch-text">
          {categoryInfo.label}
        </h1>
        <p className="text-[var(--terminal-text-muted)] max-w-2xl font-mono">
          &gt; {categoryInfo.description}
        </p>
      </section>

      {/* Category Content */}
      <section className="space-y-8">

      {/* Grid */}
      {instructions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructions.map((instruction) => (
            <div key={instruction.id} className="h-full">
              <InstructionCard instruction={instruction} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border/50">
          <p>No instructions found in this category.</p>
        </div>
      )}

      {/* Pagination (Simple) */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button disabled={currentPage <= 1} variant="outline">Previous</Button>
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button disabled={currentPage >= totalPages} variant="outline">Next</Button>
        </div>
      )}
      </section>
    </section>
  );
}
