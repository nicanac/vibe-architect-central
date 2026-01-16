# Antigravity AI Usage Guide

Welcome to your AI-enhanced persistent workspace. This guide explains how to effectively use Antigravity's memory, workflows, and skills to supercharge your development.

## 🧠 Memory System

Antigravity uses a layered memory system to maintain context across sessions.

### 1. `MEMORY.md` (Project Context)

**Location**: `.agent/rules/MEMORY.md` (or Project Root)

This is the "brain" of your project. It should contain:

- **Project Structure**: Key directories and their purpose.
- **Tech Stack**: Frameworks, libraries, and versions (e.g., Next.js 16.1, Tailwind 4.1).
- **Core Principles**: Design philosophy and coding standards.

**Tip**: Update this file when major architectural decisions are made. The AI reads this to understand _what_ it is working on.

### 2. Agent Rules

**Location**: `.agent/rules/*.md`

Modular instructions that guide AI behavior.

- `preferences.md`: Your coding style (tabs vs spaces, semi-colons, etc.), preferred tools.
- `workflows.md`: Standard operating procedures (e.g., "Always run tests before committing").

### 3. Brain Artifacts

**Location**: `~/.gemini/antigravity/brain/<id>/`

The AI automatically creates artifacts like `implementation_plan.md` and `task.md` to track complex work. Review these to see the AI's plan.

## ⚡ Workflows (Slash Commands)

Workflows are reusable prompts that automate complex or repetitive tasks. They are invoked with `/workflow-name`.

### Using Workflows

Type `/` in the chat to see available workflows.
Common examples:

- `/fix-issue <number>`: Fix a bug following standard protocol.
- `/review-pr <number>`: Review a pull request.
- `/plan-feature <description>`: Generate a detailed implementation plan.

### Creating Workflows

Use the `create-workflow` skill to generate new workflows correctly.

**Location**:

- **Project**: `.agent/workflows/` (shared with team)
- **Global**: `~/.agent/workflows/` (your personal tools)

**Structure**:
Workflows are Markdown files with YAML frontmatter.

```markdown
---
description: Describe what this workflow does
argument-hint: [optional arguments]
allowed-tools: [view_file, run_command(git status:*)] # Optional safety restrictions
---

## Objective

What should the AI do?

## Process

1. Step one
2. Step two
```

**See**: `.agent/skills/create-workflow/SKILL.md` for detailed instructions.

## 🛠️ Skills

Skills are capabilities packaged as instructions + resources. They teach the AI _how_ to perform specific types of work.

**Location**: `.agent/skills/`

Examples:

- `create-workflow`: Expert at writing Antigravity workflows.
- `code-review`: specialized instructions for security-focused code review.
- `commit-message`: Generates conventional commits.

### Using Skills

The AI automatically loads relevant skills based on your request. You generally don't need to "invoke" a skill directly, just ask for the task (e.g., "Create a workflow for X" triggers the `create-workflow` skill).

## 🚀 Best Practices

1. **Be "Intent-First"**: Tell the AI _what_ you want to achieve, not just small code edits.
2. **Use Modes**:
   - **Plan**: Ask for a plan first. "Plan how to implement X".
   - **Execute**: "Go ahead and implement the plan".
   - **Verify**: "Verify the changes match the requirements".
3. **Reference Context**: Use `@filename` to explicitly point the AI to relevant files if it gets lost.
4. **Keep Memory Fresh**: If the AI forgets something, check if it's documented in `MEMORY.md`. If not, add it!

## Directory Structure Summary

```
.agent/
├── rules/              # Persistent instructions (MEMORY.md, preferences.md)
├── workflows/          # Custom slash commands (*.md)
├── skills/             # Specialized capabilities (folders)
└── AI_USAGE_GUIDE.md   # This file
```
