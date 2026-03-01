---
description: >
  Use this skill when working with BetterStack MCP tools - authentication,
  hosted MCP connection details, complete tool reference across 8 categories
  (monitoring, on-call, incidents, status pages, telemetry, dashboards, error
  tracking), cursor-based pagination, tool filtering headers, and rate limits.
  BetterStack covers Uptime and Telemetry products in a single MCP server.
triggers:
  - betterstack api
  - betterstack mcp
  - betterstack token
  - betterstack authentication
  - betterstack tools
  - betterstack connection
  - betterstack pagination
  - betterstack rate limit
  - betterstack credentials
  - betterstack uptime api
  - betterstack telemetry api
---

# BetterStack MCP Tools & API Patterns

## Overview

BetterStack provides an official hosted MCP server at `mcp.betterstack.com` covering three products in one server: **Uptime** (monitors, on-call, incidents, status pages), **Telemetry** (logs, metrics, ClickHouse SQL, dashboards), and **Error Tracking** (exceptions, releases). When accessed through the MCP Gateway, the Bearer token is injected automatically.

The server supports tool allowlist/blocklist filtering via gateway-injected headers — useful for restricting tenant access to specific product areas.

## Authentication

### Header Format

```
Authorization: Bearer <api-token>
```

### Token Types

| Token Type | Scope | Where to Generate |
|------------|-------|-------------------|
| **Global API Token** | All products, all teams | Better Stack → API tokens → Global API tokens |
| **Uptime API Token** | Uptime product only, team-scoped | Better Stack → API tokens → (select team) → Uptime API tokens |

Use the **Global API Token** for full MCP access across Uptime, Telemetry, and Error Tracking.

### How the Gateway Injects Credentials

The MCP Gateway stores your token as an org credential and automatically forwards:

```
Authorization: Bearer <stored-api-token>
```

## Tool Filtering (Gateway Feature)

BetterStack's MCP server supports per-request tool filtering via custom headers. The gateway can inject these to restrict access per tenant:

```
X-MCP-Tools-Only: list_monitors,get_monitor,list_incidents
X-MCP-Tools-Except: create_monitor,delete_monitor,update_monitor
```

This is useful for giving read-only access to certain teams without building separate credentials.

## Complete MCP Tool Reference (8 categories)

### Monitoring Tools

| Tool | Description |
|------|-------------|
| `list_monitors` | List all monitors with status and uptime metrics |
| `get_monitor` | Get monitor details (URL, threshold, check interval) |
| `create_monitor` | Create a new uptime monitor |
| `update_monitor` | Update monitor settings |
| `delete_monitor` | Delete a monitor |
| `pause_monitor` | Pause monitoring (during maintenance) |
| `resume_monitor` | Resume a paused monitor |

### Heartbeat Monitoring

| Tool | Description |
|------|-------------|
| `list_heartbeats` | List all heartbeats |
| `get_heartbeat` | Get heartbeat details |
| `create_heartbeat` | Create a heartbeat monitor |
| `update_heartbeat` | Update heartbeat settings |
| `delete_heartbeat` | Delete a heartbeat |

### Incident Management

| Tool | Description |
|------|-------------|
| `list_incidents` | List incidents with status and severity filters |
| `get_incident` | Get incident details |
| `create_incident` | Create a manual incident |
| `acknowledge_incident` | Acknowledge an active incident |
| `resolve_incident` | Resolve an incident |

### On-Call Scheduling

| Tool | Description |
|------|-------------|
| `list_on_call_schedules` | List all on-call schedules |
| `get_on_call_schedule` | Get schedule details with rotation |
| `create_on_call_schedule` | Create a new schedule |
| `update_on_call_schedule` | Update schedule settings |
| `delete_on_call_schedule` | Delete a schedule |
| `list_schedule_policies` | List escalation/notification policies |

### Status Pages

| Tool | Description |
|------|-------------|
| `list_status_pages` | List all status pages |
| `get_status_page` | Get status page details |
| `create_status_page` | Create a new status page |
| `update_status_page` | Update status page settings |
| `list_status_page_sections` | List sections on a status page |
| `create_status_page_incident` | Post an incident update to status page |

### Query Execution (Telemetry)

| Tool | Description |
|------|-------------|
| `execute_query` | Run ClickHouse SQL against log/metric data |
| `list_saved_queries` | List saved query templates |
| `get_saved_query` | Get a saved query |

### Dashboards (Telemetry)

| Tool | Description |
|------|-------------|
| `list_dashboards` | List all dashboards |
| `get_dashboard` | Get dashboard details and panels |
| `create_dashboard` | Create a new dashboard |
| `list_dashboard_panels` | List panels on a dashboard |

### Applications (Error Tracking)

| Tool | Description |
|------|-------------|
| `list_applications` | List error tracking applications |
| `get_application` | Get application error tracking details |
| `list_releases` | List application releases |
| `create_release` | Register a new release (for error tracking) |

## Pagination

BetterStack uses cursor-based pagination:

| Parameter | Description |
|-----------|-------------|
| `per_page` | Results per page (max 50) |
| `page[after]` | Cursor from previous response to fetch next page |

**Pattern:**
1. Call tool with `per_page=50`
2. Check `pagination.next` in response — if present, it contains the cursor URL
3. Extract the `page[after]` cursor and pass to the next call
4. Continue until `pagination.next` is null

## Error Handling

| HTTP Code | Cause | Resolution |
|-----------|-------|------------|
| 401 | Invalid token | Verify token; check it's a Global or Uptime API token |
| 403 | Token lacks permissions | Global token needed for Telemetry/Error Tracking |
| 404 | Resource not found | Verify ID with a list call |
| 422 | Validation error | Check required fields in the request |
| 429 | Rate limited | Back off 30 seconds; retry |
| 503 | BetterStack maintenance | Check status.betterstack.com |

## Best Practices

1. **Use Global API Token** — Required for Telemetry and Error Tracking tools; Uptime-only tokens return 403 on those endpoints
2. **Use `X-MCP-Tools-Only` header** — Restrict tenants to only the tools they need
3. **Paginate large monitor lists** — Large accounts can have hundreds of monitors
4. **Prefer ClickHouse SQL for log analysis** — `execute_query` is more powerful than browsing the UI for log patterns
5. **Pause monitors during maintenance** — Prevents false-positive incident creation and on-call pages

## Related Skills

- [Uptime Monitoring](../uptime/SKILL.md) — Monitors, heartbeats, incidents, status pages
- [On-Call Management](../oncall/SKILL.md) — Schedules, escalation, incident workflows
