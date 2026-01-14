---
description: Quick start guide to install and configure Claude Code with AIBlueprint.
---

Quick start guide to install and configure Claude Code with AIBlueprint.

## Quick Start

The fastest way to set up Claude Code with pre-configured commands, agents, and security features:

BASH

```
# Install using aiblueprint-cli
bunx aiblueprint-cli@latest claude-code setup
```

This interactive setup will install all necessary configurations to enhance your Claude Code experience.

## Installation Methods

### Option 1: Plugin Installation (Recommended)

Install AIBlueprint as a Claude Code plugin:

BASH

```
# Add the AIBlueprint marketplace
/plugin marketplace add melvynx/aiblueprint

# Install the base plugin
/plugin install aibp-base@AIBlueprint

# Or install directly from GitHub
/plugin install github:melvynx/aiblueprint
```

**What you get:**

*   16 Custom Commands
*   3 Specialized Agents
*   Security Hooks
*   Custom Statusline
*   Notification Sounds

### Option 2: CLI Tool Installation

For more control over installation:

BASH

```
# Run immediately without installation
bunx aiblueprint-cli@latest claude-code setup

# Or install globally
npm install -g aiblueprint-cli
aiblueprint claude-code setup
```

**CLI Options:**

*   `--skip`: Install all features without prompts
*   `--folder <path>`: Install to custom directory
*   `--claudeCodeFolder <path>`: Specify Claude Code config folder

## What Gets Installed

### Directory Structure

Claude Code configurations are organized in the `~/.claude/` directory:

```
~/.claude/
├── commands/           # Slash commands (/commit, /create-pr, etc.)
├── agents/            # Specialized AI agents
├── skills/            # Complex workflows with multiple steps
├── hooks/             # Event-triggered automation
├── scripts/           # Utility scripts and tools
└── settings.json      # Main configuration file
```

### Base Features

**Commands** - Quick slash commands for common tasks:

*   `/commit` - Fast conventional commits with immediate push
*   `/create-pull-request` - Auto-generated PR creation
*   `/fix-pr-comments` - Systematic PR review resolution
*   More available in the [Configuration Guide](/docs/claude-code-configuration)

**Agents** - Specialized AI for specific tasks:

*   `action` - Conditional action executor
*   `explore-codebase` - Comprehensive code discovery
*   `explore-docs` - Documentation research
*   `websearch` - Quick web research

**Security** - Protection against dangerous operations:

*   Command validation before execution
*   Safe path verification
*   Real-time security logging
*   Learn more in the [Security Guide](/docs/claude-code-security)

## Plugin Management

If you installed via plugin marketplace:

BASH

```
# List installed plugins
/plugin list

# Update plugin to latest version
/plugin update aibp-base

# Remove plugin
/plugin uninstall aibp-base

# View marketplace plugins
/plugin marketplace list
```

## Shell Shortcuts

Add convenient shortcuts to your shell:

BASH

```
# cc - Claude Code with permissions skipped
cc

# ccc - Claude Code with continue mode
ccc
```

These are automatically added to:

*   macOS: `.zshenv`
*   Linux: `.bashrc` or `.zshrc`

## Claude Code Pro

Unlock advanced features with **Claude Code Pro** for enhanced productivity and exclusive content.

### Premium Features

*   ✨ **Advanced Statusline** - Enhanced git info, real-time costs, and token usage tracking
*   🚀 **Premium Commands** - Exclusive workflow automation templates (42 commands)
*   🤖 **Premium Agents** - Specialized AI agents for complex tasks (8 agents)
*   🎯 **Premium Skills** - Advanced workflows and methodologies (12 skills)
*   📦 **Priority Updates** - Get new features first
*   💬 **Priority Support** - Direct help when you need it

### Quick Start

BASH

```
# 1. Get your token at https://mlv.sh/claude-cli

# 2. Activate your subscription
aiblueprint claude-code pro activate YOUR_TOKEN

# 3. Install premium configurations
aiblueprint claude-code pro setup

# 4. Keep updated (use weekly)
aiblueprint claude-code pro sync
```

[Learn more about Claude Code Pro →](/docs/claude-code-pro)

## Usage Examples

### Example 1: Quick Commit and Push

BASH

```
# In Claude Code chat
/commit
```

This will:

1.  Run `git status` and `git diff`
2.  Analyze changes
3.  Create a conventional commit message
4.  Add files and commit
5.  Push to remote

### Example 2: Create Pull Request

BASH

```
# In Claude Code chat
/create-pull-request
```

This will:

1.  Check branch status
2.  Analyze all commits
3.  Generate PR title and description
4.  Push branch if needed
5.  Create PR via `gh` CLI

### Example 3: Watch CI Pipeline

BASH

```
# In Claude Code chat
/watch-ci
```

This will:

1.  Monitor CI pipeline status
2.  Detect failures
3.  Pull logs and analyze errors
4.  Fix issues locally
5.  Commit and push fixes
6.  Repeat until CI passes

## Troubleshooting

### Commands Not Found

Ensure configurations are installed:

BASH

```
# Check if .claude directory exists
ls ~/.claude/commands

# Reinstall if needed
bunx aiblueprint-cli@latest claude-code setup
```

### Hooks Not Working

Verify hooks are registered in `settings.json`:

BASH

```
# Check settings
cat ~/.claude/settings.json

# Reinstall hooks
bunx aiblueprint-cli@latest claude-code add hook post-edit-typescript
```

### Statusline Not Showing

Check statusline configuration:

BASH

```
# Reinstall statusline
bunx aiblueprint-cli@latest claude-code statusline

# Test statusline script
bun ~/.claude/scripts/statusline/src/index.ts
```

### Permission Errors

Some commands may require elevated permissions:

BASH

```
# Add sudo if needed
sudo bunx aiblueprint-cli@latest claude-code setup
```

## Requirements

### System Requirements

*   **Runtime**: Node.js 16+ or Bun
*   **Platform**: macOS (full support), Linux (partial), Windows (limited)
*   **Dependencies**: Git (for repository detection)

### Claude Code Requirements

*   **Claude Code**: Latest version installed
*   **Permissions**: Ability to modify `~/.claude/settings.json`

### Optional Dependencies

*   **bun**: Enhanced script execution and hooks
*   **ccusage**: Advanced statusline with cost tracking
*   **gh CLI**: GitHub integration for PR/issue commands
*   **prettier**, **eslint**: TypeScript hook functionality

## Next Steps

*   [Configuration Guide](/docs/claude-code-configuration) - Detailed component configuration
*   [Security Guide](/docs/claude-code-security) - Security features and validation
*   [Claude Code Pro](/docs/claude-code-pro) - Upgrade to premium features
*   [Creating Skills](/docs/claude-code-pro/create-skills-workflow) - Build custom workflows

## Resources

*   **Repository**: [melvynx/aiblueprint](https://github.com/melvynx/aiblueprint)
*   **Documentation**: [AIBlueprint Docs](https://docs.aiblueprint.dev)
*   **Issues**: [GitHub Issues](https://github.com/melvynx/aiblueprint/issues)
*   **Premium**: [Upgrade to Premium](https://mlv.sh/claude-cli)

[Documentation](/docs)[Claude Code Configuration](/docs/claude-code-configuration)
