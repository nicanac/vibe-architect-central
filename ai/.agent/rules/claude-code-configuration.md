---
description: Detailed guide on configuring commands, agents, skills, hooks, and scripts in Claude Code.
---

Detailed guide on configuring commands, agents, skills, hooks, and scripts in Claude Code.

## Configuration Structure

Claude Code configurations are organized in the `~/.claude/` directory (or `.claude/` in your project):

```
~/.claude/
├── commands/           # Slash commands (/commit, /create-pr, etc.)
├── agents/            # Specialized AI agents
├── skills/            # Complex workflows with multiple steps
├── hooks/             # Event-triggered automation
├── scripts/           # Utility scripts and tools
└── settings.json      # Main configuration file
```

## Components

### 1\. Commands

Slash commands that extend Claude Code functionality. They are simple, single-purpose tasks.

#### Available Commands

**Git & GitHub:**

*   `/commit` - Fast conventional commits with immediate push
*   `/create-pull-request` - Auto-generated PR creation
*   `/fix-pr-comments` - Systematic PR review resolution

**Code Analysis:**

*   `/deep-code-analysis` - Comprehensive codebase investigation
*   `/explain-architecture` - Pattern analysis with diagrams

**Utilities:**

*   `/cleanup-context` - Memory optimization
*   `/claude-memory` - CLAUDE.md file management
*   `/watch-ci` - Automated CI/CD monitoring

**Workflows:**

*   `/epct` - Explore-Plan-Code-Test methodology

#### Command Structure

Commands are markdown files with frontmatter and structured content:

MARKDOWN

```
---
description: Command description
argument-hint: <what-to-pass>
---

<objective>
What this command does
</objective>

<process>
1. Step one
2. Step two
3. Step three
</process>

<rules>
- Rule 1
- Rule 2
</rules>
```

#### Installing Commands

BASH

```
# Install a specific command
bunx aiblueprint-cli@latest claude-code add commands commit

# List all available commands
bunx aiblueprint-cli@latest claude-code add commands

# Install multiple commands
bunx aiblueprint-cli@latest claude-code add commands commit create-pr watch-ci
```

### 2\. Agents

Specialized AI agents for specific tasks, launched via the Task tool.

#### Available Agents

Agent

Model

Description

`action`

haiku

Conditional action executor - performs actions only when conditions are met

`explore-codebase`

yellow

Comprehensive code discovery and analysis

`explore-docs`

yellow

Documentation research with context gathering

`websearch`

yellow

Quick web research with authoritative sources

#### Agent Structure

Agents are markdown files with metadata and instructions:

MARKDOWN

```
---
name: agent-name
description: What the agent does
color: purple
model: haiku
---

Agent instructions and workflow...
```

#### Usage

The main Claude instance automatically uses these agents via the Task tool when appropriate:

BASH

```
# Example: Claude will use explore-codebase agent when needed
"Find all authentication-related files in the project"
```

### 3\. Skills

Complex workflows with multiple steps, progressive disclosure, and state management.

#### Available Skills

Skill

Description

`claude-memory`

Create and optimize CLAUDE.md memory files

`create-slash-commands`

Create custom slash commands

`create-subagents`

Create specialized subagents

#### Skill Structure

Skills are more complex than commands and can include:

*   Multiple reference documents
*   Progressive step loading
*   Interactive decision points
*   Bundled resources (scripts, examples)

**Directory Structure:**

```
skills/
└── skill-name/
    ├── SKILL.md              # Main skill file
    └── references/           # Reference documents
        ├── patterns.md
        ├── examples.md
        └── templates.md
```

#### Installing Skills

BASH

```
# Install a specific skill
bunx aiblueprint-cli@latest claude-code add skills claude-memory

# List all available skills
bunx aiblueprint-cli@latest claude-code add skills
```

### 4\. Hooks

Event-triggered automation that runs at specific points in Claude Code's workflow.

#### Available Hook Types

Hook Type

When It Runs

Use Cases

`PreToolUse`

Before a tool is executed

Command validation, security checks

`PostToolUse`

After a tool completes

File processing, formatting

`Stop`

When session stops

Cleanup, logging

`SessionStart`

When session begins

Setup, initialization

`UserPromptSubmit`

After user submits prompt

Input validation, preprocessing

#### Hook Configuration

Hooks are configured in `~/.claude/settings.json`:

JSON

```
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bun ~/.claude/scripts/validate-command.js"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "bun ~/.claude/hooks/hook-post-file.ts"
          }
        ]
      }
    ]
  }
}
```

#### Installing Hooks

BASH

```
# Install command validation hook
bunx aiblueprint-cli@latest claude-code add hook post-edit-typescript

# Install all recommended hooks
bunx aiblueprint-cli@latest claude-code setup --hooks-only
```

### 5\. Scripts

Utility scripts for various tasks (validation, statusline, notifications).

#### Available Scripts

Script

Purpose

Language

`validate-command.js`

Security validation for bash commands

JavaScript/Bun

`statusline/`

Git status and usage tracking display

TypeScript/Bun

`command-validator/`

700+ line security system

TypeScript/Bun

#### Statusline Setup

BASH

```
# Install custom statusline
bunx aiblueprint-cli@latest claude-code statusline
```

The statusline shows:

*   Git branch and status
*   Session costs
*   Token usage
*   Daily limits

#### Statusline Configuration

Configure in `~/.claude/settings.json`:

JSON

```
{
  "statusLine": {
    "type": "command",
    "command": "bun ~/.claude/scripts/statusline/src/index.ts",
    "padding": 0
  }
}
```

## Advanced Configuration

### Custom Installation Paths

Install to specific directories:

BASH

```
# Project-local installation (creates .claude/ in project root)
cd your-project/
bunx aiblueprint-cli@latest claude-code setup

# Global installation
bunx aiblueprint-cli@latest claude-code setup --folder ~/.claude

# Custom path
bunx aiblueprint-cli@latest claude-code setup --folder /custom/path
```

### Symlink Management

Share configurations between different AI CLI tools:

BASH

```
# Create symlinks between Claude Code, Codex, OpenCode, FactoryAI
bunx aiblueprint-cli@latest claude-code symlink

# With custom paths
bunx aiblueprint-cli@latest claude-code symlink \
  --claudeCodeFolder ~/.claude \
  --codexFolder ~/.codex \
  --factoryAiFolder ~/.factory
```

### Settings.json Configuration

The main configuration file (`~/.claude/settings.json`) manages all Claude Code settings:

JSON

```
{
  "statusLine": {
    "type": "command",
    "command": "bun ~/.claude/scripts/statusline/src/index.ts",
    "padding": 0
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bun ~/.claude/scripts/validate-command.js"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "bun ~/.claude/hooks/hook-post-file.ts"
          }
        ]
      }
    ]
  }
}
```

## Usage Examples

### Installing Specific Components

BASH

```
# Install only commands
bunx aiblueprint-cli@latest claude-code add commands

# Install only agents
bunx aiblueprint-cli@latest claude-code add agents

# Install only hooks
bunx aiblueprint-cli@latest claude-code add hooks

# Install statusline
bunx aiblueprint-cli@latest claude-code statusline
```

### Creating Custom Components

BASH

```
# Create a custom command
bunx aiblueprint-cli@latest claude-code create command my-command

# Create a custom agent
bunx aiblueprint-cli@latest claude-code create agent my-agent

# Create a custom skill
bunx aiblueprint-cli@latest claude-code create skill my-skill
```

## Best Practices

### Organization

1.  **Keep commands simple** - One task per command
2.  **Use agents for complex tasks** - Multi-step workflows
3.  **Leverage hooks for automation** - Avoid manual checks
4.  **Document your custom components** - Add clear descriptions

### Performance

1.  **Use appropriate models** - haiku for quick tasks, sonnet for complex ones
2.  **Minimize hook overhead** - Keep validation scripts fast
3.  **Cache when possible** - Reuse results in statusline scripts

### Maintenance

1.  **Regular updates** - Keep CLI and configurations updated
2.  **Test hooks** - Verify they don't block legitimate commands
3.  **Clean up unused components** - Remove obsolete commands/agents

## Next Steps

*   [Security Guide](/docs/claude-code-security) - Security features and validation
*   [Claude Code Pro](/docs/claude-code-pro) - Upgrade to premium features
*   [Creating Skills](/docs/claude-code-pro/create-skills-workflow) - Build custom workflows
*   [Creating Hooks](/docs/claude-code-pro/create-hooks) - Event-triggered automation

## Resources

*   **CLI Reference**: `bunx aiblueprint-cli@latest claude-code --help`
*   **Repository**: [melvynx/aiblueprint](https://github.com/melvynx/aiblueprint)
*   **Examples**: Browse `~/.claude/` after installation

[Claude Code Setup](/docs/claude-code-setup)[Claude Code Security](/docs/claude-code-security)
