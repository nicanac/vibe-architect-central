
"use client";

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CodeBlockProps {
    code: string;
    language?: string;
    className?: string;
}

export function CodeBlock({ code, language = 'bash', className }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={cn("relative group rounded-md overflow-hidden bg-muted/50 border border-border/50 font-mono text-sm", className)}>
            <div className="flex items-center justify-between px-4 py-2 bg-muted/80 border-b border-border/50">
                <span className="text-xs text-muted-foreground uppercase">{language}</span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={handleCopy}
                >
                    {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                    <span className="sr-only">Copy code</span>
                </Button>
            </div>
            <div className="p-4 overflow-x-auto">
                <pre className="text-foreground/90 leading-relaxed">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
}
