"use client";

import { cn } from "@/lib/utils";
import {
  Brain,
  Network,
  Palette,
  Sparkles,
  Code,
  Shield,
} from "lucide-react";

interface ServicesGridProps {
  theme?: "dark" | "light";
}

const services = [
  {
    id: "0x01",
    icon: Brain,
    title: "Prompt Engineering",
    description:
      "Crafting the perfect inputs to elicit the most creative and accurate outputs from LLMs. We speak the language of AI.",
  },
  {
    id: "0x02",
    icon: Network,
    title: "AI System Integration",
    description:
      "Seamlessly connecting advanced AI models into your existing tech stack. From API to UI, we handle the flow.",
  },
  {
    id: "0x03",
    icon: Palette,
    title: "Algorithmic Art",
    description:
      "Generative visuals that adapt to your brand's pulse. Unique, scalable, and impossible to ignore content creation.",
  },
  {
    id: "0x04",
    icon: Sparkles,
    title: "Workflow Automation",
    description:
      "Eliminating the boring stuff. We build self-healing automation pipelines that give you back your time.",
  },
  {
    id: "0x05",
    icon: Code,
    title: "No-Code Solutions",
    description:
      "Rapid prototyping and deployment using the best no-code tools, enhanced with custom code where it counts.",
  },
  {
    id: "0x06",
    icon: Shield,
    title: "Ethical AI Audits",
    description:
      "Ensuring your automated systems are fair, transparent, and aligned with human values.",
  },
];

export function ServicesGrid({ theme = "dark" }: ServicesGridProps) {
  return (
    <section
      id="services"
      className="py-24 border-t-4 border-[var(--terminal-green)]"
    >
      {/* Header */}
      <div className="mb-16">
        <h2 className="text-[var(--terminal-purple)] font-mono text-sm uppercase mb-2">
          /CAPABILITIES/
        </h2>
        <h3 className="text-4xl font-mono font-bold uppercase text-[var(--terminal-green)]">
          Smart Vibe Automation
        </h3>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
        {services.map((service) => (
          <div
            key={service.id}
            className="group border-2 p-8 transition-all relative border-[var(--terminal-border-muted)] hover:bg-[var(--terminal-green)]/10"
          >
            {/* Hex ID */}
            <span className="absolute top-2 right-2 text-xs opacity-30 text-[var(--terminal-green)]">
              {service.id}
            </span>

            {/* Icon */}
            <div className="text-[var(--terminal-purple)] mb-6">
              <service.icon className="w-12 h-12" strokeWidth={1.5} />
            </div>

            {/* Title */}
            <h4 className="text-xl font-bold mb-4 uppercase tracking-tight text-[var(--terminal-green)]">
              {service.title}
            </h4>

            {/* Description */}
            <p className="text-sm leading-relaxed text-[var(--terminal-text-muted)]">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
