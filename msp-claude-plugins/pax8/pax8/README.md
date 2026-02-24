# Pax8 Plugin

Claude Code plugin for the Pax8 cloud marketplace platform integration.

## Overview

This plugin provides Claude with deep knowledge of Pax8, enabling:

- **Company Management** - Manage MSP client companies within the Pax8 marketplace
- **Product Catalog** - Search and browse the cloud software catalog (Microsoft 365, Azure, security tools, backup, etc.)
- **Subscription Lifecycle** - Provision, modify, and cancel cloud subscriptions for clients
- **Order Management** - Place orders for new products and track provisioning status
- **Invoice & Billing** - Reconcile Pax8 invoices with client billing

## Prerequisites

### API Credentials

You need Pax8 OAuth2 client credentials with appropriate permissions:

1. Log into the Pax8 Partner Portal at [app.pax8.com](https://app.pax8.com)
2. Navigate to Settings > Developer > API Credentials
3. Create a new application and note the Client ID and Client Secret
4. Configure allowed scopes for your integration needs

### Environment Variables

Set the following environment variables:

```bash
export PAX8_CLIENT_ID="your-client-id"
export PAX8_CLIENT_SECRET="your-client-secret"
```

## Installation

1. Clone this plugin to your Claude plugins directory
2. Configure environment variables
3. The MCP server will be automatically started when needed

### Official MCP Server

Pax8 provides a production-ready MCP server integrated into the platform at `app.pax8.com/integrations/mcp`. This plugin adds MSP-specific skills and workflow knowledge on top of the official server.

## Available Skills

| Skill | Description |
|-------|-------------|
| `api-patterns` | Pax8 API authentication, pagination, error handling, and best practices |
| `companies` | Company (client) management in the Pax8 marketplace |
| `products` | Cloud product catalog search and pricing |
| `subscriptions` | Subscription lifecycle management (provision, modify, cancel) |
| `orders` | Order creation, tracking, and provisioning status |
| `invoices` | Invoice retrieval, billing reconciliation, and usage summaries |

## Available Commands

| Command | Description |
|---------|-------------|
| `/search-products` | Search the Pax8 product catalog by name or vendor |
| `/subscription-status` | Check subscription status for a company |
| `/create-order` | Place an order for a product subscription |
| `/license-summary` | Aggregate license counts and costs across all clients |

## Quick Start

### Search for a Product

```
/search-products "Microsoft 365 Business Premium"
```

### Check Subscription Status

```
/subscription-status --company "Acme Corp"
```

### Place an Order

```
/create-order --company "Acme Corp" --product "Microsoft 365 Business Premium" --quantity 25
```

### Generate License Summary

```
/license-summary
```

## Security Considerations

### OAuth2 Credentials

- Never commit client secrets to version control
- Use environment variables for all credentials
- Rotate client secrets periodically
- Use minimum required scopes for your integration
- Store tokens securely; they expire after a set duration

### API Key Security

- Client credentials grant full partner-level access
- Audit API usage regularly in the Pax8 portal
- Restrict application scopes to only what is needed
- Monitor for unexpected API activity

## API Rate Limits

Pax8 enforces rate limits:

- 1000 successful calls per minute

The plugin automatically handles rate limiting with exponential backoff.

## Troubleshooting

### Authentication Errors

If you see "401 Unauthorized":
1. Verify `PAX8_CLIENT_ID` and `PAX8_CLIENT_SECRET` are set correctly
2. Check that the credentials have not been revoked
3. Confirm the OAuth2 token has not expired (re-authenticate)
4. Verify the application has the required scopes

### Token Expiry

If API calls suddenly fail after working:
1. The bearer token has likely expired
2. Request a new token from `https://login.pax8.com/oauth/token`
3. Update the Authorization header with the new token

### Rate Limiting

If you see "429 Too Many Requests":
1. Wait for the rate limit window to reset (1 minute)
2. Reduce the frequency of requests
3. Use pagination to reduce total call count

### Resource Not Found

If you see "404 Not Found":
1. Verify the resource ID exists
2. Check that the base URL is `https://api.pax8.com/v1/`
3. Confirm the endpoint path is correct

## API Documentation

- [Pax8 API Documentation](https://docs.pax8.com)
- [Pax8 Partner Portal](https://app.pax8.com)
- [Pax8 MCP Integration](https://app.pax8.com/integrations/mcp)

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

All contributions require a PRD in the `prd/` directory before implementation.

## Changelog

### 0.1.0 (2026-02-23)

- Initial release
- 6 skills: api-patterns, companies, products, subscriptions, orders, invoices
- 4 commands: search-products, subscription-status, create-order, license-summary
