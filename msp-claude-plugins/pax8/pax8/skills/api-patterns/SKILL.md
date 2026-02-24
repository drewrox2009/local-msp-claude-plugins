---
description: >
  Use this skill when working with the Pax8 API - MCP server authentication,
  REST structure, pagination, sorting, filtering, rate limiting, error
  handling, and best practices. Covers the official hosted MCP server
  token auth and REST API patterns.
triggers:
  - pax8 api
  - pax8 query
  - pax8 filter
  - pax8 pagination
  - pax8 rate limit
  - pax8 authentication
  - pax8 mcp
  - pax8 rest
  - pax8 endpoint
  - pax8 request
  - pax8 token
---

# Pax8 API Patterns

## Overview

Pax8 provides a first-party hosted MCP server at `https://mcp.pax8.com/v1/mcp` for AI tool integration. The underlying REST API at `https://api.pax8.com/v1/` provides access to companies, contacts, products, subscriptions, orders, invoices, and usage summaries. This skill covers MCP authentication, REST patterns, pagination, sorting, error handling, and best practices.

## Authentication

### MCP Server (Recommended)

Pax8 hosts an official MCP server. Authentication uses a single token:

1. Log into [app.pax8.com](https://app.pax8.com)
2. Navigate to **Integrations > MCP** (or visit [app.pax8.com/integrations/mcp](https://app.pax8.com/integrations/mcp))
3. Generate an MCP token

**Required Header:**

| Header | Value | Description |
|--------|-------|-------------|
| `x-pax8-mcp-token` | `<token>` | MCP token from Pax8 portal |

**MCP Server URL:** `https://mcp.pax8.com/v1/mcp`

### Environment Variables

```bash
export PAX8_MCP_TOKEN="your-mcp-token"
```

### Claude Desktop Configuration

```json
{
  "mcpServers": {
    "pax8": {
      "command": "npx",
      "args": [
        "-y", "mcp-remote",
        "https://mcp.pax8.com/v1/mcp",
        "--header", "x-pax8-mcp-token:YOUR_TOKEN"
      ]
    }
  }
}
```

### REST API (Direct Access)

For direct REST API access, Pax8 uses OAuth2 Client Credentials:

```http
POST https://api.pax8.com/v1/token
Content-Type: application/json
```

```json
{
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "audience": "https://api.pax8.com",
  "grant_type": "client_credentials"
}
```

Tokens are valid for 24 hours (86,400 seconds). Include in requests as:

```http
Authorization: Bearer <access_token>
```

### Base URL Pattern

All REST API endpoints follow the pattern:

```
https://api.pax8.com/v1/[resource]
```

Examples:
```
https://api.pax8.com/v1/companies
https://api.pax8.com/v1/products
https://api.pax8.com/v1/subscriptions
https://api.pax8.com/v1/orders
https://api.pax8.com/v1/invoices
```

## Request Format

### Standard JSON Request

Pax8 uses standard JSON for request and response bodies:

```json
{
  "companyId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "productId": "f9e8d7c6-b5a4-3210-fedc-ba0987654321",
  "quantity": 10,
  "startDate": "2026-03-01",
  "billingTerm": "Monthly"
}
```

### Response Format

**Single Resource:**

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Acme Corporation",
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "stateOrProvince": "IL",
    "postalCode": "62704",
    "country": "US"
  },
  "phone": "555-123-4567",
  "website": "https://www.acme.com",
  "status": "Active",
  "billOnBehalfOfEnabled": false,
  "selfServiceAllowed": false,
  "orderApprovalRequired": false,
  "createdDate": "2024-01-15T10:30:00.000Z"
}
```

**Paginated Collection:**

```json
{
  "page": {
    "size": 50,
    "totalElements": 237,
    "totalPages": 5,
    "number": 0
  },
  "content": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Acme Corporation"
    },
    {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "name": "TechStart Inc"
    }
  ]
}
```

## Pagination

### Page-Based Pagination

Pax8 uses zero-based page pagination with configurable page size:

```http
GET /v1/companies?page=0&size=50
GET /v1/companies?page=1&size=50
GET /v1/companies?page=2&size=50
```

**Pagination Parameters:**

| Parameter | Description | Default | Max |
|-----------|-------------|---------|-----|
| `page` | Page number (0-based) | 0 | - |
| `size` | Results per page | 50 | 200 |

**Pagination Response Metadata:**

| Field | Description |
|-------|-------------|
| `page.size` | Number of results per page |
| `page.totalElements` | Total number of records |
| `page.totalPages` | Total number of pages |
| `page.number` | Current page number (0-based) |

### Iterating Through All Pages

```javascript
async function fetchAllResources(path) {
  const allItems = [];
  let page = 0;
  let totalPages = 1;

  while (page < totalPages) {
    const response = await pax8Client.request(
      `${path}?page=${page}&size=200`
    );
    const data = await response.json();

    allItems.push(...data.content);
    totalPages = data.page.totalPages;
    page++;
  }

  return allItems;
}
```

### curl Pagination Example

```bash
# First page
curl -s "https://api.pax8.com/v1/companies?page=0&size=50" \
  -H "Authorization: Bearer $TOKEN"

# Second page
curl -s "https://api.pax8.com/v1/companies?page=1&size=50" \
  -H "Authorization: Bearer $TOKEN"
```

## Sorting

### Sort Parameter

Use the `sort` query parameter with field name and direction:

```http
GET /v1/companies?sort=name,ASC
GET /v1/products?sort=vendorName,ASC
GET /v1/subscriptions?sort=createdDate,DESC
```

**Sort Format:** `sort=fieldName,direction`

| Direction | Description |
|-----------|-------------|
| `ASC` | Ascending (A-Z, oldest first) |
| `DESC` | Descending (Z-A, newest first) |

### Combined Sort and Pagination

```http
GET /v1/companies?sort=name,ASC&page=0&size=100
GET /v1/subscriptions?sort=createdDate,DESC&page=0&size=50
```

## Filtering

### Query Parameter Filtering

Pax8 uses query parameters for filtering. Available filters vary by endpoint:

```http
GET /v1/companies?city=Springfield&stateOrProvince=IL
GET /v1/subscriptions?companyId=a1b2c3d4&status=Active
GET /v1/products?vendorName=Microsoft
GET /v1/invoices?companyId=a1b2c3d4&status=Unpaid
```

### Common Filter Parameters by Endpoint

| Endpoint | Parameters | Description |
|----------|-----------|-------------|
| `/companies` | `city`, `stateOrProvince`, `country`, `selfServiceAllowed` | Filter companies |
| `/products` | `vendorName`, `sort` | Filter products by vendor |
| `/subscriptions` | `companyId`, `productId`, `status` | Filter subscriptions |
| `/orders` | `companyId`, `status` | Filter orders |
| `/invoices` | `companyId`, `status`, `invoiceDate` | Filter invoices |

### Subscription Status Filter

```http
GET /v1/subscriptions?status=Active
GET /v1/subscriptions?status=Cancelled
GET /v1/subscriptions?status=PendingManual
GET /v1/subscriptions?companyId=abc123&status=Active
```

## Rate Limiting

### Rate Limit Details

Pax8 enforces rate limits to ensure fair API usage:

| Metric | Limit |
|--------|-------|
| Successful calls per minute | 1000 |

### Rate Limit Response

When rate limited (HTTP 429):

```json
{
  "message": "Rate limit exceeded",
  "status": 429
}
```

### Retry Strategy

```javascript
async function requestWithRetry(path, options = {}, maxRetries = 5) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await pax8Client.request(path, options);

      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || 60;
        const jitter = Math.random() * 5000;
        await sleep(retryAfter * 1000 + jitter);
        continue;
      }

      return response;
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;

      // Exponential backoff with jitter
      const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
      await sleep(delay);
    }
  }
}
```

## CRUD Operations

### Create (POST)

```http
POST /v1/orders
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```

```json
{
  "companyId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "lineItems": [
    {
      "productId": "f9e8d7c6-b5a4-3210-fedc-ba0987654321",
      "quantity": 10,
      "billingTerm": "Monthly",
      "provisionStartDate": "2026-03-01"
    }
  ]
}
```

### Read (GET)

**Single resource:**

```http
GET /v1/companies/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Collection with filters:**

```http
GET /v1/subscriptions?companyId=a1b2c3d4&status=Active&page=0&size=50
```

### Update (PUT)

```http
PUT /v1/subscriptions/a1b2c3d4-e5f6-7890-abcd-ef1234567890
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```

```json
{
  "quantity": 15,
  "billingTerm": "Monthly"
}
```

### Delete (DELETE)

```http
DELETE /v1/subscriptions/a1b2c3d4-e5f6-7890-abcd-ef1234567890
Authorization: Bearer YOUR_TOKEN
```

**Note:** Most Pax8 resources are cancelled rather than deleted. Subscriptions use a cancellation workflow rather than direct deletion.

## Error Handling

### HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response |
| 201 | Created | Resource created successfully |
| 204 | No Content | Update/delete successful |
| 400 | Bad Request | Check request format and required fields |
| 401 | Unauthorized | Token expired or invalid; re-authenticate |
| 403 | Forbidden | Insufficient permissions or scope |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Resource state conflict (e.g., duplicate order) |
| 422 | Unprocessable Entity | Validation errors (invalid field values) |
| 429 | Rate Limited | Implement backoff, wait before retrying |
| 500 | Server Error | Retry with backoff |

### Error Response Format

```json
{
  "message": "Company not found",
  "status": 404
}
```

For validation errors:

```json
{
  "message": "Validation failed: quantity must be greater than 0",
  "status": 400
}
```

### Error Handling Pattern

```javascript
function handleApiError(response, body) {
  switch (response.status) {
    case 401:
      console.log('Token expired or invalid. Re-authenticate with OAuth2.');
      break;
    case 403:
      console.log('Forbidden. Check application scopes and permissions.');
      break;
    case 404:
      console.log('Resource not found. Verify the resource ID.');
      break;
    case 409:
      console.log('Conflict. Resource may already exist or be in an invalid state.');
      break;
    case 422:
      console.log('Validation error:', body.message);
      break;
    case 429:
      console.log('Rate limited. Wait before retrying.');
      break;
    default:
      console.log(`Error ${response.status}: ${body.message}`);
  }
}
```

## Endpoint Reference

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/v1/companies` | GET, POST | List/create companies |
| `/v1/companies/{id}` | GET | Get company by ID |
| `/v1/companies/{id}/contacts` | GET, POST | List/create contacts for a company |
| `/v1/products` | GET | List products |
| `/v1/products/{id}` | GET | Get product by ID |
| `/v1/products/{id}/pricing` | GET | Get product pricing |
| `/v1/products/{id}/provisioning-details` | GET | Get provisioning details |
| `/v1/subscriptions` | GET | List subscriptions |
| `/v1/subscriptions/{id}` | GET, PUT, DELETE | Get/update/cancel subscription |
| `/v1/subscriptions/{id}/history` | GET | Get subscription change history |
| `/v1/subscriptions/{id}/usage-summaries` | GET | Get subscription usage |
| `/v1/orders` | GET, POST | List/create orders |
| `/v1/orders/{id}` | GET | Get order by ID |
| `/v1/invoices` | GET | List invoices |
| `/v1/invoices/{id}` | GET | Get invoice by ID |
| `/v1/invoices/{id}/items` | GET | Get invoice line items |
| `/v1/usage-summaries` | GET | Get usage summaries |

## Best Practices

1. **Cache bearer tokens** - Tokens last up to 24 hours; do not request a new token on every call
2. **Use maximum page size** - Set `size=200` to minimize total API calls when fetching all records
3. **Implement retry logic** - Handle rate limits (429) and transient errors (500) with exponential backoff
4. **Filter server-side** - Use query parameters to narrow results rather than fetching everything
5. **Monitor rate limits** - Stay well under 1000 requests per minute
6. **Sort consistently** - Use `sort=name,ASC` for predictable pagination results
7. **Handle token expiry** - Refresh tokens before they expire to avoid failed requests
8. **Use UUIDs** - All Pax8 resource IDs are UUIDs; validate format before sending
9. **Log API calls** - Track requests for debugging and audit purposes
10. **Validate before sending** - Check required fields client-side to avoid 400/422 errors

## Related Skills

- [Pax8 Companies](../companies/SKILL.md) - Company management
- [Pax8 Products](../products/SKILL.md) - Product catalog
- [Pax8 Subscriptions](../subscriptions/SKILL.md) - Subscription lifecycle
- [Pax8 Orders](../orders/SKILL.md) - Order management
- [Pax8 Invoices](../invoices/SKILL.md) - Invoice and billing
