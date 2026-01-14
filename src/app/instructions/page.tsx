
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getRecentInstructions } from '@/lib/supabase/queries';
import { InstructionCard } from '@/components/vibe/InstructionCard';
import { INSTRUCTION_CATEGORIES, InstructionCategory } from '@/lib/supabase/types';
import { ArrowRight, Terminal, Bot, Zap, Anchor, Ruler, MessageSquare } from 'lucide-react';

const CATEGORY_ICONS = {
  command: Terminal,
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
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Instructions Hub</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Browse our collection of AI instructions, skills, and prompts.
          Enhance your workflow with pre-built capabilities for Claude, Cursor, and more.
        </p>
      </section>

      {/* Categories Grid */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(INSTRUCTION_CATEGORIES).map(([key, category]) => {
            const Icon = CATEGORY_ICONS[key as InstructionCategory] || Terminal;
            return (
              <Link key={key} href={`/instructions/${key}`} className="group">
                <div className="h-full p-6 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-all">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-2xl bg-background border border-border/50 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${category.color.replace('text-', 'text-')}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {category.label}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                    Explore <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Additions */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Recently Added</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentInstructions.map((instruction) => (
            <div key={instruction.id} className="h-full">
              <InstructionCard instruction={instruction} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
