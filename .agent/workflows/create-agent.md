---
description: Scaffold a new AI Agent with persona, tools, and memory configuration.
---

# Create New AI Agent Workflow

This workflow guides you through creating a new autonomous agent or sub-agent for your project.

## 1. Agent Definition
- **Name**: [Agent Name] (e.g., `qa-bot`, `sql-optimizer`)
- **Role**: One-line description of the agent's purpose.
- **Capabilities**: What tools does it need? (File access, Web search, Database, etc.)

## 2. Scaffold Structure
Create the following file structure for your agent:

```bash
mkdir -p .agent/agents/[agent-name]
touch .agent/agents/[agent-name]/PROFILE.md
touch .agent/agents/[agent-name]/RULES.md
touch .agent/agents/[agent-name]/TOOLS.json
```

## 3. Define Persona (PROFILE.md)
Write a clear system prompt in `PROFILE.md`. Include:
- **Identity**: "You are [Role], an expert in..."
- **Tone**: Professional, terse, friendly, etc.
- **Constraints**: "Never delete files without asking."

## 4. Configure Rules (RULES.md)
List strict commandments the agent must follow.
- Coding standards (if coding agent)
- Security boundaries
- Communication style

## 5. Metadata Registration
If using a central registry (like `vibe-architect`), register the agent in `agents.json` or `MEMORY.md`.

## 6. Verification
Run a test prompt against the new agent to verify:
1. Use the /oneshot workflow with a specific task for this agent.
2. Check if it respects the RULES.md.
