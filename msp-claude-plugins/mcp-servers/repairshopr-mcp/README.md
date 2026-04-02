# RepairShopr MCP Server

A Model Context Protocol (MCP) server for RepairShopr, implementing a decision tree architecture for efficient tool navigation.


## Features

- **Decision Tree Architecture**: Tools are organized by domain and loaded lazily
- **Domain Navigation**: Navigate between customers, tickets, assets, contacts, and invoices
- **Lazy Loading**: Domain handlers and the RepairShopr client are loaded on-demand
- **Full RepairShopr API Coverage**: Access to key RepairShopr functionality

## Installation

```bash
git clone https://github.com/drewrox2009/local-msp-claude-plugins.git
cd local-msp-claude-plugins/msp-claude-plugins/mcp-servers/repairshopr-mcp
npm install
npm run build
```

## Configuration

Set the following environment variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `REPAIRSHOPR_API_KEY` | Yes | Your RepairShopr API key |
| `REPAIRSHOPR_SUBDOMAIN` | No | Your RepairShopr subdomain (if applicable) |

### Getting Your API Key

1. Log in to your RepairShopr account
2. Navigate to Settings > API Tokens
3. Generate a new API token with appropriate permissions

## Usage

### With Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "repairshopr": {
      "command": "node",
      "args": ["/path/to/repairshopr-mcp/dist/index.js"],
      "env": {
        "REPAIRSHOPR_API_KEY": "your-api-key"
      }
    }
  }
}
```

### With Docker

```bash
docker build -t repairshopr-mcp .

docker run -e REPAIRSHOPR_API_KEY=your-api-key repairshopr-mcp
```

## Architecture

### Decision Tree Navigation

The server uses a hierarchical approach to tool discovery:

1. **Initial State**: Only navigation and status tools are exposed
2. **After Navigation**: Domain-specific tools become available
3. **Back Navigation**: Return to the main menu to switch domains

This reduces cognitive load and improves LLM tool selection accuracy.

### Available Domains

| Domain | Description | Tools |
|--------|-------------|-------|
| `customers` | Manage customer accounts | list, get, create, search |
| `tickets` | Manage support tickets | list, get, create, update, add_comment |
| `assets` | Manage configuration items | list, get, search |
| `contacts` | Manage customer contacts | list, get, create |
| `invoices` | View and manage billing | list, get, create, email |

## Tools Reference

### Navigation Tools

#### repairshopr_navigate
Navigate to a domain to access its tools.

```json
{
  "domain": "customers" | "tickets" | "assets" | "contacts" | "invoices"
}
```

#### repairshopr_back
Return to the main menu from any domain.

#### repairshopr_status
Show current navigation state and credential status.

### Customers Domain

#### repairshopr_customers_list
List customers with optional filters.

```json
{
  "query": "search term",
  "business_name": "Company Inc",
  "email": "contact@example.com",
  "include_disabled": false,
  "page": 1,
  "per_page": 25
}
```

#### repairshopr_customers_get
Get a specific customer by ID.

```json
{
  "customer_id": 123
}
```

#### repairshopr_customers_create
Create a new customer.

```json
{
  "business_name": "Acme Corp",
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@acme.com"
}
```

#### repairshopr_customers_search
Search customers by query string.

```json
{
  "query": "acme",
  "limit": 25
}
```

### Tickets Domain

#### repairshopr_tickets_list
List tickets with optional filters.

```json
{
  "customer_id": 123,
  "status": "Open",
  "user_id": 456,
  "resolved": false
}
```

#### repairshopr_tickets_get
Get a specific ticket by ID.

```json
{
  "ticket_id": 789
}
```

#### repairshopr_tickets_create
Create a new ticket.

```json
{
  "customer_id": 123,
  "subject": "Network Issue",
  "problem_type": "Network",
  "comment_body": "Initial description"
}
```

#### repairshopr_tickets_update
Update an existing ticket.

```json
{
  "ticket_id": 789,
  "status": "Resolved",
  "user_id": 456
}
```

#### repairshopr_tickets_add_comment
Add a comment to a ticket.

```json
{
  "ticket_id": 789,
  "body": "Comment text",
  "hidden": false
}
```

### Assets Domain

#### repairshopr_assets_list
List assets with optional filters.

```json
{
  "customer_id": 123,
  "asset_type": "Desktop"
}
```

#### repairshopr_assets_get
Get a specific asset by ID.

```json
{
  "asset_id": 456
}
```

#### repairshopr_assets_search
Search assets by query or serial number.

```json
{
  "query": "workstation",
  "asset_serial": "SN12345"
}
```

### Contacts Domain

#### repairshopr_contacts_list
List contacts with optional filters.

```json
{
  "customer_id": 123,
  "query": "john"
}
```

#### repairshopr_contacts_get
Get a specific contact by ID.

```json
{
  "contact_id": 789
}
```

#### repairshopr_contacts_create
Create a new contact.

```json
{
  "customer_id": 123,
  "name": "Jane Smith",
  "email": "jane@example.com"
}
```

### Invoices Domain

#### repairshopr_invoices_list
List invoices with optional filters.

```json
{
  "customer_id": 123,
  "status": "sent",
  "since_date": "2024-01-01"
}
```

#### repairshopr_invoices_get
Get a specific invoice by ID.

```json
{
  "invoice_id": 456
}
```

#### repairshopr_invoices_create
Create a new invoice.

```json
{
  "customer_id": 123,
  "due_date": "2024-02-01"
}
```

#### repairshopr_invoices_email
Email an invoice to the customer.

```json
{
  "invoice_id": 456,
  "subject": "Your Invoice"
}
```

## Rate Limiting

RepairShopr API has a rate limit of 180 requests per minute. This fork uses a vendored Syncro client internally and preserves the same request throttling behavior.

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run in development
npm run dev

# Type check
npm run typecheck

# Lint
npm run lint
```

## License

Apache-2.0
