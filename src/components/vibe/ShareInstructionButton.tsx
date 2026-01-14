"use client";

import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ShareInstructionButtonProps {
    title: string;
    description: string;
    className?: string;
}

export function ShareInstructionButton({ title, description, className }: ShareInstructionButtonProps) {
    const handleShare = async () => {
        const shareData = {
            title,
            text: description,
            url: window.location.href,
        };

        if (navigator.share && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // Ignore abort errors
                console.log('Share aborted');
            }
        } else {
            // Fallback to clipboard
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard");
        }
    };

    return (
        <Button className={cn(className)} variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Instruction
        </Button>
    );
}
