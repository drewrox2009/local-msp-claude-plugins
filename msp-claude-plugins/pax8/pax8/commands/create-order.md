---
name: create-order
description: Place an order for a product subscription in Pax8
arguments:
  - name: company
    description: Company name or ID to place the order for
    required: true
  - name: product
    description: Product name or ID to order
    required: true
  - name: quantity
    description: Number of seats/licenses to order
    required: true
  - name: billing_term
    description: Billing term (Monthly, Annual, Triennial)
    required: false
    default: Annual
  - name: start_date
    description: Subscription start date (YYYY-MM-DD)
    required: false
    default: today
---

# Create Pax8 Order

Place an order for a cloud product subscription on behalf of a client company. This provisions new licenses through the Pax8 marketplace.

## Prerequisites

- Valid Pax8 OAuth2 credentials configured (`PAX8_CLIENT_ID`, `PAX8_CLIENT_SECRET`)
- Active bearer token (auto-refreshed)
- Company must exist in Pax8
- Product must be active and available for ordering
- Quantity must be within the product's min/max range

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

2. **Resolve company** - Find the company by name or use the provided UUID

   ```bash
   curl -s "https://api.pax8.com/v1/companies?page=0&size=200&sort=name,ASC" \
     -H "Authorization: Bearer $TOKEN"
   ```

3. **Resolve product** - Find the product by name or use the provided UUID

   ```bash
   curl -s "https://api.pax8.com/v1/products?page=0&size=200&sort=name,ASC" \
     -H "Authorization: Bearer $TOKEN"
   ```

4. **Validate order** - Check product availability, quantity limits, and billing term

   ```bash
   curl -s "https://api.pax8.com/v1/products/PRODUCT_ID" \
     -H "Authorization: Bearer $TOKEN"
   ```

5. **Get pricing** for confirmation

   ```bash
   curl -s "https://api.pax8.com/v1/products/PRODUCT_ID/pricing" \
     -H "Authorization: Bearer $TOKEN"
   ```

6. **Place the order**

   ```bash
   curl -s -X POST "https://api.pax8.com/v1/orders" \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "companyId": "COMPANY_ID",
       "lineItems": [
         {
           "productId": "PRODUCT_ID",
           "quantity": 25,
           "billingTerm": "Annual",
           "provisionStartDate": "2026-03-01"
         }
       ]
     }'
   ```

7. **Return order confirmation** with order ID and expected provisioning timeline

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| company | string | Yes | - | Company name or UUID |
| product | string | Yes | - | Product name or UUID |
| quantity | integer | Yes | - | Number of seats/licenses |
| billing_term | string | No | Annual | Billing term (Monthly, Annual, Triennial) |
| start_date | string | No | today | Start date in YYYY-MM-DD format |

## Examples

### Basic Order

```
/create-order --company "Acme Corp" --product "Microsoft 365 Business Premium" --quantity 25
```

### Monthly Billing

```
/create-order --company "Acme Corp" --product "Microsoft Defender for Business" --quantity 25 --billing_term Monthly
```

### Future Start Date

```
/create-order --company "Acme Corp" --product "Microsoft 365 E3" --quantity 50 --start_date 2026-04-01
```

### By UUID

```
/create-order --company "a1b2c3d4-e5f6-7890-abcd-ef1234567890" --product "f9e8d7c6-b5a4-3210-fedc-ba0987654321" --quantity 10
```

## Output

### Order Confirmation

```
Order Placed Successfully
================================================================

Order ID:       o1r2d3e4-r5s6-7890-abcd-ef1234567890
Company:        Acme Corporation
Status:         Submitted
Created:        2026-02-23T14:30:00.000Z

Line Items:
+--------------------------------------------+------+----------+--------+-----------+
| Product                                    | Qty  | Term     | Price  | Monthly   |
+--------------------------------------------+------+----------+--------+-----------+
| Microsoft 365 Business Premium             | 25   | Annual   | $17.10 | $427.50   |
+--------------------------------------------+------+----------+--------+-----------+

Start Date:     2026-03-01
Est. Provision: Automated (minutes)

Total Monthly Cost: $427.50
Total Annual Cost:  $5,130.00

Next Steps:
  - Order is being provisioned automatically
  - Check status: /subscription-status --company "Acme Corporation"
  - Monitor order: Check Pax8 portal for real-time status
================================================================
```

### Order with Confirmation Prompt

```
Order Summary (Confirm Before Placing)
================================================================

Company:        Acme Corporation
Product:        Microsoft 365 Business Premium
Quantity:       25 users
Billing Term:   Annual (12-month commitment)
Start Date:     2026-03-01

Pricing:
  Unit Price:   $17.10/user/month
  Monthly Cost: $427.50
  Annual Cost:  $5,130.00

Annual savings vs. Monthly: $540.00 ($1.80/user/month)

WARNING: Annual billing term creates a 12-month commitment.
         Seat decreases may be restricted during the commitment period.

Proceed with order? (Review details above)
================================================================
```

### Validation Errors

```
Order Validation Failed
================================================================

Issues found:
  1. Quantity 500 exceeds maximum of 300 for "Microsoft 365 Business Premium"
  2. Annual billing term not available for this product

Suggestions:
  - Reduce quantity to 300 or fewer
  - Use Monthly billing term instead
  - Check product details: /search-products "Microsoft 365 Business Premium" --show_pricing

================================================================
```

### Company Not Found

```
Company not found: "Unknown Corp"

Suggestions:
  - Check spelling of the company name
  - Try a partial name match
  - Use the company UUID directly
  - Create the company first in Pax8 portal
```

### Product Not Found

```
Product not found: "Nonexistent Product"

Suggestions:
  - Check spelling of the product name
  - Search the catalog: /search-products "product name"
  - Browse by vendor: /search-products "" --vendor Microsoft
  - Verify the product is available in your Pax8 catalog
```

## Billing Term Reference

| Term | Commitment | Seat Changes | Discount |
|------|-----------|--------------|----------|
| Monthly | None | Increase/decrease anytime | Standard price |
| Annual | 12 months | Increase anytime, decrease restricted | ~10% discount |
| Triennial | 36 months | Increase anytime, decrease restricted | ~15% discount |

## Error Handling

### Authentication Error

```
Error: Unable to authenticate with Pax8 API

Check PAX8_CLIENT_ID and PAX8_CLIENT_SECRET environment variables.
```

### Provisioning Failed

```
Order submitted but provisioning failed
Order ID: o1r2d3e4-r5s6-7890-abcd-ef1234567890

Possible causes:
  - Product requires manual provisioning by vendor
  - Company contact information is incomplete
  - Vendor-specific requirements not met

Next Steps:
  - Check order status in the Pax8 portal
  - Verify company contacts are set up
  - Contact Pax8 support if the issue persists
```

### Duplicate Order Warning

```
Warning: A similar order may already exist

Existing subscription found:
  Product: Microsoft 365 Business Premium
  Quantity: 25
  Status: Active

Did you mean to increase seats instead?
  - Modify existing: Adjust subscription quantity through the API
  - Place new order: Confirm to proceed with a new order

To add seats to an existing subscription, use the subscription modification API.
```

### Rate Limit

```
Error: Rate limit exceeded (429)

Please wait a moment and try again.
The Pax8 API allows 1000 requests per minute.
```

## Related Commands

- `/search-products` - Find products before ordering
- `/subscription-status` - Check existing subscriptions
- `/license-summary` - View all licenses across clients
