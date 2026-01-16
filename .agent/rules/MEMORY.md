---
trigger: always_on
---

## 🔗 Memory Bank

The project uses a structured Memory Bank for documentation.

- **Tasks & Status**: [memory-bank/TASKS.md](memory-bank/TASKS.md)
- **Tech Specs**: [memory-bank/TSD.md](memory-bank/TSD.md)
- **Product Requirements**: [memory-bank/PRD.md](memory-bank/PRD.md)

## 🛠️ Operational Commands

- **Dev Server**: `npm run dev` (Runs on http://localhost:3000)
- **Lint**: `npm run lint`
- **Database Status**: `npx supabase status`
- **Type Check**: `npx tsc --noEmit`

## 🚨 Critical Rules (The "Vibe")

- **Styling**: Tailwind 4.1 CSS-only config. NO manual CSS files. Use `globals.css` variables.
- **Components**: shadcn/ui 3.6 (Lyra/Sharp). Composition over complex props.
- **Data**: Supabase Server Actions for mutations. `use cache` for fetching.
- **Code**: Strict TypeScript 7.0 (tsgo).

## 🤖 Agent Rules

Detailed coding rules are in `.agent/rules/`:

- [Architecture](.agent/rules/architecture.md)
- [Workflows](.agent/workflows/workflows.md)
- [Skills](.agent/skills/skill-name/SKILL.md)
- [Git Conventions](.agent/rules/git.md)
