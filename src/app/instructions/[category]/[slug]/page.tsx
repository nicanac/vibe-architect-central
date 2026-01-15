
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { getInstructionBySlug } from '@/lib/supabase/queries';
import { CodeBlock } from '@/components/vibe/CodeBlock';
import { CopyInstructionButton } from '@/components/vibe/CopyInstructionButton';
import { ShareInstructionButton } from '@/components/vibe/ShareInstructionButton';
import { INSTRUCTION_CATEGORIES, InstructionCategory } from '@/lib/supabase/types';
import { Calendar, FileText, Clock, Hash } from 'lucide-react';
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
    <div className="max-w-6xl mx-auto px-8 pt-8 pb-24 relative">
      {/* Terminal Breadcrumb */}
      <header className="h-16 border-b-2 border-[var(--terminal-green)] mb-8 flex items-center">
        <span className="text-xs text-[var(--terminal-green)]/60 tracking-widest uppercase font-mono">
          <Link href="/instructions" className="hover:text-[var(--terminal-green)] transition-colors">
            Instructions
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/instructions/${category}`} className="hover:text-[var(--terminal-green)] transition-colors capitalize">
            {categoryLabel}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--terminal-green)]">{instruction.title}</span>
        </span>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-10">

          {/* Header Section */}
          <div className="space-y-6 pb-8 border-b-2 border-[var(--terminal-green)]/30">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="capitalize border-[var(--terminal-green)] text-[var(--terminal-green)] bg-[var(--terminal-green)]/10 px-3 py-1 text-xs font-bold uppercase font-mono">
                {instruction.difficulty}
              </Badge>
              {instruction.agent_types.map(agent => (
                <Badge key={agent} variant="outline" className="border-[var(--terminal-purple)] text-[var(--terminal-purple)] bg-[var(--terminal-purple)]/10 px-3 py-1 text-xs font-mono">
                  {agent}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--terminal-green)] uppercase font-mono glitch-text">
              {instruction.title}
            </h1>

            <p className="text-lg text-[var(--terminal-green)]/70 leading-relaxed max-w-3xl font-mono">
              &gt; {instruction.description}
            </p>

            <div className="flex items-center gap-6 text-sm text-[var(--terminal-green)]/50 font-mono">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--terminal-purple)]" />
                <span>Updated {date}</span>
              </div>
              {instruction.file_format && (
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[var(--terminal-purple)]" />
                  <span className="uppercase tracking-wider text-xs font-bold border border-[var(--terminal-green)]/30 px-2 py-0.5">
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
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:scroll-m-20 prose-headings:font-mono prose-headings:text-[var(--terminal-green)] prose-headings:uppercase
                prose-h1:text-3xl prose-h1:border-b-2 prose-h1:border-[var(--terminal-green)]/30 prose-h1:pb-4 prose-h1:mb-8
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-l-4 prose-h2:border-[var(--terminal-purple)] prose-h2:pl-4
                prose-h3:text-xl prose-h3:mt-8
                prose-p:leading-7 prose-p:text-[var(--terminal-green)]/80 prose-p:mb-6 prose-p:font-mono
                prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                prose-li:text-[var(--terminal-green)]/80 prose-li:my-2 prose-li:font-mono
                prose-strong:text-white prose-strong:font-bold
                prose-code:text-[var(--terminal-purple)] prose-code:bg-[var(--terminal-purple)]/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-code:border prose-code:border-[var(--terminal-purple)]/30
                prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 prose-pre:border-none
                prose-blockquote:border-l-[var(--terminal-purple)] prose-blockquote:bg-[var(--terminal-purple)]/10 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-[var(--terminal-green)]/80
                prose-a:text-[var(--terminal-purple)] prose-a:underline prose-a:underline-offset-4
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
                          <div className="not-prose my-8 border-2 border-[var(--terminal-green)] overflow-hidden">
                            <CodeBlock
                              code={String(children).replace(/\n$/, '')}
                              language={language}
                              className="border-0 bg-[var(--terminal-bg)]"
                            />
                          </div>
                        );
                      }

                      return (
                        <code className={cn("bg-[var(--terminal-purple)]/10 px-1.5 py-0.5 font-mono text-sm border border-[var(--terminal-purple)]/30", className)} {...props}>
                          {children}
                        </code>
                      );
                    },
                    // Custom link rendering
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        className="text-[var(--terminal-purple)] underline underline-offset-4 decoration-[var(--terminal-purple)]/30 hover:decoration-[var(--terminal-purple)] transition-all font-bold"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                    // Custom HR
                    hr: ({ ...props }) => <hr className="my-10 border-[var(--terminal-green)]/30" {...props} />,
                    // Custom table
                    table: ({ node, ...props }) => (
                      <table className="w-full border-2 border-[var(--terminal-green)] font-mono text-sm" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                      <th className="border border-[var(--terminal-green)]/50 bg-[var(--terminal-green)] text-[var(--terminal-bg)] p-2 font-bold uppercase" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                      <td className="border border-[var(--terminal-green)]/30 p-2" {...props} />
                    ),
                  }}
                >
                  {instruction.content}
                </ReactMarkdown>
              </article>
            ) : (
              <CodeBlock code={instruction.content} language={instruction.file_format} className="border-2 border-[var(--terminal-green)]" />
            )}
          </div>

          {/* Usage Example if available */}
          {instruction.usage_example && (
            <section className="space-y-6 pt-8 border-t-2 border-[var(--terminal-green)]/30">
              <div className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-[var(--terminal-purple)]" />
                <h2 className="text-2xl font-bold tracking-tight uppercase font-mono text-white">Usage_Example</h2>
              </div>
              <div className="border-2 border-[var(--terminal-green)] overflow-hidden">
                <CodeBlock code={instruction.usage_example} className="border-0 bg-[var(--terminal-bg)]" />
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-24 space-y-6">

            {/* Action Card */}
            <div className="p-6 border-2 border-[var(--terminal-green)]">
              <h3 className="font-bold mb-6 flex items-center gap-2 text-lg uppercase font-mono text-white">
                <span className="h-6 w-1 bg-[var(--terminal-purple)] inline-block"></span>
                Quick Actions
              </h3>
              <div className="space-y-4">
                <CopyInstructionButton 
                  content={instruction.content} 
                  className="w-full py-4 text-sm font-bold uppercase font-mono border-2 border-[var(--terminal-green)] text-[var(--terminal-green)] hover:bg-[var(--terminal-green)] hover:text-[var(--terminal-bg)] transition-all" 
                />
                <ShareInstructionButton
                  title={instruction.title}
                  description={instruction.description}
                  className="w-full py-4 text-sm font-bold uppercase font-mono bg-[var(--terminal-purple)] text-white pixel-border-sm hover:translate-y-0.5 transition-all"
                />
              </div>
            </div>

            {/* Metadata Card */}
            <div className="p-6 border-2 border-[var(--terminal-green)]/30">
              <h4 className="text-sm font-bold text-[var(--terminal-purple)] uppercase tracking-wider mb-4 font-mono">Metadata</h4>
              <dl className="space-y-3 text-sm font-mono">
                <div className="flex justify-between">
                  <dt className="text-[var(--terminal-green)]/70">Category</dt>
                  <dd className="font-bold capitalize text-white">{categoryLabel}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--terminal-green)]/70">Format</dt>
                  <dd className="text-xs bg-[var(--terminal-green)]/10 border border-[var(--terminal-green)]/30 px-2 py-0.5 text-[var(--terminal-green)]">{instruction.file_format}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--terminal-green)]/70">Agents</dt>
                  <dd className="text-right max-w-[150px] truncate text-[var(--terminal-purple)]">{instruction.agent_types.join(', ')}</dd>
                </div>
              </dl>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
