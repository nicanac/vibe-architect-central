import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full border-2 border-[var(--terminal-green)] bg-[var(--terminal-bg)] px-3 py-2 text-sm text-[var(--terminal-green)] font-mono uppercase transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--terminal-green)]/50 focus-visible:outline-none focus-visible:border-[var(--terminal-purple)] focus-visible:ring-1 focus-visible:ring-[var(--terminal-purple)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
