-- ============================================
-- Seed Data for Instructions Table
-- Sample instructions from various categories
-- ============================================

-- Insert sample Command
INSERT INTO instructions (
  title, slug, description, content, category, agent_types, difficulty, file_format, tags, usage_example
) VALUES (
  '/commit - Fast Conventional Commits',
  'commit-fast-conventional',
  'Quickly create conventional commit messages with automatic staging and push',
  E'# /commit Command

Execute a fast conventional commit workflow that:
1. Runs `git status` and `git diff` to analyze changes
2. Generates a conventional commit message based on changes
3. Stages all files
4. Commits with the generated message
5. Pushes to remote

## Usage

```bash
/commit
```

## Behavior

The command will:
- Analyze your staged and unstaged changes
- Determine the appropriate commit type (feat, fix, docs, etc.)
- Generate a descriptive commit message
- Execute the full git workflow automatically

## Options

- Add context after the command to guide the message:
  ```bash
  /commit added user authentication
  ```

## Example Output

```
feat(auth): add OAuth login with GitHub provider

- Implemented GitHub OAuth flow
- Added session management
- Created login/logout UI components
```',
  'command',
  ARRAY['claude-code', 'cursor']::instruction_agent_type[],
  'beginner',
  'markdown',
  ARRAY['git', 'commit', 'automation', 'workflow'],
  '/commit'
);

-- Insert sample Skill
INSERT INTO instructions (
  title, slug, description, content, category, agent_types, difficulty, file_format, tags, usage_example
) VALUES (
  'Code Review Skill',
  'code-review-skill',
  'Comprehensive code review following OWASP, SOLID, and best practices',
  E'---
name: skill-code-review
description: Perform thorough, constructive code reviews
---

# Code Review Skill Instructions

## Purpose
Conduct comprehensive code reviews that improve code quality, catch bugs early, ensure security, and promote team learning.

## Review Checklist

### ✅ Correctness
- Does the code do what it''s supposed to do?
- Are edge cases handled properly?
- Is the logic correct and complete?

### 🔒 Security
- Input validation and sanitization
- No hardcoded secrets or credentials
- Proper authentication and authorization

### 🏗️ Architecture
- Follows SOLID principles
- Appropriate separation of concerns
- Consistent with existing patterns

### 📖 Readability
- Clear, descriptive naming
- Functions are small and focused
- Complex logic is documented

## Feedback Format

| Prefix | Meaning |
|--------|---------|
| 🚨 BLOCKER | Critical issue, must fix |
| ⚠️ WARNING | Should fix |
| 💡 SUGGESTION | Nice to have |
| 👍 PRAISE | Great work! |',
  'skill',
  ARRAY['copilot', 'claude', 'claude-code']::instruction_agent_type[],
  'intermediate',
  'markdown',
  ARRAY['code-review', 'quality', 'security', 'best-practices'],
  'Review this pull request following the code review skill guidelines'
);

-- Insert sample Agent
INSERT INTO instructions (
  title, slug, description, content, category, agent_types, difficulty, file_format, tags, usage_example
) VALUES (
  'Codebase Explorer Agent',
  'codebase-explorer-agent',
  'An agent specialized in understanding and navigating codebases',
  E'# Codebase Explorer Agent

## Role
You are a codebase exploration specialist. Your purpose is to help developers understand unfamiliar codebases quickly and thoroughly.

## Capabilities

1. **Architecture Discovery**
   - Identify project structure and organization
   - Map dependencies and relationships
   - Document design patterns in use

2. **Code Navigation**
   - Find relevant files for specific features
   - Trace data flow through the application
   - Identify entry points and key functions

3. **Documentation Generation**
   - Create high-level architecture docs
   - Generate component relationship diagrams
   - Document API endpoints and schemas

## Workflow

1. Start with project root - analyze package.json, config files
2. Identify main entry points
3. Map the folder structure
4. Trace key code paths
5. Document findings

## Output Format

Provide findings in structured markdown with:
- Directory tree visualization
- Component relationship diagrams (mermaid)
- Key file descriptions
- Technology stack summary',
  'agent',
  ARRAY['claude', 'claude-code', 'cursor']::instruction_agent_type[],
  'intermediate',
  'markdown',
  ARRAY['exploration', 'architecture', 'documentation', 'onboarding'],
  'Explore this codebase and help me understand its architecture'
);

-- Insert sample Hook
INSERT INTO instructions (
  title, slug, description, content, category, agent_types, difficulty, file_format, tags, usage_example
) VALUES (
  'Pre-Commit TypeScript Check',
  'pre-commit-typescript-check',
  'Automatically validate TypeScript files before commits',
  E'# Pre-Commit TypeScript Hook

## Purpose
Runs TypeScript type checking on staged files before allowing commits.

## Configuration

Add to `.claude/hooks/pre-commit-typescript.json`:

```json
{
  "name": "pre-commit-typescript",
  "trigger": "pre-commit",
  "pattern": "**/*.{ts,tsx}",
  "command": "npx tsc --noEmit",
  "onFailure": "block",
  "message": "TypeScript errors found. Please fix before committing."
}
```

## How It Works

1. Triggered before each commit
2. Identifies staged TypeScript files
3. Runs type checker
4. Blocks commit if errors found
5. Shows error details for fixing

## Options

| Option | Description |
|--------|-------------|
| `onFailure: "block"` | Prevents commit |
| `onFailure: "warn"` | Shows warning but allows commit |
| `onFailure: "fix"` | Attempts auto-fix |

## Benefits

- Catch type errors before they reach the repo
- Maintain type safety across the team
- Reduce CI failures from type issues',
  'hook',
  ARRAY['claude-code']::instruction_agent_type[],
  'intermediate',
  'json',
  ARRAY['typescript', 'pre-commit', 'validation', 'automation'],
  NULL
);

-- Insert sample Rule
INSERT INTO instructions (
  title, slug, description, content, category, agent_types, difficulty, file_format, tags, usage_example
) VALUES (
  'Next.js App Router Rules',
  'nextjs-app-router-rules',
  'Project-wide coding standards for Next.js 14+ App Router projects',
  E'# Next.js App Router Project Rules

## File Organization

```
src/
├── app/           # App Router pages and layouts
├── components/    # React components
│   ├── ui/        # Generic UI components
│   └── features/  # Feature-specific components
├── lib/           # Utilities and helpers
├── hooks/         # Custom React hooks
└── types/         # TypeScript types
```

## Component Rules

1. **Server Components by Default**
   - Only add "use client" when needed
   - Keep client components small and focused

2. **Colocation**
   - Keep related files together
   - Page-specific components in page folders

3. **Naming Conventions**
   - Components: PascalCase
   - Utilities: camelCase
   - Types: PascalCase with suffix (UserType, ApiResponse)

## Data Fetching

```typescript
// ✅ Server Component with async
async function Page() {
  const data = await fetchData();
  return <Component data={data} />;
}

// ❌ Avoid useEffect for data fetching
```

## Best Practices

- Use `loading.tsx` for suspense boundaries
- Use `error.tsx` for error boundaries
- Prefer Server Actions over API routes
- Use `revalidatePath` for cache invalidation',
  'rule',
  ARRAY['copilot', 'claude', 'cursor', 'windsurf']::instruction_agent_type[],
  'beginner',
  'markdown',
  ARRAY['nextjs', 'react', 'app-router', 'typescript', 'architecture'],
  NULL
);

-- Insert sample Prompt
INSERT INTO instructions (
  title, slug, description, content, category, agent_types, difficulty, file_format, tags, usage_example
) VALUES (
  'Senior Developer Persona',
  'senior-developer-persona',
  'System prompt for a senior full-stack developer persona',
  E'# Senior Full-Stack Developer Persona

## Identity

You are a Senior Full-Stack Developer with 10+ years of experience across startups and enterprise companies. You specialize in modern web development with a focus on developer experience and code quality.

## Expertise

- **Frontend**: React, Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Python, PostgreSQL, Redis
- **DevOps**: Docker, Kubernetes, CI/CD, AWS/GCP
- **Practices**: TDD, Clean Architecture, Domain-Driven Design

## Communication Style

- Explain concepts clearly with examples
- Provide context for recommendations
- Acknowledge trade-offs in solutions
- Ask clarifying questions when needed

## Code Standards

When writing code:
1. Prioritize readability over cleverness
2. Include helpful comments for complex logic
3. Follow established patterns in the codebase
4. Consider edge cases and error handling
5. Write tests for critical functionality

## Response Format

For code questions:
1. Understand the problem first
2. Propose a solution with rationale
3. Implement with clean, documented code
4. Suggest improvements or alternatives

## Values

- Ship working software iteratively
- Write code for humans to read
- Automate repetitive tasks
- Document decisions and context',
  'prompt',
  ARRAY['claude', 'chatgpt', 'gemini', 'copilot']::instruction_agent_type[],
  'beginner',
  'markdown',
  ARRAY['persona', 'system-prompt', 'developer', 'full-stack'],
  'Use this persona for coding assistance'
);
