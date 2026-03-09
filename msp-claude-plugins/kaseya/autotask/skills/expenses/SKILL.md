---
description: >
  Use this skill when working with Autotask expense reports and expense items -
  creating expense reports, adding line items, searching and retrieving expenses,
  tracking reimbursements, and managing expense categories. Covers expense report
  lifecycle, expense item fields, billability, receipt tracking, and payment types.
  Essential for MSP teams managing travel, subscriptions, and operational costs.
triggers:
  - autotask expense
  - expense report
  - expense item
  - create expense
  - add expense
  - reimbursement
  - receipt tracking
  - expense category
  - travel expense
  - subscription expense
  - expense approval
  - expense submission
---

# Autotask Expense Management

## Overview

Expense reports and expense items track non-labor costs in Autotask. Expense reports are containers that group individual expense line items for submission and approval. Each item represents a specific cost (subscriptions, travel, supplies, etc.) with category, amount, receipt status, and billability. This skill covers the full expense lifecycle from creation through approval.

## Entity Relationship

```
Expense Report (container)
├── Expense Item 1 (line item)
├── Expense Item 2 (line item)
└── Expense Item N (line item)
```

- An **Expense Report** groups items for a submission period (typically a week)
- **Expense Items** are individual costs attached to a report
- Items reference a company (or 0 for internal expenses)

## Available MCP Tools

| Tool | Description |
|------|-------------|
| `autotask_get_expense_report` | Get a specific expense report by ID |
| `autotask_search_expense_reports` | Search expense reports with filters |
| `autotask_create_expense_report` | Create a new expense report |
| `autotask_create_expense_item` | Add a line item to an existing report |

## Expense Report Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | int | System | Auto-generated unique identifier |
| `name` | string | Yes | Report name (e.g., "Week ending 2026-01-05") |
| `description` | string | No | Report description |
| `submitterID` | int | Yes | Resource ID of the person submitting |
| `weekEndingDate` | string | No | Week ending date (YYYY-MM-DD) |
| `submitDate` | date | System | Date report was submitted |
| `approvedDate` | date | System | Date report was approved |
| `status` | int | System | Current approval status |
| `totalAmount` | decimal | System | Calculated sum of all items |

## Expense Item Fields

### Core Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | int | System | Auto-generated unique identifier |
| `expenseReportID` | int | Yes | Parent expense report ID |
| `description` | string | Yes | Line item description |
| `expenseDate` | string | Yes | Date of expense (YYYY-MM-DD) |
| `expenseCategory` | int | Yes | Expense category picklist ID |
| `expenseCurrencyExpenseAmount` | decimal | Yes | Amount in expense currency |

### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `companyID` | int | 0 | Associated company (0 = internal) |
| `haveReceipt` | boolean | false | Whether a receipt is attached |
| `isBillableToCompany` | boolean | false | Whether billable to the company |
| `isReimbursable` | boolean | true | Whether reimbursable to submitter |
| `paymentType` | int | 10 | Payment type picklist ID |

## Common Expense Categories

Expense categories are picklist values that vary by Autotask instance. Use `autotask_get_field_info` with entity type `ExpenseItem` and field name `expenseCategory` to retrieve available categories. Common examples:

| Category | Typical Use |
|----------|------------|
| Software/Subscriptions | SaaS tools, licenses |
| Travel - Mileage | Driving to client sites |
| Travel - Airfare | Flights |
| Travel - Lodging | Hotels |
| Meals & Entertainment | Client dinners, team meals |
| Office Supplies | Hardware, peripherals |
| Training & Certification | Courses, exam fees |
| Telecommunications | Phone, internet |

## Payment Types

Payment types are picklist values. Common IDs:

| ID | Type | Description |
|----|------|-------------|
| 10 | Credit Card | Company or personal credit card |
| 11 | Cash | Cash payment |
| 12 | Check | Check payment |
| 13 | Other | Other payment method |

> **Note:** Payment type IDs vary by Autotask instance. Use `autotask_get_field_info` with entity `ExpenseItem` and field `paymentType` to get your instance's values.

## API Patterns

### Creating an Expense Report

```json
{
  "name": "Week ending 2026-01-05",
  "description": "January week 1 expenses",
  "submitterId": 29744150,
  "weekEndingDate": "2026-01-05"
}
```

### Adding an Expense Item

```json
{
  "expenseReportId": 21,
  "description": "Azure subscription - Production environment",
  "expenseDate": "2026-01-02",
  "expenseCategory": 29683500,
  "amount": 999.99,
  "companyId": 174,
  "haveReceipt": true,
  "isBillableToCompany": true,
  "isReimbursable": false,
  "paymentType": 10
}
```

### Searching Expense Reports

```json
{
  "submitterId": 29744150,
  "status": 0,
  "pageSize": 25
}
```

### Full Workflow Example

```
1. Create expense report
   └─ autotask_create_expense_report
      { name: "Week ending 2026-01-05", submitterId: 29744150 }
      → Returns reportId: 21

2. Add line items
   └─ autotask_create_expense_item
      { expenseReportId: 21, description: "Azure sub", ... }
   └─ autotask_create_expense_item
      { expenseReportId: 21, description: "Client lunch", ... }

3. Verify report
   └─ autotask_get_expense_report
      { reportId: 21 }
```

## Billability Rules

| Scenario | Billable? | Reimbursable? | Example |
|----------|-----------|---------------|---------|
| Client-specific cost | Yes | No | Software license for client project |
| Internal tool | No | No | Company SaaS subscription |
| Employee travel for client | Yes | Yes | Mileage to client site |
| Employee travel internal | No | Yes | Mileage to training |
| Company credit card | Varies | No | Already paid by company |
| Personal card for client | Yes | Yes | Out-of-pocket for client |

### Decision Logic

```
Is this expense for a specific client?
├── Yes → isBillableToCompany: true, set companyID
│         Was it paid out of pocket?
│         ├── Yes → isReimbursable: true
│         └── No  → isReimbursable: false
└── No  → isBillableToCompany: false, companyID: 0
          Was it paid out of pocket?
          ├── Yes → isReimbursable: true
          └── No  → isReimbursable: false
```

## Business Rules

### Receipt Requirements

| Amount Threshold | Receipt Required | Policy |
|-----------------|------------------|--------|
| < $25 | Optional | Low-value transactions |
| $25 - $75 | Recommended | Standard business practice |
| > $75 | Required | Audit compliance |
| Any billable | Required | Client invoicing support |

### Date Validation

- `expenseDate` must be in YYYY-MM-DD format
- Date should fall within the expense report's period
- Future dates may be rejected depending on Autotask configuration
- Backdating beyond 90 days may require manager override

### Amount Validation

- Amount must be positive
- Use the expense currency amount field (`expenseCurrencyExpenseAmount` in the API)
- Currency conversion is handled by Autotask if multi-currency is enabled

## Error Handling

### Common Errors

| Error | Cause | Resolution |
|-------|-------|------------|
| Invalid expenseReportID | Report doesn't exist | Verify report ID with search |
| Missing required fields | Incomplete item data | Include all required fields |
| Invalid expenseCategory | Category ID not found | Use `autotask_get_field_info` to get valid IDs |
| Report already submitted | Can't add to submitted report | Create new report or reopen |
| Invalid date format | Wrong date string | Use YYYY-MM-DD format |

## Best Practices

1. **Name reports consistently** - Use "Week ending YYYY-MM-DD" for weekly reports
2. **Attach receipts** - Set `haveReceipt: true` when receipt is available
3. **Categorize accurately** - Use correct expense categories for reporting
4. **Set billability upfront** - Determine client billability at creation time
5. **Group by period** - One report per week or per trip
6. **Include descriptions** - Descriptive line items speed up approval
7. **Link to companies** - Associate client expenses with the correct `companyID`
8. **Verify before submission** - Review all items before submitting the report

## Related Skills

- [Autotask Time Entries](../time-entries/SKILL.md) - Time tracking and billing
- [Autotask Contracts](../contracts/SKILL.md) - Service agreements and billing terms
- [Autotask Projects](../projects/SKILL.md) - Project cost tracking
- [Autotask API Patterns](../api-patterns/SKILL.md) - Query builder and authentication
