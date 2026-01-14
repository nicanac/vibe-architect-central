---
description: Security features, command validation, and protection against dangerous operations in Claude Code.
---

Security features, command validation, and protection against dangerous operations in Claude Code.

## Overview

Claude Code includes a comprehensive security system to protect against dangerous operations while maintaining flexibility for legitimate development tasks.

## Command Validation System

The security system protects against dangerous operations through real-time command analysis and validation.

### Blocked Commands

The following command patterns are blocked or restricted:

#### Destructive Operations

**File System Destruction:**

*   `rm -rf` with critical paths (/, /usr, /etc, /System, etc.)
*   `dd` - Direct disk operations
*   `mkfs` - File system creation
*   `fdisk` - Disk partitioning

**Example blocked commands:**

BASH

```
rm -rf /
rm -rf /usr/local
dd if=/dev/zero of=/dev/sda
```

#### Permission Changes

**Dangerous Permission Modifications:**

*   `chmod 777` - World-writable permissions
*   `chmod -R 777` - Recursive world-writable
*   `chown -R root` - Recursive ownership changes
*   `chgrp -R` - Recursive group changes

**Example blocked commands:**

BASH

```
chmod 777 /etc/passwd
chmod -R 777 /var
chown -R root:root /home
```

#### Remote Execution

**Piped Remote Scripts:**

*   `curl | bash` - Download and execute
*   `wget | sh` - Download and execute
*   `curl | sudo bash` - Execute with privilege

**Example blocked commands:**

BASH

```
curl https://example.com/script.sh | bash
wget -O - https://example.com/install.sh | sudo sh
```

#### Privilege Escalation

**Sudo Operations:**

*   `sudo rm -rf` - Destructive with privilege
*   `sudo chmod 777` - Permission changes with privilege
*   `sudo dd` - Disk operations with privilege

**Example blocked commands:**

BASH

```
sudo rm -rf /var
sudo chmod -R 777 /etc
```

### Safe Paths

The following paths are considered safe and allowed:

**Relative Paths:**

*   `./` - Current directory
*   `../` - Parent directory
*   `./node_modules/` - Project dependencies

**Home Directory:**

*   `~/` - User home directory
*   `~/.cache/` - User cache
*   `~/.local/` - User local files

**Common Safe Directories:**

*   `node_modules/` - Package dependencies
*   `.git/` - Git repository files
*   `tmp/` - Temporary files
*   `dist/` - Build output
*   `build/` - Build output

**Example allowed commands:**

BASH

```
rm -rf ./dist
rm -rf node_modules/
rm -rf ~/.cache/claude-code
trash ~/Downloads/old-file.txt
```

### Alternative Commands

Use safer alternatives when available:

Dangerous

Safe Alternative

Description

`rm -rf`

`trash`

Move to trash instead of permanent deletion

`sudo`

File permissions

Adjust file permissions instead

`curl | bash`

Download then review

Download, review, then execute

`chmod 777`

Specific permissions

Use 755, 644, or minimal needed permissions

## Security Logging

All blocked commands are logged to `~/.claude/security.log` for audit purposes.

### Log Format

JSON

```
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "command": "rm -rf /",
  "severity": "CRITICAL",
  "action": "BLOCKED",
  "reason": "Destructive command with critical path"
}
```

### Log Levels

Severity

Description

Example

`CRITICAL`

System-destroying operations

`rm -rf /`

`HIGH`

Dangerous privilege escalation

`sudo chmod 777`

`MEDIUM`

Risky operations

`chmod -R 777 ./`

`LOW`

Suspicious patterns

`curl | bash`

### Viewing Logs

BASH

```
# View all security logs
cat ~/.claude/security.log

# View recent logs
tail -n 20 ~/.claude/security.log

# Search for specific command
grep "rm -rf" ~/.claude/security.log

# View critical alerts only
jq 'select(.severity == "CRITICAL")' ~/.claude/security.log
```

## Hook-Based Protection

Security is enforced through PreToolUse hooks that run before command execution.

### How It Works

1.  **Command Submission** - User or AI submits a bash command
2.  **Hook Trigger** - PreToolUse hook intercepts the command
3.  **Validation** - Command validator script analyzes the command
4.  **Pattern Matching** - Checks against 50+ security patterns
5.  **Path Analysis** - Validates target paths
6.  **Decision** - ALLOW, BLOCK, or REQUEST CONFIRMATION
7.  **Execution** - Command runs only if approved

### Configuration

Security hooks are configured in `~/.claude/settings.json`:

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
    ]
  }
}
```

### Validation Script

The command validator (`~/.claude/scripts/validate-command.js`) is a 700+ line security system that:

*   Parses bash commands and arguments
*   Detects dangerous patterns
*   Validates file paths
*   Checks for privilege escalation
*   Logs security events
*   Provides user confirmations

## User Confirmation

For questionable commands, the system requests user confirmation:

### Interactive Prompts

BASH

```
⚠️  WARNING: Potentially dangerous command detected

Command: rm -rf ./important-folder/

Reason: Recursive deletion in current directory
Risk Level: MEDIUM

Do you want to proceed? (y/N):
```

### Bypass Options

For legitimate operations, you can:

1.  **Confirm the prompt** - Type 'y' to proceed
2.  **Use safer alternatives** - Use `trash` instead of `rm -rf`
3.  **Adjust the command** - Make the command more specific
4.  **Disable temporarily** - (Not recommended in production)

## Security Best Practices

### Command Safety

1.  **Use trash instead of rm -rf** - Recoverable deletion
2.  **Specify exact paths** - Avoid wildcards in destructive commands
3.  **Test in safe environments** - Use Docker or VMs for risky operations
4.  **Review before executing** - Read commands before confirming
5.  **Limit sudo usage** - Use only when absolutely necessary

### File Permissions

1.  **Use minimal permissions** - 644 for files, 755 for directories
2.  **Avoid world-writable** - Never use 777
3.  **Check ownership** - Ensure correct user/group ownership
4.  **Use umask** - Set default permissions appropriately

### Remote Scripts

1.  **Download first** - Never pipe directly to bash
2.  **Review code** - Read scripts before executing
3.  **Verify source** - Use HTTPS and trusted sources
4.  **Use checksums** - Verify file integrity
5.  **Sandbox execution** - Test in containers first

## Advanced Security

### Custom Security Rules

You can add custom security rules to the validator:

JAVASCRIPT

```
// ~/.claude/scripts/custom-security.js
export const customRules = [
  {
    pattern: /dangerous-command/,
    severity: 'HIGH',
    reason: 'Custom dangerous command detected'
  }
];
```

### Whitelist Patterns

For commands you frequently use:

JAVASCRIPT

```
// ~/.claude/scripts/whitelist.js
export const whitelist = [
  /^npm install/,
  /^git push/,
  /^docker run/
];
```

### Security Notifications

Set up notifications for blocked commands:

JSON

```
{
  "security": {
    "notifications": {
      "enabled": true,
      "sound": "~/.claude/sounds/alert.mp3",
      "slack": "https://hooks.slack.com/..."
    }
  }
}
```

## Troubleshooting

### Legitimate Commands Blocked

If a safe command is blocked:

1.  **Check the path** - Ensure it's not targeting system directories
2.  **Use absolute paths** - Be explicit about the target
3.  **Review the pattern** - Understand why it was flagged
4.  **Contact support** - Report false positives

### Security Hook Not Working

Verify the hook is active:

BASH

```
# Check settings
cat ~/.claude/settings.json | jq '.hooks.PreToolUse'

# Test the validator
bun ~/.claude/scripts/validate-command.js "rm -rf test"

# Reinstall hooks
bunx aiblueprint-cli@latest claude-code add hook command-validator
```

### Disabling Security (Not Recommended)

Only for development environments:

JSON

```
{
  "hooks": {
    "PreToolUse": []
  }
}
```

**Warning:** Disabling security removes all protections. Use with extreme caution.

## Security Updates

The security system is regularly updated with:

*   New dangerous command patterns
*   Improved path validation
*   Enhanced detection algorithms
*   Additional security rules

### Keeping Updated

BASH

```
# Update CLI
npm update -g aiblueprint-cli

# Update security scripts
bunx aiblueprint-cli@latest claude-code update --security-only

# Check for updates
bunx aiblueprint-cli@latest claude-code version
```

## Next Steps

*   [Configuration Guide](/docs/claude-code-configuration) - Configure hooks and scripts
*   [Command Validator Script](/docs/claude-code-pro/script-command-validator) - Deep dive into validation
*   [Creating Hooks](/docs/claude-code-pro/create-hooks) - Build custom security hooks
*   [Claude Code Pro](/docs/claude-code-pro) - Advanced security features

## Resources

*   **Security Log**: `~/.claude/security.log`
*   **Validator Script**: `~/.claude/scripts/validate-command.js`
*   **Issue Reporting**: [GitHub Issues](https://github.com/melvynx/aiblueprint/issues)

[Claude Code Configuration](/docs/claude-code-configuration)[Cheatsheet](/docs/claude-code-pro/cheatsheet)
