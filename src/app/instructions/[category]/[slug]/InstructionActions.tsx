"use client";

import { useState } from "react";
import { Instruction } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import { useVibeClipboard } from "@/lib/hooks/useVibeClipboard";
import { Copy, Download, Heart, Check, Share2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface InstructionActionsProps {
  instruction: Instruction;
}

export function InstructionActions({ instruction }: InstructionActionsProps) {
  const { copy, copied } = useVibeClipboard({ successMessage: `${instruction.title} copied!` });
  const [isFavorited, setIsFavorited] = useState(false);

  const handleCopy = async () => {
    await copy(instruction.content);
    
    // Increment copy count
    const supabase = createClient();
    await supabase.rpc("increment_instruction_copy", { instruction_id: instruction.id });
  };

  const handleDownload = () => {
    const extension = instruction.file_format === "markdown" ? "md" : instruction.file_format;
    const filename = `${instruction.slug}.${extension}`;
    const blob = new Blob([instruction.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: instruction.title,
          text: instruction.description,
          url,
        });
      } catch {
        // User cancelled or error
        await navigator.clipboard.writeText(url);
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const handleFavorite = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Redirect to login or show message
      window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname);
      return;
    }

    if (isFavorited) {
      await supabase
        .from("instruction_favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("instruction_id", instruction.id);
      setIsFavorited(false);
    } else {
      await supabase
        .from("instruction_favorites")
        .insert({ user_id: user.id, instruction_id: instruction.id });
      setIsFavorited(true);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mb-8 p-4 vibe-glass rounded-industrial border border-border">
      <Button 
        onClick={handleCopy}
        className="flex-1 sm:flex-none"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" />
            Copy Content
          </>
        )}
      </Button>
      
      <Button 
        variant="outline" 
        onClick={handleDownload}
        className="flex-1 sm:flex-none"
      >
        <Download className="w-4 h-4 mr-2" />
        Download
      </Button>
      
      <Button 
        variant="outline" 
        onClick={handleShare}
        className="flex-1 sm:flex-none"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </Button>
      
      <Button 
        variant="ghost" 
        onClick={handleFavorite}
        className={isFavorited ? "text-red-500" : ""}
      >
        <Heart className={`w-4 h-4 mr-2 ${isFavorited ? "fill-current" : ""}`} />
        {isFavorited ? "Saved" : "Save"}
      </Button>
    </div>
  );
}
