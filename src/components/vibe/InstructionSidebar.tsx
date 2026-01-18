
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
    Workflow,
    Brain
} from 'lucide-react';

const CATEGORY_ICONS = {
    command: Terminal,
    workflow: Workflow,
    agent: Bot,
    skill: Zap,
    hook: Anchor,
    rule: Ruler,
    prompt: MessageSquare,
};

export function InstructionSidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <nav className={cn(
            "flex flex-col w-[200px] h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto",
            "border-r-4 border-[var(--terminal-green)] bg-[var(--terminal-bg)]",
            className
        )}>
            {/* Overview Link */}
            <Link href="/instructions">
                <SidebarItem
                    active={pathname === '/instructions'}
                    icon={Home}
                    index={0}
                >
                    Overview
                </SidebarItem>
            </Link>

            {/* AI Docs Search Link */}
            <Link href="/instructions/ai-docs">
                <SidebarItem
                    active={pathname === '/instructions/ai-docs'}
                    icon={Brain}
                    index={-1}
                >
                    AI Docs
                </SidebarItem>
            </Link>

            {/* Categories Section */}
            <div className="py-2">
                <h3 className="px-4 py-2 text-[10px] font-bold text-[var(--terminal-purple)] uppercase tracking-widest font-mono">
                    Categories
                </h3>
                {Object.entries(INSTRUCTION_CATEGORIES).map(([key, category], index) => {
                    const Icon = CATEGORY_ICONS[key as InstructionCategory] || Terminal;
                    const isActive = pathname.startsWith(`/instructions/${key}`);

                    return (
                        <Link key={key} href={`/instructions/${key}`}>
                            <SidebarItem active={isActive} icon={Icon} index={index + 1}>
                                {category.label}
                            </SidebarItem>
                        </Link>
                    );
                })}
            </div>

            {/* Status Footer */}
            <div className="mt-auto p-4 text-[10px] text-[var(--terminal-text-muted)] border-t border-[var(--terminal-border-muted)] font-mono uppercase">
                SYSTEM_STATUS: OK<br />
                LATENCY: 14ms
            </div>
        </nav>
    );
}

function SidebarItem({
    children,
    active,
    icon: Icon,
    index
}: {
    children: React.ReactNode;
    active: boolean;
    icon: React.ComponentType<{ className?: string }>;
    index: number;
}) {
    const hexIndex = index.toString().padStart(2, '0');

    return (
        <div
            className={cn(
                "block py-3 px-4 border-b border-[var(--terminal-border-muted)] transition-all duration-200 text-xs font-mono uppercase cursor-pointer",
                active
                    ? "bg-[var(--terminal-green)] text-[var(--terminal-bg)]"
                    : "text-[var(--terminal-green)] hover:bg-[var(--terminal-green)] hover:text-[var(--terminal-bg)]"
            )}
        >
            <div className="flex items-center gap-2">
                <span className={cn(
                    "opacity-50",
                    active && "opacity-70"
                )}>{hexIndex}.</span>
                <Icon className="w-4 h-4" />
                {children}
            </div>
        </div>
    );
}
