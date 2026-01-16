# Section Templates

Copy and adapt these section templates for your MEMORY.md file.

## Tech Stack Templates

### Minimal

```markdown
## Tech Stack

- Next.js 16 + TypeScript
- PostgreSQL via Prisma
- TailwindCSS
```

### Detailed

```markdown
## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS v4 + shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: [Auth solution]
- **Testing**: Vitest (unit), Playwright (e2e)
- **Package Manager**: pnpm
```

### With Infrastructure

```markdown
## Tech Stack

### Application

- Next.js 16 + TypeScript
- PostgreSQL via Prisma
- Redis for caching/queues

### Infrastructure

- Vercel (hosting)
- Neon (database)
- Upstash (Redis)

### Monitoring

- Sentry (errors)
- Vercel Analytics
```

## Commands Templates

### Minimal

```markdown
## Commands

- `pnpm dev` - Development
- `pnpm test` - Run tests
- `pnpm build` - Production build
```

### Categorized

```markdown
## Commands

### Development

- `pnpm dev` - Start dev server
- `pnpm build` - Production build
- `pnpm start` - Start production

### Quality

- `pnpm lint` - ESLint
- `pnpm ts` - Type check
- `pnpm format` - Prettier

### Testing

- `pnpm test:ci` - Unit tests
- `pnpm test:e2e:ci` - E2E tests

### Database

- `pnpm db:push` - Push schema
- `pnpm db:seed` - Seed data
```

### With Warnings

```markdown
## Commands

### Development

- `pnpm dev` - Start dev server
- `pnpm build` - Production build

### Testing

**CRITICAL - Use CI commands only:**

- `pnpm test:ci` - Unit tests (non-interactive)
- `pnpm test:e2e:ci` - E2E tests (headless)

**NEVER use:**

- ~~`pnpm test`~~ - Interactive mode
- ~~`pnpm test:e2e`~~ - Interactive mode
```

## Directory Structure Templates

### Simple

```markdown
## Directory Structure

src/
├── components/ # UI components
├── lib/ # Utilities
├── hooks/ # React hooks
└── styles/ # CSS
```

### Feature Based

```markdown
## Directory Structure

src/
├── features/
│ ├── auth/ # Authentication
│ ├── dashboard/ # Dashboard views
│ └── settings/ # User settings
├── components/
│ ├── ui/ # shadcn components
│ └── shared/ # Shared components
├── lib/ # Utilities
└── hooks/ # React hooks
```

### Monorepo

```markdown
## Directory Structure

apps/
├── web/ # Next.js frontend
├── api/ # Node.js backend
└── admin/ # Admin dashboard
packages/
├── ui/ # Shared components
├── config/ # Shared config
└── types/ # Shared types
```

## Conventions Templates

### Minimal

```markdown
## Conventions

- TypeScript strict mode
- ESLint + Prettier configured
- Conventional commits
```

### Detailed

```markdown
## Code Conventions

### TypeScript

- Use `type` over `interface`
- No `any` types
- Strict mode enabled

### React

- Prefer Server Components
- Client components only for interactivity
- Components under 300 lines

### Naming

- camelCase for variables/functions
- PascalCase for components/types
- kebab-case for files
```

### With Critical Rules

```markdown
## Code Conventions

### TypeScript

- Strict mode enabled
- No `any` types

### Forms

**CRITICAL**: Use TanStack Form for ALL forms

- Import from `@/features/form/tanstack-form`
- **NEVER** use React Hook Form directly

### Server Actions

- All actions use `safe-actions.ts`
- Suffix files with `.action.ts`
```

## Git Workflow Templates

### Simple

```markdown
## Git Workflow

- Branch: `feature/name` or `fix/name`
- Conventional commits (feat:, fix:, refactor:)
- PRs required for all changes
```

### Detailed

```markdown
## Git Workflow

### Branches

- `main` - Production
- `develop` - Integration
- `feature/*` - New features
- `fix/*` - Bug fixes
- `hotfix/*` - Production fixes

### Commits

Format: `type(scope): description`

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code change
- `docs`: Documentation
- `test`: Tests

### Pull Requests

- Create from feature branch to develop
- Require 1 approval
- Must pass CI checks
- Squash merge preferred
```

## Important Files Templates

### Simple

```markdown
## Key Files

- `src/lib/auth.ts` - Auth config
- `src/lib/db.ts` - Database client
- `prisma/schema.prisma` - DB schema
```

### With Descriptions

```markdown
## Important Files

### Configuration

- `src/lib/auth.ts` - Authentication setup
- `src/lib/db.ts` - Prisma client
- `src/site-config.ts` - Site metadata

### Patterns

- `src/features/form/tanstack-form.tsx` - Form utilities (**use for all forms**)
- `src/lib/actions/safe-actions.ts` - Server action wrapper

### Database

- `prisma/schema.prisma` - Main schema
- `prisma/seed.ts` - Seed data
```

## Testing Templates

### Minimal

```markdown
## Testing

- Run `pnpm test` before committing
- Write tests for new features
```

### Detailed

```markdown
## Testing

### Unit Tests

- Location: `__tests__/`
- Framework: Vitest + Testing Library
- Run: `pnpm test:ci`

### E2E Tests

- Location: `e2e/`
- Framework: Playwright
- Run: `pnpm test:e2e:ci`

### Requirements

- All new features require tests
- Target 80% coverage
- Run tests before pushing
```

## Security Templates

```markdown
## Security

**NEVER commit:**

- `.env` files
- API keys or secrets
- Database credentials
- Private tokens

**Always:**

- Use environment variables
- Store secrets in `.env.local`
- Check `.gitignore` before committing
```

## Combination Tips

### Minimal Project

For small projects, combine into fewer sections:

```markdown
# Project Name

## Stack & Commands

- Next.js + TypeScript
- `pnpm dev` / `pnpm test` / `pnpm build`

## Conventions

- ESLint/Prettier configured
- Run tests before pushing
- Never commit .env files
```

### Large Project

For large projects, use all relevant sections but keep each concise. Link to external docs for details:

```markdown
## Detailed Guides

- Architecture: See [docs/architecture.md](docs/architecture.md)
- API patterns: See [docs/api.md](docs/api.md)
- Testing: See [docs/testing.md](docs/testing.md)
```
