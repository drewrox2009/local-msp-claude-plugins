---
description: >
  Use this skill when placing orders in Pax8 - creating new product
  orders for client companies, tracking provisioning status, understanding
  order line items, and managing the order-to-subscription workflow.
  Covers order creation, status tracking, and provisioning timelines.
triggers:
  - pax8 order
  - pax8 purchase
  - pax8 provision
  - pax8 buy
  - place order pax8
  - order status
  - order tracking
  - new subscription order
  - pax8 ordering
---

# Pax8 Order Management

## Overview

Orders in Pax8 are the mechanism for provisioning new cloud subscriptions for client companies. When an MSP needs to set up a new product for a client -- whether it is Microsoft 365 licenses, a security tool, or backup solution -- they create an order. The order contains one or more line items, each specifying a product, quantity, and billing term. Once submitted, the order is processed and, upon successful provisioning, creates one or more subscriptions.

## Key Concepts

### Order Lifecycle

```
Create Order --> Processing --> Provisioning --> Completed --> Subscription Created
                                    |
                               PendingManual
                               (vendor action needed)
```

### Order States

| State | Description |
|-------|-------------|
| `Submitted` | Order received and being processed |
| `Processing` | Order is being provisioned |
| `Completed` | Order fulfilled; subscriptions created |
| `Failed` | Order could not be provisioned |
| `PendingApproval` | Awaiting MSP approval (self-service orders) |
| `Cancelled` | Order was cancelled before completion |

### Line Items

Each order contains one or more line items. Each line item corresponds to a single product:

| Concept | Description |
|---------|-------------|
| Product | The cloud software being ordered |
| Quantity | Number of seats/licenses |
| Billing Term | Monthly, Annual, or Triennial |
| Provision Start Date | When the subscription should begin |

### Order-to-Subscription Flow

1. **MSP creates an order** with line items for one or more products
2. **Pax8 processes the order** and initiates provisioning with the vendor
3. **Provisioning completes** (automated: seconds/minutes; manual: hours/days)
4. **Subscription is created** and becomes Active
5. **Billing begins** on the provision start date

## Field Reference

### Order Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | System | Order unique identifier |
| `companyId` | UUID | Yes | Company the order is for |
| `lineItems` | array | Yes | Products being ordered |
| `status` | string | System | Current order status |
| `createdDate` | datetime | System | When the order was placed |
| `orderedBy` | string | System | Who placed the order |

### Line Item Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | System | Line item unique identifier |
| `productId` | UUID | Yes | Product being ordered |
| `quantity` | integer | Yes | Number of licenses |
| `billingTerm` | string | Yes | Billing term (Monthly, Annual) |
| `provisionStartDate` | date | No | When subscription starts |
| `lineItemNumber` | integer | System | Position in the order |

## API Patterns

### List Orders

```http
GET /v1/orders
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**With Filters:**

```http
GET /v1/orders?companyId=a1b2c3d4-e5f6-7890-abcd-ef1234567890
GET /v1/orders?status=Completed
GET /v1/orders?companyId=a1b2c3d4&page=0&size=50
```

### curl Examples

```bash
# List all orders (first page)
curl -s "https://api.pax8.com/v1/orders?page=0&size=50&sort=createdDate,DESC" \
  -H "Authorization: Bearer $TOKEN"

# List orders for a specific company
curl -s "https://api.pax8.com/v1/orders?companyId=a1b2c3d4-e5f6-7890-abcd-ef1234567890" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Single Order

```http
GET /v1/orders/o1r2d3e4-r5s6-7890-abcd-ef1234567890
Authorization: Bearer YOUR_TOKEN
```

```bash
curl -s "https://api.pax8.com/v1/orders/o1r2d3e4-r5s6-7890-abcd-ef1234567890" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**

```json
{
  "id": "o1r2d3e4-r5s6-7890-abcd-ef1234567890",
  "companyId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "Completed",
  "createdDate": "2026-02-20T09:15:00.000Z",
  "orderedBy": "partner@msp.com",
  "lineItems": [
    {
      "id": "l1i2n3e4-i5t6-7890-abcd-ef1234567890",
      "productId": "f9e8d7c6-b5a4-3210-fedc-ba0987654321",
      "quantity": 25,
      "billingTerm": "Annual",
      "provisionStartDate": "2026-03-01",
      "lineItemNumber": 1
    }
  ]
}
```

### Create Order

```http
POST /v1/orders
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```

**Single Product Order:**

```json
{
  "companyId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "lineItems": [
    {
      "productId": "f9e8d7c6-b5a4-3210-fedc-ba0987654321",
      "quantity": 25,
      "billingTerm": "Annual",
      "provisionStartDate": "2026-03-01"
    }
  ]
}
```

**Multi-Product Order:**

```json
{
  "companyId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "lineItems": [
    {
      "productId": "f9e8d7c6-b5a4-3210-fedc-ba0987654321",
      "quantity": 25,
      "billingTerm": "Annual",
      "provisionStartDate": "2026-03-01"
    },
    {
      "productId": "a9b8c7d6-e5f4-3210-fedc-ba0987654322",
      "quantity": 25,
      "billingTerm": "Monthly",
      "provisionStartDate": "2026-03-01"
    }
  ]
}
```

### curl Create Order

```bash
curl -s -X POST "https://api.pax8.com/v1/orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "lineItems": [
      {
        "productId": "f9e8d7c6-b5a4-3210-fedc-ba0987654321",
        "quantity": 25,
        "billingTerm": "Annual",
        "provisionStartDate": "2026-03-01"
      }
    ]
  }'
```

## Common Workflows

### Place an Order for a New Client

```javascript
async function orderForNewClient(companyId, products) {
  // Step 1: Verify company exists
  const companyRes = await pax8Client.request(`/companies/${companyId}`);
  if (companyRes.status === 404) {
    throw new Error('Company not found. Create the company first.');
  }

  // Step 2: Validate products and build line items
  const lineItems = [];
  for (const item of products) {
    // Verify product exists and is active
    const productRes = await pax8Client.request(`/products/${item.productId}`);
    const product = await productRes.json();

    if (!product.active) {
      console.log(`Warning: Product ${product.name} is not active. Skipping.`);
      continue;
    }

    if (item.quantity < product.minQuantity || item.quantity > product.maxQuantity) {
      throw new Error(
        `Quantity ${item.quantity} is outside allowed range ` +
        `(${product.minQuantity}-${product.maxQuantity}) for ${product.name}`
      );
    }

    lineItems.push({
      productId: item.productId,
      quantity: item.quantity,
      billingTerm: item.billingTerm || 'Annual',
      provisionStartDate: item.startDate || new Date().toISOString().split('T')[0]
    });
  }

  // Step 3: Place the order
  const orderRes = await pax8Client.request('/orders', {
    method: 'POST',
    body: JSON.stringify({ companyId, lineItems })
  });

  if (!orderRes.ok) {
    const error = await orderRes.json();
    throw new Error(`Order failed: ${error.message}`);
  }

  return await orderRes.json();
}
```

### Track Order Provisioning Status

```javascript
async function trackOrderStatus(orderId) {
  const orderRes = await pax8Client.request(`/orders/${orderId}`);
  const order = await orderRes.json();

  const statusReport = {
    orderId: order.id,
    companyId: order.companyId,
    overallStatus: order.status,
    createdDate: order.createdDate,
    lineItems: order.lineItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      billingTerm: item.billingTerm,
      startDate: item.provisionStartDate
    }))
  };

  return statusReport;
}

// Poll for completion
async function waitForOrderCompletion(orderId, timeoutMs = 300000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const status = await trackOrderStatus(orderId);

    if (status.overallStatus === 'Completed') {
      console.log('Order completed successfully.');
      return status;
    }

    if (status.overallStatus === 'Failed') {
      throw new Error('Order provisioning failed.');
    }

    // Wait 30 seconds between polls
    await sleep(30000);
  }

  throw new Error('Order provisioning timed out.');
}
```

### Standard MSP Onboarding Order

A typical MSP onboarding order includes multiple products:

```javascript
async function standardOnboardingOrder(companyId, userCount) {
  // Common MSP stack: M365, security, backup
  const lineItems = [
    {
      productId: 'MICROSOFT_365_BUSINESS_PREMIUM_ID',
      quantity: userCount,
      billingTerm: 'Annual',
      provisionStartDate: new Date().toISOString().split('T')[0]
    },
    {
      productId: 'DEFENDER_FOR_BUSINESS_ID',
      quantity: userCount,
      billingTerm: 'Monthly',
      provisionStartDate: new Date().toISOString().split('T')[0]
    },
    {
      productId: 'BACKUP_SOLUTION_ID',
      quantity: userCount,
      billingTerm: 'Monthly',
      provisionStartDate: new Date().toISOString().split('T')[0]
    }
  ];

  const orderRes = await pax8Client.request('/orders', {
    method: 'POST',
    body: JSON.stringify({ companyId, lineItems })
  });

  return await orderRes.json();
}
```

### Order History Report

```javascript
async function orderHistory(companyId, daysBack = 90) {
  let allOrders = [];
  let page = 0;
  let totalPages = 1;

  while (page < totalPages) {
    const response = await pax8Client.request(
      `/orders?companyId=${companyId}&page=${page}&size=200&sort=createdDate,DESC`
    );
    const data = await response.json();
    allOrders.push(...data.content);
    totalPages = data.page.totalPages;
    page++;
  }

  // Filter by date range
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysBack);

  return allOrders.filter(order => new Date(order.createdDate) >= cutoff);
}
```

## Error Handling

### Common API Errors

| Code | Message | Resolution |
|------|---------|------------|
| 400 | Company ID is required | Include `companyId` in the order |
| 400 | Line items are required | Include at least one line item |
| 400 | Invalid product ID | Verify the product UUID exists |
| 400 | Quantity out of range | Check product min/max quantity |
| 400 | Invalid billing term | Use "Monthly", "Annual", or "Triennial" |
| 401 | Unauthorized | Token expired; re-authenticate |
| 404 | Company not found | Verify company UUID |
| 404 | Product not found | Verify product UUID |
| 409 | Duplicate order | An identical order may already be processing |
| 422 | Product not available | Product may be discontinued or restricted |

### Pre-Order Validation

```javascript
async function validateOrder(companyId, lineItems) {
  const errors = [];

  // Validate company
  const companyRes = await pax8Client.request(`/companies/${companyId}`);
  if (companyRes.status === 404) {
    errors.push('Company not found');
  }

  // Validate each line item
  for (const item of lineItems) {
    const productRes = await pax8Client.request(`/products/${item.productId}`);
    if (productRes.status === 404) {
      errors.push(`Product ${item.productId} not found`);
      continue;
    }

    const product = await productRes.json();

    if (!product.active) {
      errors.push(`Product ${product.name} is not active`);
    }

    if (item.quantity < product.minQuantity) {
      errors.push(`${product.name}: quantity ${item.quantity} below minimum ${product.minQuantity}`);
    }

    if (item.quantity > product.maxQuantity) {
      errors.push(`${product.name}: quantity ${item.quantity} above maximum ${product.maxQuantity}`);
    }

    const validTerms = ['Monthly', 'Annual', 'Triennial'];
    if (!validTerms.includes(item.billingTerm)) {
      errors.push(`Invalid billing term: ${item.billingTerm}`);
    }
  }

  return { valid: errors.length === 0, errors };
}
```

## Endpoint Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/orders` | GET | List orders with filters |
| `/v1/orders` | POST | Create a new order |
| `/v1/orders/{id}` | GET | Get order details by ID |

## Best Practices

1. **Validate before ordering** - Check company, product, and quantity before submitting
2. **Use annual billing** - Annual commitments save money; recommend to clients
3. **Bundle line items** - Include all products in a single order when possible
4. **Track provisioning** - Monitor order status until completion
5. **Set start dates** - Use `provisionStartDate` to align billing with client agreements
6. **Check product availability** - Verify products are active before including in orders
7. **Handle failures gracefully** - Failed orders may need to be resubmitted
8. **Respect quantity limits** - Stay within product min/max quantity bounds
9. **Document orders** - Record order IDs in your PSA for cross-reference
10. **Test with small quantities** - For new products, test with minimal seats before scaling up

## Related Skills

- [Pax8 API Patterns](../api-patterns/SKILL.md) - Authentication and API reference
- [Pax8 Products](../products/SKILL.md) - Product catalog and pricing
- [Pax8 Subscriptions](../subscriptions/SKILL.md) - Managing resulting subscriptions
- [Pax8 Companies](../companies/SKILL.md) - Company management
- [Pax8 Invoices](../invoices/SKILL.md) - Billing for orders
