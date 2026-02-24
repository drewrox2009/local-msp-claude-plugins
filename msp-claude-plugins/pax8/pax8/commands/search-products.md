---
name: search-products
description: Search the Pax8 product catalog by name or vendor
arguments:
  - name: query
    description: Product name to search for (partial match supported)
    required: true
  - name: vendor
    description: Filter by vendor name (e.g., Microsoft, SentinelOne, Acronis)
    required: false
  - name: show_pricing
    description: Include pricing details in results
    required: false
    default: false
---

# Search Pax8 Products

Search the Pax8 cloud product catalog by name, vendor, or keyword. Returns matching products with pricing and provisioning details.

## Prerequisites

- Valid Pax8 OAuth2 credentials configured (`PAX8_CLIENT_ID`, `PAX8_CLIENT_SECRET`)
- Active bearer token (auto-refreshed)
- Partner account with product catalog access

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

2. **Fetch products** with optional vendor filter

   ```bash
   # Without vendor filter
   curl -s "https://api.pax8.com/v1/products?page=0&size=200&sort=name,ASC" \
     -H "Authorization: Bearer $TOKEN"

   # With vendor filter
   curl -s "https://api.pax8.com/v1/products?vendorName=Microsoft&page=0&size=200&sort=name,ASC" \
     -H "Authorization: Bearer $TOKEN"
   ```

3. **Filter results** client-side by search query (name matching)

4. **Optionally fetch pricing** for each matching product

   ```bash
   curl -s "https://api.pax8.com/v1/products/{productId}/pricing" \
     -H "Authorization: Bearer $TOKEN"
   ```

5. **Format and return results** with product details and pricing

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| query | string | Yes | - | Product name search (partial match) |
| vendor | string | No | all | Vendor name filter |
| show_pricing | boolean | No | false | Include pricing in results |

## Examples

### Basic Product Search

```
/search-products "Microsoft 365"
```

### Search by Vendor

```
/search-products "Business" --vendor Microsoft
```

### Search with Pricing

```
/search-products "Defender" --vendor Microsoft --show_pricing
```

### Search Backup Products

```
/search-products "backup"
```

### Search Security Products

```
/search-products "endpoint protection"
```

## Output

### Standard Results

```
Found 5 products matching "Microsoft 365"

+--------------------------------------------+------------+--------+--------+------------+
| Product Name                               | Vendor     | SKU    | Unit   | Provision  |
+--------------------------------------------+------------+--------+--------+------------+
| Microsoft 365 Business Basic               | Microsoft  | CFQ7.. | User   | Automated  |
| Microsoft 365 Business Standard            | Microsoft  | CFQ7.. | User   | Automated  |
| Microsoft 365 Business Premium             | Microsoft  | CFQ7.. | User   | Automated  |
| Microsoft 365 E3                           | Microsoft  | CFQ7.. | User   | Automated  |
| Microsoft 365 E5                           | Microsoft  | CFQ7.. | User   | Automated  |
+--------------------------------------------+------------+--------+--------+------------+

View details:
  /search-products "Microsoft 365 Business Premium" --show_pricing
```

### Results with Pricing

```
Found 1 product matching "Microsoft 365 Business Premium"

Product: Microsoft 365 Business Premium
================================================================
ID:              f9e8d7c6-b5a4-3210-fedc-ba0987654321
Vendor:          Microsoft
SKU:             CFQ7TTC0LCHC
Unit:            User
Min Quantity:    1
Max Quantity:    300
Provisioning:    Automated
Active:          Yes

Pricing:
+----------+--------+---------+---------+--------+
| Term     | Cost   | Retail  | Margin  | Margin%|
+----------+--------+---------+---------+--------+
| Monthly  | $18.90 | $22.00  | $3.10   | 14.1%  |
| Annual   | $17.10 | $22.00  | $4.90   | 22.3%  |
+----------+--------+---------+---------+--------+

Annual savings: $1.80/user/month ($21.60/user/year)

Quick Actions:
  - Order: /create-order --product "Microsoft 365 Business Premium" --company "Company Name" --quantity 25
================================================================
```

### No Results

```
No products found matching "XYZ Product"

Suggestions:
  - Check spelling of the product name
  - Try a shorter search term
  - Browse by vendor: /search-products "" --vendor Microsoft
  - Try common terms: "365", "backup", "security", "endpoint"

Popular searches:
  /search-products "Microsoft 365"
  /search-products "Defender"
  /search-products "backup" --vendor Acronis
  /search-products "SentinelOne"
```

## Error Handling

### Authentication Error

```
Error: Unable to authenticate with Pax8 API

Possible causes:
  - Invalid client credentials (check PAX8_CLIENT_ID and PAX8_CLIENT_SECRET)
  - Credentials have been revoked
  - Network connectivity issue

Retry or check configuration.
```

### Rate Limit

```
Error: Rate limit exceeded (429)

The Pax8 API allows 1000 requests per minute.
Please wait a moment and try again.
```

### No Pricing Available

```
Product: Custom Enterprise Solution
Pricing: Not available via API

Note: Some products require contacting Pax8 directly for pricing.
Check the Pax8 portal at app.pax8.com for details.
```

## Use Cases

### Find the Right M365 Plan

Compare Microsoft 365 plans for a client:
```
/search-products "Microsoft 365" --vendor Microsoft --show_pricing
```

### Compare Security Products

Find endpoint security options across vendors:
```
/search-products "endpoint" --show_pricing
```

### Check Backup Options

Find backup solutions:
```
/search-products "backup" --show_pricing
```

### Verify a SKU Before Ordering

Confirm product details before placing an order:
```
/search-products "CFQ7TTC0LCHC" --show_pricing
```

## Related Commands

- `/create-order` - Place an order for a found product
- `/subscription-status` - Check existing subscriptions for a product
- `/license-summary` - See all active licenses across clients
