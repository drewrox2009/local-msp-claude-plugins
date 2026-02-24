---
description: >
  Use this skill when working with the Pax8 product catalog - searching
  for cloud software, browsing vendors, checking pricing, reviewing
  provisioning details, and finding the right SKU for a client need.
  Covers Microsoft 365, Azure, security tools, backup products, and
  the full Pax8 marketplace catalog.
triggers:
  - pax8 product
  - pax8 catalog
  - pax8 sku
  - pax8 pricing
  - pax8 vendor
  - pax8 marketplace
  - cloud product search
  - microsoft 365 pax8
  - azure pax8
  - pax8 software
  - license pricing
---

# Pax8 Product Catalog

## Overview

The Pax8 product catalog contains thousands of cloud software products from hundreds of vendors. MSPs use the catalog to find the right products for their clients, check pricing, and understand provisioning requirements. Products range from Microsoft 365 and Azure to security tools, backup solutions, and line-of-business applications. Each product has associated pricing tiers, billing terms, and provisioning details that determine how it is ordered and managed.

## Key Concepts

### Product Hierarchy

Products in Pax8 follow a hierarchical structure:

| Level | Description | Example |
|-------|-------------|---------|
| Vendor | The software publisher | Microsoft, SentinelOne, Acronis |
| Product | A specific offering | Microsoft 365 Business Premium |
| SKU/Pricing | Billing terms and tiers | Monthly, Annual, per-user, per-device |

### Product Types

| Type | Description | Examples |
|------|-------------|---------|
| Seat-based | Per-user licensing | Microsoft 365, Google Workspace |
| Usage-based | Pay for what you consume | Azure, AWS |
| Device-based | Per-device licensing | Endpoint security, RMM |
| Flat-rate | Fixed monthly fee | Domain registration, hosted services |
| Tiered | Price varies by quantity | Backup storage tiers |

### Billing Terms

| Term | Description |
|------|-------------|
| Monthly | Month-to-month billing, cancel anytime |
| Annual | 12-month commitment, typically discounted |
| Triennial | 3-year commitment, deepest discount |
| One-Time | Single purchase (e.g., setup fees) |
| Trial | Free trial period before billing begins |

### Provisioning Types

| Type | Description |
|------|-------------|
| Automated | Instantly provisioned through Pax8 |
| Manual | Requires manual setup by vendor or Pax8 |
| Hybrid | Automated creation with manual configuration steps |

## Field Reference

### Product Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Product unique identifier |
| `name` | string | Product display name |
| `vendorName` | string | Vendor/publisher name |
| `vendorId` | UUID | Vendor unique identifier |
| `description` | string | Product description |
| `sku` | string | Product SKU code |
| `unitOfMeasurement` | string | Licensing unit (e.g., "User", "Device", "GB") |
| `billingTermOptions` | array | Available billing terms |
| `provisioningType` | string | How the product is provisioned |
| `minQuantity` | integer | Minimum order quantity |
| `maxQuantity` | integer | Maximum order quantity |
| `active` | boolean | Whether the product is available for ordering |
| `category` | string | Product category |

### Pricing Fields

Pricing is a separate endpoint per product:

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Pricing record ID |
| `productId` | UUID | Associated product ID |
| `billingTerm` | string | Billing term (Monthly, Annual) |
| `unitPrice` | decimal | Price per unit |
| `flatPrice` | decimal | Flat fee (if applicable) |
| `partnerBuyPrice` | decimal | MSP cost price |
| `suggestedRetailPrice` | decimal | Suggested end-user price |
| `currency` | string | Currency code (e.g., "USD") |
| `startDate` | date | Pricing effective date |
| `endDate` | date | Pricing expiration date |

### Provisioning Details Fields

| Field | Type | Description |
|-------|------|-------------|
| `productId` | UUID | Associated product ID |
| `provisioningType` | string | Automated, Manual, or Hybrid |
| `requiredFields` | array | Fields needed for provisioning |
| `instructions` | string | Setup instructions |
| `estimatedTime` | string | Estimated provisioning time |

## API Patterns

### List Products

```http
GET /v1/products
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**With Pagination and Sorting:**

```http
GET /v1/products?page=0&size=50&sort=name,ASC
GET /v1/products?page=0&size=200&sort=vendorName,ASC
```

**Filter by Vendor:**

```http
GET /v1/products?vendorName=Microsoft
GET /v1/products?vendorName=SentinelOne
GET /v1/products?vendorName=Acronis
```

### curl Examples

```bash
# List all products (first page, sorted by name)
curl -s "https://api.pax8.com/v1/products?page=0&size=50&sort=name,ASC" \
  -H "Authorization: Bearer $TOKEN"

# Filter by vendor
curl -s "https://api.pax8.com/v1/products?vendorName=Microsoft&page=0&size=50" \
  -H "Authorization: Bearer $TOKEN"

# Get all products from a vendor (paginated)
curl -s "https://api.pax8.com/v1/products?vendorName=Microsoft&page=0&size=200" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Single Product

```http
GET /v1/products/f9e8d7c6-b5a4-3210-fedc-ba0987654321
Authorization: Bearer YOUR_TOKEN
```

```bash
curl -s "https://api.pax8.com/v1/products/f9e8d7c6-b5a4-3210-fedc-ba0987654321" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**

```json
{
  "id": "f9e8d7c6-b5a4-3210-fedc-ba0987654321",
  "name": "Microsoft 365 Business Premium",
  "vendorName": "Microsoft",
  "description": "Best-in-class Office apps with advanced security and device management",
  "sku": "CFQ7TTC0LCHC",
  "unitOfMeasurement": "User",
  "billingTermOptions": ["Monthly", "Annual"],
  "provisioningType": "Automated",
  "minQuantity": 1,
  "maxQuantity": 300,
  "active": true
}
```

### Get Product Pricing

```http
GET /v1/products/f9e8d7c6-b5a4-3210-fedc-ba0987654321/pricing
Authorization: Bearer YOUR_TOKEN
```

```bash
curl -s "https://api.pax8.com/v1/products/f9e8d7c6-b5a4-3210-fedc-ba0987654321/pricing" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**

```json
{
  "content": [
    {
      "id": "p1r2i3c4-e5f6-7890-abcd-ef1234567890",
      "productId": "f9e8d7c6-b5a4-3210-fedc-ba0987654321",
      "billingTerm": "Monthly",
      "unitPrice": 18.90,
      "partnerBuyPrice": 18.90,
      "suggestedRetailPrice": 22.00,
      "currency": "USD",
      "startDate": "2026-01-01",
      "endDate": null
    },
    {
      "id": "p2r3i4c5-f6a7-8901-bcde-f12345678901",
      "productId": "f9e8d7c6-b5a4-3210-fedc-ba0987654321",
      "billingTerm": "Annual",
      "unitPrice": 17.10,
      "partnerBuyPrice": 17.10,
      "suggestedRetailPrice": 22.00,
      "currency": "USD",
      "startDate": "2026-01-01",
      "endDate": null
    }
  ]
}
```

### Get Provisioning Details

```http
GET /v1/products/f9e8d7c6-b5a4-3210-fedc-ba0987654321/provisioning-details
Authorization: Bearer YOUR_TOKEN
```

```bash
curl -s "https://api.pax8.com/v1/products/f9e8d7c6-b5a4-3210-fedc-ba0987654321/provisioning-details" \
  -H "Authorization: Bearer $TOKEN"
```

## Common Workflows

### Find the Right Product for a Client

```javascript
async function searchProducts(searchTerm, vendor = null) {
  let url = '/products?page=0&size=200&sort=name,ASC';
  if (vendor) {
    url += `&vendorName=${encodeURIComponent(vendor)}`;
  }

  const response = await pax8Client.request(url);
  const data = await response.json();

  // Client-side filter by name since Pax8 API does not have a name search param
  const filtered = data.content.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return filtered;
}

// Find Microsoft 365 products
const m365Products = await searchProducts('365', 'Microsoft');

// Find backup products across all vendors
const backupProducts = await searchProducts('backup');
```

### Compare Product Pricing

```javascript
async function comparePricing(productIds) {
  const comparisons = [];

  for (const productId of productIds) {
    const productRes = await pax8Client.request(`/products/${productId}`);
    const product = await productRes.json();

    const pricingRes = await pax8Client.request(`/products/${productId}/pricing`);
    const pricing = await pricingRes.json();

    comparisons.push({
      name: product.name,
      vendor: product.vendorName,
      sku: product.sku,
      unit: product.unitOfMeasurement,
      pricing: pricing.content.map(p => ({
        term: p.billingTerm,
        cost: p.partnerBuyPrice,
        retail: p.suggestedRetailPrice,
        margin: ((p.suggestedRetailPrice - p.partnerBuyPrice) / p.suggestedRetailPrice * 100).toFixed(1) + '%'
      }))
    });
  }

  return comparisons;
}
```

### Build a Product Catalog Export

```javascript
async function exportProductCatalog(vendorFilter = null) {
  let allProducts = [];
  let page = 0;
  let totalPages = 1;
  let url = '/products?size=200&sort=vendorName,ASC';

  if (vendorFilter) {
    url += `&vendorName=${encodeURIComponent(vendorFilter)}`;
  }

  while (page < totalPages) {
    const response = await pax8Client.request(`${url}&page=${page}`);
    const data = await response.json();
    allProducts.push(...data.content);
    totalPages = data.page.totalPages;
    page++;
  }

  // Enrich with pricing (rate-limit aware)
  const catalog = [];
  for (const product of allProducts) {
    const pricingRes = await pax8Client.request(`/products/${product.id}/pricing`);
    const pricing = await pricingRes.json();

    catalog.push({
      id: product.id,
      name: product.name,
      vendor: product.vendorName,
      sku: product.sku,
      unit: product.unitOfMeasurement,
      active: product.active,
      monthlyPrice: pricing.content.find(p => p.billingTerm === 'Monthly')?.partnerBuyPrice,
      annualPrice: pricing.content.find(p => p.billingTerm === 'Annual')?.partnerBuyPrice,
      retailPrice: pricing.content[0]?.suggestedRetailPrice
    });

    // Respect rate limits: brief pause between calls
    await sleep(100);
  }

  return catalog;
}
```

### Microsoft 365 Product Finder

A common MSP need is finding the right M365 SKU:

```javascript
async function findM365Product(planName) {
  const products = await searchProducts(planName, 'Microsoft');

  // Common M365 plans MSPs order:
  // - Microsoft 365 Business Basic
  // - Microsoft 365 Business Standard
  // - Microsoft 365 Business Premium
  // - Microsoft 365 E3
  // - Microsoft 365 E5
  // - Exchange Online Plan 1/2
  // - Microsoft Teams Essentials
  // - Microsoft Defender for Business

  return products.map(p => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    unit: p.unitOfMeasurement,
    maxQuantity: p.maxQuantity,
    provisioning: p.provisioningType
  }));
}
```

## Error Handling

### Common API Errors

| Code | Message | Resolution |
|------|---------|------------|
| 401 | Unauthorized | Token expired; re-authenticate |
| 404 | Product not found | Verify product UUID |
| 404 | Pricing not found | Product may not have pricing configured |

### Product Not Found

```javascript
async function safeGetProduct(productId) {
  try {
    const response = await pax8Client.request(`/products/${productId}`);
    if (response.status === 404) {
      console.log(`Product ${productId} not found. It may have been discontinued.`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.log(`Error fetching product: ${error.message}`);
    return null;
  }
}
```

### Pricing Unavailable

Some products may not have pricing visible through the API:

```javascript
async function safeGetPricing(productId) {
  try {
    const response = await pax8Client.request(`/products/${productId}/pricing`);
    if (response.status === 404) {
      return { content: [], note: 'Pricing not available via API. Check Pax8 portal.' };
    }
    return await response.json();
  } catch (error) {
    return { content: [], note: `Pricing error: ${error.message}` };
  }
}
```

## Endpoint Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/products` | GET | List all products with pagination |
| `/v1/products/{id}` | GET | Get product details by ID |
| `/v1/products/{id}/pricing` | GET | Get product pricing tiers |
| `/v1/products/{id}/provisioning-details` | GET | Get provisioning requirements |

## Best Practices

1. **Cache product catalog** - Products and pricing change infrequently; cache for 1-4 hours
2. **Use vendor filter** - Always filter by `vendorName` when you know the vendor to reduce result sets
3. **Check pricing separately** - Product listing does not include pricing; make a separate call per product
4. **Verify active status** - Only order products where `active` is `true`
5. **Check min/max quantities** - Respect `minQuantity` and `maxQuantity` before placing orders
6. **Understand billing terms** - Annual commitments are cheaper but lock in for 12 months
7. **Review provisioning type** - Automated products are instant; manual products may take hours or days
8. **Compare pricing tiers** - Show clients the savings from annual vs. monthly commitment
9. **Calculate margins** - Use `partnerBuyPrice` vs. `suggestedRetailPrice` to understand margins
10. **Paginate large catalogs** - The full Pax8 catalog has thousands of products; always paginate

## Related Skills

- [Pax8 API Patterns](../api-patterns/SKILL.md) - Authentication and API reference
- [Pax8 Subscriptions](../subscriptions/SKILL.md) - Active product subscriptions
- [Pax8 Orders](../orders/SKILL.md) - Ordering products
- [Pax8 Companies](../companies/SKILL.md) - Client company management
- [Pax8 Invoices](../invoices/SKILL.md) - Billing for products
