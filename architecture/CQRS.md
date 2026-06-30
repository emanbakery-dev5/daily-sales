# Command Query Responsibility Segregation (CQRS)

**Project:** EMA Bakery Distribution Management System

**Version:** 1.0

**Status:** Enterprise Architecture Standard

---

## 1. Purpose

The EMA Bakery Distribution Management System adopts **Command Query Responsibility Segregation (CQRS)** to separate operations that modify data from operations that retrieve data.

This architectural pattern improves maintainability, scalability, security, testing, and long-term system evolution.

CQRS is implemented at the application layer while maintaining a single PostgreSQL database within Supabase.

This is **logical CQRS**, not physical database segregation.

---

## 2. Core Philosophy

The system separates responsibilities into two categories:

### Commands

Commands change the state of the system.

Commands always execute business rules.

Commands always require authorization.

Commands always create audit logs.

Commands may publish events.

Commands never return complex business data.

---

### Queries

Queries retrieve information.

Queries never modify data.

Queries never publish events.

Queries never execute business logic.

Queries may optimize reads for performance.

Queries may aggregate information from multiple sources.

---

## 3. Command Pipeline

Every command follows the exact execution pipeline.

```text
Incoming Request

↓

Authentication

↓

Authorization

↓

Input Validation

↓

Business Rule Validation

↓

Workflow Execution

↓

Repository Layer

↓

Database Transaction

↓

Commit

↓

Publish Events

↓

Audit Log

↓

Return Success
```

No command may bypass this pipeline.

---

## 4. Query Pipeline

Every query follows the exact execution pipeline.

```text
Incoming Request

↓

Authentication

↓

Authorization

↓

Input Validation

↓

Repository

↓

Projection

↓

Formatting

↓

Return Data
```

Queries never perform mutations.

---

## 5. Command Characteristics

Every command:

* Changes state
* Runs inside a workflow
* Executes inside a transaction
* Creates audit entries
* May publish events
* Returns typed responses
* Is idempotent where applicable

---

## 6. Query Characteristics

Every query:

* Is read-only
* Does not publish events
* Does not create audit entries unless required for compliance
* May use caching
* May use pagination
* May use optimized SQL views
* May aggregate data

---

## 7. Command Catalogue

The following operations are implemented as commands.

### Authentication Commands

* Login
* Logout
* Change Password
* Reset Password
* Refresh Session

---

### User Commands

* Create User
* Update User
* Disable User
* Enable User
* Assign Role
* Remove Role

---

### Salesperson Commands

* Create Salesperson
* Update Salesperson
* Freeze Salesperson
* Activate Salesperson
* Update Credit Limit

---

### Product Commands

* Create Product
* Update Product
* Archive Product
* Restore Product

---

### Pricing Commands

* Create Price Version
* Activate Price Version
* Bulk Price Update
* Delete Draft Price Version

Historical price records are never modified.

---

### Dispatch Commands

* Create Dispatch
* Update Dispatch
* Cancel Dispatch
* Print Dispatch
* Reprint Dispatch
* Approve Dispatch

---

### Payment Commands

* Record Payment
* Reverse Payment
* Allocate Payment

---

### Ledger Commands

* Create Ledger Entry
* Reverse Ledger Entry
* Recalculate Ledger

---

### Notification Commands

* Send WhatsApp
* Retry WhatsApp
* Send Email

---

## 8. Query Catalogue

The following operations are implemented as queries.

---

### Dashboard Queries

* Daily Summary
* Weekly Summary
* Monthly Summary
* Outstanding Balance
* Sales Summary
* Collection Summary

---

### Salesperson Queries

* Salesperson Details
* Customer Statement
* Payment History
* Dispatch History
* Outstanding Balance

---

### Product Queries

* Product Catalogue
* Product Pricing
* Product Categories

---

### Dispatch Queries

* Dispatch Details
* Dispatch History
* Daily Dispatches
* Monthly Dispatches

---

### Ledger Queries

* Running Ledger
* Ledger Statement
* Financial History

---

### Payment Queries

* Payment History
* Payment Summary
* Payment Receipt

---

### Reporting Queries

* Daily Reports
* Weekly Reports
* Monthly Reports
* Product Reports
* Customer Reports
* Outstanding Reports

---

## 9. Validation Strategy

Validation is performed before command execution.

Validation occurs in four stages.

### Stage One

Input Validation

Example

Required fields

Numeric values

Date formats

UUID validation

---

### Stage Two

Permission Validation

Examples

Can Create Dispatch

Can Reverse Payment

Can Manage Users

---

### Stage Three

Business Rule Validation

Examples

Credit Limit

Duplicate Dispatch

Inactive Customer

Invalid Price Version

---

### Stage Four

Repository Validation

Examples

Entity Exists

Foreign Key Exists

Unique Constraint

---

## 10. Transaction Boundaries

Every command executes inside a database transaction.

If any step fails:

* Rollback Transaction
* Publish No Events
* Return Error

Queries never create transactions unless explicitly required by PostgreSQL.

---

## 11. Read Model Strategy

Queries may use optimized read models.

Examples

Dashboard View

Sales Summary View

Outstanding Balance View

Monthly Statistics View

Read models improve performance while keeping command models normalized.

---

## 12. Caching Strategy

Caching applies only to queries.

Examples

Product Catalogue

Categories

Permissions

Configuration

Reference Data

Commands always bypass cache.

Successful commands invalidate affected cache entries.

---

## 13. Security

Every command validates:

* Authentication
* Authorization
* Business Rules
* Ownership
* Audit Requirements

Every query validates:

* Authentication
* Authorization
* Row-Level Security (RLS)

No client-side permission checks are trusted.

---

## 14. Error Handling

Command failures include:

* Validation Error
* Permission Error
* Business Rule Error
* Infrastructure Error
* External Integration Error

Query failures include:

* Validation Error
* Permission Error
* Data Not Found
* Infrastructure Error

All failures include a Correlation ID for traceability.

---

## 15. Governance

New features must first be classified as either a Command or a Query.

Mixed responsibilities are prohibited.

If an operation both reads and writes data, the write operation is implemented as a Command, and any required data retrieval is handled separately.

This separation maintains architectural clarity and simplifies future maintenance.

---

## Conclusion

CQRS is a foundational architectural pattern within the EMA Bakery Distribution Management System.

By separating commands from queries, the platform achieves clearer business workflows, stronger security, improved scalability, simplified testing, and better performance optimization.

Every future feature must conform to the CQRS standards defined in this document.
