---
description: >
  Use this skill when working with BetterStack on-call scheduling - listing
  and managing on-call schedules, reviewing escalation and notification policies,
  understanding who is currently on-call, and responding to active incidents
  via the on-call flow. Covers list_on_call_schedules, get_on_call_schedule,
  list_schedule_policies, and incident acknowledgment/resolution tools.
triggers:
  - betterstack oncall
  - betterstack on-call
  - betterstack schedule
  - betterstack rotation
  - betterstack escalation policy
  - betterstack notification policy
  - betterstack who is on call
  - betterstack paging
  - betterstack responder
  - betterstack shift
  - betterstack override
---

# BetterStack On-Call Management

## Overview

BetterStack Uptime includes integrated on-call scheduling that determines who gets paged when a monitor fails. Schedules define rotation patterns, and notification/escalation policies define how and when responders are alerted (via phone, SMS, email, or push). For MSPs, BetterStack on-call is commonly configured per customer team, with separate schedules for each client's SLA requirements.

## MCP Tools

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `list_on_call_schedules` | List all on-call schedules | `per_page`, `page[after]` |
| `get_on_call_schedule` | Get schedule details and current on-call | `id` |
| `create_on_call_schedule` | Create a new schedule | `name`, `time_zone` |
| `update_on_call_schedule` | Update schedule settings | `id` |
| `delete_on_call_schedule` | Delete a schedule | `id` |
| `list_schedule_policies` | List notification/escalation policies | `per_page` |
| `acknowledge_incident` | Acknowledge an active incident | `id` |
| `resolve_incident` | Mark incident as resolved | `id` |

## Key Concepts

### Schedule Structure

BetterStack schedules define:
- **Members** — Responders in the rotation
- **Rotation** — Daily, weekly, or custom patterns
- **Time zone** — Critical for follow-the-sun setups
- **Start date** — When the rotation begins

### Notification (Escalation) Policies

Policies define the alert cascade when a monitor goes down:

| Step | Description |
|------|-------------|
| 1 | Page the on-call schedule via phone, SMS, email, push |
| 2 (after timeout) | Escalate to a secondary schedule or individual |
| 3 (after timeout) | Escalate to team manager or broader group |

Unlike PagerDuty, BetterStack calls these "notification policies" rather than "escalation policies", but they serve the same purpose.

### Integration with Monitors

Monitors are linked to notification policies at creation time. When a monitor goes down:
1. BetterStack creates an incident
2. The monitor's notification policy fires
3. On-call responders are paged in sequence
4. If acknowledged, escalation stops
5. If not acknowledged within the timeout, the next tier is paged

## Common Workflows

### Find Who Is Currently On-Call

1. Call `list_on_call_schedules` to get all schedules
2. Call `get_on_call_schedule` for each relevant schedule
3. Check the `current_shift` field — shows who is currently on-call and when their shift ends
4. For MSP use: filter schedules by team to find the on-call person for a specific customer account

### Review Escalation Policy Coverage

1. Call `list_schedule_policies` to see all notification policies
2. For each policy, review the escalation steps:
   - Tier 1: who gets paged first and via what channels
   - Tier 2: escalation timeout and who is next
   - Tier 3: final escalation (manager, team-wide broadcast)
3. Verify no step has a deleted or empty schedule assignment

### On-Call Handoff

Before transitioning between on-call shifts:

1. Call `list_incidents` with `status=acknowledged` to find any open, active incidents
2. For each open incident, call `get_incident` to get current status
3. Check the responsible monitor with `get_monitor` for the affected service
4. Brief the incoming responder on: what monitor is down, what was tried, current status
5. The incoming responder runs `acknowledge_incident` if they are taking ownership

### Maintenance Window On-Call Coordination

During planned maintenance:

1. Use `pause_monitor` (see uptime skill) to prevent false pages during the window
2. Notify the on-call team via `create_status_page_incident` for any customer-facing work
3. After maintenance, `resume_monitor` on all paused monitors
4. Verify no stale incidents remain open with `list_incidents`

## Field Reference

### Schedule Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Schedule identifier |
| `attributes.name` | string | Schedule name |
| `attributes.time_zone` | string | Time zone (e.g., "America/New_York") |
| `attributes.current_shift` | object | Current on-call user and shift end |
| `attributes.next_shift` | object | Upcoming on-call user and shift start |

### Policy Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Policy identifier |
| `attributes.name` | string | Policy name |
| `attributes.steps` | array | Escalation steps with timeouts and targets |

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| 401 | Invalid token | Use Global API token; Uptime token scope insufficient |
| 404 | Schedule not found | List schedules to verify ID |
| 422 | Invalid schedule config | Check time_zone format and member IDs |

## Best Practices

1. **Use one schedule per customer team** — Maps cleanly to MSP client accounts in BetterStack teams
2. **Set reasonable escalation timeouts** — 5 minutes for Tier 1, 10 minutes for Tier 2 is a common MSP standard
3. **Always have a Tier 2 and Tier 3** — Single-tier policies cause missed incidents if the primary is unavailable
4. **Review current_shift before major changes** — Confirm the right person is on-call before planned work
5. **Coordinate with monitor pause/resume** — Always pair maintenance windows with schedule awareness to avoid false pages

## Related Skills

- [Uptime Monitoring](../uptime/SKILL.md) — Monitors, incidents, heartbeats, status pages
- [API Patterns](../api-patterns/SKILL.md) — Auth, complete tool reference, pagination
