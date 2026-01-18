---
name: project-genome
description: Ultra-detailed codebase analysis generating machine-readable JSON and human-readable Markdown genome files
---

# Project Genome Skill

Generate comprehensive project documentation by analyzing the entire codebase and extracting tech stack, design system, and reusable templates.

## Role

You are a **Lead System Architect and UI/UX Engineer**.

## Objective

Perform an ultra-detailed analysis of the application codebase. Index every file, referencing external documentation via browser tool only if specific library details are missing from the code.

## Output Files

Generate two distinct files in the `memory-bank/` directory:

1. **`project_genome.json`** - Machine-readable source of truth
2. **`project_genome.md`** - Human-readable summary with templates

---

## Process

### Phase 1: Codebase Discovery

1. **Scan project structure** - List all directories and files
2. **Read package.json** - Extract all dependencies with versions
3. **Read config files** - tsconfig, tailwind.config, next.config, etc.
4. **Scan src/** - Index all components, pages, hooks, utils
5. **Read globals.css** - Extract all CSS variables and themes

### Phase 2: Design System Extraction

1. **Colors**: Extract all Hex/RGB codes and CSS variables
   - Categorize by: Primary, Secondary, Background, Text, Alerts, Borders
2. **Typography**: Fonts, weights, line-heights, responsive sizing
3. **Spacing**: Padding/margin scales, gap values
4. **Components**: UI library components and custom components
5. **Assets**: Index logos, icons, media paths

### Phase 3: Architecture Analysis

1. **Routing structure** - App Router pages and API routes
2. **Data layer** - Database schema, queries, server actions
3. **State management** - Hooks, context, external stores
4. **Authentication** - Auth patterns and middleware
5. **External integrations** - APIs, SDKs, third-party services

### Phase 4: Template Generation

1. Analyze existing page structure in `/app` or `/pages`
2. Identify common patterns: layouts, loading states, error boundaries
3. Create generic **Boilerplate Page Template** ready for copy-paste

---

## JSON Schema (project_genome.json)

```json
{
  "meta": {
    "name": "Project Name",
    "version": "x.x.x",
    "generatedAt": "ISO timestamp",
    "description": "Brief project description"
  },
  "techStack": {
    "framework": { "name": "Next.js", "version": "16.x" },
    "language": { "name": "TypeScript", "version": "5.x" },
    "styling": { "name": "Tailwind CSS", "version": "4.x" },
    "database": { "name": "Supabase", "version": "x.x" },
    "ui": { "name": "shadcn/ui", "style": "Lyra/Sharp" },
    "dependencies": [
      { "name": "package-name", "version": "x.x.x", "purpose": "description" }
    ],
    "devDependencies": [
      { "name": "package-name", "version": "x.x.x", "purpose": "description" }
    ]
  },
  "designSystem": {
    "colors": {
      "primary": { "value": "#hex", "variable": "--color-primary" },
      "background": { "value": "#hex", "variable": "--bg" },
      "text": { "value": "#hex", "variable": "--text" }
    },
    "typography": {
      "fontFamily": { "primary": "Inter", "mono": "JetBrains Mono" },
      "fontSizes": { "xs": "0.75rem", "sm": "0.875rem", "base": "1rem" },
      "fontWeights": { "normal": 400, "medium": 500, "bold": 700 }
    },
    "spacing": { "unit": "rem", "scale": [0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8] },
    "borderRadius": { "none": "0", "sm": "0.125rem", "md": "0.375rem" }
  },
  "architecture": {
    "directories": {
      "src/app": "App Router pages and API routes",
      "src/components": "Reusable UI components",
      "src/lib": "Utilities, hooks, and helpers"
    },
    "pages": [
      { "path": "/", "file": "src/app/page.tsx", "description": "Home page" }
    ],
    "apiRoutes": [
      { "path": "/api/example", "file": "src/app/api/example/route.ts" }
    ],
    "database": {
      "tables": [
        { "name": "users", "columns": ["id", "email", "created_at"] }
      ]
    }
  },
  "assets": {
    "logos": ["public/logo.svg"],
    "icons": "lucide-react",
    "media": ["public/images/"]
  }
}
```

---

## Markdown Template (project_genome.md)

```markdown
# Project Genome: [Project Name]

> Generated: [ISO Date] | Version: [x.x.x]

## Executive Summary

[Brief overview of the project's core purpose and architecture]

## Tech Stack

| Category   | Technology     | Version |
|------------|----------------|---------|
| Framework  | Next.js        | 16.x    |
| Language   | TypeScript     | 5.x     |
| Styling    | Tailwind CSS   | 4.x     |
| Database   | Supabase       | x.x     |
| UI Library | shadcn/ui      | -       |

## Design System

### Color Palette

| Name       | Hex       | CSS Variable        | Usage           |
|------------|-----------|---------------------|-----------------|
| Primary    | #3b82f6   | --color-primary     | Buttons, links  |
| Background | #09090b   | --bg                | Page background |

### Typography

- **Primary Font**: Inter, system-ui
- **Monospace**: JetBrains Mono
- **Base Size**: 1rem (16px)

## Development Standards

### Coding Conventions
- [List discovered patterns]

### File Naming
- Components: PascalCase (e.g., `UserCard.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Routes: kebab-case folders

## Boilerplate Page Template

\`\`\`tsx
// src/app/[feature]/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
};

export default async function FeaturePage() {
  // Data fetching here
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="border-l-4 border-[var(--terminal-purple)] pl-6 py-4">
        <span className="text-[var(--terminal-purple)] font-mono text-sm uppercase">
          /DIRECTORY/FEATURE/
        </span>
        <h1 className="text-4xl font-bold uppercase font-mono text-[var(--terminal-green)]">
          Feature_Title
        </h1>
        <p className="text-[var(--terminal-text-muted)] font-mono">
          &gt; Feature description here
        </p>
      </section>

      {/* Content */}
      <section className="space-y-4">
        {/* Your content */}
      </section>
    </div>
  );
}
\`\`\`

## Directory Structure

\`\`\`
src/
├── app/              # App Router pages
├── components/       # UI components
│   ├── ui/           # shadcn/ui primitives
│   ├── layout/       # Header, Footer
│   └── vibe/         # Custom components
├── lib/              # Utilities
│   ├── supabase/     # Database client & queries
│   ├── hooks/        # React hooks
│   └── utils/        # Helper functions
└── styles/           # Global CSS
\`\`\`
```

---

## Success Criteria

- [ ] All dependencies indexed with versions
- [ ] Complete color palette extracted
- [ ] Typography system documented
- [ ] All pages and routes catalogued
- [ ] Boilerplate template created and tested
- [ ] Both JSON and MD files written to memory-bank/
