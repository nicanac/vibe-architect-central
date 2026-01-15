"use client";

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface HeroSectionProps {
  theme?: "dark" | "light";
}

export function HeroSection({ theme = "dark" }: HeroSectionProps) {
  const isDark = theme === "dark";

  return (
    <section
      className={cn(
        "text-left mb-32 border-l-4 pl-8 py-12",
        "border-[var(--terminal-purple)] bg-[var(--terminal-bg)]/50"
      )}
    >
      {/* Status Badge */}
      <span
        className="inline-block px-2 py-1 font-bold text-xs mb-6 pixel-border-sm bg-[var(--terminal-green)] text-[var(--terminal-bg)]"
      >
        STATUS: ONLINE // NEXT_GEN_AGENCY
      </span>

      {/* Main Heading */}
      <h1
        className="text-4xl md:text-7xl font-mono font-bold mb-8 leading-none tracking-tighter glitch-text text-[var(--terminal-green)]"
      >
        WE_ENGINEER_THE <br />
        <span className="text-[var(--terminal-purple)] underline decoration-4 underline-offset-8">
          VIBES
        </span>{" "}
        <br />
        YOU_BUILD_THE_FUTURE
      </h1>

      {/* Tagline */}
      <p
        className="mt-4 max-w-2xl text-lg border-b-2 pb-8 italic text-[var(--terminal-text-muted)] border-[var(--terminal-border-muted)]"
      >
        &gt; A digital agency fusing algorithmic precision with artistic
        intuition. We code systems that feel human and scale infinitely.
      </p>

      {/* CTA Buttons */}
      <div className="mt-12 flex flex-col sm:flex-row gap-6">
        <Link
          href="#services"
          className="pixel-border font-bold px-8 py-4 uppercase flex items-center justify-center gap-2 transition-colors bg-[var(--terminal-green)] text-[var(--terminal-bg)] hover:bg-[var(--terminal-hover-bg)] hover:text-[var(--terminal-hover-text)]"
        >
          RUN_SERVICES.sh <ArrowRight className="w-5 h-5" />
        </Link>
        <Link
          href="#case-studies"
          className="pixel-border font-bold px-8 py-4 uppercase transition-all border-[var(--terminal-purple)] text-[var(--terminal-purple)] hover:bg-[var(--terminal-purple)] hover:text-white"
        >
          VIEW_CASE_STUDIES
        </Link>
      </div>
    </section>
  );
}
