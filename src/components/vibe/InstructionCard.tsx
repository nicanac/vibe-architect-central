
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Instruction } from '@/lib/supabase/types';
import {
  Terminal,
  Bot,
  Zap,
  Anchor,
  Ruler,
  MessageSquare,
  ArrowRight,
  Copy,
  Workflow
} from 'lucide-react';

interface InstructionCardProps {
  instruction: Instruction;
  className?: string;
}

const CATEGORY_ICONS = {
  command: Terminal,
  workflow: Workflow,
  agent: Bot,
  skill: Zap,
  hook: Anchor,
  rule: Ruler,
  prompt: MessageSquare,
};

const DIFFICULTY_COLORS = {
  beginner: 'bg-green-500/10 text-green-500 border-green-500/20',
  intermediate: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  advanced: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export function InstructionCard({ instruction, className }: InstructionCardProps) {
  const Icon = CATEGORY_ICONS[instruction.category] || Terminal;

  return (
    <Card className={cn("group flex flex-col h-full bg-background/50 backdrop-blur-sm border-white/5 hover:border-primary/50 transition-colors", className)}>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="p-2 rounded-md bg-primary/10 text-primary">
            <Icon className="w-5 h-5" />
          </div>
          <Badge variant="outline" className={cn("capitalize", DIFFICULTY_COLORS[instruction.difficulty])}>
            {instruction.difficulty}
          </Badge>
        </div>
        <CardTitle className="mt-4 text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
          {instruction.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {instruction.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {instruction.agent_types.slice(0, 3).map((agent) => (
            <Badge key={agent} variant="secondary" className="text-xs bg-secondary/50">
              {agent}
            </Badge>
          ))}
          {instruction.agent_types.length > 3 && (
            <Badge variant="secondary" className="text-xs bg-secondary/50">
              +{instruction.agent_types.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t border-white/5 pt-4">
        <Link
          href={`/instructions/${instruction.category}/${instruction.slug}`}
          className="w-full"
        >
          <button className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-all text-sm font-medium">
            View Instructions <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </CardFooter>
    </Card>
  );
}
