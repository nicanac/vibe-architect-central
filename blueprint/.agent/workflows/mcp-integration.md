---
description: detailed guide for adding and configuring new Model Context Protocol (MCP) servers.
---

# MCP Integration Workflow

This workflow helps you integrate new MCP servers to extend your agent's capabilities.

## 1. Discovery
1. Identify the need (e.g., "Access GitHub", "Query PostgreSQL").
2. Search for existing MCP servers (Context7, Smithery, GitHub).

## 2. Configuration
Add the server to your agent's configuration file (usually `mcp_config.json` or `.cursor/mcp.json`).

```json
{
  "mcpServers": {
    "my-new-server": {
      "command": "npx",
      "args": ["-y", "@org/mcp-server-name"],
      "env": {
        "API_KEY": "..."
      }
    }
  }
}
```

## 3. Environment Setup
1. Add required API keys to `.env` or your secure storage.
2. **Never** commit API keys to git.

## 4. Verification
1. Restart the agent environment.
2. Run `list_tools` to verify the new server's tools are visible.
3. Call a simple tool (e.g., `list_tables` or `get_user`) to test connectivity.

## 5. Documentation
Update `MEMORY.md` or `pinecode.md` with:
- The name of the new MCP server.
- Key tools it provides.
- usage examples.
