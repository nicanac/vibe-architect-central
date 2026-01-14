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

#### `instructions`
- `id`: uuid (pk)
- `title`: text
- `slug`: text (unique)
- `description`: text
- `content`: text
- `category`: enum ('command', 'agent', 'skill', 'hook', 'rule', 'prompt')
- `agent_types`: enum[] ('claude', 'cursor', etc.)
- `difficulty`: enum ('beginner', 'intermediate', 'advanced')
- `file_format`: enum ('markdown', 'json', 'yaml', 'toml')
- `tags`: text[]
- `search_vector`: tsvector

#### `profiles`
- `id`: uuid (pk, references auth.users)
- `email`: text
- `full_name`: text
- `avatar_url`: text
- `updated_at`: timestamptz

#### `favorites`
- `id`: uuid (pk)
- `user_id`: uuid (references profiles)
- `item_id`: uuid (polymorphic: tools/prompts/instructions)
- `item_type`: text ('tool', 'prompt', 'instruction')
- `created_at`: timestamptz

## 3. Folder Structure (Next.js 16.1)
```text
/
├── .agent/                # Antigravity Agent Skills & Workflows
├── .cursor/               # MCP and Agent-specific context
├── supabase/              # SQL Migrations & Seed data
├── src/
│   ├── app/               # App Router with "use cache" directives
│   │   ├── (directory)/   # Tools & Prompts routes
│   │   ├── auth/          # Authentication routes
│   │   └── instructions/  # Instructions Hub
│   ├── components/
│   │   ├── ui/            # shadcn components (v3.6)
│   │   └── vibe/          # Custom Architect components
│   ├── lib/
│   │   ├── supabase/      # Supabase client (v2.90+)
│   │   └── actions/       # Server Actions for prompt copying/execution
│   ├── middleware.ts      # Auth protection & routing
│   └── styles/
│       └── globals.css    # Tailwind 4.1 @theme configurations
└── next.config.ts         # Native TypeScript config
```

## 4. Project Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `npm run dev` | Start development server with Turbo |
| `build` | `npm run build` | Build for production |
| `sync:ai` | `npm run sync:ai` | Syncs `.agent` and `.github` to `ai/` for agent context |
| `branch` | `npm run branch` | Create feature branch from linear/jira ID |
| `lint` | `npm run lint` | Run ESLint |

