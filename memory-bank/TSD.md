# Project: Vibe Architect Central - Technical Blueprint (v2026)

**Stack:** Next.js 16.1 (App Router), TypeScript 7.0 (tsgo), Tailwind CSS 4.1, Supabase v2.90, shadcn/ui 3.6 (MCP-Native).

## 1. 2026 Architectural Shifts

- **Compiler:** Using `tsgo` (Project Corsa) for 10x faster type-checking.
- **Styling:** Tailwind 4.1 removes `tailwind.config.js`. Theme variables in `globals.css` using `@theme` directive.
- **Terminal Theme (v2):** Retro CRT aesthetic with:
  - **Fonts:** Fira Code (monospace), Space Grotesk (headings)
  - **Colors:** Terminal green (#00FF41), purple (#BC13FE), dark bg (#0a0a0a)
  - **Effects:** CRT scanlines, pixel borders, glitch text
- **AI-Native Components:** Utilizing shadcn/ui 3.6 with **Model Context Protocol (MCP)** support.

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
│   │   ├── (auth)/        # Route group for login/signup (no Header)
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (directory)/   # Tools & Prompts routes
│   │   ├── auth/          # OAuth callback routes
│   │   └── instructions/  # Instructions Hub with sidebar layout
│   ├── components/
│   │   ├── layout/        # Global layout components (Header, Footer)
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

## 4. Layout Architecture

- **Root Layout** (`app/layout.tsx`): Contains global Header and Footer
- **Route Groups**: Use `(groupName)` to share layout without affecting URL
  - `(auth)` group: Contains `login` and `signup` pages. Allows them to have a distinct layout (hidden Header) while keeping clean URLs (`/login` instead of `/auth/login`).
- **Standard Routes**:
  - `auth` directory: Contains functional authentication routes like `/auth/callback` and `/auth/error` used by Supabase Auth flow.
- **Nested Layouts**: Feature-specific layouts (e.g., `instructions/layout.tsx` with sidebar)
