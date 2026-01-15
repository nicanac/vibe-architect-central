"use client";

import { cn } from "@/lib/utils";

interface SolutionBannerProps {
  theme?: "dark" | "light";
}

export function SolutionBanner({ theme = "dark" }: SolutionBannerProps) {
  return (
    <section className="py-24 text-center border-l-4 mt-24 border-[var(--terminal-green)]">
      {/* Warning Badge */}
      <span className="font-mono text-sm uppercase mb-4 block text-[var(--terminal-purple)]">
        WARNING: SYSTEM_INEFFICIENCY_DETECTED
      </span>

      {/* Heading */}
      <h2 className="text-3xl md:text-5xl font-mono font-bold mb-6 uppercase tracking-tight text-[var(--terminal-green)]">
        Manual Work Is Slowing Your
        <br />
        Business Down
      </h2>

      {/* Quote */}
      <p className="text-lg mb-12 max-w-2xl mx-auto italic text-[var(--terminal-text-muted)]">
        &quot;Growing companies lose time, money, and opportunities because
        their systems don&apos;t talk to each other.&quot;
      </p>

      {/* Solution Box */}
      <div className="pixel-border p-12 max-w-3xl mx-auto relative group bg-[var(--terminal-bg)] border-[var(--terminal-green)]">
        {/* Floating Label */}
        <div className="absolute -top-4 left-4 px-3 py-1 font-bold text-xs uppercase pixel-border-sm bg-[var(--terminal-green)] text-[var(--terminal-bg)]">
          Resolution_found
        </div>

        {/* Solution Title */}
        <h3 className="text-2xl font-bold mb-6 uppercase text-[var(--terminal-green)]">
          The Vibe Coding Solution
        </h3>

        {/* Solution Description */}
        <p className="leading-relaxed font-mono text-sm md:text-base text-[var(--terminal-text-muted)]">
          We deploy intelligent agents that handle the heavy lifting. Your team
          focuses on strategy and creativity, while our code handles the
          execution.
        </p>
      </div>
    </section>
  );
}
