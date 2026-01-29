---
description: Generate ultra-detailed project_genome.json and project_genome.md files from codebase analysis
---

# /project-genome Workflow

Ultra-detailed codebase analysis that generates machine-readable JSON and human-readable Markdown genome files.

## Role
You are a **Lead System Architect and UI/UX Engineer**.

## Output
- `memory-bank/project_genome.json` - Machine-readable source of truth
- `memory-bank/project_genome.md` - Human-readable summary with templates

---

## Process

// turbo-all

### Phase 1: Discovery

1. **Scan project structure**
```bash
ls -la && find src -type f -name "*.tsx" -o -name "*.ts" | head -50
```

2. **Read package.json** - Extract all dependencies with versions
```bash
cat package.json
```

3. **Read config files** - Gather build and styling configuration
```bash
cat tsconfig.json 2>/dev/null; cat next.config.ts 2>/dev/null; cat tailwind.config.ts 2>/dev/null
```

4. **Read globals.css** - Extract CSS variables and theme
```bash
cat src/app/globals.css
```

### Phase 2: Design System Extraction

5. **Extract from globals.css**:
   - All CSS variables (colors, typography, spacing)
   - Categorize: Primary, Secondary, Background, Text, Borders, Alerts
   - Font families and weights
   - Border radius and shadows

6. **Identify UI components**:
   - Scan `src/components/ui/` for shadcn primitives
   - Scan custom component directories
   - Note icon library (lucide-react, etc.)

### Phase 3: Architecture Analysis

7. **Map routing structure**:
   - List all pages in `src/app/`
   - List all API routes in `src/app/api/`
   - Identify layouts and route groups

8. **Analyze data layer**:
   - Database schema from Supabase types or migrations
   - Server actions and data fetching patterns
   - Authentication middleware

### Phase 4: Generate Files

9. **Create project_genome.json** with this structure:
```json
{
  "meta": { "name": "", "version": "", "generatedAt": "", "description": "" },
  "techStack": { "framework": {}, "language": {}, "styling": {}, "database": {}, "ui": {}, "dependencies": [], "devDependencies": [] },
  "designSystem": { "colors": {}, "typography": {}, "spacing": {}, "borderRadius": {} },
  "architecture": { "directories": {}, "pages": [], "apiRoutes": [], "database": {} },
  "assets": { "logos": [], "icons": "", "media": [] }
}
```

10. **Create project_genome.md** with:
    - Executive Summary
    - Tech Stack table
    - Design System (colors, typography)
    - Development Standards
    - **Boilerplate Page Template** (copy-paste ready)
    - Directory Structure

---

## Boilerplate Template to Include

```tsx
// src/app/[feature]/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
};

export default async function FeaturePage() {
  return (
    <div className="space-y-8">
      <section className="border-l-4 border-[var(--terminal-purple)] pl-6 py-4">
        <span className="text-[var(--terminal-purple)] font-mono text-sm uppercase">
          /DIRECTORY/FEATURE/
        </span>
        <h1 className="text-4xl font-bold uppercase font-mono text-[var(--terminal-green)]">
          Feature_Title
        </h1>
        <p className="text-[var(--terminal-text-muted)] font-mono">
          &gt; Feature description
        </p>
      </section>
      <section className="space-y-4">
        {/* Content */}
      </section>
    </div>
  );
}
```

---

## Success Criteria

- [ ] All dependencies indexed with versions
- [ ] Complete color palette extracted with CSS variables
- [ ] Typography system documented
- [ ] All pages and API routes catalogued
- [ ] Boilerplate template included
- [ ] Both files written to `memory-bank/`
