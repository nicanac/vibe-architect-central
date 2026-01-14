# Project: Vibe Architect Central - Technical Blueprint (v2026)
**Stack:** Next.js 16.1 (App Router), TypeScript 7.0 (tsgo), Tailwind CSS 4.1, Supabase v2.90, shadcn/ui 3.6 (MCP-Native).

## 1. 2026 Architectural Shifts
- **Compiler:** Using `tsgo` (Project Corsa) for 10x faster type-checking.
- **Styling:** Tailwind 4.1 removes `tailwind.config.js`. Theme variables move to `globals.css` using the `@theme` directive.
- **AI-Native Components:** Utilizing shadcn/ui 3.6 with **Model Context Protocol (MCP)** support, allowing your AI Agent (Cursor/Antigravity) to fetch and install components directly.

## 2. Database Schema (Supabase)
### Tables
#### `tools`
- `id`: uuid (pk)
- `name`: text
- `description`: text
- `url`: text
- `vibe_level`: enum ('no-code', 'low-code', 'agentic', 'pro-orchestration')
- `pricing`: text
- `image_url`: text
- `created_at`: timestamptz (default: now())

#### `prompts`
- `id`: uuid (pk)
- `title`: text
- `content`: text (The raw orchestration prompt)
- `target_ai`: text (Gemini Pro, Claude 3.5, etc.)
- `technique`: text (CoT, ReAct, etc.)
- `created_by`: uuid (auth.users link)

## 3. Folder Structure (Next.js 16.1)
```text
/
├── .cursor/               # MCP and Agent-specific context
├── supabase/              # SQL Migrations & Seed data
├── src/
│   ├── app/               # App Router with "use cache" directives
│   │   ├── (directory)/   # Tools & Prompts routes
│   │   └── proxy.ts       # 2026 replacement for complex middleware.ts
│   ├── components/
│   │   ├── ui/            # shadcn components (v3.6)
│   │   └── vibe/          # Custom Architect components
│   ├── lib/
│   │   ├── supabase/      # Supabase client (v2.90+)
│   │   └── actions/       # Server Actions for prompt copying/execution
│   └── styles/
│       └── globals.css    # Tailwind 4.1 @theme configurations
└── next.config.ts         # Native TypeScript config
```
