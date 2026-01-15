import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold uppercase transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--terminal-green)]",
  {
    variants: {
      variant: {
        default: "bg-[var(--terminal-green)] text-[var(--terminal-bg)] hover:bg-white pixel-border-sm",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border-2 border-[var(--terminal-green)] text-[var(--terminal-green)] bg-transparent hover:bg-[var(--terminal-green)] hover:text-[var(--terminal-bg)]",
        secondary:
          "border-2 border-[var(--terminal-purple)] text-[var(--terminal-purple)] bg-transparent hover:bg-[var(--terminal-purple)] hover:text-white",
        ghost:
          "text-[var(--terminal-green)] hover:bg-[var(--terminal-green)]/20",
        link: "text-[var(--terminal-purple)] underline-offset-4 hover:underline",
        success: "bg-[var(--terminal-green)] text-[var(--terminal-bg)] pixel-border-sm hover:bg-white",
        terminal: "bg-[var(--terminal-purple)] text-white pixel-border-sm hover:translate-y-0.5 active:translate-y-1",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
