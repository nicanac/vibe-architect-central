# Project: Vibe Architect Central - Guided Design Document
**Theme:** Cyber-Industrial Minimalist
**Library:** shadcn/ui (Tailwind CSS + Radix UI)
**Icons:** Lucide-react

## 1. Visual Language
- **Atmosphere:** Dark, focused, and high-performance.
- **Surfaces:** Deep grays and obsidian blacks with "frosted" borders (1px) to create depth.
- **Typography:** - *Primary:* Inter or Geist Sans (Clean, Modern).
  - *Monospace:* JetBrains Mono (For all prompt/code blocks).

## 2. Color Palette
| Element | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Background** | `#09090b` | Base page color |
| **Card/Surface** | `#18181b` | Component containers |
| **Border** | `#27272a` | Subtle structure |
| **Primary Accent** | `#3b82f6` | "Run in AI" buttons (Blue) |
| **Prompt Accent** | `#10b981` | Copy-to-clipboard success (Emerald) |
| **Text Primary** | `#fafafa` | High readability |
| **Text Muted** | `#a1a1aa` | Meta-data and descriptions |

## 3. Component Style Guide
- **Buttons:** Sharp corners (radius: 4px), subtle hover glow effects.
- **Cards:** No shadows; use 1px solid borders.
- **Code Blocks:** Syntax highlighting using `shiki` or `prism`. Include a visible "Copy" overlay.
- **Navigation:** Top-sticky "Command Bar" style search (CMD+K) for tool discovery.

## 4. Key UI Elements
- **The "Prompt Mirror":** A side-by-side view where the left side is the "Instruction" and the right side is the "Target AI" selector.
- **Stack Badges:** Small, pill-shaped tags indicating tech compatibility (e.g., Next.js, Python, Rust).
