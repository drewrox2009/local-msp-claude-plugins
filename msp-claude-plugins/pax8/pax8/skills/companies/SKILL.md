---
description: >
  Use this skill when working with Pax8 companies (MSP clients) -
  creating, searching, updating, and managing client records in the
  Pax8 marketplace. Covers company fields, contact management, billing
  settings, and cross-referencing with subscriptions and orders.
triggers:
  - pax8 company
  - pax8 client
  - pax8 organization
  - pax8 customer
  - company lookup pax8
  - company management pax8
  - pax8 contact
  - client management pax8
---

# Pax8 Companies Management

## Overview

Companies in Pax8 represent the MSP's client organizations. Each company is associated with subscriptions, orders, invoices, and contacts. When an MSP provisions cloud software through Pax8, it is always tied to a specific company record. Companies are the foundational entity for all marketplace operations -- products are ordered for companies, subscriptions belong to companies, and invoices are generated per company.

## Key Concepts

### Company Lifecycle

Companies in Pax8 follow a straightforward lifecycle:

| Stage | Description | Typical Actions |
|-------|-------------|-----------------|
| Creation | New client added to Pax8 | Set name, address, billing preferences |
| Active | Client with active subscriptions | Order products, manage licenses |
| Inactive | No active subscriptions | Review for reactivation or cleanup |

### Company vs. Partner

In Pax8's model:

- **Partner** - Your MSP organization (the authenticated API user)
- **Company** - Your MSP's clients (the end customers you manage)

The API operates from the Partner perspective. All company operations are scoped to your partner account.

### Billing Configuration

Companies have billing-related settings that control how Pax8 invoices are handled:

| Setting | Description |
|---------|-------------|
| `billOnBehalfOfEnabled` | Whether the MSP bills the client directly through Pax8 |
| `selfServiceAllowed` | Whether the client can self-manage subscriptions |
| `orderApprovalRequired` | Whether orders require MSP approval before provisioning |

## Field Reference

### Core Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | System | Auto-generated unique identifier |
| `name` | string | Yes | Company name |
| `phone` | string | No | Phone number |
| `website` | string | No | Company website URL |
| `status` | string | System | Company status |
| `externalId` | string | No | External reference ID (for PSA integration) |
| `billOnBehalfOfEnabled` | boolean | No | Bill-on-behalf-of setting |
| `selfServiceAllowed` | boolean | No | Self-service access |
| `orderApprovalRequired` | boolean | No | Require order approval |
| `createdDate` | datetime | System | Creation timestamp |

### Address Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address.street` | string | No | Street address |
| `address.city` | string | No | City |
| `address.stateOrProvince` | string | No | State or province |
| `address.postalCode` | string | No | Postal/ZIP code |
| `address.country` | string | No | Country code (e.g., "US") |

### Contact Fields

Contacts are managed as a sub-resource of companies:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | System | Contact unique identifier |
| `firstName` | string | Yes | First name |
| `lastName` | string | Yes | Last name |
| `email` | string | Yes | Email address |
| `phone` | string | No | Phone number |
| `types` | array | No | Contact types (e.g., "Admin", "Billing", "Technical") |

## API Patterns

### List Companies

```http
GET /v1/companies
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**With Pagination and Sorting:**

```http
GET /v1/companies?page=0&size=50&sort=name,ASC
```

**With Filters:**

```http
GET /v1/companies?city=Springfield&stateOrProvince=IL
GET /v1/companies?selfServiceAllowed=true
```

### curl Examples

```bash
# List all companies (first page)
curl -s "https://api.pax8.com/v1/companies?page=0&size=50&sort=name,ASC" \
  -H "Authorization: Bearer $TOKEN"

# Filter by state
curl -s "https://api.pax8.com/v1/companies?stateOrProvince=IL&page=0&size=50" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Single Company

```http
GET /v1/companies/a1b2c3d4-e5f6-7890-abcd-ef1234567890
Authorization: Bearer YOUR_TOKEN
```

```bash
curl -s "https://api.pax8.com/v1/companies/a1b2c3d4-e5f6-7890-abcd-ef1234567890" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**

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
  "externalId": "PSA-12345",
  "billOnBehalfOfEnabled": false,
  "selfServiceAllowed": false,
  "orderApprovalRequired": false,
  "createdDate": "2024-01-15T10:30:00.000Z"
}
```

### Create Company

```http
POST /v1/companies
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```

```json
{
  "name": "New Client Corporation",
  "address": {
    "street": "456 Oak Ave",
    "city": "Portland",
    "stateOrProvince": "OR",
    "postalCode": "97201",
    "country": "US"
  },
  "phone": "555-987-6543",
  "website": "https://newclient.com",
  "externalId": "PSA-67890",
  "billOnBehalfOfEnabled": false,
  "selfServiceAllowed": false,
  "orderApprovalRequired": true
}
```

```bash
curl -s -X POST "https://api.pax8.com/v1/companies" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Client Corporation",
    "address": {
      "street": "456 Oak Ave",
      "city": "Portland",
      "stateOrProvince": "OR",
      "postalCode": "97201",
      "country": "US"
    },
    "phone": "555-987-6543",
    "externalId": "PSA-67890"
  }'
```

### Update Company

```http
PUT /v1/companies/a1b2c3d4-e5f6-7890-abcd-ef1234567890
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```

```json
{
  "name": "Acme Corporation",
  "phone": "555-999-0000",
  "website": "https://newsite.acme.com",
  "orderApprovalRequired": true
}
```

### List Contacts for a Company

```http
GET /v1/companies/a1b2c3d4-e5f6-7890-abcd-ef1234567890/contacts
Authorization: Bearer YOUR_TOKEN
```

```bash
curl -s "https://api.pax8.com/v1/companies/a1b2c3d4-e5f6-7890-abcd-ef1234567890/contacts" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**

```json
{
  "page": {
    "size": 50,
    "totalElements": 3,
    "totalPages": 1,
    "number": 0
  },
  "content": [
    {
      "id": "c1d2e3f4-a5b6-7890-cdef-123456789012",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@acme.com",
      "phone": "555-123-4567",
      "types": ["Admin", "Billing"]
    },
    {
      "id": "d2e3f4a5-b6c7-8901-defa-234567890123",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane.doe@acme.com",
      "phone": "555-234-5678",
      "types": ["Technical"]
    }
  ]
}
```

### Create Contact

```http
POST /v1/companies/a1b2c3d4-e5f6-7890-abcd-ef1234567890/contacts
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```

```json
{
  "firstName": "Bob",
  "lastName": "Manager",
  "email": "bob.manager@acme.com",
  "phone": "555-345-6789",
  "types": ["Admin"]
}
```

## Common Workflows

### New Client Onboarding in Pax8

1. **Create company** with basic info (name, address, phone)
2. **Set external ID** to link with your PSA (ConnectWise, Autotask, HaloPSA)
3. **Create contacts** for admin, billing, and technical roles
4. **Configure billing** preferences (bill-on-behalf-of, order approval)
5. **Place initial orders** for required products (Microsoft 365, security, backup)
6. **Verify subscriptions** are provisioned and active

```javascript
async function onboardClient(clientData) {
  // Step 1: Create company
  const company = await pax8Client.request('/companies', {
    method: 'POST',
    body: JSON.stringify({
      name: clientData.name,
      address: {
        street: clientData.street,
        city: clientData.city,
        stateOrProvince: clientData.state,
        postalCode: clientData.zip,
        country: 'US'
      },
      phone: clientData.phone,
      externalId: clientData.psaId,
      orderApprovalRequired: true
    })
  });
  const companyData = await company.json();

  // Step 2: Create primary contact
  await pax8Client.request(`/companies/${companyData.id}/contacts`, {
    method: 'POST',
    body: JSON.stringify({
      firstName: clientData.contactFirst,
      lastName: clientData.contactLast,
      email: clientData.contactEmail,
      types: ['Admin', 'Billing']
    })
  });

  return companyData;
}
```

### Cross-Reference with PSA

Use the `externalId` field to match Pax8 companies with PSA records:

```javascript
async function findByPsaId(psaId) {
  const companies = await fetchAllCompanies();
  return companies.find(c => c.externalId === psaId);
}

async function syncCompanyWithPsa(pax8Company, psaCompany) {
  // Update Pax8 company with PSA external ID if not set
  if (!pax8Company.externalId) {
    await pax8Client.request(`/companies/${pax8Company.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: pax8Company.name,
        externalId: psaCompany.id.toString()
      })
    });
  }
}
```

### Company Audit Report

```javascript
async function generateCompanyAudit() {
  const companies = await fetchAllCompanies();

  const report = [];
  for (const company of companies) {
    // Get subscription count for each company
    const subsResponse = await pax8Client.request(
      `/subscriptions?companyId=${company.id}&status=Active&page=0&size=1`
    );
    const subsData = await subsResponse.json();

    report.push({
      name: company.name,
      id: company.id,
      externalId: company.externalId || 'NOT LINKED',
      city: company.address?.city,
      state: company.address?.stateOrProvince,
      activeSubscriptions: subsData.page.totalElements,
      selfService: company.selfServiceAllowed,
      orderApproval: company.orderApprovalRequired,
      createdDate: company.createdDate
    });
  }

  return report;
}
```

### Bulk Company Export

```javascript
async function exportCompaniesForReconciliation() {
  const companies = await fetchAllCompanies();

  return companies.map(c => ({
    pax8Id: c.id,
    name: c.name,
    externalId: c.externalId,
    city: c.address?.city,
    state: c.address?.stateOrProvince,
    country: c.address?.country,
    phone: c.phone,
    website: c.website,
    billOnBehalf: c.billOnBehalfOfEnabled,
    selfService: c.selfServiceAllowed,
    created: c.createdDate
  }));
}
```

## Error Handling

### Common API Errors

| Code | Message | Resolution |
|------|---------|------------|
| 400 | Name is required | Provide company name in request body |
| 400 | Invalid country code | Use ISO country code (e.g., "US", "CA", "GB") |
| 401 | Unauthorized | Token expired; re-authenticate |
| 404 | Company not found | Verify company UUID |
| 409 | Company name already exists | Use a unique company name |
| 422 | Validation failed | Check field values and formats |

### Validation Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Name required | Missing name field | Add name to request body |
| Invalid UUID | Malformed company ID | Verify UUID format |
| Invalid country | Wrong country format | Use 2-letter ISO code |
| Invalid email | Malformed contact email | Verify email format |

### Error Recovery Pattern

```javascript
async function safeCreateCompany(data) {
  try {
    const response = await pax8Client.request('/companies', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw { status: response.status, message: error.message };
    }

    return await response.json();
  } catch (error) {
    if (error.status === 409) {
      // Company exists - search for it
      const companies = await fetchAllCompanies();
      return companies.find(c => c.name === data.name);
    }

    if (error.status === 401) {
      throw new Error('OAuth2 token expired. Re-authenticate.');
    }

    throw error;
  }
}
```

## Best Practices

1. **Set external IDs** - Always link Pax8 companies to your PSA records using `externalId`
2. **Create contacts** - Add admin, billing, and technical contacts for each company
3. **Enable order approval** - Use `orderApprovalRequired` for new clients until trust is established
4. **Audit regularly** - Review company list quarterly for inactive or orphaned records
5. **Standardize naming** - Use consistent company naming conventions across Pax8 and your PSA
6. **Use pagination** - Always paginate when listing companies; do not assume small result sets
7. **Cache company lists** - Company data changes infrequently; cache for short periods to reduce API calls
8. **Validate before creating** - Search for existing companies before creating duplicates
9. **Track billing config** - Document which companies have bill-on-behalf-of enabled
10. **Sync with PSA** - Regularly verify that Pax8 companies match your PSA company records

## Related Skills

- [Pax8 API Patterns](../api-patterns/SKILL.md) - Authentication and API reference
- [Pax8 Subscriptions](../subscriptions/SKILL.md) - Subscription management per company
- [Pax8 Orders](../orders/SKILL.md) - Ordering products for companies
- [Pax8 Invoices](../invoices/SKILL.md) - Company billing and invoices
- [Pax8 Products](../products/SKILL.md) - Product catalog
