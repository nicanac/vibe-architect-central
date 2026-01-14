"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

interface UseVibeClipboardOptions {
  successMessage?: string;
  errorMessage?: string;
  duration?: number;
}

export function useVibeClipboard(options: UseVibeClipboardOptions = {}) {
  const {
    successMessage = "Copied to clipboard!",
    errorMessage = "Failed to copy",
    duration = 2000,
  } = options;

  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success(successMessage, {
          duration,
          style: {
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.5)",
            color: "#10b981",
          },
        });

        setTimeout(() => setCopied(false), duration);
        return true;
      } catch {
        toast.error(errorMessage, {
          duration,
        });
        return false;
      }
    },
    [successMessage, errorMessage, duration]
  );

  return { copy, copied };
}
