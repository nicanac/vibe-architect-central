
import Link from 'next/link';
import { getRecentInstructions } from '@/lib/supabase/queries';
import { InstructionCard } from '@/components/vibe/InstructionCard';
import { INSTRUCTION_CATEGORIES, InstructionCategory } from '@/lib/supabase/types';
import { ArrowRight, Terminal, Bot, Zap, Anchor, Ruler, MessageSquare, Workflow } from 'lucide-react';

const CATEGORY_ICONS = {
  command: Terminal,
  workflow: Workflow,
  agent: Bot,
  skill: Zap,
  hook: Anchor,
  rule: Ruler,
  prompt: MessageSquare,
};

export const dynamic = 'force-dynamic';

export default async function InstructionsPage() {
  const recentInstructions = await getRecentInstructions(6);

  return (
    <div className="space-y-16">
      {/* Header Section */}
      <section className="space-y-4 border-l-4 border-[var(--terminal-purple)] pl-6 py-4">
        <span className="text-[var(--terminal-purple)] font-mono text-sm uppercase">
          /DIRECTORY/INSTRUCTIONS/
        </span>
        <h1 className="text-4xl font-bold tracking-tight uppercase font-mono text-[var(--terminal-green)] glitch-text">
          Instructions_Hub
        </h1>
        <p className="text-[var(--terminal-text-muted)] max-w-2xl font-mono">
          &gt; Browse our collection of AI instructions, skills, and prompts.
          Enhance your workflow with pre-built capabilities for Claude, Cursor, and more.
        </p>
      </section>

      {/* Categories Grid */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold uppercase font-mono text-[var(--terminal-green)] flex items-center gap-2">
          <span className="text-[var(--terminal-purple)]">//</span> Browse_by_Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(INSTRUCTION_CATEGORIES).map(([key, category], index) => {
            const Icon = CATEGORY_ICONS[key as InstructionCategory] || Terminal;
            const hexIndex = `0x${(index + 1).toString(16).padStart(2, '0').toUpperCase()}`;
            return (
              <Link key={key} href={`/instructions/${key}`} className="group">
                <div className="h-full p-6 border-2 border-[var(--terminal-border-muted)] hover:border-[var(--terminal-green)] hover:bg-[var(--terminal-green)]/10 transition-all relative bg-[var(--terminal-bg)]">
                  {/* Hex ID */}
                  <span className="absolute top-2 right-2 text-xs text-[var(--terminal-text-muted)] font-mono">
                    {hexIndex}
                  </span>
                  
                  <div className="w-12 h-12 border-2 border-[var(--terminal-purple)] flex items-center justify-center mb-4 group-hover:bg-[var(--terminal-purple)] transition-colors">
                    <Icon className="w-6 h-6 text-[var(--terminal-purple)] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 uppercase font-mono text-[var(--terminal-green)] group-hover:text-[var(--terminal-green)] transition-colors">
                    {category.label}
                  </h3>
                  <p className="text-[var(--terminal-text-muted)] text-sm mb-4 font-mono">
                    {category.description}
                  </p>
                  <div className="flex items-center text-sm font-bold text-[var(--terminal-purple)] opacity-0 group-hover:opacity-100 transition-opacity font-mono uppercase">
                    Explore <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Additions */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold uppercase font-mono text-[var(--terminal-green)] flex items-center gap-2">
            <span className="text-[var(--terminal-purple)]">//</span> Recently_Added
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentInstructions.map((instruction, index) => (
            <div key={instruction.id} className="h-full">
              <InstructionCard instruction={instruction} index={index} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
