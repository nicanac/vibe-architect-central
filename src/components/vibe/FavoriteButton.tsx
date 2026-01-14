"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavoriteTool, toggleFavoritePrompt } from "@/app/actions/favorites";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  itemId: string;
  itemType: "tool" | "prompt";
  initialFavorited: boolean;
  className?: string;
}

export function FavoriteButton({
  itemId,
  itemType,
  initialFavorited,
  className,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const result =
        itemType === "tool"
          ? await toggleFavoriteTool(itemId)
          : await toggleFavoritePrompt(itemId);

      if (result.error) {
        toast.error(result.error);
      } else {
        setIsFavorited(result.isFavorited!);
        toast.success(
          result.isFavorited
            ? `Added to favorites!`
            : `Removed from favorites`
        );
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "p-2 rounded-md transition-colors",
        isFavorited
          ? "text-red-500 hover:text-red-400 bg-red-500/10"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary",
        isPending && "opacity-50 cursor-not-allowed",
        className
      )}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn("w-5 h-5", isFavorited && "fill-current")}
      />
    </button>
  );
}
