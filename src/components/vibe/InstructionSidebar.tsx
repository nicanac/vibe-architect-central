
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { INSTRUCTION_CATEGORIES, InstructionCategory } from '@/lib/supabase/types';
import {
    Terminal,
    Bot,
    Zap,
    Anchor,
    Ruler,
    MessageSquare,
    Home,
    Workflow // Import new icon
} from 'lucide-react';

const CATEGORY_ICONS = {
    command: Terminal,
    workflow: Workflow, // Add workflow icon mapping
    agent: Bot,
    agent: Bot,
    skill: Zap,
    hook: Anchor,
    rule: Ruler,
    prompt: MessageSquare,
};

export function InstructionSidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <nav className={cn("flex flex-col gap-2 w-64 pr-4 border-r border-border/50 h-[calc(100vh-4rem)] sticky top-16", className)}>
            <div className="pb-4 mb-4 border-b border-border/50">
                <Link href="/instructions">
                    <ButtonVariant
                        active={pathname === '/instructions'}
                        icon={Home}
                    >
                        Overview
                    </ButtonVariant>
                </Link>
            </div>

            <div className="flex flex-col gap-1">
                <h3 className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Categories
                </h3>
                {Object.entries(INSTRUCTION_CATEGORIES).map(([key, category]) => {
                    const Icon = CATEGORY_ICONS[key as InstructionCategory] || Terminal;
                    const isActive = pathname.startsWith(`/instructions/${key}`);

                    return (
                        <Link key={key} href={`/instructions/${key}`}>
                            <ButtonVariant active={isActive} icon={Icon}>
                                {category.label}
                            </ButtonVariant>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

function ButtonVariant({ children, active, icon: Icon }: { children: React.ReactNode, active: boolean, icon: any }) {
    return (
        <div className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-md transition-colors text-sm font-medium",
            active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}>
            <Icon className="w-4 h-4" />
            {children}
        </div>
    )
}
