---
description: Expert guidance for creating Antigravity slash commands with YAML configuration and dynamic context loading.
---

Expert guidance for creating Antigravity slash commands with YAML configuration and dynamic context loading.

The `/create-slash-commands` skill helps you create effective slash commands for Antigravity that enable users to trigger reusable prompts with `/command-name` syntax.

## What are Slash Commands?

Slash commands expand as prompts in the current conversation, allowing teams to standardize workflows and operations. Commands can be:

- **Global** - Available everywhere in `~/.antigravity/commands/`
- **Project-specific** - Shared with team in `.antigravity/commands/`

## Quick Start

### Workflow

1.  Create `.antigravity/commands/` directory (project) or use `~/.antigravity/commands/` (personal)
2.  Create `command-name.md` file
3.  Add YAML frontmatter (at minimum: `description`)
4.  Write command prompt
5.  Test with `/command-name [args]`

### Example

**File**: `.antigravity/commands/optimize.md`

```markdown
---
description: Analyze this code for performance issues and suggest optimizations
---

Analyze the performance of this code and suggest three specific optimizations:
```

**Usage**: `/optimize`

## Markdown Structure

All generated slash commands should use Markdown headers in the body for clarity.

### Required Header Sections

**`## Objective`** - What the command does and why it matters

```markdown
## Objective

What needs to happen and why this matters.
Context about who uses this and what it accomplishes.
```

**`## Process`** - How to execute the command

```markdown
## Process

1. First step
2. Second step
3. Final step
```

**`## Success Criteria`** - How to know the command succeeded

```markdown
## Success Criteria

- Clear, measurable criteria for successful completion.
```

### Conditional Sections

**`## Context`** - When loading dynamic state or files

```markdown
## Context

Current state: !`git status`
Relevant files: @package.json
```

**`## Verification`** - When producing artifacts that need checking

```markdown
## Verification

Before completing, verify:

- Specific test or check to perform
- How to confirm it works
```

**`## Testing`** - When running tests is part of the workflow

```markdown
## Testing

Run tests: !`npm test`
Check linting: !`npm run lint`
```

**`## Output`** - When creating/modifying specific files

```markdown
## Output

Files created/modified:

- `./path/to/file.ext` - Description
```

## YAML Frontmatter Options

| Field           | Required | Description                                     |
| :-------------- | :------- | :---------------------------------------------- |
| `description`   | Yes      | Short description shown in `/help` command list |
| `allowed-tools` | No       | Restrict which tools Antigravity can use        |
| `argument-hint` | No       | Show expected arguments in autocomplete         |

### Allowed Tools Syntax

Restrict tools for security or focused execution:

```yaml
# Array format
allowed-tools: [Read, Edit, Write]

# Single tool
allowed-tools: SequentialThinking

# Bash with command restrictions
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
```

If omitted, all tools are available.

## Arguments

### When to Use Arguments

**Commands that NEED arguments:**

- Task operates on user-specified data
- Examples: `/fix-issue [number]`, `/review-pr [number]`, `/optimize [file-path]`

**Commands WITHOUT arguments:**

- Self-contained procedures operating on implicit context
- Examples: `/check-todos`, `/first-principles`, `/whats-next`

### Argument Syntax

Commands can accept user input in two ways:

### All Arguments String

Use `#$ARGUMENTS` to capture all arguments as a single string:

```markdown
---
description: Fix issue following coding standards
argument-hint: [issue-number]
---

Fix issue #$ARGUMENTS following our coding standards
```

**Usage**: `/fix-issue 123 high-priority`

**Antigravity receives**: "Fix issue #123 high-priority following our coding standards"

### Positional Arguments

Use `$1`, `$2`, `$3` for structured input:

```markdown
---
description: Review PR with priority and assignee
argument-hint: <pr-number> <priority> <assignee>
---

## Objective

Review PR #$1 with priority $2 and assign to $3.
```

**Usage**: `/review-pr 456 high alice`

**Antigravity receives**: "Review PR #456 with priority high and assign to alice"

## Dynamic Context

Execute bash commands and reference files to provide fresh context:

### Shell Commands

Use `!` before backticks to execute commands:

```markdown
## Context

Git status: !`git status --short`
Current branch: !`git branch --show-current`
Recent commits: !`git log --oneline -5`
```

### File References

Use `@` to reference specific files:

```markdown
## Context

Package info: @package.json
Source files: @src/utils/\*.js
```

Both shell commands and file references are resolved when the command runs.

## Common Patterns

### Simple Analysis Command

```markdown
---
description: Review this code for security vulnerabilities
---

## Objective

Review code for security vulnerabilities and suggest fixes.

## Process

1. Scan code for common vulnerabilities (XSS, SQL injection, etc.)
2. Identify specific issues with line numbers
3. Suggest remediation for each issue

## Success Criteria

- All major vulnerability types checked
- Specific issues identified with locations
- Actionable fixes provided
```

### Git Workflow with Context

```markdown
---
description: Create a git commit
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
---

## Objective

Create a git commit for current changes following repository conventions.

## Context

- Current status: !`git status`
- Changes: !`git diff HEAD`
- Recent commits: !`git log --oneline -5`

## Process

1. Review staged and unstaged changes
2. Stage relevant files
3. Write commit message following recent commit style
4. Create commit

## Success Criteria

- All relevant changes staged
- Commit message follows repository conventions
- Commit created successfully
```

### Parameterized Command

```markdown
---
description: Optimize code performance
argument-hint: [file-path]
---

## Objective

Analyze performance of @#$ARGUMENTS and suggest specific optimizations.

## Process

1. Review code in @#$ARGUMENTS for performance issues
2. Identify bottlenecks and inefficiencies
3. Suggest three specific optimizations with rationale
4. Estimate performance impact of each

## Success Criteria

- Performance issues clearly identified
- Three concrete optimizations suggested
- Implementation guidance provided
- Performance impact estimated
```

**Usage**: `/optimize src/utils/helpers.js`

## Best Practices

1.  **Always use Markdown structure** - Standard headers (`## Objective`, `## Process`) are clearer and easier to maintain.
2.  **Clear descriptions** - "Analyze this code for performance issues" not "Optimize stuff"
3.  **Use dynamic context for state-dependent tasks** - Load fresh git status, test results, etc.
4.  **Restrict tools when appropriate** - Use `allowed-tools` for security (git commands, analysis-only)
5.  **Use #$ARGUMENTS for flexibility** - Let users specify what to operate on
6.  **Reference relevant files** - Use `@package.json` or `@src/**/*.ts` for context
7.  **Keep commands focused** - One command, one clear purpose
8.  **Include Success Criteria** - Define what "done" means

[/create-prompt](/docs/antigravity/create-prompt)[/create-meta-prompts](/docs/antigravity/create-meta-prompts)
