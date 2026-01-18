
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Database, Instruction } from '@/lib/supabase/types';
import { SupabaseClient } from '@supabase/supabase-js';
import archiver from 'archiver';
import path from 'path';
import fs from 'fs/promises';
import { PassThrough } from 'stream';

// 1. Virtual File System Helper
type VFS = Record<string, string>;

// Stack detection helpers
const stackCategories = {
  frontend: ['React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'SvelteKit', 'Remix', 'Astro', 'Nuxt.js'],
  backend: ['Node.js', 'Express', 'NestJS', 'FastAPI', 'Django', 'Flask', 'Rails', 'Laravel', 'Go', 'Rust'],
  mobile: ['React Native', 'Expo', 'Flutter', 'Swift', 'Kotlin', 'Ionic'],
  database: ['PostgreSQL', 'MongoDB', 'MySQL', 'Supabase', 'Firebase', 'Prisma', 'Drizzle'],
  styling: ['Tailwind', 'TailwindCSS', 'CSS', 'Sass', 'Styled Components', 'Emotion'],
  state: ['Redux', 'Zustand', 'Jotai', 'Recoil', 'MobX', 'TanStack Query'],
  testing: ['Jest', 'Vitest', 'Playwright', 'Cypress', 'Testing Library'],
  deployment: ['Vercel', 'Netlify', 'AWS', 'Docker', 'Kubernetes', 'Cloudflare'],
};

function detectStackCategories(stack: string[]): { primary: string; categories: string[] } {
  const normalizedStack = stack.map(s => s.toLowerCase());
  const detectedCategories: string[] = [];
  let primary = 'web';

  for (const [category, techs] of Object.entries(stackCategories)) {
    if (techs.some(t => normalizedStack.some(s => s.includes(t.toLowerCase())))) {
      detectedCategories.push(category);
    }
  }

  // Determine primary project type
  if (detectedCategories.includes('mobile')) {
    primary = 'mobile';
  } else if (detectedCategories.includes('backend') && !detectedCategories.includes('frontend')) {
    primary = 'api';
  } else if (detectedCategories.includes('frontend')) {
    primary = 'web';
  }

  return { primary, categories: detectedCategories };
}

function generateSetupCommands(stack: string[]): string {
  const commands: string[] = [];
  const normalizedStack = stack.map(s => s.toLowerCase());

  // Package manager detection
  const usesPnpm = normalizedStack.some(s => s.includes('pnpm'));
  const usesYarn = normalizedStack.some(s => s.includes('yarn'));
  const pm = usesPnpm ? 'pnpm' : usesYarn ? 'yarn' : 'npm';
  const usesTailwind = normalizedStack.some(s => s.includes('tailwind'));

  // Framework-specific commands
  if (normalizedStack.some(s => s.includes('next'))) {
    const tailwindFlag = usesTailwind ? ' --tailwind' : ' --no-tailwind';
    commands.push(`npx create-next-app@latest . --typescript${tailwindFlag} --eslint --app --src-dir`);
  } else if (normalizedStack.some(s => s.includes('vite') || s.includes('react'))) {
    commands.push(`${pm} create vite@latest . -- --template react-ts`);
  } else if (normalizedStack.some(s => s.includes('expo'))) {
    commands.push(`npx create-expo-app@latest . --template blank-typescript`);
  }

  // Database setup
  if (normalizedStack.some(s => s.includes('supabase'))) {
    commands.push(`${pm} ${pm === 'npm' ? 'install' : 'add'} @supabase/supabase-js @supabase/ssr`);
    commands.push(`npx supabase init`);
  }
  if (normalizedStack.some(s => s.includes('prisma'))) {
    commands.push(`${pm} ${pm === 'npm' ? 'install' : 'add'} prisma @prisma/client`);
    commands.push(`npx prisma init`);
  }

  // UI Libraries
  if (normalizedStack.some(s => s.includes('shadcn'))) {
    commands.push(`npx shadcn@latest init`);
  }

  // State management
  if (normalizedStack.some(s => s.includes('zustand'))) {
    commands.push(`${pm} ${pm === 'npm' ? 'install' : 'add'} zustand`);
  }

  // Testing
  if (normalizedStack.some(s => s.includes('vitest'))) {
    commands.push(`${pm} ${pm === 'npm' ? 'install' : 'add'} -D vitest @testing-library/react`);
  }

  return commands.length > 0 ? commands.join('\n') : `# Initialize your project\n${pm} init`;
}

function generatePRD(name: string, description: string, stack: string[]): string {
  const { primary, categories } = detectStackCategories(stack);
  const today = new Date().toISOString().split('T')[0];
  
  const projectType = primary === 'mobile' ? 'Mobile Application' : 
                      primary === 'api' ? 'API Service' : 'Web Application';

  return `# Project: ${name}

**Version:** 0.1.0
**Status:** Planning
**Created:** ${today}
**Stack:** ${stack.join(', ')}

<!-- 
  🤖 AI AGENT INSTRUCTIONS:
  This PRD contains dynamic placeholders marked with {{VARIABLE}}.
  Use /blueprint-init workflow or ask the user to customize these sections.
  Validate tech versions using Context7 MCP before finalizing.
-->

## 1. Executive Summary

${description || `{{EXECUTIVE_SUMMARY}} <!-- Ask user: What problem does this project solve? Who is it for? -->`}

## 2. Project Type

**Category:** ${projectType}
${categories.length > 0 ? `**Tech Categories:** ${categories.join(', ')}` : ''}

## 3. Core Features

### MVP Features (Phase 1)
<!-- 🤖 Customize based on user's stated requirements -->
- [ ] {{MVP_FEATURE_1}} <!-- Ask: What is the #1 must-have feature? -->
- [ ] {{MVP_FEATURE_2}}
- [ ] {{MVP_FEATURE_3}}
- [ ] User authentication and authorization
- [ ] Error handling and validation

### Future Features (Phase 2+)
<!-- 🤖 Derive from user's long-term vision -->
- [ ] {{FUTURE_FEATURE_1}}
- [ ] {{FUTURE_FEATURE_2}}
- [ ] Analytics and monitoring
- [ ] Performance optimizations

## 4. User Stories

### As a {{PRIMARY_USER_TYPE}}:
<!-- 🤖 Ask: Who is the primary user? What do they want to achieve? -->
- I want to {{USER_GOAL_1}}
- I want to {{USER_GOAL_2}}
- I want my data to be secure and private

### As a Developer:
- I want clear documentation and code structure
- I want automated testing and CI/CD
- I want scalable architecture patterns

## 5. Technical Requirements

### Performance
- Page load time < 3 seconds
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1

### Security
- Input validation and sanitization
- Secure authentication flow
- HTTPS enforcement
- {{ADDITIONAL_SECURITY}} <!-- Ask about compliance: GDPR, HIPAA, SOC2? -->

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility

## 6. Success Metrics

<!-- 🤖 Ask: How will you measure success? -->
- {{SUCCESS_METRIC_1}}
- {{SUCCESS_METRIC_2}}
- Error rates < 1%
- Test coverage > 80%

## 7. Timeline

<!-- 🤖 Adjust based on project complexity and team size -->
- **Week 1-2:** Project setup and infrastructure
- **Week 3-4:** Core feature development
- **Week 5-6:** Testing and refinement
- **Week 7-8:** Launch preparation

## 8. Project Management

<!-- 🤖 Ask: What tools will you use for project management? -->
**Task Management:** {{PM_TOOL}} <!-- Linear, GitHub Projects, Jira, Notion -->
**Documentation:** {{DOCS_TOOL}} <!-- Notion, Confluence, GitHub Wiki -->
**Communication:** {{COMM_TOOL}} <!-- Slack, Discord, Teams -->

---

*This PRD was auto-generated by Vibe Architect. Use /blueprint-init workflow to customize all {{PLACEHOLDERS}}.*
`;
}

function generateTSD(name: string, stack: string[]): string {
  const { primary, categories } = detectStackCategories(stack);
  const today = new Date().toISOString().split('T')[0];
  const setupCommands = generateSetupCommands(stack);
  
  // Detect specific technologies for folder structure
  const usesNextJs = stack.some(s => s.toLowerCase().includes('next'));
  const usesReact = stack.some(s => s.toLowerCase().includes('react'));
  const usesTailwind = stack.some(s => s.toLowerCase().includes('tailwind'));
  const usesSupabase = stack.some(s => s.toLowerCase().includes('supabase'));
  const usesPrisma = stack.some(s => s.toLowerCase().includes('prisma'));

  let folderStructure = '';
  if (usesNextJs) {
    folderStructure = `
\`\`\`
/
├── .agent/                # AI Agent configuration
│   ├── rules/             # Coding rules and conventions
│   └── workflows/         # Agent workflows
├── memory-bank/           # Project documentation
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── (auth)/        # Auth route group
│   │   ├── api/           # API routes
│   │   └── layout.tsx     # Root layout
│   ├── components/
│   │   ├── ui/            # shadcn/ui components
│   │   └── [feature]/     # Feature-specific components
│   ├── lib/
│   │   ├── utils.ts       # Utility functions
│   │   ${usesSupabase ? '├── supabase/        # Supabase client\n│   │   ' : ''}${usesPrisma ? '└── prisma/          # Prisma client' : '└── ...'}
│   └── hooks/             # Custom React hooks
├── public/                # Static assets
├── tests/                 # Test files
└── package.json
\`\`\``;
  } else if (usesReact) {
    folderStructure = `
\`\`\`
/
├── .agent/                # AI Agent configuration
├── memory-bank/           # Project documentation
├── src/
│   ├── components/        # React components
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities and helpers
│   ├── pages/             # Page components
│   └── App.tsx            # Root component
├── public/                # Static assets
└── package.json
\`\`\``;
  } else {
    folderStructure = `
\`\`\`
/
├── .agent/                # AI Agent configuration
├── memory-bank/           # Project documentation
├── src/                   # Source code
├── tests/                 # Test files
└── package.json
\`\`\``;
  }

  return `# ${name} - Technical Specification Document

**Version:** 0.1.0
**Last Updated:** ${today}
**Project Type:** ${primary === 'mobile' ? 'Mobile Application' : primary === 'api' ? 'API Service' : 'Web Application'}

<!-- 
  🤖 AI AGENT INSTRUCTIONS:
  Use Context7 MCP to validate all version numbers before setup.
  Run: mcp__context7__resolve-library-id({ library: "next.js" })
  Then get docs to confirm latest stable version.
-->

## 1. Technology Stack

### Primary Technologies
${stack.map(t => `- **${t}** <!-- 🤖 Validate version with Context7 -->`).join('\n')}

### Detected Categories
${categories.map(c => `- ${c.charAt(0).toUpperCase() + c.slice(1)}`).join('\n') || '- General'}

### MCP Servers & Tools
<!-- 🤖 Ask user: Which MCP servers do you have access to? -->
- [ ] Context7 (documentation lookup)
- [ ] Exa (web search)
- [ ] GitHub (repository management)
- [ ] Supabase (database operations)
- [ ] {{ADDITIONAL_MCP_SERVERS}}

## 2. Project Setup

### Quick Start Commands

<!-- 🤖 Validate these with Context7 for latest flags/options -->
\`\`\`bash
${setupCommands}
\`\`\`

### Environment Variables

Create a \`.env.local\` file with:

\`\`\`env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
${usesSupabase ? `
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key` : ''}
${usesPrisma ? `
# Database
DATABASE_URL=your-database-url` : ''}

# {{ADDITIONAL_ENV_VARS}} - Add based on integrations
\`\`\`

## 3. Recommended Folder Structure
${folderStructure}

## 4. Coding Conventions

### File Naming
- Components: \`PascalCase.tsx\` (e.g., \`UserProfile.tsx\`)
- Utilities: \`kebab-case.ts\` (e.g., \`format-date.ts\`)
- Hooks: \`use-[name].ts\` (e.g., \`use-auth.ts\`)

### Code Style
- Use TypeScript for type safety
- Prefer functional components
- Use named exports for components
- Keep components small and focused

${usesTailwind ? `### Styling with Tailwind
- Use utility classes for styling
- Create custom components for repeated patterns
- Use CSS variables for theming in \`globals.css\`
` : ''}

## 5. Development Workflow

### Branch Strategy
- \`main\` - Production-ready code
- \`develop\` - Integration branch
- \`feature/*\` - New features
- \`fix/*\` - Bug fixes

### Commit Convention
Use conventional commits:
- \`feat:\` New features
- \`fix:\` Bug fixes
- \`docs:\` Documentation
- \`refactor:\` Code refactoring
- \`test:\` Adding tests

## 6. AI Agent Configuration

### Available Workflows
<!-- 🤖 List workflows included in this blueprint -->
- \`/blueprint-init\` - Interactive project setup
- \`/new-feature\` - Feature development
- \`/review-code\` - Code review
- \`/debug\` - Debugging assistance

### Agent Rules
<!-- 🤖 Generate rules based on stack selection -->
- Framework conventions: \`.agent/rules/${stack[0]?.toLowerCase().replace(/[^a-z]/g, '') || 'general'}-conventions.md\`
- Code patterns: \`.agent/rules/code-patterns.md\`

## 7. Build & Deploy

### Development
\`\`\`bash
npm run dev
\`\`\`

### Production Build
\`\`\`bash
npm run build
npm run start
\`\`\`

### CI/CD
<!-- 🤖 Ask: What is your deployment target? -->
**Target:** {{DEPLOYMENT_TARGET}} <!-- Vercel, AWS, Netlify, etc. -->

---

*This TSD was auto-generated by Vibe Architect. Use /blueprint-init to customize all {{PLACEHOLDERS}} and validate versions.*
`;
}

function generateTasks(name: string, stack: string[]): string {
  const { categories } = detectStackCategories(stack);
  const today = new Date().toISOString().split('T')[0];
  
  // Detect specific technologies
  const usesNextJs = stack.some(s => s.toLowerCase().includes('next'));
  const usesSupabase = stack.some(s => s.toLowerCase().includes('supabase'));
  const usesTailwind = stack.some(s => s.toLowerCase().includes('tailwind'));
  const usesTests = categories.includes('testing');

  const setupTasks = ['- [ ] Initialize project with selected stack', '- [ ] Review and update PRD.md', '- [ ] Review and update TSD.md'];
  
  if (usesNextJs) {
    setupTasks.push('- [ ] Configure Next.js app router structure');
  }
  if (usesSupabase) {
    setupTasks.push('- [ ] Set up Supabase client and types');
    setupTasks.push('- [ ] Create initial database migrations');
  }
  if (usesTailwind) {
    setupTasks.push('- [ ] Configure Tailwind theme and design tokens');
  }

  const featureTasks = [
    '- [ ] Implement core data models',
    '- [ ] Build primary UI components',
    '- [ ] Set up routing and navigation',
    '- [ ] Implement error handling',
    '- [ ] Add form validation',
  ];

  if (usesSupabase || categories.includes('database')) {
    featureTasks.push('- [ ] Implement authentication flow');
    featureTasks.push('- [ ] Set up database queries and mutations');
  }

  const qualityTasks = [
    '- [ ] Add TypeScript strict mode',
    '- [ ] Configure ESLint and Prettier',
  ];

  if (usesTests) {
    qualityTasks.push('- [ ] Set up testing framework');
    qualityTasks.push('- [ ] Write unit tests for core logic');
    qualityTasks.push('- [ ] Add integration tests for critical paths');
  }

  const deployTasks = [
    '- [ ] Configure environment variables',
    '- [ ] Set up CI/CD pipeline',
    '- [ ] Deploy to staging environment',
    '- [ ] Performance testing and optimization',
    '- [ ] Production deployment',
  ];

  return `# ${name} - Implementation Tasks

> **Last Updated:** ${today}
> **Status:** 🚀 Starting
> **Project Management:** {{PM_TOOL}} <!-- Linear, GitHub Projects, Jira, Notion -->

<!-- 
  🤖 AI AGENT INSTRUCTIONS:
  This task list contains dynamic placeholders.
  Use /blueprint-init workflow to customize based on user's project scope.
  Tasks should sync with chosen project management tool.
-->

---

## 📋 Phase 1: Project Setup

<!-- 🤖 Ask: What is your timeline for MVP? Adjust tasks accordingly -->

${setupTasks.join('\n')}
- [ ] {{CUSTOM_SETUP_TASK_1}} <!-- Add based on user requirements -->
- [ ] {{CUSTOM_SETUP_TASK_2}}

---

## ⚡ Phase 2: Core Features

<!-- 🤖 Generate tasks based on stated MVP features from PRD -->

${featureTasks.join('\n')}
- [ ] {{MVP_FEATURE_TASK_1}} <!-- Derived from PRD.md features -->
- [ ] {{MVP_FEATURE_TASK_2}}
- [ ] {{MVP_FEATURE_TASK_3}}

---

## ✅ Phase 3: Quality Assurance

${qualityTasks.join('\n')}

---

## 🚀 Phase 4: Deployment

${deployTasks.join('\n')}

---

## 🤖 AI Agent Workflow Integration

### Recommended Workflows for Each Phase:

| Phase | Workflow | Usage |
|-------|----------|-------|
| Setup | \`/blueprint-init\` | Customize this blueprint with user input |
| Features | \`/new-feature\` | Implement each feature with AI assistance |
| QA | \`/review-code\` | Review code before merging |
| Deploy | \`/commit-fast-conventional\` | Create proper commit messages |

### Available MCP Tools:
<!-- 🤖 List tools available for task automation -->
- Context7: Documentation lookup for implementation
- Exa: Web search for solutions
- GitHub: PR and issue management
- {{ADDITIONAL_TOOLS}}

---

## 📝 Notes

Add your implementation notes here as you progress through the tasks.

---

*This task list was auto-generated by Vibe Architect. Use /blueprint-init to customize all {{PLACEHOLDERS}}.*
`;
}

class BlueprintService {
  static async generate(
    { name, description, stack, workflows }: 
    { name: string; description: string; stack: string[]; workflows: string[] }
  ): Promise<VFS> {
    const vfs: VFS = {};
    const supabase = (await createClient()) as SupabaseClient<Database>;
    
    // A. Generate Enhanced Memory Bank
    vfs['memory-bank/PRD.md'] = generatePRD(name, description, stack);
    vfs['memory-bank/TSD.md'] = generateTSD(name, stack);
    vfs['memory-bank/TASKS.md'] = generateTasks(name, stack);

    // B. Fetch Rules (Logic: Find rules matching ANY selected stack tag)
    // We explicitly cast the response to avoid strict type issues with the generic client
    const { data } = await supabase
      .from('instructions')
      .select('*')
      .overlaps('tags', stack)
      .eq('category', 'rule');
    
    const rules = data as Instruction[] | null;

    if (rules) {
      rules.forEach(rule => {
        // Use slug as filename
        vfs[`.agent/rules/${rule.slug}.md`] = rule.content;
      });
    }

    // C. Fetch Workflows
    const workflowsDir = path.join(process.cwd(), '.agent/workflows');
    for (const flow of workflows) {
      try {
        const content = await fs.readFile(path.join(workflowsDir, `${flow}.md`), 'utf-8');
        vfs[`.agent/workflows/${flow}.md`] = content;
      } catch (_error) {
        console.error(`Missing workflow: ${flow}`);
      }
    }

    // D. Add Enhanced Instructions on how to use
    const setupCommands = generateSetupCommands(stack);
    const rulesCount = rules?.length || 0;
    const workflowsCount = workflows.length;
    
    vfs['README.md'] = `# ${name} - AI Agent Blueprint

> 🚀 Generated by **Vibe Architect Central**

This blueprint contains everything you need to set up AI-assisted development for your project.

## 📦 What's Included

| Folder | Contents |
|--------|----------|
| \`.agent/rules/\` | ${rulesCount} coding rules tailored to your stack |
| \`.agent/workflows/\` | ${workflowsCount} agent workflows for common tasks |
| \`memory-bank/\` | PRD, TSD, and TASKS documents |

## 🛠️ Quick Setup

### 1. Extract & Copy Files

\`\`\`bash
# Copy the .agent folder to your project root
cp -r .agent /path/to/your/project/

# Copy the memory-bank folder
cp -r memory-bank /path/to/your/project/
\`\`\`

### 2. Initialize Your Project

\`\`\`bash
${setupCommands}
\`\`\`

## 📚 Documentation

- **PRD.md** - Product Requirements Document with features and user stories
- **TSD.md** - Technical Specification with architecture and setup instructions
- **TASKS.md** - Implementation checklist organized by phases

## 🤖 Using with AI Assistants

### Cursor / Windsurf
The \`.agent/rules/\` folder will be automatically detected. Your AI assistant will follow these conventions.

### Claude / GitHub Copilot
Reference the rules in your conversations:
- "Follow the coding rules in .agent/rules/"
- "Check memory-bank/PRD.md for project context"

### Claude Code CLI
\`\`\`bash
# The memory-bank folder provides context for Claude Code
claude code --context memory-bank/
\`\`\`

## 📋 Next Steps

1. ✅ Copy files to your project
2. ✅ Review and update \`memory-bank/PRD.md\`
3. ✅ Review \`memory-bank/TSD.md\` for setup commands
4. ✅ Start implementing tasks from \`memory-bank/TASKS.md\`

---

*Built with [Vibe Architect Central](https://github.com/nicanac/vibe-architect-central)*
`;

    return vfs;
  }
}

// 2. API Route
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectName, description, techStack, selectedWorkflows } = body;

    if (!projectName) {
      return NextResponse.json({ error: 'Project name required' }, { status: 400 });
    }

    // Generate VFS
    const vfs = await BlueprintService.generate({
      name: projectName,
      description: description || '',
      stack: techStack || [],
      workflows: selectedWorkflows || []
    });

    // Create ZIP Stream
    const passThrough = new PassThrough();
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(passThrough);

    // Append files from VFS
    Object.entries(vfs).forEach(([filePath, content]) => {
      archive.append(content, { name: filePath });
    });

    archive.finalize();

    // Return stream with headers
    return new NextResponse(passThrough as any, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${projectName.replace(/\s+/g, '-').toLowerCase()}-blueprint.zip"`,
      },
    });

  } catch (error) {
    console.error('Blueprint Generation Error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
