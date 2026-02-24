---
name: subscription-status
description: Check subscription status for a company in Pax8
arguments:
  - name: company
    description: Company name or ID to check subscriptions for
    required: true
  - name: status
    description: Filter by subscription status (Active, Cancelled, PendingManual, all)
    required: false
    default: Active
  - name: product
    description: Filter by product name (partial match)
    required: false
---

# Check Pax8 Subscription Status

View subscription status and details for a specific company. Shows active licenses, seat counts, billing terms, and renewal dates.

## Prerequisites

- Valid Pax8 OAuth2 credentials configured (`PAX8_CLIENT_ID`, `PAX8_CLIENT_SECRET`)
- Active bearer token (auto-refreshed)
- Company must exist in Pax8

## Steps

1. **Authenticate** with Pax8 OAuth2 if token is expired

   ```bash
   TOKEN=$(curl -s -X POST https://login.pax8.com/oauth/token \
     -H "Content-Type: application/json" \
     -d '{
       "client_id": "'$PAX8_CLIENT_ID'",
       "client_secret": "'$PAX8_CLIENT_SECRET'",
       "audience": "api://p8p.client",
       "grant_type": "client_credentials"
     }' | jq -r '.access_token')
   ```

2. **Resolve company** - Find the company by name or ID

   ```bash
   # If a name was provided, search for it
   curl -s "https://api.pax8.com/v1/companies?page=0&size=200&sort=name,ASC" \
     -H "Authorization: Bearer $TOKEN"
   ```

3. **Fetch subscriptions** for the company

   ```bash
   curl -s "https://api.pax8.com/v1/subscriptions?companyId=COMPANY_ID&status=Active&page=0&size=200" \
     -H "Authorization: Bearer $TOKEN"
   ```

4. **Enrich with product names** by looking up product details

   ```bash
   curl -s "https://api.pax8.com/v1/products/PRODUCT_ID" \
     -H "Authorization: Bearer $TOKEN"
   ```

5. **Format and return results** with subscription details

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| company | string | Yes | - | Company name or UUID |
| status | string | No | Active | Status filter (Active, Cancelled, PendingManual, PendingCancel, all) |
| product | string | No | - | Product name filter (partial match) |

## Examples

### Check All Active Subscriptions

```
/subscription-status --company "Acme Corp"
```

### Check Specific Product

```
/subscription-status --company "Acme Corp" --product "Microsoft 365"
```

### Check All Statuses

```
/subscription-status --company "Acme Corp" --status all
```

### Check Pending Subscriptions

```
/subscription-status --company "Acme Corp" --status PendingManual
```

### Check by Company ID

```
/subscription-status --company "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

## Output

### Active Subscriptions

```
Subscription Status for: Acme Corporation
================================================================

Active Subscriptions: 6
Total Monthly Cost: $2,847.50

+--------------------------------------------+------+----------+--------+-----------+------------+
| Product                                    | Qty  | Term     | Price  | Monthly   | Renewal    |
+--------------------------------------------+------+----------+--------+-----------+------------+
| Microsoft 365 Business Premium             | 25   | Annual   | $17.10 | $427.50   | 2026-05-31 |
| Microsoft 365 Business Basic               | 10   | Annual   | $5.40  | $54.00    | 2026-05-31 |
| Exchange Online Plan 1                     | 5    | Monthly  | $3.60  | $18.00    | -          |
| Microsoft Defender for Business            | 25   | Monthly  | $2.70  | $67.50    | -          |
| SentinelOne Singularity Control            | 40   | Annual   | $4.50  | $180.00   | 2026-08-15 |
| Acronis Cyber Protect Cloud                | 500  | Monthly  | $4.20  | $2,100.00 | -          |
+--------------------------------------------+------+----------+--------+-----------+------------+

Upcoming Renewals (next 30 days):
  None

Quick Actions:
  - Modify seats: Adjust quantity on any subscription above
  - View history: Check subscription change history
  - Place order: /create-order --company "Acme Corporation"
================================================================
```

### All Statuses

```
Subscription Status for: Acme Corporation (All Statuses)
================================================================

+--------------------------------------------+------+-------------------+-----------+
| Product                                    | Qty  | Status            | Monthly   |
+--------------------------------------------+------+-------------------+-----------+
| Microsoft 365 Business Premium             | 25   | Active            | $427.50   |
| Microsoft 365 Business Basic               | 10   | Active            | $54.00    |
| Exchange Online Plan 1                     | 5    | Active            | $18.00    |
| Microsoft Defender for Business            | 25   | Active            | $67.50    |
| SentinelOne Singularity Control            | 40   | Active            | $180.00   |
| Acronis Cyber Protect Cloud                | 500  | Active            | $2,100.00 |
| Dropbox Business Advanced                  | 15   | Cancelled         | -         |
| Webroot SecureAnywhere                     | 30   | Cancelled         | -         |
| Azure Reserved Instance                    | 1    | PendingManual     | TBD       |
+--------------------------------------------+------+-------------------+-----------+

Summary:
  Active: 6 subscriptions ($2,847.50/month)
  Cancelled: 2 subscriptions
  Pending: 1 subscription

================================================================
```

### Single Product Filter

```
/subscription-status --company "Acme Corp" --product "Microsoft"

Subscription Status for: Acme Corporation (filtered: "Microsoft")
================================================================

Microsoft Subscriptions: 4
Total Monthly Cost: $567.00

+--------------------------------------------+------+----------+--------+-----------+
| Product                                    | Qty  | Term     | Price  | Monthly   |
+--------------------------------------------+------+----------+--------+-----------+
| Microsoft 365 Business Premium             | 25   | Annual   | $17.10 | $427.50   |
| Microsoft 365 Business Basic               | 10   | Annual   | $5.40  | $54.00    |
| Exchange Online Plan 1                     | 5    | Monthly  | $3.60  | $18.00    |
| Microsoft Defender for Business            | 25   | Monthly  | $2.70  | $67.50    |
+--------------------------------------------+------+----------+--------+-----------+

Total Microsoft seats: 65
================================================================
```

### No Subscriptions Found

```
No active subscriptions found for "New Client Inc"

Possible reasons:
  - Company has no subscriptions yet
  - All subscriptions may be cancelled
  - Company name may not match exactly

Suggestions:
  - Check all statuses: /subscription-status --company "New Client Inc" --status all
  - Verify company name: Search in Pax8 portal
  - Place an order: /create-order --company "New Client Inc"
```

### Company Not Found

```
Company not found: "Unknown Corp"

Suggestions:
  - Check spelling of the company name
  - Try a partial name match
  - Use the company UUID directly
  - Verify the company exists in Pax8
```

## Subscription States Reference

| State | Description |
|-------|-------------|
| Active | Live and billing |
| Cancelled | Terminated |
| PendingManual | Awaiting vendor provisioning |
| PendingAutomated | Auto-provisioning in progress |
| PendingCancel | Cancellation in progress |
| WaitingForDetails | Needs more information |
| Trial | Free trial active |
| Converted | Trial converted to paid |
| ActivePendingChange | Change being processed |

## Error Handling

### Authentication Error

```
Error: Unable to authenticate with Pax8 API

Check PAX8_CLIENT_ID and PAX8_CLIENT_SECRET environment variables.
```

### Rate Limit

```
Error: Rate limit exceeded (429)

Please wait a moment and try again.
The Pax8 API allows 1000 requests per minute.
```

### API Error

```
Error connecting to Pax8 API

Possible causes:
  - Network connectivity issue
  - Pax8 API may be experiencing issues
  - Check https://status.pax8.com for service status

Retry or check configuration.
```

## Related Commands

- `/search-products` - Find products to add to a company
- `/create-order` - Place a new order for a company
- `/license-summary` - View licenses across all companies
