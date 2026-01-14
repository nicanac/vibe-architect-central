
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getInstructionBySlug } from '@/lib/supabase/queries';
import { CodeBlock } from '@/components/vibe/CodeBlock';
import { CopyInstructionButton } from '@/components/vibe/CopyInstructionButton';
import { ShareInstructionButton } from '@/components/vibe/ShareInstructionButton';
import { INSTRUCTION_CATEGORIES, InstructionCategory } from '@/lib/supabase/types';
import { ArrowLeft, Calendar, FileText, Share2, Clock, Hash } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

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

  // Format date
  const date = new Date(instruction.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const categoryLabel = INSTRUCTION_CATEGORIES[category as InstructionCategory]?.label || category;

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/instructions" className="hover:text-primary transition-colors hover:underline underline-offset-4">
          Instructions
        </Link>
        <span className="text-border">/</span>
        <Link href={`/instructions/${category}`} className="hover:text-primary transition-colors capitalize hover:underline underline-offset-4">
          {categoryLabel}
        </Link>
        <span className="text-border">/</span>
        <span className="text-foreground font-medium truncate max-w-[300px]">{instruction.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-10">

          {/* Header Section */}
          <div className="space-y-6 pb-8 border-b border-border/40">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="capitalize text-primary border-primary/20 bg-primary/5 px-3 py-1 rounded-sm text-xs font-medium tracking-wider">
                {instruction.difficulty}
              </Badge>
              {instruction.agent_types.map(agent => (
                <Badge key={agent} variant="secondary" className="bg-secondary/50 hover:bg-secondary/70 text-secondary-foreground px-3 py-1 rounded-sm text-xs border border-transparent">
                  {agent}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground lg:leading-[1.1]">
              {instruction.title}
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl font-light">
              {instruction.description}
            </p>

            <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary/70" />
                <span>Updated {date}</span>
              </div>
              {instruction.file_format && (
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary/70" />
                  <span className="uppercase tracking-wider text-xs font-medium border border-border/50 px-1.5 py-0.5 rounded-sm bg-muted/20">
                    {instruction.file_format}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Markdown Content */}
          <div className="min-h-[500px]">
            {instruction.file_format === 'markdown' ? (
              <article className="prose prose-zinc dark:prose-invert max-w-none 
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:scroll-m-20 
                prose-h1:text-3xl prose-h1:border-b prose-h1:pb-4 prose-h1:mb-8
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-l-4 prose-h2:border-primary/50 prose-h2:pl-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:text-foreground
                prose-p:leading-7 prose-p:text-muted-foreground prose-p:mb-6
                prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                prose-li:text-muted-foreground prose-li:my-2
                prose-strong:text-foreground prose-strong:font-semibold
                prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 prose-pre:border-none
                prose-blockquote:border-l-primary/30 prose-blockquote:bg-muted/10 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-muted-foreground
                ">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Override code block rendering to use our custom CodeBlock
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      const language = match ? match[1] : '';

                      if (!inline && match) {
                        return (
                          <div className="not-prose my-8 shadow-lg rounded-md border border-border/40 overflow-hidden">
                            <CodeBlock
                              code={String(children).replace(/\n$/, '')}
                              language={language}
                              className="border-0 rounded-none bg-zinc-950/50"
                            />
                          </div>
                        );
                      }

                      return (
                        <code className={cn("bg-muted px-1.5 py-0.5 rounded font-mono text-sm border border-border/30", className)} {...props}>
                          {children}
                        </code>
                      );
                    },
                    // Custom link rendering
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        className="text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                    // Custom HR
                    hr: ({ ...props }) => <hr className="my-10 border-border/40" {...props} />
                  }}
                >
                  {instruction.content}
                </ReactMarkdown>
              </article>
            ) : (
              <CodeBlock code={instruction.content} language={instruction.file_format} className="border border-border/40 shadow-sm" />
            )}
          </div>

          {/* Usage Example if available */}
          {instruction.usage_example && (
            <section className="space-y-6 pt-8 border-t border-border/40">
              <div className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight">Usage Example</h2>
              </div>
              <div className="shadow-md rounded-md overflow-hidden border border-border/40">
                <CodeBlock code={instruction.usage_example} className="border-0 bg-zinc-950/30" />
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-24 space-y-6">

            {/* Action Card */}
            <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm">
              <h3 className="font-semibold mb-6 flex items-center gap-2 text-lg">
                <span className="h-6 w-1 bg-primary rounded-full inline-block"></span>
                Quick Actions
              </h3>
              <div className="space-y-4">
                <CopyInstructionButton content={instruction.content} className="w-full py-6 text-base font-medium shadow-sm transition-all hover:shadow-md active:scale-[0.98]" />
                <ShareInstructionButton
                  title={instruction.title}
                  description={instruction.description}
                  className="w-full py-6 text-base"
                />
              </div>
            </div>

            {/* Metadata Card */}
            <div className="p-6 rounded-xl bg-muted/10 border border-border/30">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Metadata</h4>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="font-medium capitalize">{categoryLabel}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Format</dt>
                  <dd className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{instruction.file_format}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Agents</dt>
                  <dd className="text-right max-w-[150px] truncate">{instruction.agent_types.join(', ')}</dd>
                </div>
              </dl>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
