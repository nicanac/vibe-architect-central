"use client";

import { cn } from "@/lib/utils";
import { Terminal } from "lucide-react";
import Link from "next/link";

interface TerminalNavProps {
  theme?: "dark" | "light";
}

export function TerminalNav({ theme = "dark" }: TerminalNavProps) {
  return (
    <nav
      className="sticky top-0 z-50 border-b-4 bg-[var(--terminal-bg)] border-[var(--terminal-green)]"
    >
      <div className="max-w-8xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Terminal className="w-7 h-7 text-[var(--terminal-green)]" />
            <span className="font-mono font-bold text-xl uppercase tracking-tighter text-[var(--terminal-green)]">
              Vibe_Coding_v1.0
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm uppercase">
            <Link
              href="#services"
              className="px-2 py-1 transition-all font-bold text-[var(--terminal-green)] hover:bg-[var(--terminal-green)] hover:text-[var(--terminal-bg)]"
            >
              [ Services ]
            </Link>
            <Link
              href="#projects"
              className="px-2 py-1 transition-all font-bold text-[var(--terminal-green)] hover:bg-[var(--terminal-green)] hover:text-[var(--terminal-bg)]"
            >
              [ Projects ]
            </Link>
            <Link
              href="#process"
              className="px-2 py-1 transition-all font-bold text-[var(--terminal-green)] hover:bg-[var(--terminal-green)] hover:text-[var(--terminal-bg)]"
            >
              [ Process ]
            </Link>

            {/* CTA Button */}
            <Link
              href="#contact"
              className="bg-[var(--terminal-purple)] text-white px-4 py-1 pixel-border-sm hover:translate-y-0.5 active:translate-y-1 transition-all font-bold"
            >
              GET_IN_TOUCH.exe
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
