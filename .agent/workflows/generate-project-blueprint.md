---
description: Interactive project blueprint generator with discovery, design inspiration, and tech research phases
---

## Objective

Guide the user through a structured discovery process, gather design inspiration, research the best tech stack using brainstorm and Context7, then generate a customized AI-ready project blueprint.

## Process

### Phase 1: Discovery Questions

Before generating any technical blueprint, ask the user at least 5 discovery questions. Present them clearly and wait for answers.

**Required Questions:**

1.  **Project Purpose**: What is the core goal of this project?
    - Options: SaaS product, Internal tool, Marketing/Landing page, E-commerce, Portfolio, API/Backend service, Mobile app, Other
2.  **Target Users**: Who are the primary users?
    - Options: Developers, Consumers/General public, Internal team, B2B clients, Other
3.  **Key Features**: What are the 3 most important features or pages?
    - Free-form answer.
4.  **Data Requirements**: What kind of data persistence is needed?
    - Options: Relational DB (PostgreSQL), NoSQL (MongoDB), File-based, No database, Unsure
5.  **AI Agent Usage**: Will AI coding assistants (Antigravity, Cursor, etc.) be used?
    - Options: Yes (heavily), Yes (occasionally), No, Unsure

**Optional but Recommended:**
- **Aesthetic/Vibe**: What visual style are you going for? (e.g., Minimalist, Brutalist, Corporate, Playful, Cyber-Industrial)
- **Deployment**: Where will this be deployed? (e.g., Vercel, AWS, Self-hosted)

Wait for the user to answer before proceeding.

---

### Phase 2: Design Inspiration

After gathering answers, create a `design-inspiration/` folder.

```bash
mkdir -p design-inspiration
```

**Prompt the user:**

> 🎨 **Design Inspiration Needed**
>
> Please add any design references, screenshots, mockups, or UI inspiration images to the `design-inspiration/` folder.
>
> This will help inform the visual direction and may influence the tech stack choice (e.g., animation-heavy designs may favor certain frameworks).
>
> **Let me know when you're ready to continue.**

Wait for the user to confirm they have added files (or confirm they want to skip).

If design references are provided:
- Analyze the images for common patterns (color schemes, layout styles, component types): create a json containing ann the relevant info for the design
- Note if the designs suggest specific needs (e.g., complex animations → might need Framer Motion, heavy data tables → might need TanStack Table).

---

### Phase 3: Tech Stack Research (Brainstorm + Context7)

Based on the discovery answers and design inspiration analysis, launch a `/brainstorm` session.

**Synthesize a research question:**

```
/brainstorm What is the best tech stack for a [Project Purpose] targeting [Target Users] with [Data Requirements]? Consider the design style: [Aesthetic from Phase 1/2].
```

The brainstorm workflow will:
1. Explore multiple technology options.
2. Challenge assumptions.
3. Provide multi-perspective analysis.
4. Recommend a stack with confidence levels.

**Context7 Validation:**

For each major technology recommended:
1. Use `mcp_context7_resolve-library-id` to find the library.
2. Use `mcp_context7_query-docs` to fetch current best practices.
3. Document key patterns and setup requirements.

---

### Phase 4: Blueprint Generation

Generate the `blueprint/` folder structure based on the researched and validated tech stack.

```
blueprint/
├── .agent/
│   ├── rules/           # Coding rules tailored to chosen stack
│   ├── workflows/       # Reusable workflows
│   └── AI_USAGE_GUIDE.md
├── memory-bank/
│   ├── PRD.md          # Filled with discovery answers
│   ├── TSD.md          # Filled with brainstorm research
│   └── TASKS.md        # Initial task breakdown
├── design-inspiration/  # Copied from Phase 2
├── app/ or src/         # Framework-specific structure (see below)
├── components/          # UI components
├── lib/                 # Utilities
├── docs/
│   ├── ARCHITECTURE.md
│   ├── SETUP.md
│   └── CONVENTIONS.md
└── scripts/
    └── init-project.sh
```

### 🚨 CRITICAL: Project Structure Validation with Context7

**BEFORE creating the project structure**, you MUST query Context7 for the framework's conventions.

#### Step 1: Identify the Framework/Language
Based on discovery, determine the primary framework or language:
- **Frontend**: Expo Router, Next.js, Remix, Vue, Svelte
- **Backend**: FastAPI, Django, Express, NestJS, Go Fiber, Rust Axum
- **Mobile**: Expo, React Native CLI, Flutter, Swift, Kotlin
- **CLI/Scripts**: Python, Node.js, Go, Rust

#### Step 2: Query Context7 for Project Structure
```
mcp_context7_resolve-library-id({ libraryName: "[framework]", query: "project structure" })
mcp_context7_query-docs({ libraryId: "[resolved-id]", query: "folder structure layout setup" })
```

#### Step 3: Apply Framework-Specific Patterns

**Frontend (File-based Routing)**:
| Framework | Root Layout | Route Groups | Dynamic Routes |
|-----------|-------------|--------------|----------------|
| Expo Router | `app/_layout.tsx` | `app/(group)/` | `app/[id].tsx` |
| Next.js | `app/layout.tsx` | `app/(group)/` | `app/[slug]/page.tsx` |
| Remix | `app/root.tsx` | - | `app/routes/$id.tsx` |

**Backend (Python)**:
```
src/
├── main.py              # Entry point
├── api/
│   └── routes/          # Endpoint modules
├── models/              # Database models
├── services/            # Business logic
└── tests/
```

**Backend (Node.js/Express)**:
```
src/
├── index.ts             # Entry point
├── routes/              # API routes
├── controllers/         # Request handlers
├── services/            # Business logic
└── models/              # Data models
```

**Backend (Go)**:
```
cmd/
├── api/
│   └── main.go          # Entry point
internal/
├── handlers/            # HTTP handlers
├── services/            # Business logic
└── models/              # Data structures
```

**Mobile (Flutter)**:
```
lib/
├── main.dart            # Entry point
├── screens/             # UI screens
├── widgets/             # Reusable widgets
├── services/            # API/DB services
└── models/              # Data models
```

#### Step 4: Verify with Context7
After generating the structure, **double-check** critical files exist:
- Entry point file (main.py, index.ts, main.go, etc.)
- Configuration files (requirements.txt, package.json, go.mod, etc.)
- Root layout/router (for frontend frameworks)

**DO NOT skip this validation step. Missing entry points or misstructured projects will fail.**

## Workflows  rules skills 
Universal Workflows (ALWAYS INCLUDE) - Now explicitly lists 9 workflows:
/brainstorm, /commit-fast-conventional, /create-branch, /debug, /explore, /new-feature, /oneshot, /rebase-master, /review-code

Design/UI Workflows - For frontend projects:
/ux-ui-fix, /vision-ux-ui
**Stack-Specific - Create new ones:**
Mobile: /expo-build
Next.js: /nextjs-deploy
API: /test-endpoints
**ADAPTATION REQUIRED** - Added explicit reminder to:
Update commands for package manager
Update framework-specific commands
Update directory paths


**Content Generation Guidelines:**
- `PRD.md`: Pre-fill with project purpose, target users, and key features from Phase 1.
- `TSD.md`: Document the chosen tech stack with versions from Context7 research.
- `ARCHITECTURE.md`: Summarize the brainstorm conclusions and design decisions.
- Templates: Generate code templates matching the chosen framework (e.g., React vs Vue components).

---

### Phase 5: Finalization

1. Create `blueprint/README.md` with quick start instructions.
2. Create `blueprint/GITHUB_TEMPLATE_SETUP.md` for publishing as a template.
3. Copy `design-inspiration/` contents into `blueprint/design-inspiration/`.

---

## Assessment Checklist

Verify the blueprint contains:

- ✅ Discovery answers documented in PRD.md
- ✅ Design inspiration folder included
- ✅ Tech stack researched via brainstorm
- ✅ Stack validated with Context7 documentation
- ✅ Complete `.agent/` configuration
- ✅ Memory bank templates pre-filled
- ✅ Framework-specific code templates
- ✅ Comprehensive documentation
- ✅ Setup scripts

## Output

A `blueprint/` folder containing a fully customized, AI-ready project scaffold tailored to the user's specific needs and design vision.