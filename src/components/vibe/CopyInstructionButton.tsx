
"use client";

import { Button } from "@/components/ui/button";
import { useVibeClipboard } from "@/lib/hooks/useVibeClipboard";
import { Copy, Check } from "lucide-react";

interface CopyInstructionButtonProps {
    content: string;
    label?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    className?: string;
}

export function CopyInstructionButton({ content, label = "Copy Instructions", variant = "secondary", className }: CopyInstructionButtonProps) {
    const { copy, copied } = useVibeClipboard({
        successMessage: "Instruction copied to clipboard!",
        duration: 2000,
    });

    return (
        <Button
            className={className}
            variant={variant}
            onClick={() => copy(content)}
        >
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? "Copied!" : label}
        </Button>
    );
}
