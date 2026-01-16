---
name: create-slash-commands
description: Expert guidance for creating Antigravity slash commands. Use when working with slash commands, creating custom commands, understanding command structure, or learning YAML configuration.
---

## Objective

Create effective slash commands for Antigravity that enable users to trigger reusable prompts with `/command-name` syntax. Slash commands expand as prompts in the current conversation, allowing teams to standardize workflows and operations.

Commands can be **global** (available everywhere in `~/.agent/commands/`) or **project-specific** (shared with team in `.agent/commands/`). This skill teaches you to structure commands with proper formatting (Markdown), YAML frontmatter, dynamic context loading, and intelligent argument handling.

**CRITICAL WORKFLOW**: This skill enforces a mandatory research phase where you MUST:

1. Read all reference documentation
2. Examine existing slash commands for patterns
3. Understand syntax and best practices
4. Only then create the command

This prevents poorly-structured commands and ensures consistency with established patterns.

## Quick Start

### Workflow

1. Create `.agent/commands/` directory (project) or use `~/.agent/commands/` (personal)
2. Create `command-name.md` file
3. Add YAML frontmatter (at minimum: `description`)
4. Write command prompt
5. Test with `/command-name [args]`

### Example

**File**: `.agent/commands/optimize.md`

```markdown
---
description: Analyze this code for performance issues and suggest optimizations
---

Analyze the performance of this code and suggest three specific optimizations:
```

**Usage**: `/optimize`

Antigravity receives the expanded prompt and analyzes the code in context.

## Markdown Structure

Slash commands should use **Markdown headings** (Headers) in the body (after YAML frontmatter).

**Format**:

- **Markdown Headers**: The standard for Antigravity commands (`## Objective`, `## Process`)
- **Compatibility**: Antigravity parses Markdown headers effectively for instruction structuring.

### Required Sections

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

Current state: ! `git status`
Relevant files: @ package.json
```

(Note: Remove the space after @ in actual usage)

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

Run tests: ! `npm test`
Check linting: ! `npm run lint`
```

**`## Output`** - When creating/modifying specific files

```markdown
## Output

Files created/modified:

- `./path/to/file.ext` - Description
```

### Structure Example

```markdown
---
name: example-command
description: Does something useful
argument-hint: [input]
---

## Objective

Process #$ARGUMENTS to accomplish [goal].

This helps [who] achieve [outcome].

## Context

Current state: ! `relevant command`
Files: @ relevant/files

## Process

1. Parse #$ARGUMENTS
2. Execute operation
3. Verify results

## Success Criteria

- Operation completed without errors
- Output matches expected format
```

### Intelligence Rules

**Simple commands** (single operation, no artifacts):

- Required: `## Objective`, `## Process`, `## Success Criteria`
- Example: `/check-todos`, `/first-principles`

**Complex commands** (multi-step, produces artifacts):

- Required: `## Objective`, `## Process`, `## Success Criteria`
- Add: `## Context` (if loading state), `## Verification` (if creating files), `## Output` (what gets created)
- Example: `/commit`, `/create-prompt`, `/run-prompt`

**Commands with dynamic arguments**:

- Use `#$ARGUMENTS` in body
- Include `argument-hint` in frontmatter
- Make it clear what the arguments are for

**Commands that produce files**:

- Always include `## Output` section specifying what gets created
- Always include `## Verification` section with checks to perform

**Commands that run tests/builds**:

- Include `## Testing` section with specific commands
- Include pass/fail criteria in `## Success Criteria`

## Arguments Intelligence

The skill should intelligently determine whether a slash command needs arguments.

### Commands That Need Arguments

**User provides specific input:**

- `/fix-issue [issue-number]` - Needs issue number
- `/review-pr [pr-number]` - Needs PR number
- `/optimize [file-path]` - Needs file to optimize
- `/commit [type]` - Needs commit type (optional)

**Pattern:** Task operates on user-specified data
Include `argument-hint: [description]` in frontmatter and reference `#$ARGUMENTS` in the body.

### Commands Without Arguments

**Self-contained procedures:**

- `/check-todos` - Operates on known file (TO-DOS.md)
- `/first-principles` - Operates on current conversation
- `/whats-next` - Analyzes current context

**Pattern:** Task operates on implicit context (current conversation, known files, project state)
Omit `argument-hint` and don't reference `#$ARGUMENTS`.

### Incorporating Arguments

**In Objective:**

```markdown
## Objective

Fix issue #$ARGUMENTS following project conventions.
```

**In Process:**

```markdown
## Process

1. Understand issue #$ARGUMENTS from issue tracker
```

**In Context:**

```markdown
## Context

Issue details: @ issues/#$ARGUMENTS.md
Related files: ! `grep -r "TODO.*#$ARGUMENTS" src/`
```

### Positional Arguments

For structured input, use `$1`, `$2`, `$3`:

```markdown
---
argument-hint: <pr-number> <priority> <assignee>
---

## Objective

Review PR #$1 with priority $2 and assign to $3.
```

**Usage:** `/review-pr 456 high alice`

## File Structure

**Project commands**: `.agent/commands/` (in project root)

- Shared with team via version control
- Project-specific workflows
- Shows `(project)` in `/help` list

**Global commands**: `~/.agent/commands/` (user home directory)

- Available across all your projects
- Personal productivity commands
- Shows `(user)` in `/help` list

**Choosing between global and project**:

- Use **global** for: Personal workflows, general utilities, commands you use everywhere
- Use **project** for: Team workflows, project-specific operations, shared conventions

## YAML Frontmatter

### Field: description

**Required** - Describes what the command does

```yaml
description: Analyze this code for performance issues and suggest optimizations
```

### Field: allowed-tools

**Optional** - Restricts which tools Antigravity can use

```yaml
allowed-tools: [Read, Edit, Write]
# or
allowed-tools: Bash(git add:*)
```

## Arguments Usage

### All Arguments String

Use `#$ARGUMENTS` to capture all arguments strings.

```markdown
Fix issue #$ARGUMENTS following our coding standards
```

**Usage**: `/fix-issue 123 high-priority`
**Received**: "Fix issue #123 high-priority following our coding standards"

### Positional Arguments

Use `$1`, `$2` for split arguments.

```markdown
Review PR #$1 with priority $2
```

**Usage**: `/review-pr 456 high`
**Received**: "Review PR #456 with priority high"

## Dynamic Context

Execute bash commands before the prompt using the exclamation mark prefix directly before backticks `!`.

```markdown
## Context

- Current git status: ! `git status`
- Current git diff: ! `git diff HEAD`
```

Use `@` prefix to reference specific files:

```markdown
Review the implementation in @ src/utils/helpers.js
```

## Best Practices

**1. Always use Markdown Structure**
After frontmatter, use standard Markdown headers:

- `## Objective`
- `## Process`
- `## Success Criteria`

**2. Clear descriptions**
Write descriptive summaries for the `/help` list.

**3. Use dynamic context for state-dependent tasks**
Load fresh status for git ops or tests.

**4. Restrict tools when appropriate**
Use `allowed-tools` to prevent unintended actions (e.g. restrict to Analysis tools only).

**5. Use #$ARGUMENTS for flexibility**
Let users specify files or IDs at runtime.

**6. Reference relevant files**
Use `@filename` to load context automatically.

## Common Patterns

### Simple Analysis Command

```markdown
---
description: Review this code for security vulnerabilities
---

## Objective

Review code for security vulnerabilities and suggest fixes.

## Process

1. Scan code for common vulnerabilities
2. Identify specific issues
3. Suggest remediation

## Success Criteria

- All major vulnerability types checked
- Issues identified with locations
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

- Current status: ! `git status`
- Changes: ! `git diff HEAD`
- Recent commits: ! `git log --oneline -5`

## Process

1. Review staged and unstaged changes
2. Stage relevant files
3. Write commit message
4. Create commit

## Success Criteria

- Commit created successfully
- Message follows conventions
```

## Reference Guides

**Slash command specific references:**

- [arguments.md](resources/arguments.md)
- [patterns.md](examples/patterns.md)
- [tool-restrictions.md](resources/tool-restrictions.md)
- [prompt-examples.md](examples/prompt-examples.md)

**Generation Protocol**
(See mandatory research steps in previous sections)
