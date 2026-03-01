---
description: >
  Use this skill when working with BetterStack uptime monitoring - managing
  monitors, responding to incidents, working with heartbeats, and updating
  status pages. Covers monitor configuration, pause/resume during maintenance,
  incident acknowledgment and resolution, heartbeat monitoring for scheduled
  jobs, and status page incident communication for MSP customer-facing pages.
triggers:
  - betterstack monitor
  - betterstack uptime
  - betterstack incident
  - betterstack heartbeat
  - betterstack status page
  - betterstack down
  - betterstack alert
  - betterstack check
  - betterstack availability
  - betterstack maintenance
  - betterstack pause monitor
  - monitor status betterstack
---

# BetterStack Uptime Monitoring

## Overview

BetterStack Uptime monitors websites, APIs, and services from 20+ global regions and pages on-call responders when checks fail. It also provides heartbeat monitoring for scheduled jobs (cron tasks, backup scripts) and public status pages for customer-facing incident communication. For MSPs, BetterStack Uptime is commonly used to monitor client infrastructure, with per-team monitor grouping for each customer.

## MCP Tools

### Monitor Tools

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `list_monitors` | List all monitors with current status | `per_page`, `page[after]` |
| `get_monitor` | Get monitor details and recent history | `id` (required) |
| `create_monitor` | Create a new uptime monitor | `url`, `monitor_type`, `check_frequency` |
| `update_monitor` | Update monitor settings | `id`, fields to change |
| `delete_monitor` | Delete a monitor | `id` |
| `pause_monitor` | Pause checking (maintenance window) | `id` |
| `resume_monitor` | Resume a paused monitor | `id` |

### Heartbeat Tools

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `list_heartbeats` | List all heartbeat monitors | `per_page`, `page[after]` |
| `get_heartbeat` | Get heartbeat details | `id` |
| `create_heartbeat` | Create a heartbeat monitor | `name`, `period`, `grace` |
| `update_heartbeat` | Update heartbeat settings | `id` |
| `delete_heartbeat` | Delete a heartbeat | `id` |

### Incident Tools

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `list_incidents` | List incidents with status filters | `per_page`, `page[after]` |
| `get_incident` | Get incident details and timeline | `id` |
| `acknowledge_incident` | Acknowledge an active incident | `id` |
| `resolve_incident` | Mark incident as resolved | `id` |

### Status Page Tools

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `list_status_pages` | List all status pages | `per_page` |
| `get_status_page` | Get status page details | `id` |
| `create_status_page` | Create a new status page | `subdomain`, `company_name` |
| `list_status_page_sections` | List sections and monitored resources | `status_page_id` |
| `create_status_page_incident` | Post a public incident update | `status_page_id`, `title`, `status` |

## Key Concepts

### Monitor Types

| Type | Description | Use Case |
|------|-------------|----------|
| `status` | HTTP/HTTPS check (returns 2xx) | Website availability |
| `expected_status_code` | HTTP check expecting specific code | API endpoint health |
| `keyword` | HTTP check + body keyword match | Content validation |
| `keyword_absence` | HTTP check + keyword must be absent | Error page detection |
| `ping` | ICMP ping check | Server reachability |
| `tcp` | TCP port check | Service port availability |
| `dns` | DNS record validation | Domain resolution |
| `smtp` | SMTP mail server check | Email server health |
| `pop` | POP3 check | Mail retrieval health |
| `imap` | IMAP check | Mail server health |
| `udp` | UDP port check | UDP service availability |

### Incident Lifecycle

| Status | Description |
|--------|-------------|
| `started` | Monitor failed; incident created; page sent |
| `acknowledged` | Responder acknowledged the page |
| `resolved` | Monitor recovered or manually resolved |

### Heartbeat Monitoring

Heartbeats detect **silent failures** — scheduled jobs that stop running without throwing errors (backup scripts, data pipelines, cron jobs). A heartbeat expects a ping at regular intervals; if the ping doesn't arrive within the grace period, an incident is created.

| Field | Description |
|-------|-------------|
| `period` | How often the job should ping (seconds) |
| `grace` | Extra time to wait before alerting (seconds) |
| `call` | Whether to call (phone) on miss |
| `sms` | Whether to SMS on miss |
| `email` | Whether to email on miss |

The scheduled job pings the heartbeat URL: `https://uptime.betterstack.com/api/v1/heartbeat/<token>`

### Status Page Incident Statuses

| Status | Description |
|--------|-------------|
| `investigating` | We're looking into it |
| `identified` | Root cause identified |
| `monitoring` | Fix deployed, watching |
| `resolved` | Issue resolved |

## Common Workflows

### Review All Monitor Health

1. Call `list_monitors` with `per_page=50`
2. Group monitors by `status`: `up`, `down`, `paused`, `pending`, `maintenance`
3. For each `down` monitor, call `get_monitor` for last check details
4. Check `list_incidents` for any active incidents tied to down monitors
5. Build a health summary: % uptime, monitors down, open incidents

### Respond to a Monitor Down Alert

1. Call `get_monitor` on the affected monitor — check `last_check_at`, `reason`, `ssl_expiry`
2. Call `list_incidents` filtered to this monitor
3. Call `acknowledge_incident` to pause escalation while investigating
4. If applicable, call `pause_monitor` to stop noise during maintenance
5. After resolution, call `resume_monitor` and `resolve_incident`

### Plan a Maintenance Window

1. Before maintenance: call `pause_monitor` on all monitors for the affected system
2. Optionally: call `create_status_page_incident` to communicate planned maintenance to customers
   - Status: `investigating` → switch to `resolved` when done
3. After maintenance: call `resume_monitor` on all paused monitors
4. Verify all monitors return to `up` status with `list_monitors`

### Check Heartbeat Health

1. Call `list_heartbeats` to see all scheduled job monitors
2. For any heartbeat with `status=down`, the scheduled job has missed its ping
3. Call `get_heartbeat` for the last ping time and failure reason
4. Investigate the scheduled job — check logs, cron status, server health

### Post a Status Page Update

When a customer-facing incident is ongoing:

1. Call `list_status_pages` to find the relevant customer status page
2. Call `create_status_page_incident` with:
   - `title`: brief description of the issue
   - `status`: `investigating` initially
   - `message`: customer-facing impact description
3. As the incident progresses, post updates with status changes:
   - `identified` when root cause is known
   - `monitoring` when fix is deployed
   - `resolved` when service is fully restored

## Field Reference

### Monitor Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Monitor identifier |
| `attributes.url` | string | Monitored URL or host |
| `attributes.monitor_type` | string | Check type (status, ping, tcp, etc.) |
| `attributes.status` | string | up / down / paused / pending |
| `attributes.uptime` | float | Uptime % over reporting period |
| `attributes.check_frequency` | integer | Check interval in seconds |
| `attributes.last_check_at` | datetime | When the last check ran |
| `attributes.reason` | string | Why the last check failed (if down) |
| `attributes.ssl_expiry` | datetime | SSL certificate expiry (if applicable) |

### Incident Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Incident identifier |
| `attributes.started_at` | datetime | When the incident started |
| `attributes.resolved_at` | datetime | When it was resolved |
| `attributes.cause` | string | Reason the monitor failed |
| `attributes.monitor_id` | string | Which monitor triggered this |

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| 401 | Invalid token | Verify token at Better Stack → API tokens |
| 404 | Monitor/incident not found | List resources to find valid IDs |
| 422 | Invalid monitor config | Check URL format, monitor_type values |
| 429 | Rate limited | Back off and retry |

## Best Practices

1. **Use heartbeats for all scheduled jobs** — Silent failures (backups, sync jobs) are caught before they cause data loss
2. **Pause monitors before maintenance** — Prevents false incidents and unnecessary on-call pages
3. **Post status page updates promptly** — Even "investigating" status reduces inbound customer contact
4. **Group monitors by client team** — BetterStack teams map cleanly to MSP customer accounts
5. **Set realistic check frequencies** — 30-second checks for critical services; 3-minute for low-priority
6. **Use keyword checks for application health** — HTTP 200 alone doesn't confirm your app is working

## Related Skills

- [On-Call Management](../oncall/SKILL.md) — Escalation policies, schedule management
- [API Patterns](../api-patterns/SKILL.md) — Auth, full tool reference, pagination
