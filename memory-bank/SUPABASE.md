# Supabase Database Documentation

## Overview

Vibe Architect Central uses **Supabase** as its backend database and authentication provider. This document covers the complete setup, schema, and usage patterns.

---

## Project Configuration

### Supabase Project Details

| Property              | Value                                      |
| --------------------- | ------------------------------------------ |
| **Project Reference** | `qlsgscizfvqbdajzqtgb`                     |
| **Region**            | Default (check Supabase dashboard)         |
| **Database**          | PostgreSQL 14+                             |
| **URL**               | `https://qlsgscizfvqbdajzqtgb.supabase.co` |

### Environment Variables

Create a `.env.local` file in the project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://qlsgscizfvqbdajzqtgb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

> ⚠️ **Never commit `.env.local` to version control.** The anon key is safe for client-side use but should still be kept private.

---

## Database Schema

### Enum Types

```sql
CREATE TYPE vibe_level AS ENUM (
  'no-code',
  'low-code',
  'agentic',
  'pro-orchestration'
);
```

### Tables

#### `tools` - AI Tool Directory

| Column        | Type         | Description                          |
| ------------- | ------------ | ------------------------------------ |
| `id`          | UUID         | Primary key (auto-generated)         |
| `name`        | VARCHAR(255) | Tool name (required)                 |
| `description` | TEXT         | Tool description                     |
| `url`         | VARCHAR(500) | Official tool URL                    |
| `vibe_level`  | vibe_level   | Skill level category                 |
| `pricing`     | VARCHAR(100) | Pricing model (Free, Freemium, etc.) |
| `image_url`   | VARCHAR(500) | Tool logo/image URL                  |
| `created_at`  | TIMESTAMPTZ  | Auto-set on creation                 |

#### `prompts` - Orchestration Prompt Library

| Column       | Type         | Description                       |
| ------------ | ------------ | --------------------------------- |
| `id`         | UUID         | Primary key (auto-generated)      |
| `title`      | VARCHAR(255) | Prompt title (required)           |
| `content`    | TEXT         | Full prompt content (required)    |
| `target_ai`  | VARCHAR(100) | Target AI (Claude, ChatGPT, etc.) |
| `technique`  | VARCHAR(100) | Prompting technique used          |
| `created_by` | UUID         | FK to auth.users (nullable)       |
| `created_at` | TIMESTAMPTZ  | Auto-set on creation              |

#### `instructions` - Agent Instructions Hub

| Column          | Type                     | Description                               |
| --------------- | ------------------------ | ----------------------------------------- |
| `id`            | UUID                     | Primary key (gen_random_uuid())           |
| `title`         | TEXT                     | Instruction title                         |
| `slug`          | TEXT                     | URL-friendly slug (unique)                |
| `description`   | TEXT                     | Short description                         |
| `content`       | TEXT                     | The actual instruction content            |
| `category`      | instruction_category     | command, agent, skill, hook, rule, prompt |
| `agent_types`   | instruction_agent_type[] | Supported agents (claude, cursor, etc.)   |
| `difficulty`    | instruction_difficulty   | beginner, intermediate, advanced          |
| `file_format`   | instruction_file_format  | markdown, json, yaml, toml, text          |
| `tags`          | TEXT[]                   | Search tags                               |
| `view_count`    | INTEGER                  | Number of views                           |
| `copy_count`    | INTEGER                  | Number of copies                          |
| `submitted_by`  | UUID                     | FK to auth.users                          |
| `created_at`    | TIMESTAMPTZ              | Creation timestamp                        |
| `updated_at`    | TIMESTAMPTZ              | Last update timestamp                     |
| `search_vector` | TSVECTOR                 | Full-text search index                    |

#### `instruction_favorites` - User Favorites for Instructions

| Column           | Type        | Description        |
| ---------------- | ----------- | ------------------ |
| `id`             | UUID        | PK                 |
| `user_id`        | UUID        | FK to auth.users   |
| `instruction_id` | UUID        | FK to instructions |
| `created_at`     | TIMESTAMPTZ | Creation timestamp |

### Custom Types (Enums)

```sql
TYPE instruction_category = ('command', 'agent', 'skill', 'hook', 'rule', 'prompt');
TYPE instruction_agent_type = ('copilot', 'claude', 'claude-code', 'chatgpt', 'gemini', 'cursor', 'windsurf', 'other');
TYPE instruction_difficulty = ('beginner', 'intermediate', 'advanced');
TYPE instruction_file_format = ('markdown', 'json', 'yaml', 'toml', 'text');
```

### Database Functions

- `search_instructions(search_query TEXT)`: Returns instructions matching the full-text search query.
- `increment_instruction_view(instruction_id UUID)`: Atomically increments view count.
- `increment_instruction_copy(instruction_id UUID)`: Atomically increments copy count.

#### `profiles` - User Profiles

| Column       | Type        | Description                |
| ------------ | ----------- | -------------------------- |
| `id`         | UUID        | PK (references auth.users) |
| `email`      | TEXT        | User email                 |
| `full_name`  | TEXT        | User's display name        |
| `avatar_url` | TEXT        | Profile picture URL        |
| `updated_at` | TIMESTAMPTZ | Last update timestamp      |

#### `favorites` - User Favorites

| Column       | Type        | Description                      |
| ------------ | ----------- | -------------------------------- |
| `id`         | UUID        | PK                               |
| `user_id`    | UUID        | FK to profiles.id                |
| `item_id`    | UUID        | FK to tools/prompts/instructions |
| `item_type`  | TEXT        | 'tool', 'prompt', 'instruction'  |
| `created_at` | TIMESTAMPTZ | Creation timestamp               |

### Storage Buckets

- `tool-logos`: Public bucket for uploading tool images.
- `avatars` (Optional): Public bucket for user avatars.

### Row Level Security (RLS)

Both tables have RLS enabled with the following policies:

```sql
-- Anyone can read tools and prompts (public directory)
CREATE POLICY "Allow public read" ON tools FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON prompts FOR SELECT USING (true);

-- Anyone can submit new tools and prompts (MVP - open submissions)
CREATE POLICY "Allow public insert" ON tools FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON prompts FOR INSERT WITH CHECK (true);
```

> 🔒 **Production Note:** Tighten insert policies to require authentication for production use.

---

## Supabase CLI Usage

### Initial Setup

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Initialize Supabase in project
npx supabase init

# Login to Supabase (opens browser for auth)
npx supabase login

# Link to existing project
npx supabase link --project-ref qlsgscizfvqbdajzqtgb
```

### Database Migrations

Migrations are stored in `supabase/migrations/` directory.

```bash
# Push all migrations to remote database
npx supabase db push --include-all

# Create a new migration
npx supabase migration new migration_name

# Pull remote schema to local
npx supabase db pull

# Reset local database (if using local Supabase)
npx supabase db reset
```

### Current Migration File

Location: `supabase/migrations/20260113000000_init.sql`

This migration:

1. Creates the `vibe_level` enum
2. Creates the `tools` table
3. Creates the `prompts` table
4. Enables RLS on both tables
5. Creates public read/insert policies
6. Seeds initial data (5 tools, 3 prompts)

---

## Next.js Integration

### Client Architecture

The project uses the `@supabase/ssr` package for server-side rendering compatibility.

#### Server Client (`src/lib/supabase/server.ts`)

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

#### Browser Client (`src/lib/supabase/client.ts`)

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### Query Functions (`src/lib/supabase/queries.ts`)

```typescript
// Fetch all tools
export async function getTools(): Promise<Tool[]>;

// Fetch all prompts
export async function getPrompts(): Promise<Prompt[]>;

// Fetch tools filtered by vibe level
export async function getToolsByVibeLevel(level: VibeLevel): Promise<Tool[]>;
```

### Usage in Server Components

```typescript
// src/app/page.tsx
import { getTools, getPrompts } from "@/lib/supabase/queries";

export default async function HomePage() {
  const [tools, prompts] = await Promise.all([getTools(), getPrompts()]);

  return <HomePageContent tools={tools} prompts={prompts} />;
}
```

### Usage in Server Actions

```typescript
// src/app/actions/submissions.ts
"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitTool(data: ToolSubmission) {
  const supabase = await createClient();

  const { error } = await supabase.from("tools").insert({
    name: data.name,
    description: data.description,
    url: data.url,
    vibe_level: data.vibeLevel,
    pricing: data.pricing,
  });

  if (error) throw new Error(error.message);
  return { success: true };
}
```

---

## TypeScript Types

### Database Types (`src/lib/supabase/types.ts`)

```typescript
export type VibeLevel =
  | "no-code"
  | "low-code"
  | "agentic"
  | "pro-orchestration";

export interface Tool {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  vibe_level: VibeLevel;
  pricing: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  target_ai: string | null;
  technique: string | null;
  created_by: string | null;
  created_at: string;
}
```

---

## Seed Data

### Tools (5 entries)

| Name         | Vibe Level        | Pricing  |
| ------------ | ----------------- | -------- |
| Cursor       | agentic           | Freemium |
| Bolt.new     | no-code           | Free     |
| v0.dev       | low-code          | Freemium |
| Claude       | pro-orchestration | Freemium |
| Replit Agent | agentic           | Freemium |

### Prompts (3 entries)

| Title                          | Target AI | Technique        |
| ------------------------------ | --------- | ---------------- |
| Chain of Thought Reasoning     | Claude    | chain-of-thought |
| Senior Architect System Prompt | Any       | system-prompt    |
| ReAct Framework Implementation | Claude    | react            |

---

## Troubleshooting

### Common Issues

#### "uuid_generate_v4() does not exist"

Supabase uses PostgreSQL 14+ which has `gen_random_uuid()` built-in. Replace:

```sql
-- ❌ Old (requires pgcrypto extension)
id UUID PRIMARY KEY DEFAULT uuid_generate_v4()

-- ✅ New (built-in)
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

#### "relation does not exist"

Run migrations to create tables:

```bash
npx supabase db push --include-all
```

#### "Invalid API key"

1. Check `.env.local` has correct keys
2. Restart dev server after changing env vars
3. Verify keys in Supabase dashboard → Settings → API

#### RLS blocking queries

If queries return empty arrays unexpectedly:

1. Check RLS policies in Supabase dashboard → Table Editor → Policies
2. For development, you can temporarily disable RLS (not recommended for production)

---

## API Access (REST)

Supabase provides auto-generated REST APIs. Example curl commands:

```bash
# Get all tools
curl "https://qlsgscizfvqbdajzqtgb.supabase.co/rest/v1/tools?select=*" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Get tools by vibe level
curl "https://qlsgscizfvqbdajzqtgb.supabase.co/rest/v1/tools?vibe_level=eq.agentic" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Insert a new prompt
curl -X POST "https://qlsgscizfvqbdajzqtgb.supabase.co/rest/v1/prompts" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"title": "My Prompt", "content": "Prompt content here"}'
```

---

## Database Backups

The `supabase/backups` directory contains database backups for the Supabase project.

### Automated Backup Script

We have created a PowerShell script to automate the backup process for the remote project "vibe code".

**Location**: `scripts/backup-db.ps1`

**Usage**:

```powershell
./scripts/backup-db.ps1
```

### Backup Troubleshooting

- **Local Backup**: Requires Docker to be running. If `npx supabase status` fails, local backups with `--local` will not work.
- **Remote Backup**: Requires authentication. Run `npx supabase login` if the script fails to link the project.

### Manual Commands

To manually backup the remote production database ("vibe code"):

```bash
# Link Project (ID: qlsgscizfvqbdajzqtgb)
npx supabase link --project-ref qlsgscizfvqbdajzqtgb

# Dump Data
npx supabase db dump -f supabase/backups/my_backup.sql
```

## Future Enhancements

- [ ] Add authentication for user-specific data
- [ ] Implement update/delete policies for tool owners
- [ ] Add categories/tags table for better filtering
- [ ] Set up database functions for analytics
- [ ] Configure storage bucket for tool images
- [ ] Add real-time subscriptions for live updates
