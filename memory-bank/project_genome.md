# Project Genome: Vibe Coding Tool

> Generated: 2026-01-18 | Version: 0.1.0

## Executive Summary

Vibe Architect Central is a high-performance directory and orchestration library for "Senior Vibe Architects." It serves as a central hub for discovering AI tools, managing prompts, and accessing agent instructions. Built with a "Cyber-Industrial" aesthetic, it bridges the gap between raw intent and executable prompts using a modern Next.js 16 stack.

## Tech Stack

| Category   | Technology     | Version | Purpose |
|------------|----------------|---------|---------|
| Framework  | Next.js        | 16.1.1  | App Router, Server Actions |
| Language   | TypeScript     | 5.x     | Strict typing (tsgo) |
| Styling    | Tailwind CSS   | 4.0     | Utility-first, CSS variables |
| Database   | Supabase       | v2      | PostgreSQL, Auth, Realtime |
| UI Library | shadcn/ui      | -       | Radix UI primitive components |
| Icons      | Lucide React   | 0.562   | Consistent iconography |

## Design System

### Color Palette (Cyber-Industrial)

| Name       | Hex       | CSS Variable              | Usage               |
|------------|-----------|---------------------------|---------------------|
| Background | `#09090b` | `--color-background`      | Main page background|
| Surface    | `#18181b` | `--color-surface`         | Cards, panels       |
| Border     | `#27272a` | `--color-border`          | 1px solid borders   |
| Primary    | `#3b82f6` | `--color-primary-accent`  | Actions, links      |
| Success    | `#10b981` | `--color-neon-success`    | Status indicators   |
| Text       | `#fafafa` | `--color-text-primary`    | Main content        |
| Muted      | `#a1a1aa` | `--color-text-muted`      | Secondary text      |

### Typography

- **Primary Font**: `Inter`, `Geist Sans` (System UI)
- **Monospace**: `JetBrains Mono` (Code blocks, technical details)
- **Base Size**: 1rem (16px)

### Visual Effects

- **Glassmorphism**: `.vibe-glass` (Backdrop blur, semi-transparent)
- **Neon Glow**: `.glow-primary`, `.glow-success`
- **Borders**: Sharp corners (`--radius-industrial: 4px`)

## Development Standards

### Coding Conventions
- **Intent-First**: Analyze requirements deeply before coding.
- **Server Components**: Default to server components; use local `use client` only when interactivity is needed.
- **Composition**: Favor component composition over complex props.
- **Type Safety**: Strictly typed interfaces; no `any`.

### File Naming
- Components: PascalCase (e.g., `UserCard.tsx`)
- Hooks: camelCase (e.g., `useAuth.ts`)
- Routes: kebab-case directories (e.g., `app/new-project/page.tsx`)

## Boilerplate Page Template

```tsx
// src/app/[feature]/page.tsx
import { Metadata } from 'next';
import { TerminalHeader } from '@/components/vibe/TerminalHeader';

export const metadata: Metadata = {
  title: 'Feature Name | Vibe Architect',
  description: 'Description of the feature functionality',
};

export default async function FeaturePage() {
  return (
    <div className="space-y-8 min-h-screen bg-[var(--color-background)]">
      {/* Feature Header */}
      <section className="border-l-4 border-[var(--terminal-purple)] pl-6 py-4">
        <span className="text-[var(--terminal-purple)] font-mono text-sm uppercase">
          /DIRECTORY/FEATURE/
        </span>
        <h1 className="text-4xl font-bold uppercase font-mono text-[var(--terminal-green)]">
          Feature_Title
        </h1>
        <p className="text-[var(--terminal-text-muted)] font-mono">
          &gt; Feature description and status
        </p>
      </section>

      {/* Content Container */}
      <section className="container max-w-7xl mx-auto px-4 space-y-4">
        <div className="vibe-card p-6">
            <h2 className="text-xl font-semibold mb-4 text-[var(--color-text-primary)]">
                Section Title
            </h2>
            <div className="text-[var(--color-text-muted)]">
                Feature content goes here...
            </div>
        </div>
      </section>
    </div>
  );
}
```

## Directory Structure

```
src/
├── app/                  # App Router
│   ├── (auth)/           # Authentication routes
│   ├── api/              # API Endpoints
│   ├── instructions/     # Instructions Hub
│   ├── new-project/      # Wizard Flow
│   ├── tools/            # Tools Directory
│   └── layout.tsx        # Global Layout
├── components/
│   ├── ui/               # shadcn/ui primitives
│   ├── vibe/             # Custom Project components (e.g., TerminalHeader)
│   └── layout/           # Sidebar, Footer
├── lib/
│   ├── supabase/         # Database client
│   └── utils.ts          # Styles utility (cn)
└── styles/
    └── globals.css       # Tailwind 4.0 Theme Variables
```
