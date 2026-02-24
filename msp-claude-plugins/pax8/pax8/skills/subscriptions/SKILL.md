---
description: >
  Use this skill when working with Pax8 subscriptions - provisioning new
  cloud licenses, modifying seat counts, cancelling subscriptions, checking
  subscription status, reviewing change history, and optimizing license
  usage across MSP clients. Covers the full subscription lifecycle including
  all subscription states and quantity management.
triggers:
  - pax8 subscription
  - pax8 license
  - pax8 seat
  - pax8 provision
  - pax8 cancel
  - subscription management
  - license management
  - seat count
  - pax8 activate
  - license optimization
  - subscription lifecycle
  - subscription status
---

# Pax8 Subscription Lifecycle Management

## Overview

Subscriptions in Pax8 represent active cloud product licenses assigned to a client company. When an order is placed and provisioned, it creates a subscription. Subscriptions are the core ongoing entity that MSPs manage -- adjusting seat counts as clients hire or leave, upgrading plans, or cancelling when a product is no longer needed. Every subscription is tied to a company and a product, with a quantity (seat count), billing term, and status.

## Key Concepts

### Subscription Lifecycle

```
Order Placed --> Provisioning --> Active --> [Modify/Cancel] --> Cancelled
                     |                          |
                 PendingManual            ActivePendingChange
                 PendingAutomated         PendingCancel
                 WaitingForDetails
```

### Subscription States

| State | Description |
|-------|-------------|
| `Active` | Subscription is live and billing |
| `Cancelled` | Subscription has been terminated |
| `PendingManual` | Awaiting manual provisioning by vendor |
| `PendingAutomated` | Automated provisioning in progress |
| `PendingCancel` | Cancellation request submitted, not yet complete |
| `WaitingForDetails` | Additional information needed for provisioning |
| `Trial` | Free trial period active |
| `Converted` | Trial converted to paid subscription |
| `ActivePendingChange` | Active but a modification is being processed |

### Billing Terms

| Term | Description | Commitment |
|------|-------------|------------|
| Monthly | Month-to-month | Cancel anytime |
| Annual | 12-month commitment | Locked for 12 months |
| Triennial | 3-year commitment | Locked for 3 years |

### Quantity Management

The `quantity` field represents the number of licenses (seats, devices, or units depending on the product). Changing quantity triggers a billing adjustment:

- **Increase**: Additional seats are prorated for the current billing period
- **Decrease**: Seat reduction may be restricted by vendor commitment terms
- **Annual plans**: Seat decreases may only be allowed at renewal

## Field Reference

### Subscription Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Subscription unique identifier |
| `companyId` | UUID | Associated company ID |
| `productId` | UUID | Associated product ID |
| `quantity` | integer | Number of licenses/seats |
| `startDate` | date | Subscription start date |
| `endDate` | date | Subscription end date (for commitments) |
| `createdDate` | datetime | When the subscription was created |
| `billingStart` | date | When billing begins |
| `status` | string | Current subscription state |
| `billingTerm` | string | Billing term (Monthly, Annual) |
| `price` | decimal | Current unit price |
| `commitmentTermId` | UUID | Commitment term identifier |

### Usage Summary Fields

| Field | Type | Description |
|-------|------|-------------|
| `subscriptionId` | UUID | Associated subscription |
| `resourceGroup` | string | Usage resource group |
| `quantity` | decimal | Usage quantity |
| `unitOfMeasure` | string | Usage unit |
| `currentCharges` | decimal | Charges for this period |
| `date` | date | Usage date |

## API Patterns

### List Subscriptions

```http
GET /v1/subscriptions
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**With Filters:**

```http
GET /v1/subscriptions?companyId=a1b2c3d4-e5f6-7890-abcd-ef1234567890
GET /v1/subscriptions?status=Active
GET /v1/subscriptions?companyId=a1b2c3d4&status=Active
GET /v1/subscriptions?productId=f9e8d7c6-b5a4-3210-fedc-ba0987654321
```

**With Pagination:**

```http
GET /v1/subscriptions?page=0&size=200&sort=createdDate,DESC
GET /v1/subscriptions?companyId=a1b2c3d4&page=0&size=100
```

### curl Examples

```bash
# List all active subscriptions
curl -s "https://api.pax8.com/v1/subscriptions?status=Active&page=0&size=200" \
  -H "Authorization: Bearer $TOKEN"

# List subscriptions for a specific company
curl -s "https://api.pax8.com/v1/subscriptions?companyId=a1b2c3d4-e5f6-7890-abcd-ef1234567890&status=Active" \
  -H "Authorization: Bearer $TOKEN"

# Get all subscriptions sorted by creation date
curl -s "https://api.pax8.com/v1/subscriptions?page=0&size=200&sort=createdDate,DESC" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Single Subscription

```http
GET /v1/subscriptions/s1u2b3s4-c5r6-7890-abcd-ef1234567890
Authorization: Bearer YOUR_TOKEN
```

```bash
curl -s "https://api.pax8.com/v1/subscriptions/s1u2b3s4-c5r6-7890-abcd-ef1234567890" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**

```json
{
  "id": "s1u2b3s4-c5r6-7890-abcd-ef1234567890",
  "companyId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "productId": "f9e8d7c6-b5a4-3210-fedc-ba0987654321",
  "quantity": 25,
  "startDate": "2025-06-01",
  "endDate": "2026-05-31",
  "createdDate": "2025-05-28T14:30:00.000Z",
  "billingStart": "2025-06-01",
  "status": "Active",
  "billingTerm": "Annual",
  "price": 17.10
}
```

### Modify Subscription (Change Quantity)

```http
PUT /v1/subscriptions/s1u2b3s4-c5r6-7890-abcd-ef1234567890
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```

```json
{
  "quantity": 30,
  "billingTerm": "Annual"
}
```

```bash
curl -s -X PUT "https://api.pax8.com/v1/subscriptions/s1u2b3s4-c5r6-7890-abcd-ef1234567890" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 30, "billingTerm": "Annual"}'
```

### Cancel Subscription

```http
DELETE /v1/subscriptions/s1u2b3s4-c5r6-7890-abcd-ef1234567890
Authorization: Bearer YOUR_TOKEN
```

```bash
curl -s -X DELETE "https://api.pax8.com/v1/subscriptions/s1u2b3s4-c5r6-7890-abcd-ef1234567890" \
  -H "Authorization: Bearer $TOKEN"
```

**Note:** Cancellation may transition the subscription to `PendingCancel` before it becomes `Cancelled`. Annual subscriptions may not allow mid-term cancellation.

### Get Subscription History

```http
GET /v1/subscriptions/s1u2b3s4-c5r6-7890-abcd-ef1234567890/history
Authorization: Bearer YOUR_TOKEN
```

```bash
curl -s "https://api.pax8.com/v1/subscriptions/s1u2b3s4-c5r6-7890-abcd-ef1234567890/history" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Subscription Usage Summaries

```http
GET /v1/subscriptions/s1u2b3s4-c5r6-7890-abcd-ef1234567890/usage-summaries
Authorization: Bearer YOUR_TOKEN
```

```bash
curl -s "https://api.pax8.com/v1/subscriptions/s1u2b3s4-c5r6-7890-abcd-ef1234567890/usage-summaries" \
  -H "Authorization: Bearer $TOKEN"
```

## Common Workflows

### License Optimization Across All Clients

This is one of the most valuable MSP workflows -- finding unused or underutilized licenses:

```javascript
async function findOptimizationOpportunities() {
  const companies = await fetchAllResources('/companies');
  const opportunities = [];

  for (const company of companies) {
    const subsResponse = await pax8Client.request(
      `/subscriptions?companyId=${company.id}&status=Active&page=0&size=200`
    );
    const subsData = await subsResponse.json();

    for (const sub of subsData.content) {
      // Flag subscriptions with quantity of 1 or very low counts
      // compared to similar products at other clients
      opportunities.push({
        companyName: company.name,
        companyId: company.id,
        subscriptionId: sub.id,
        productId: sub.productId,
        quantity: sub.quantity,
        billingTerm: sub.billingTerm,
        price: sub.price,
        monthlyCost: sub.quantity * sub.price,
        startDate: sub.startDate,
        endDate: sub.endDate
      });
    }

    // Respect rate limits
    await sleep(100);
  }

  // Sort by monthly cost descending to surface biggest savings opportunities
  return opportunities.sort((a, b) => b.monthlyCost - a.monthlyCost);
}
```

### Modify Subscription Quantity

```javascript
async function adjustSeats(subscriptionId, newQuantity) {
  // First, get current subscription to validate
  const currentRes = await pax8Client.request(`/subscriptions/${subscriptionId}`);
  const current = await currentRes.json();

  if (current.status !== 'Active') {
    throw new Error(`Cannot modify subscription in ${current.status} state`);
  }

  console.log(`Changing ${current.productId} from ${current.quantity} to ${newQuantity} seats`);

  const response = await pax8Client.request(`/subscriptions/${subscriptionId}`, {
    method: 'PUT',
    body: JSON.stringify({
      quantity: newQuantity,
      billingTerm: current.billingTerm
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to modify subscription: ${error.message}`);
  }

  return await response.json();
}
```

### Subscription Status Report by Company

```javascript
async function subscriptionReport(companyId) {
  const companyRes = await pax8Client.request(`/companies/${companyId}`);
  const company = await companyRes.json();

  const subsResponse = await pax8Client.request(
    `/subscriptions?companyId=${companyId}&page=0&size=200`
  );
  const subsData = await subsResponse.json();

  const report = {
    companyName: company.name,
    totalSubscriptions: subsData.page.totalElements,
    byStatus: {},
    totalMonthlyCost: 0,
    subscriptions: []
  };

  for (const sub of subsData.content) {
    // Count by status
    report.byStatus[sub.status] = (report.byStatus[sub.status] || 0) + 1;

    // Calculate cost for active subscriptions
    if (sub.status === 'Active') {
      const monthlyCost = sub.quantity * sub.price;
      report.totalMonthlyCost += monthlyCost;
    }

    report.subscriptions.push({
      id: sub.id,
      productId: sub.productId,
      quantity: sub.quantity,
      status: sub.status,
      billingTerm: sub.billingTerm,
      price: sub.price,
      monthlyCost: sub.quantity * sub.price,
      startDate: sub.startDate,
      endDate: sub.endDate
    });
  }

  return report;
}
```

### Renewal Management

```javascript
async function findUpcomingRenewals(daysAhead = 30) {
  const allSubscriptions = await fetchAllResources('/subscriptions');
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

  const renewals = allSubscriptions
    .filter(sub => {
      if (sub.status !== 'Active' || !sub.endDate) return false;
      const endDate = new Date(sub.endDate);
      return endDate <= cutoffDate && endDate >= new Date();
    })
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

  // Enrich with company names
  const companyCache = {};
  for (const sub of renewals) {
    if (!companyCache[sub.companyId]) {
      const companyRes = await pax8Client.request(`/companies/${sub.companyId}`);
      companyCache[sub.companyId] = await companyRes.json();
    }
    sub.companyName = companyCache[sub.companyId].name;
  }

  return renewals;
}
```

### Bulk Subscription Inventory

```javascript
async function fullSubscriptionInventory() {
  const companies = await fetchAllResources('/companies');
  const inventory = [];

  for (const company of companies) {
    const subsResponse = await pax8Client.request(
      `/subscriptions?companyId=${company.id}&status=Active&page=0&size=200`
    );
    const subsData = await subsResponse.json();

    for (const sub of subsData.content) {
      inventory.push({
        companyName: company.name,
        companyId: company.id,
        subscriptionId: sub.id,
        productId: sub.productId,
        quantity: sub.quantity,
        status: sub.status,
        billingTerm: sub.billingTerm,
        unitPrice: sub.price,
        monthlyCost: sub.quantity * sub.price,
        startDate: sub.startDate,
        endDate: sub.endDate
      });
    }

    await sleep(100); // Rate limit awareness
  }

  return inventory;
}
```

## Error Handling

### Common API Errors

| Code | Message | Resolution |
|------|---------|------------|
| 400 | Invalid quantity | Quantity must be within product min/max range |
| 400 | Cannot decrease seats on annual plan | Annual plans restrict mid-term decreases |
| 401 | Unauthorized | Token expired; re-authenticate |
| 404 | Subscription not found | Verify subscription UUID |
| 409 | Subscription already cancelled | Cannot modify a cancelled subscription |
| 409 | Change already pending | Wait for the current change to complete |
| 422 | Validation failed | Check field values and product constraints |

### State Transition Errors

| Current State | Attempted Action | Error |
|---------------|-----------------|-------|
| Cancelled | Modify quantity | Cannot modify cancelled subscription |
| PendingCancel | Modify quantity | Cannot modify during cancellation |
| PendingManual | Cancel | Cannot cancel during provisioning |
| ActivePendingChange | Modify quantity | Wait for current change to complete |

### Error Recovery Pattern

```javascript
async function safeModifySubscription(subscriptionId, newQuantity) {
  const current = await pax8Client.request(`/subscriptions/${subscriptionId}`);
  const sub = await current.json();

  // Pre-validate state
  const modifiableStates = ['Active'];
  if (!modifiableStates.includes(sub.status)) {
    return {
      success: false,
      error: `Cannot modify subscription in ${sub.status} state. ` +
             `Wait for pending operations to complete.`
    };
  }

  try {
    const response = await pax8Client.request(`/subscriptions/${subscriptionId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity: newQuantity, billingTerm: sub.billingTerm })
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    return { success: true, data: await response.json() };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## Endpoint Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/subscriptions` | GET | List subscriptions with filters |
| `/v1/subscriptions/{id}` | GET | Get subscription details |
| `/v1/subscriptions/{id}` | PUT | Update subscription (change quantity) |
| `/v1/subscriptions/{id}` | DELETE | Cancel subscription |
| `/v1/subscriptions/{id}/history` | GET | Get change history |
| `/v1/subscriptions/{id}/usage-summaries` | GET | Get usage data |

## Best Practices

1. **Check state before modifying** - Always verify the subscription is in `Active` state before making changes
2. **Understand commitment terms** - Annual subscriptions restrict quantity decreases
3. **Track all changes** - Use the history endpoint to audit subscription modifications
4. **Optimize regularly** - Review subscriptions monthly to find unused licenses
5. **Use company filter** - Always filter by `companyId` when checking a specific client's subscriptions
6. **Monitor pending states** - Subscriptions in pending states need attention
7. **Plan renewals** - Track end dates and plan renewal conversations with clients
8. **Batch modifications** - When adjusting multiple subscriptions, respect rate limits
9. **Document changes** - Note why quantities were changed in your PSA or documentation
10. **Verify after modification** - Re-fetch the subscription after PUT to confirm the change took effect

## Related Skills

- [Pax8 API Patterns](../api-patterns/SKILL.md) - Authentication and API reference
- [Pax8 Companies](../companies/SKILL.md) - Company management
- [Pax8 Products](../products/SKILL.md) - Product catalog and pricing
- [Pax8 Orders](../orders/SKILL.md) - Creating new subscriptions via orders
- [Pax8 Invoices](../invoices/SKILL.md) - Billing for subscriptions
