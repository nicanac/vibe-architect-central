
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getInstructionBySlug } from '@/lib/supabase/queries';
import { CodeBlock } from '@/components/vibe/CodeBlock';
import { CopyInstructionButton } from '@/components/vibe/CopyInstructionButton';
import { INSTRUCTION_CATEGORIES, InstructionCategory } from '@/lib/supabase/types';
import { ArrowLeft, Calendar, FileText, Share2 } from 'lucide-react';

interface InstructionDetailPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function InstructionDetailPage({ params }: InstructionDetailPageProps) {
  const { category, slug } = await params;

  const instruction = await getInstructionBySlug(slug);

  if (!instruction) {
    notFound();
  }

  if (!instruction) {
    notFound();
  }

  // Format date
  const date = new Date(instruction.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const categoryLabel = INSTRUCTION_CATEGORIES[category as InstructionCategory]?.label || category;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/instructions" className="hover:text-primary transition-colors">Instructions</Link>
        <span>/</span>
        <Link href={`/instructions/${category}`} className="hover:text-primary transition-colors capitalize">
          {categoryLabel}
        </Link>
        <span>/</span>
        <span className="text-foreground truncate">{instruction.title}</span>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="capitalize text-primary border-primary/20 bg-primary/5">
            {instruction.difficulty}
          </Badge>
          {instruction.agent_types.map(agent => (
            <Badge key={agent} variant="secondary">
              {agent}
            </Badge>
          ))}
        </div>

        <h1 className="text-4xl font-bold tracking-tight">{instruction.title}</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          {instruction.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground pb-6 border-b border-border/50">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>Updated {date}</span>
          </div>
          {instruction.file_format && (
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span className="uppercase">{instruction.file_format}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Content</h2>
            {instruction.file_format === 'markdown' ? (
              <article className="prose prose-invert prose-blue max-w-none">
                {/* 
                   Ideally we would render Markdown here. 
                   For now, reusing CodeBlock if it looks like code, 
                   or just text if it's text.
                   Since migrated content is mixed, we'll simple-render text or code.
                */}
                <div className="whitespace-pre-wrap font-sans text-muted-foreground leading-7">
                  {instruction.content}
                </div>
              </article>
            ) : (
              <CodeBlock code={instruction.content} language={instruction.file_format} />
            )}
          </section>

          {/* Usage Example if available */}
          {instruction.usage_example && ( // Note: schema doesn't have usage_example yet? Check types.ts
            // Wait, I didn't verify if I added usage_example to schema. 
            // Types.ts has it? 
            // Let's check locally viewed types.ts. Line 101: `usage_example: string | null;`
            // Yes it does.
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Usage Example</h2>
              <CodeBlock code={instruction.usage_example} />
            </section>
          )}
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-muted/30 border border-border/50 sticky top-24">
            <h3 className="font-semibold mb-4 text-lg">Quick Actions</h3>
            <div className="space-y-4">
              <CopyInstructionButton content={instruction.content} className="w-full" />
              <Button className="w-full" variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share Link
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


