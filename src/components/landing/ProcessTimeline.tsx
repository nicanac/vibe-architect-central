"use client";

import { cn } from "@/lib/utils";

interface ProcessTimelineProps {
  theme?: "dark" | "light";
}

const steps = [
  {
    step: "STEP_01",
    title: "Vibe Check",
    description:
      "We analyze your current workflows, brand voice, and pain points to understand the 'vibe' you want to achieve.",
  },
  {
    step: "STEP_02",
    title: "Prototype",
    description:
      "We build a rapid MVP of the automation or AI integration. You see the magic happen before full commitment.",
  },
  {
    step: "STEP_03",
    title: "Scale",
    description:
      "Once validated, we deploy the system at scale, integrating it deeply into your infrastructure for maximum impact.",
  },
  {
    step: "STEP_04",
    title: "Vibe Check 2.0",
    description:
      "Continuous monitoring and fine-tuning. As AI evolves, so does your system. We keep the vibes immaculate.",
  },
];

export function ProcessTimeline({ theme = "dark" }: ProcessTimelineProps) {
  return (
    <section
      id="process"
      className="py-24 pixel-border bg-[var(--terminal-bg)]/80 border-[var(--terminal-purple)]"
    >
      <div className="px-8">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-[var(--terminal-purple)] font-mono text-sm uppercase mb-2">
            // SEQUENCE_FLOW //
          </h2>
          <h3 className="text-4xl font-mono font-bold uppercase text-[var(--terminal-green)]">
            Our Simple, Proven
            <br />
            Automation Process
          </h3>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step) => (
            <div
              key={step.step}
              className="border-2 p-6 relative border-[var(--terminal-green)] bg-[var(--terminal-bg)]"
            >
              {/* Step Number */}
              <span className="font-mono text-xs text-[var(--terminal-purple)] mb-4 block underline">
                {step.step}
              </span>

              {/* Title */}
              <h4 className="text-lg font-bold mb-4 uppercase text-[var(--terminal-green)]">
                {step.title}
              </h4>

              {/* Description */}
              <p className="text-xs leading-relaxed uppercase text-[var(--terminal-text-muted)]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
