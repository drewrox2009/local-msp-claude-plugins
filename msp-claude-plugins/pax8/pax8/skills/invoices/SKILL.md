---
description: >
  Use this skill when working with Pax8 invoices and billing - retrieving
  invoices, viewing line items, reconciling billing with client charges,
  analyzing usage summaries, and understanding the MSP billing cycle.
  Covers invoice retrieval, invoice items, usage-based billing, and
  billing reconciliation workflows.
triggers:
  - pax8 invoice
  - pax8 billing
  - pax8 cost
  - pax8 charge
  - pax8 usage
  - billing reconciliation
  - invoice items
  - pax8 payment
  - cost analysis
  - billing report
  - usage summary
---

# Pax8 Invoices & Billing

## Overview

Invoices in Pax8 represent the MSP's cost for cloud subscriptions procured through the marketplace. Pax8 generates invoices on a regular billing cycle, detailing the charges for each subscription across all client companies. MSPs use invoice data to reconcile their costs against what they charge their clients, ensuring profitability and catching billing discrepancies. Invoice items break down charges per subscription, making it possible to attribute costs to specific clients and products.

## Key Concepts

### Billing Model

Pax8 operates as a distributor between vendors and MSPs:

```
Vendor (Microsoft, etc.) --> Pax8 (Distributor) --> MSP (Partner) --> End Client
```

- **Pax8 invoices the MSP** for all subscriptions across all clients
- **MSP invoices each client** at their own markup/margin
- **Reconciliation** ensures the MSP is charging clients correctly for what Pax8 bills

### Invoice Structure

| Level | Description |
|-------|-------------|
| Invoice | A billing statement for a billing period |
| Invoice Item | A line item for a specific subscription charge |
| Usage Summary | Consumption details for usage-based products (e.g., Azure) |

### Invoice Statuses

| Status | Description |
|--------|-------------|
| `Unpaid` | Invoice issued, payment not yet received |
| `Paid` | Invoice has been paid |
| `Void` | Invoice has been voided/cancelled |
| `Overdue` | Payment past due date |
| `PartiallyPaid` | Partial payment received |

### Billing Reconciliation

The core MSP workflow for invoices:

1. **Receive Pax8 invoice** with charges for all client subscriptions
2. **Break down by client** using invoice items and company IDs
3. **Compare against PSA billing** to ensure clients are being charged correctly
4. **Identify discrepancies** where Pax8 charges do not match client billing
5. **Adjust** client invoices or subscription quantities as needed

## Field Reference

### Invoice Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Invoice unique identifier |
| `invoiceDate` | date | Date the invoice was issued |
| `dueDate` | date | Payment due date |
| `status` | string | Invoice status (Unpaid, Paid, etc.) |
| `total` | decimal | Total invoice amount |
| `balance` | decimal | Remaining unpaid balance |
| `currency` | string | Currency code (e.g., "USD") |
| `companyId` | UUID | Company associated with the invoice |
| `partnerName` | string | MSP partner name |

### Invoice Item Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Invoice item unique identifier |
| `invoiceId` | UUID | Parent invoice ID |
| `subscriptionId` | UUID | Associated subscription ID |
| `productId` | UUID | Associated product ID |
| `companyId` | UUID | Company charged |
| `quantity` | decimal | Quantity billed |
| `unitPrice` | decimal | Price per unit |
| `subtotal` | decimal | Line item subtotal |
| `description` | string | Charge description |
| `startDate` | date | Billing period start |
| `endDate` | date | Billing period end |
| `chargeType` | string | Type of charge (e.g., "Recurring", "Prorated") |

### Usage Summary Fields

| Field | Type | Description |
|-------|------|-------------|
| `subscriptionId` | UUID | Associated subscription |
| `resourceGroup` | string | Resource group name |
| `quantity` | decimal | Usage quantity |
| `unitOfMeasure` | string | Unit of measurement |
| `currentCharges` | decimal | Charges for this period |
| `date` | date | Usage reporting date |

## API Patterns

### List Invoices

```http
GET /v1/invoices
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**With Filters:**

```http
GET /v1/invoices?status=Unpaid
GET /v1/invoices?companyId=a1b2c3d4-e5f6-7890-abcd-ef1234567890
GET /v1/invoices?invoiceDate=2026-02-01
```

**With Pagination:**

```http
GET /v1/invoices?page=0&size=50&sort=invoiceDate,DESC
```

### curl Examples

```bash
# List recent invoices
curl -s "https://api.pax8.com/v1/invoices?page=0&size=50&sort=invoiceDate,DESC" \
  -H "Authorization: Bearer $TOKEN"

# Filter by status
curl -s "https://api.pax8.com/v1/invoices?status=Unpaid&page=0&size=50" \
  -H "Authorization: Bearer $TOKEN"

# Filter by company
curl -s "https://api.pax8.com/v1/invoices?companyId=a1b2c3d4-e5f6-7890-abcd-ef1234567890" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Single Invoice

```http
GET /v1/invoices/i1n2v3o4-i5c6-7890-abcd-ef1234567890
Authorization: Bearer YOUR_TOKEN
```

```bash
curl -s "https://api.pax8.com/v1/invoices/i1n2v3o4-i5c6-7890-abcd-ef1234567890" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**

```json
{
  "id": "i1n2v3o4-i5c6-7890-abcd-ef1234567890",
  "invoiceDate": "2026-02-01",
  "dueDate": "2026-03-03",
  "status": "Unpaid",
  "total": 4527.50,
  "balance": 4527.50,
  "currency": "USD",
  "partnerName": "Acme MSP"
}
```

### Get Invoice Items

```http
GET /v1/invoices/i1n2v3o4-i5c6-7890-abcd-ef1234567890/items
Authorization: Bearer YOUR_TOKEN
```

```bash
curl -s "https://api.pax8.com/v1/invoices/i1n2v3o4-i5c6-7890-abcd-ef1234567890/items?page=0&size=200" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**

```json
{
  "page": {
    "size": 200,
    "totalElements": 45,
    "totalPages": 1,
    "number": 0
  },
  "content": [
    {
      "id": "it1e2m3a4-b5c6-7890-abcd-ef1234567890",
      "invoiceId": "i1n2v3o4-i5c6-7890-abcd-ef1234567890",
      "subscriptionId": "s1u2b3s4-c5r6-7890-abcd-ef1234567890",
      "productId": "f9e8d7c6-b5a4-3210-fedc-ba0987654321",
      "companyId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "description": "Microsoft 365 Business Premium",
      "quantity": 25,
      "unitPrice": 17.10,
      "subtotal": 427.50,
      "chargeType": "Recurring",
      "startDate": "2026-02-01",
      "endDate": "2026-02-28"
    }
  ]
}
```

### Get Usage Summaries

```http
GET /v1/usage-summaries
Authorization: Bearer YOUR_TOKEN
```

```bash
curl -s "https://api.pax8.com/v1/usage-summaries?page=0&size=200" \
  -H "Authorization: Bearer $TOKEN"
```

## Common Workflows

### Monthly Billing Reconciliation

The most important MSP billing workflow:

```javascript
async function monthlyReconciliation(invoiceId) {
  // Step 1: Get the invoice
  const invoiceRes = await pax8Client.request(`/invoices/${invoiceId}`);
  const invoice = await invoiceRes.json();

  // Step 2: Get all invoice items
  let allItems = [];
  let page = 0;
  let totalPages = 1;

  while (page < totalPages) {
    const itemsRes = await pax8Client.request(
      `/invoices/${invoiceId}/items?page=${page}&size=200`
    );
    const data = await itemsRes.json();
    allItems.push(...data.content);
    totalPages = data.page.totalPages;
    page++;
  }

  // Step 3: Group by company
  const byCompany = {};
  for (const item of allItems) {
    if (!byCompany[item.companyId]) {
      byCompany[item.companyId] = {
        companyId: item.companyId,
        items: [],
        total: 0
      };
    }
    byCompany[item.companyId].items.push(item);
    byCompany[item.companyId].total += item.subtotal;
  }

  // Step 4: Enrich with company names
  for (const companyId of Object.keys(byCompany)) {
    const companyRes = await pax8Client.request(`/companies/${companyId}`);
    const company = await companyRes.json();
    byCompany[companyId].companyName = company.name;
    await sleep(50); // Rate limit awareness
  }

  return {
    invoiceId: invoice.id,
    invoiceDate: invoice.invoiceDate,
    invoiceTotal: invoice.total,
    companyBreakdown: Object.values(byCompany).sort((a, b) => b.total - a.total)
  };
}
```

### Cost-per-Client Report

```javascript
async function costPerClientReport() {
  // Get recent invoices
  const invoicesRes = await pax8Client.request(
    '/invoices?page=0&size=10&sort=invoiceDate,DESC'
  );
  const invoices = await invoicesRes.json();

  if (invoices.content.length === 0) {
    return { message: 'No invoices found' };
  }

  // Use the most recent invoice
  const latestInvoice = invoices.content[0];
  return await monthlyReconciliation(latestInvoice.id);
}
```

### Margin Analysis

```javascript
async function marginAnalysis(invoiceId) {
  const reconciliation = await monthlyReconciliation(invoiceId);

  // For each company, calculate what you could charge vs. what Pax8 charges you
  for (const company of reconciliation.companyBreakdown) {
    for (const item of company.items) {
      // Get suggested retail price for comparison
      const pricingRes = await pax8Client.request(
        `/products/${item.productId}/pricing`
      );
      const pricing = await pricingRes.json();

      const retailPrice = pricing.content.find(
        p => p.billingTerm === 'Monthly' || p.billingTerm === 'Annual'
      )?.suggestedRetailPrice;

      item.suggestedRetail = retailPrice;
      item.retailSubtotal = item.quantity * (retailPrice || item.unitPrice);
      item.potentialMargin = item.retailSubtotal - item.subtotal;
      item.marginPercent = retailPrice
        ? ((retailPrice - item.unitPrice) / retailPrice * 100).toFixed(1) + '%'
        : 'N/A';

      await sleep(100); // Rate limit
    }

    company.totalRetail = company.items.reduce((sum, i) => sum + (i.retailSubtotal || 0), 0);
    company.totalMargin = company.totalRetail - company.total;
  }

  return reconciliation;
}
```

### Invoice Trend Analysis

```javascript
async function invoiceTrend(monthsBack = 6) {
  let allInvoices = [];
  let page = 0;
  let totalPages = 1;

  while (page < totalPages) {
    const response = await pax8Client.request(
      `/invoices?page=${page}&size=200&sort=invoiceDate,DESC`
    );
    const data = await response.json();
    allInvoices.push(...data.content);
    totalPages = data.page.totalPages;
    page++;
  }

  // Filter to recent months
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - monthsBack);

  const recent = allInvoices.filter(inv => new Date(inv.invoiceDate) >= cutoff);

  // Group by month
  const byMonth = {};
  for (const inv of recent) {
    const month = inv.invoiceDate.substring(0, 7); // YYYY-MM
    if (!byMonth[month]) {
      byMonth[month] = { month, total: 0, invoiceCount: 0 };
    }
    byMonth[month].total += inv.total;
    byMonth[month].invoiceCount++;
  }

  return Object.values(byMonth).sort((a, b) => a.month.localeCompare(b.month));
}
```

### Unpaid Invoice Alert

```javascript
async function checkUnpaidInvoices() {
  let allUnpaid = [];
  let page = 0;
  let totalPages = 1;

  while (page < totalPages) {
    const response = await pax8Client.request(
      `/invoices?status=Unpaid&page=${page}&size=200`
    );
    const data = await response.json();
    allUnpaid.push(...data.content);
    totalPages = data.page.totalPages;
    page++;
  }

  const today = new Date();
  const overdue = allUnpaid.filter(inv => new Date(inv.dueDate) < today);
  const upcoming = allUnpaid.filter(inv => new Date(inv.dueDate) >= today);

  return {
    totalUnpaid: allUnpaid.reduce((sum, inv) => sum + inv.balance, 0),
    overdueCount: overdue.length,
    overdueTotal: overdue.reduce((sum, inv) => sum + inv.balance, 0),
    upcomingCount: upcoming.length,
    upcomingTotal: upcoming.reduce((sum, inv) => sum + inv.balance, 0),
    overdueInvoices: overdue.map(inv => ({
      id: inv.id,
      date: inv.invoiceDate,
      dueDate: inv.dueDate,
      total: inv.total,
      balance: inv.balance
    }))
  };
}
```

## Error Handling

### Common API Errors

| Code | Message | Resolution |
|------|---------|------------|
| 401 | Unauthorized | Token expired; re-authenticate |
| 404 | Invoice not found | Verify invoice UUID |
| 404 | Invoice items not found | Invoice may not have items yet |

### No Invoice Data

```javascript
async function safeGetInvoice(invoiceId) {
  try {
    const response = await pax8Client.request(`/invoices/${invoiceId}`);
    if (response.status === 404) {
      return { error: 'Invoice not found', id: invoiceId };
    }
    return await response.json();
  } catch (error) {
    return { error: error.message, id: invoiceId };
  }
}
```

## Endpoint Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/invoices` | GET | List invoices with filters |
| `/v1/invoices/{id}` | GET | Get invoice details |
| `/v1/invoices/{id}/items` | GET | Get invoice line items |
| `/v1/usage-summaries` | GET | Get usage summaries |

## Best Practices

1. **Reconcile monthly** - Compare Pax8 invoices to client billing every billing cycle
2. **Break down by client** - Use invoice items to attribute costs per company
3. **Track margins** - Compare partner buy price to what you charge clients
4. **Monitor trends** - Track month-over-month billing changes
5. **Catch discrepancies early** - Automated reconciliation catches billing errors
6. **Watch for prorated charges** - Mid-cycle subscription changes create prorated line items
7. **Usage-based products** - Azure and similar products have variable billing; monitor usage summaries
8. **Archive invoices** - Keep historical invoice data for financial reporting
9. **Automate alerts** - Set up notifications for overdue invoices
10. **Cross-reference with PSA** - Match Pax8 invoice items to PSA agreement line items

## Related Skills

- [Pax8 API Patterns](../api-patterns/SKILL.md) - Authentication and API reference
- [Pax8 Subscriptions](../subscriptions/SKILL.md) - Subscription details for invoice items
- [Pax8 Companies](../companies/SKILL.md) - Company attribution for billing
- [Pax8 Products](../products/SKILL.md) - Product pricing for margin analysis
- [Pax8 Orders](../orders/SKILL.md) - Order-to-invoice tracking
