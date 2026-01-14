# Supabase Database Documentation

## Overview

Vibe Architect Central uses **Supabase** as its backend database and authentication provider. This document covers the complete setup, schema, and usage patterns.

---

## Project Configuration

### Supabase Project Details

| Property | Value |
|----------|-------|
| **Project Reference** | `qlsgscizfvqbdajzqtgb` |
| **Region** | Default (check Supabase dashboard) |
| **Database** | PostgreSQL 14+ |
| **URL** | `https://qlsgscizfvqbdajzqtgb.supabase.co` |

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

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `name` | VARCHAR(255) | Tool name (required) |
| `description` | TEXT | Tool description |
| `url` | VARCHAR(500) | Official tool URL |
| `vibe_level` | vibe_level | Skill level category |
| `pricing` | VARCHAR(100) | Pricing model (Free, Freemium, etc.) |
| `image_url` | VARCHAR(500) | Tool logo/image URL |
| `created_at` | TIMESTAMPTZ | Auto-set on creation |

#### `prompts` - Orchestration Prompt Library

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `title` | VARCHAR(255) | Prompt title (required) |
| `content` | TEXT | Full prompt content (required) |
| `target_ai` | VARCHAR(100) | Target AI (Claude, ChatGPT, etc.) |
| `technique` | VARCHAR(100) | Prompting technique used |
| `created_by` | UUID | FK to auth.users (nullable) |
| `created_at` | TIMESTAMPTZ | Auto-set on creation |

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
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

#### Browser Client (`src/lib/supabase/client.ts`)

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Query Functions (`src/lib/supabase/queries.ts`)

```typescript
// Fetch all tools
export async function getTools(): Promise<Tool[]>

// Fetch all prompts  
export async function getPrompts(): Promise<Prompt[]>

// Fetch tools filtered by vibe level
export async function getToolsByVibeLevel(level: VibeLevel): Promise<Tool[]>
```

### Usage in Server Components

```typescript
// src/app/page.tsx
import { getTools, getPrompts } from '@/lib/supabase/queries'

export default async function HomePage() {
  const [tools, prompts] = await Promise.all([
    getTools(),
    getPrompts()
  ])
  
  return <HomePageContent tools={tools} prompts={prompts} />
}
```

### Usage in Server Actions

```typescript
// src/app/actions/submissions.ts
'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitTool(data: ToolSubmission) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('tools')
    .insert({
      name: data.name,
      description: data.description,
      url: data.url,
      vibe_level: data.vibeLevel,
      pricing: data.pricing,
    })
    
  if (error) throw new Error(error.message)
  return { success: true }
}
```

---

## TypeScript Types

### Database Types (`src/lib/supabase/types.ts`)

```typescript
export type VibeLevel = 'no-code' | 'low-code' | 'agentic' | 'pro-orchestration'

export interface Tool {
  id: string
  name: string
  description: string | null
  url: string | null
  vibe_level: VibeLevel
  pricing: string | null
  image_url: string | null
  created_at: string
}

export interface Prompt {
  id: string
  title: string
  content: string
  target_ai: string | null
  technique: string | null
  created_by: string | null
  created_at: string
}
```

---

## Seed Data

### Tools (5 entries)

| Name | Vibe Level | Pricing |
|------|------------|---------|
| Cursor | agentic | Freemium |
| Bolt.new | no-code | Free |
| v0.dev | low-code | Freemium |
| Claude | pro-orchestration | Freemium |
| Replit Agent | agentic | Freemium |

### Prompts (3 entries)

| Title | Target AI | Technique |
|-------|-----------|-----------|
| Chain of Thought Reasoning | Claude | chain-of-thought |
| Senior Architect System Prompt | Any | system-prompt |
| ReAct Framework Implementation | Claude | react |

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

## Future Enhancements

- [ ] Add authentication for user-specific data
- [ ] Implement update/delete policies for tool owners
- [ ] Add categories/tags table for better filtering
- [ ] Set up database functions for analytics
- [ ] Configure storage bucket for tool images
- [ ] Add real-time subscriptions for live updates
