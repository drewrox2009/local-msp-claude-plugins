# RepairShopr Plugin

Claude Code plugin for RepairShopr integration.

> This plugin is rebuilt from the in-repo Syncro MCP server because the APIs are closely related.
> Its MCP implementation now lives directly in this repository under `msp-claude-plugins/mcp-servers/repairshopr-mcp`.

## Overview

This plugin provides Claude with domain knowledge of RepairShopr, enabling:

- **Ticket Management** - Create, search, update, and manage service tickets
- **Customer Operations** - Customer and contact management
- **Asset Management** - Asset tracking and RMM integration
- **Invoice Management** - Invoice generation, payments, and billing

## Configuration

### Claude Code Settings (Recommended)

Add your credentials to `~/.claude/settings.json` (user scope, encrypted on macOS):

```json
{
  "env": {
    "REPAIRSHOPR_SUBDOMAIN": "acmemsp",
    "REPAIRSHOPR_API_KEY": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  }
}
```

For project-specific configuration, use `.claude/settings.local.json` (gitignored):

```json
{
  "env": {
    "REPAIRSHOPR_SUBDOMAIN": "acmemsp",
    "REPAIRSHOPR_API_KEY": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  }
}
```

### Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REPAIRSHOPR_SUBDOMAIN` | Yes | | Your RepairShopr subdomain (from `https://{subdomain}.repairshopr.com`) |
| `REPAIRSHOPR_API_KEY` | Yes | | API key from Admin > API Tokens |

## Local MCP Server

This fork uses local MCP server launches by default. The plugin manifest starts:

```json
{
  "mcpServers": {
    "repairshopr": {
      "command": "npx",
      "args": ["-y", "file:../mcp-servers/repairshopr-mcp"]
    }
  }
}
```

### Obtaining API Credentials

1. **Log into RepairShopr**
   - Navigate to your RepairShopr instance at `https://your-subdomain.repairshopr.com`

2. **Generate an API Token**
   - Go to **Admin > API Tokens**
   - Click **Create Token**
   - Give your token a descriptive name (e.g., "Claude Code Integration")
   - Copy the generated API key (it will only be shown once)

3. **Find Your Subdomain**
   - Your subdomain is the first part of your RepairShopr URL
   - Example: If your URL is `https://acmemsp.repairshopr.com`, your subdomain is `acmemsp`

### Testing Your Connection

Once configured in Claude Code settings, test the connection:

```bash
# Test connection (env vars injected by Claude Code)
curl -s "https://${REPAIRSHOPR_SUBDOMAIN}.repairshopr.com/api/v1/me?api_key=${REPAIRSHOPR_API_KEY}" | jq
```

## Installation

```bash
# Clone the repository
git clone https://github.com/drewrox2009/local-msp-claude-plugins.git

# Navigate to plugin
cd local-msp-claude-plugins/msp-claude-plugins/repairshopr

# Use with Claude Code
claude --plugin .
```

## Skills

| Skill | Description |
|-------|-------------|
| `tickets` | Service ticket management, statuses, timers |
| `customers` | Customer and contact management |
| `assets` | Asset tracking and RMM integration |
| `invoices` | Invoice generation and payments |
| `api-patterns` | RepairShopr API authentication, pagination, rate limits |

## Commands

| Command | Description |
|---------|-------------|
| `/create-ticket` | Create a new service ticket |
| `/search-tickets` | Search for tickets by criteria |

## API Reference

- **Base URL**: `https://{subdomain}.repairshopr.com/api/v1`
- **Auth**: API key passed as query parameter `api_key`
- **Rate Limit**: 180 requests per minute
- **Docs**: Check your RepairShopr account documentation and API token settings

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.
