# Project: Vibe Architect Central - Implementation Tasks

> **Last Updated:** January 14, 2026  
> **Status:** ✅ Phase 5 Complete - Deployed to Vercel

---

## Phase 4.1: Foundation & High-Speed Setup ✅ COMPLETE
- [x] Initialize project: `npx create-next-app@latest . --ts --tailwind --app --src-dir` (Next.js 16.1.1 ✓)
- [x] Install Supabase: `npm install @supabase/ssr @supabase/supabase-js` (v2.90 ✓)
- [x] Configure Tailwind 4.1: Implemented "Cyber-Industrial" `@theme` in globals.css
- [x] Initialize shadcn/ui 3.6: Components initialized with custom theming

## Phase 4.2: Slice 1 - Core Directory Infrastructure ✅ COMPLETE
- [x] Setup Supabase Client: Created `src/lib/supabase/server.ts` and `client.ts` using @supabase/ssr pattern
- [x] Database Sync: Created `supabase/migrations/20260113000000_init.sql` and pushed via CLI
- [x] Build `ToolCard.tsx`: High-fidelity card with vibe level badges, pricing, external links
- [x] Layout Shell: `DirectoryLayout.tsx` with responsive grid and `vibe-glass` utility

## Phase 4.3: Slice 2 - The Prompt Vault & Interactivity ✅ COMPLETE
- [x] Build `PromptCard.tsx`: Monospace code block with syntax styling
- [x] Implement "Copy to Clipboard": `useVibeClipboard` hook with Sonner toast notifications
- [x] Deep Link Engine: `aiLinks.ts` utility generating Claude/ChatGPT/Gemini deep links
- [x] Directory Filter: `VibeLevelFilter.tsx` for filtering tools by skill level

## Phase 4.4: Slice 3 - Contribution & Security ✅ COMPLETE
- [x] Submission Form: `/submit` page with `ToolSubmissionForm` and `PromptSubmissionForm`
- [x] Server Action: `submissions.ts` with Zod 4 validation and Supabase insert
- [x] Success State: Toast notifications on successful submission
- [x] Validation: Zod 4 schemas in `src/lib/validations/`

## Phase 4.5: Slice 4 - Orchestration Wizard (The "Vibe" Feature) ✅ COMPLETE
- [x] Wizard UI: `PromptWizard.tsx` - 4-step wizard (Persona → Context → Task → Preview)
- [x] CMD+K Search: `CommandSearch.tsx` using cmdk with keyboard shortcuts
- [x] Final Polish: Neon button styling with `vibe-neon-*` utility classes

## Phase 4.6: Database & Deployment ✅ COMPLETE
- [x] Environment Setup: `.env.local` configured with Supabase credentials
- [x] Supabase CLI: Initialized, logged in, linked to project `qlsgscizfvqbdajzqtgb`
- [x] Migration Pushed: Schema with `tools` and `prompts` tables + RLS policies
- [x] Seed Data: 5 tools (Cursor, Bolt.new, v0.dev, Claude, Replit Agent) + 3 prompts
- [x] Live Connection: Server Components fetching real data from Supabase
- [x] Documentation: Created `SUPABASE.md` with complete database documentation

---

## 🚀 Phase 5: Enhancement & Production ✅ COMPLETE

### Phase 5.1: Authentication & User Features ✅ COMPLETE
- [x] Implement Supabase Auth (Email/OAuth providers)
  - Created `src/middleware.ts` for route protection
  - Created `src/app/auth/callback/route.ts` for OAuth callbacks
  - Created `src/app/auth/error/page.tsx` for auth errors
  - Created `src/lib/supabase/auth.ts` with server actions
- [x] Add user profile page showing submitted tools/prompts
  - Created `/profile` with stats, submitted content, favorites
  - Created `/profile/edit` with profile editing form
- [x] Created profiles migration with auto-profile trigger
- [x] Add "Favorites" feature for logged-in users
  - Created `FavoriteButton.tsx` component
  - Created `src/app/actions/favorites.ts` server actions
  - Integrated into ToolCard and PromptCard

### Phase 5.2: Search & Discovery ✅ COMPLETE
- [x] Implement full-text search using Supabase `textsearch`
  - Created tsvector columns and GIN indexes
  - Created `search_tools()` and `search_prompts()` functions
- [x] Add categories/tags system in migration
- [x] Create dedicated `/tools` and `/prompts` pages with pagination
  - Created `SearchInput.tsx` with debounce
  - Created `Pagination.tsx` component
  - Filter by technique/target_ai
- [x] Updated Header with navigation links

### Phase 5.3: Content Management ✅ COMPLETE
- [x] Edit/Delete functionality for submitted content
  - Created `src/app/actions/content.ts` (updateTool, deleteTool, updatePrompt, deletePrompt)
  - Created `/tools/[id]/edit` page with form
  - Created `/prompts/[id]/edit` page with form
  - Added AlertDialog for delete confirmations
- [x] Image upload for tool logos via Supabase Storage
  - Created storage bucket migration
  - Implemented `uploadImage()` server action
- [x] Added edit buttons to profile page

### Phase 5.4: Performance & SEO ✅ COMPLETE
- [x] Add OpenGraph meta tags for social sharing
  - Enhanced `layout.tsx` with full Metadata config
  - Added Twitter cards, viewport, keywords
- [x] Implement sitemap.xml generation
  - Created `src/app/sitemap.ts` with dynamic routes
- [x] Implement robots.txt
  - Created `src/app/robots.ts`
- [x] Add loading skeletons for better UX
  - Created loading.tsx for root, tools, prompts, profile
- [x] Created `public/manifest.json` for PWA support

### Phase 5.5: Deployment ✅ COMPLETE
- [x] Created `vercel.json` with headers and caching
- [x] Created `.env.example` template
- [x] Security headers configured
- [x] Fixed vercel.json (removed secret references for env vars)
- [x] Build verification passed ✓
- [x] Deployed to Vercel via `npx vercel`

---

## 🔗 Phase 5.6: GitHub Repository Setup ✅ COMPLETE

### Connect to GitHub
Repository: `https://github.com/nicanac/vibe-architect-central.git`

- [x] Initialize git repository locally
- [x] Connect to remote repository
- [x] Push to main branch
- [ ] Link Vercel to GitHub for automatic deployments (optional)

---

## �📋 Post-Deployment Configuration

### Vercel Dashboard Setup
Add environment variables in Vercel Project Settings:
- `NEXT_PUBLIC_SUPABASE_URL` = `https://qlsgscizfvqbdajzqtgb.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your anon key)

### Database Migrations Pushed
Via `npx supabase db push --include-all`:
1. ✅ `20260114000000_auth_profiles.sql` - Profiles & favorites tables
2. ✅ `20260114000001_search_categories.sql` - Full-text search & categories
3. ⚠️ `20260114000002_storage_bucket.sql` - Needs manual setup in Supabase Dashboard

### Storage Bucket Setup (Manual)
Create in Supabase Dashboard → Storage:
- Bucket name: `tool-logos`
- Set as public bucket
- Add RLS policies for authenticated uploads

### Vercel Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Supabase Dashboard Configuration
1. Enable Email auth provider
2. Add OAuth providers (GitHub, Google) with redirect URLs:
   - `https://your-domain.vercel.app/auth/callback`
3. Configure storage bucket public access

---

## 📊 Final Stats

| Metric | Count |
|--------|-------|
| Tools in DB | 6 |
| Prompts in DB | 4 |
| React Components | 20+ |
| Server Actions | 6+ |
| Database Migrations | 4 |
| Pages Created | 15+ |

## 🗂️ New Files Created in Phase 5

### Authentication
- `src/middleware.ts`
- `src/app/auth/callback/route.ts`
- `src/app/auth/error/page.tsx`
- `src/lib/supabase/auth.ts`
- `src/app/login/page.tsx`
- `src/app/signup/page.tsx`
- `src/app/profile/page.tsx`
- `src/app/profile/edit/page.tsx`
- `src/app/profile/edit/ProfileEditForm.tsx`

### Favorites
- `src/app/actions/favorites.ts`
- `src/components/vibe/FavoriteButton.tsx`

### Search & Discovery
- `src/components/ui/pagination.tsx`
- `src/components/ui/search-input.tsx`
- `src/app/tools/page.tsx`
- `src/app/prompts/page.tsx`

### Content Management
- `src/app/actions/content.ts`
- `src/app/tools/[id]/edit/page.tsx`
- `src/app/tools/[id]/edit/EditToolForm.tsx`
- `src/app/prompts/[id]/edit/page.tsx`
- `src/app/prompts/[id]/edit/EditPromptForm.tsx`
- `src/components/ui/alert-dialog.tsx`

### SEO & Performance
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/app/loading.tsx`
- `src/app/tools/loading.tsx`
- `src/app/prompts/loading.tsx`
- `src/app/profile/loading.tsx`
- `public/manifest.json`

### Deployment
- `vercel.json`
- `.env.example`

### Migrations
- `supabase/migrations/20260114000000_auth_profiles.sql`
- `supabase/migrations/20260114000001_search_categories.sql`
- `supabase/migrations/20260114000002_storage_bucket.sql`

---

## 🚀 Phase 6: Future Enhancements (NEXT)

### Phase 6.0: Agent Instructions Hub ⭐ PRIORITY
> New section: "Instructions" - A comprehensive directory for AI agent configurations, commands, skills, and workflows.
> **Inspired by:** [CodeLynx Docs](https://codelynx.dev/docs/) structure

#### Content Categories (like CodeLynx)

| Category | Description | Example |
|----------|-------------|---------|
| **Commands** | Slash commands for quick tasks | `/commit`, `/create-pr`, `/review` |
| **Agents** | Specialized AI personas for specific domains | `explore-codebase`, `code-reviewer`, `security-auditor` |
| **Skills** | Complex multi-step workflows (SKILL.md) | APEX methodology, debugging workflow |
| **Hooks** | Event-driven automation triggers | `pre-commit`, `post-edit`, `on-file-save` |
| **Rules** | Project-wide instructions (.cursorrules, CLAUDE.md) | Architecture patterns, coding standards |
| **Prompts** | System prompts & persona definitions | Expert personas, role definitions |

#### Database Schema
- [ ] Create `instructions` table in Supabase
  ```sql
  - id, title, slug, description, content (markdown/code)
  - category: enum (command, agent, skill, hook, rule, prompt)
  - agent_type: enum (copilot, claude, claude-code, chatgpt, gemini, cursor, windsurf, other)
  - difficulty: enum (beginner, intermediate, advanced)
  - tags: text[] (array of tags for filtering)
  - usage_example: text (how to use it)
  - file_format: enum (markdown, json, yaml, toml)
  - submitted_by, created_at, updated_at, view_count
  ```
- [ ] Create migration file with RLS policies
- [ ] Add full-text search with tsvector
- [ ] Add GIN index for tags array

#### Documentation-Style UI (like CodeLynx)
- [ ] Create `/instructions` landing page
  - Hero section with search bar
  - Category cards (Commands, Agents, Skills, Hooks, Rules, Prompts)
  - "Getting Started" section
  - Featured/Popular instructions
- [ ] Create `/instructions/[category]` pages
  - Sidebar navigation with all items in category
  - Grid or list view toggle
  - Filter by agent type, difficulty, tags
- [ ] Create `/instructions/[category]/[slug]` detail pages
  - Full documentation view with syntax highlighting
  - Code blocks with copy button
  - Usage examples section
  - Related instructions sidebar
  - "Try it" deep links (for supported agents)
  - Download as file button

#### UI Components
- [ ] Create `InstructionCard.tsx`
  - Category icon/badge (Command 🔧, Agent 🤖, Skill ⚡, Hook 🪝, Rule 📏, Prompt 💬)
  - Agent type badge (Copilot, Claude, Cursor, etc.)
  - Difficulty indicator
  - Tags display
  - Copy/Download actions
- [ ] Create `InstructionSidebar.tsx` - Category navigation
- [ ] Create `CodeBlock.tsx` - Syntax highlighted code with copy
- [ ] Create `UsageExample.tsx` - Interactive usage examples
- [ ] Create `InstructionSearch.tsx` - Search with filters

#### Filtering & Discovery
- [ ] Filter by category (Commands, Agents, Skills, Hooks, Rules, Prompts)
- [ ] Filter by agent/tool (Copilot, Claude, Claude Code, Cursor, Windsurf, ChatGPT, Gemini)
- [ ] Filter by difficulty (Beginner, Intermediate, Advanced)
- [ ] Filter by tags (git, testing, security, performance, etc.)
- [ ] Full-text search across title, description, content
- [ ] Sort by: newest, popular, alphabetical

#### Submission & Management
- [ ] Create `/submit/instruction` form
  - Category selector with descriptions
  - Agent type multi-select
  - Monaco code editor for content
  - Live preview panel
  - Tags input with suggestions
  - Usage example editor
- [ ] File upload support (.md, .json, .yaml, .toml)
- [ ] Edit/delete functionality for own submissions
- [ ] Draft/publish workflow

#### Navigation Integration
- [ ] Add "Instructions" to Header (Tools | Prompts | **Instructions**)
- [ ] Update home page with 3-tab layout
- [ ] Add instruction count badge
- [ ] CMD+K search integration

#### Seed Data
- [ ] Import `.github/skills/code-review/` → Skills category
- [ ] Import `.github/skills/commit-message/` → Skills category
- [ ] Create sample commands (commit, review, debug)
- [ ] Create sample agents (codebase-explorer, security-auditor)
- [ ] Create sample hooks (pre-commit, post-edit)
- [ ] Create sample rules (Next.js patterns, TypeScript strict)

#### Data Migration from CodeLynx
> Migrate all existing content from https://codelynx.dev/docs/ to the new database

- [ ] Create migration script `scripts/migrate-codelynx.ts`
- [ ] Scrape/fetch all documentation pages:
  - [ ] Claude Code Setup guide
  - [ ] All Claude Code PRO commands (`/apex`, `/brainstorm`, `/debug`, `/clean-code`, etc.)
  - [ ] All agents documentation
  - [ ] All skills documentation
  - [ ] All hooks documentation
- [ ] Parse and transform content:
  - [ ] Extract title, description, content (markdown)
  - [ ] Identify category (command, agent, skill, hook, rule, prompt)
  - [ ] Extract usage examples and code blocks
  - [ ] Parse flags/options tables
  - [ ] Extract related links
- [ ] Map to new database schema:
  - [ ] Set agent_type = 'claude-code' for Claude Code content
  - [ ] Set appropriate difficulty levels
  - [ ] Generate slugs from titles
  - [ ] Create tags from content analysis
- [ ] Insert into Supabase `instructions` table
- [ ] Verify data integrity and completeness
- [ ] Update view counts and metadata

#### Content to Migrate from CodeLynx

| Category | Items | Source URL Pattern |
|----------|-------|-------------------|
| Setup Guide | 1 | `/docs/claude-code-setup` |
| Commands | 15+ | `/docs/claude-code-pro/*` |
| - /apex | APEX methodology | `/docs/claude-code-pro/apex-skills` |
| - /brainstorm | Deep research | `/docs/claude-code-pro/brainstorm` |
| - /debug | Error debugging | `/docs/claude-code-pro/debug` |
| - /clean-code | Best practices | `/docs/claude-code-pro/clean-code` |
| - /review-code | Code review | `/docs/claude-code-pro/review-code` |
| - /ci-experts | CI/CD debugging | `/docs/claude-code-pro/ci-experts` |
| - /claude-memory | Memory files | `/docs/claude-code-pro/claude-memory` |
| - /create-prompt | Prompt engineering | `/docs/claude-code-pro/create-prompt` |
| - /create-meta-prompts | Meta prompts | `/docs/claude-code-pro/create-meta-prompts` |
| - /create-slash-commands | Custom commands | `/docs/claude-code-pro/create-slash-commands` |
| - /create-skills-workflow | Workflow skills | `/docs/claude-code-pro/create-skills-workflow` |
| - /create-agent-skills | SKILL.md files | `/docs/claude-code-pro/create-agent-skills` |
| - /create-hooks | Automation hooks | `/docs/claude-code-pro/create-hooks` |
| - /create-subagents | Subagents | `/docs/claude-code-pro/create-subagents` |
| Agents | 4+ | Base agents (action, explore-codebase, explore-docs, websearch) |
| Configuration | 1 | `/docs/claude-code-configuration` |
| Security | 1 | `/docs/claude-code-security` |

#### Advanced Features (Phase 6.0.1)
- [ ] "Collections" - Curated sets of instructions (e.g., "Full Claude Code Setup")
- [ ] Version history for instructions
- [ ] Fork/remix functionality
- [ ] Installation CLI command generator
- [ ] GitHub Gist export
- [ ] One-click install to `~/.claude/` or `.cursor/`

### Phase 6.1: Advanced Features
- [ ] Implement voting/rating system for tools and prompts
- [ ] Add comments/reviews on tools
- [ ] Create tool comparison feature
- [ ] Add "tool stacks" - curated collections

### Phase 6.2: Analytics & Insights
- [ ] Track tool/prompt/instruction views
- [ ] User activity dashboard
- [ ] Popular items leaderboard
- [ ] Usage analytics with Vercel Analytics

### Phase 6.3: Community Features
- [ ] User profiles with public pages
- [ ] Follow other vibe architects
- [ ] Activity feed
- [ ] Notifications system

### Phase 6.4: API & Integrations
- [ ] Public API for tool data
- [ ] Webhooks for new submissions
- [ ] Integration with IDE extensions
- [ ] RSS feed for new tools/prompts/instructions
