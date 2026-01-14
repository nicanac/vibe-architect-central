# Tool Restrictions Reference

Official documentation on restricting tool access in workflows.

## Why Restrict Tools

Tool restrictions provide:

- **Security**: Prevent accidental destructive operations
- **Focus**: Limit scope for specialized workflows
- **Safety**: Ensure workflows only perform intended operations

## allowed-tools Field

**Location**: YAML frontmatter

**Format**: Array of tool names or patterns

**Default**: If omitted, all tools available

## Basic Patterns

### Array Format

```yaml
---
description: My workflow
allowed-tools: [view_file, replace_file_content, write_to_file]
---
```

### Single Tool

```yaml
---
description: Thinking workflow
allowed-tools: plan_mode
---
```

## run_command Restrictions

**Source**: Official Antigravity documentation

Restrict shell commands to specific patterns using wildcards.

### Git-Only Workflows

```yaml
---
description: Create a git commit
allowed-tools: run_command(git add:*), run_command(git status:*), run_command(git commit:*)
---
```

**Allows**:

- `git add <anything>`
- `git status <anything>`
- `git commit <anything>`

**Prevents**:

- `rm -rf`
- `curl <url>`
- Any non-git commands

### NPM Script Restrictions

```yaml
---
description: Run tests and lint
allowed-tools: run_command(npm test:*), run_command(npm run lint:*)
---
```

**Allows**:

- `npm test`
- `npm test -- --watch`
- `npm run lint`
- `npm run lint:fix`

**Prevents**:

- `npm install malicious-package`
- `npm run deploy`
- Other npm commands

### Multiple Command Patterns

```yaml
---
description: Development workflow
allowed-tools: run_command(git status:*), run_command(npm test:*), run_command(npm run build:*)
---
```

Combines multiple command patterns.

## Common Tool Restriction Patterns

### Pattern 1: Git Workflows

**Use case**: Workflows that create commits, check status, etc.

```yaml
---
description: Create a git commit
allowed-tools: run_command(git add:*), run_command(git status:*), run_command(git diff:*), run_command(git commit:*)
---

Current status: ! `git status`
Changes: ! `git diff HEAD`

Create a commit for these changes.
```

**Security benefit**: Cannot accidentally run destructive commands like `rm -rf` or `curl malicious-site.com`

### Pattern 2: Read-Only Analysis

**Use case**: Workflows that analyze code without modifying it

```yaml
---
description: Analyze codebase for pattern
allowed-tools: [view_file, grep_search, find_by_name]
---
Search codebase for: #$ARGUMENTS
```

**Security benefit**: Cannot write files or execute code

### Pattern 3: Thinking-Only Workflows

**Use case**: Deep analysis or planning without file operations

```yaml
---
description: Analyze problem from first principles
allowed-tools: plan_mode
---
Analyze the current problem from first principles.
```

**Focus benefit**: Antigravity focuses purely on planning/reasoning, no file operations

### Pattern 4: Controlled File Operations

**Use case**: Workflows that should only read/edit specific types

```yaml
---
description: Update documentation
allowed-tools: [view_file, replace_file_content(*.md)]
---
Update documentation in @ #$ARGUMENTS
```

**Note**: File pattern restrictions may not be supported in all versions.

## Real Examples from Official Docs

### Example 1: Git Commit Workflow

**Source**: Official Antigravity documentation

```markdown
---
allowed-tools: run_command(git add:*), run_command(git status:*), run_command(git commit:*)
description: Create a git commit
---

## Context

- Current git status: ! `git status`
- Current git diff (staged and unstaged changes): ! `git diff HEAD`
- Current branch: ! `git branch --show-current`
- Recent commits: ! `git log --oneline -10`

## Your task

Based on the above changes, create a single git commit.
```

**Allowed commands**:

- `git add .`
- `git add file.js`
- `git status`
- `git status --short`
- `git commit -m "message"`
- `git commit --amend`

**Blocked commands**:

- `rm file.js`
- `curl https://malicious.com`
- `npm install`
- Any non-git commands

### Example 2: Code Review (No Restrictions)

```markdown
---
description: Review this code for security vulnerabilities
---

Review this code for security vulnerabilities:
```

**No allowed-tools field** = All tools available

Antigravity can:

- Read files
- Write files
- Execute commands
- Use any tool

**Use when**: Workflow needs full flexibility

## When to Restrict Tools

### ✅ Restrict when:

1. **Security-sensitive operations**

   ```yaml
   # Git operations only
   allowed-tools: run_command(git add:*), run_command(git status:*)
   ```

2. **Focused tasks**

   ```yaml
   # Deep thinking only
   allowed-tools: plan_mode
   ```

3. **Read-only analysis**

   ```yaml
   # No modifications
   allowed-tools: [view_file, grep_search, find_by_name]
   ```

4. **Specific bash commands**
   ```yaml
   # Only npm scripts
   allowed-tools: run_command(npm run test:*), run_command(npm run build:*)
   ```

### ❌ Don't restrict when:

1. **Workflow needs flexibility**
   - Complex workflows
   - Exploratory tasks
   - Multi-step operations

2. **Tool needs are unpredictable**
   - General problem-solving
   - Debugging unknown issues

3. **Already in safe environment**
   - Sandboxed execution
   - Non-production systems

## Best Practices

### 1. Use Wildcards for Command Families

```yaml
# Good - allows all git commands
allowed-tools: run_command(git *)

# Better - specific git operations
allowed-tools: run_command(git add:*), run_command(git status:*), run_command(git commit:*)

# Best - minimal necessary permissions
allowed-tools: run_command(git status:*), run_command(git diff:*)
```

### 2. Combine Tool Types Appropriately

```yaml
# Analysis with optional git context
allowed-tools: [view_file, grep_search, run_command(git status:*)]
```

### 3. Test Restrictions

Create workflow and verify:

- Allowed operations work
- Blocked operations are prevented
- Error messages are clear

### 4. Document Why

```yaml
---
description: Create git commit (restricted to git commands only for security)
allowed-tools: run_command(git add:*), run_command(git status:*), run_command(git commit:*)
---
```

## Tool Types

### File Operations

- `view_file` - Read files
- `write_to_file` - Write new files
- `replace_file_content` - Modify existing files (single block)
- `multi_replace_file_content` - Modify existing files (multiple blocks)
- `grep_search` - Search file contents
- `find_by_name` - Find files by pattern

### Execution

- `run_command(pattern:*)` - Execute bash commands matching pattern
- `plan_mode` - Reasoning/Planning tool
- `task_boundary` - Task management / Subagent invocation helper

### Other

- `browser_subagent` - Browser automation
- `search_web` - Web search
- `read_url_content` - Fetch web pages

## Security Patterns

### Pattern: Prevent Data Exfiltration

```yaml
---
description: Analyze code locally
allowed-tools: [view_file, grep_search, find_by_name, plan_mode]
# No run_command, read_url_content - cannot send data externally
---
```

### Pattern: Prevent Destructive Operations

```yaml
---
description: Review changes
allowed-tools: [view_file, run_command(git diff:*), run_command(git log:*)]
# No write_to_file, replace_file_content, git reset, git push --force
---
```

### Pattern: Controlled Deployment

```yaml
---
description: Deploy to staging
allowed-tools: run_command(npm run deploy:staging), run_command(git push origin:staging)
# Cannot deploy to production accidentally
---
```

## Limitations

1. **Wildcard patterns** may vary by version
2. **File-specific restrictions** (like `replace_file_content(*.md)`) may not be supported
3. **Cannot blacklist** - only whitelist
4. **All or nothing** for tool types - can't partially restrict
