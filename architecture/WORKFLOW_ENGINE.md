# Workflow Engine Architecture

**Project:** EMA Bakery Distribution Management System

**Version:** 1.0

**Status:** Enterprise Architecture Standard

---

## 1. Purpose

The Workflow Engine is the operational heart of the EMA Bakery Distribution Management System.

It is responsible for orchestrating every business operation from start to finish while ensuring consistency, security, auditability, and transactional integrity.

A workflow is the only approved mechanism for executing business operations.

Pages, components, Server Actions, Edge Functions, and services **must never** bypass the Workflow Engine to directly execute business logic.

---

## 2. Objectives

The Workflow Engine exists to achieve the following goals:

- Centralize business execution.
- Standardize all business operations.
- Prevent duplicated business logic.
- Guarantee audit logging.
- Guarantee permission validation.
- Guarantee business rule validation.
- Guarantee transactional consistency.
- Provide deterministic execution.
- Simplify testing.
- Simplify debugging.
- Improve maintainability.
- Support future automation.

---

## 3. Core Principles

Every workflow must satisfy the following principles.

### Deterministic

The same input always produces the same result.

---

### Auditable

Every execution produces an audit trail.

---

### Idempotent

Executing the same request multiple times must never produce duplicate business records.

---

### Atomic

Either the entire workflow succeeds or the entire workflow fails.

Partial completion is prohibited unless explicitly designed with compensation logic.

---

### Observable

Every workflow publishes execution metrics.

Execution time.

Status.

Failures.

Correlation ID.

User.

Device.

IP Address.

---

### Recoverable

Recoverable failures may be retried.

Non-recoverable failures terminate immediately.

---

## 4. Standard Workflow Lifecycle

Every workflow follows the exact execution sequence below.

```
Incoming Request
        │
        ▼
Authentication Validation
        │
        ▼
Authorization Validation
        │
        ▼
Input Validation
        │
        ▼
Business Rule Validation
        │
        ▼
Load Required Data
        │
        ▼
Execute Domain Logic
        │
        ▼
Database Transaction
        │
        ▼
Commit Transaction
        │
        ▼
Publish Events
        │
        ▼
Write Audit Log
        │
        ▼
Queue Notifications
        │
        ▼
Return Typed Response
```

No workflow may alter this execution order without documented architectural approval.

---

## 5. Workflow Categories

### Authentication Workflows

- Login
- Logout
- Refresh Session
- Change Password
- Reset Password
- Verify Session

---

### User Administration Workflows

- Create User
- Update User
- Disable User
- Enable User
- Assign Role
- Remove Role

---

### Salesperson Workflows

- Create Salesperson
- Update Salesperson
- Freeze Salesperson
- Activate Salesperson
- Update Credit Limit
- Generate Statement

---

### Product Workflows

- Create Product
- Update Product
- Archive Product
- Restore Product

---

### Pricing Workflows

- Create Price Version
- Activate Price Version
- Bulk Price Update
- Schedule Price Update

---

### Dispatch Workflows

- Create Dispatch
- Edit Dispatch
- Post Dispatch
- Cancel Dispatch
- Print Dispatch
- Reprint Dispatch
- Generate Dispatch PDF

---

### Ledger Workflows

- Create Ledger Entry
- Reverse Ledger Entry
- Recalculate Ledger
- Generate Statement

---

### Payment Workflows

- Record Payment
- Reverse Payment
- Allocate Payment
- Generate Receipt

---

### Reporting Workflows

- Generate Report
- Export PDF
- Export Excel
- Schedule Report

---

### Notification Workflows

- Send WhatsApp
- Retry WhatsApp
- Send Email (Future)
- Send Push Notification (Future)

---

## 6. Dispatch Workflow

Dispatch creation is the most critical workflow in the system.

Execution sequence:

```
User Creates Dispatch

↓

Validate Authentication

↓

Validate Permission

↓

Validate Salesperson

↓

Validate Customer Status

↓

Validate Credit Limit

↓

Load Active Price Version

↓

Validate Product Availability

↓

Calculate Totals

↓

Create Dispatch Header

↓

Create Dispatch Items

↓

Create Ledger Transaction

↓

Update Inventory (Future)

↓

Commit Transaction

↓

Publish DispatchCreated Event

↓

Generate PDF

↓

Queue WhatsApp Notification

↓

Create Audit Log

↓

Return Success
```

Any failure before database commit causes a complete rollback.

---

## 7. Payment Workflow

```
Receive Payment

↓

Authenticate User

↓

Authorize Payment Permission

↓

Validate Customer

↓

Validate Amount

↓

Validate Payment Method

↓

Create Payment Record

↓

Create Ledger Credit

↓

Commit Transaction

↓

Publish PaymentReceived Event

↓

Generate Receipt

↓

Queue WhatsApp Receipt

↓

Audit Log

↓

Return Success
```

---

## 8. Price Update Workflow

```
Validate Permission

↓

Load Current Price Version

↓

Create New Price Version

↓

Expire Previous Version

↓

Commit

↓

Publish PriceUpdated Event

↓

Audit

↓

Return Success
```

Historical prices are never modified.

---

## 9. Login Workflow

```
Enter Credentials

↓

Validate Input

↓

Authenticate

↓

Load User

↓

Verify Status

↓

Load Roles

↓

Load Permissions

↓

Create Session

↓

Audit Login

↓

Publish UserLoggedIn Event

↓

Redirect Dashboard
```

---

## 10. Logout Workflow

The logout process always requires user confirmation.

Execution sequence:

```
User Clicks Logout

↓

Display Confirmation Dialog

↓

"Are you sure you want to log out?"

↓

Cancel

OR

Confirm

↓

Destroy Session

↓

Audit Logout

↓

Publish UserLoggedOut Event

↓

Redirect Login
```

Closing the confirmation dialog without confirming does not terminate the session.

---

## 11. Error Handling

Every workflow returns a standardized result object.

Possible states:

- Success
- Validation Failure
- Authorization Failure
- Business Rule Failure
- Infrastructure Failure
- External Integration Failure
- Unexpected Failure

Unexpected failures are automatically logged with a Correlation ID.

---

## 12. Compensation Strategy

Certain operations require compensating actions instead of deletion.

Examples:

- Payment reversal creates a reversing ledger entry.
- Dispatch cancellation creates reversing financial transactions.
- Price changes create a new version.
- Permission changes create a new audit record.

Data is never silently overwritten.

---

## 13. Retry Strategy

Retryable operations include:

- WhatsApp delivery
- Email delivery
- Report generation
- External API calls

Retries use exponential backoff.

Maximum retry attempts are configurable.

---

## 14. Workflow Timeouts

Every workflow has a maximum execution time.

Recommended defaults:

- Login: 5 seconds
- Dispatch: 10 seconds
- Payment: 10 seconds
- Reports: 60 seconds
- Notifications: 30 seconds

Timeouts are configurable through system settings.

---

## 15. Observability

Every workflow execution records:

- Workflow Name
- Workflow ID
- Correlation ID
- User ID
- Execution Start Time
- Execution End Time
- Duration
- Success/Failure
- Error Code
- Device Information
- IP Address

These metrics support monitoring, diagnostics, and performance optimization.

---

## 16. Workflow Governance

All new business operations must be implemented as workflows.

Workflows are version-controlled.

Changes to existing workflows require:

- Architecture review
- Documentation update
- Test updates
- Audit validation

No production feature may bypass the Workflow Engine.

---

## Conclusion

The Workflow Engine is the execution backbone of the EMA Bakery Distribution Management System.

By enforcing standardized execution, validation, auditing, transactional integrity, and event publication, it guarantees that every business process behaves consistently across the application.

Every business capability—from authentication to dispatch, payments, reporting, and notifications—must be implemented as a governed workflow following the principles defined in this document.
