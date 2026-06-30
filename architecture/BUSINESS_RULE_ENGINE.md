# Business Rule Engine

**Project:** EMA Bakery Distribution Management System

**Version:** 1.0

**Status:** Enterprise Architecture Standard

---

## 1. Purpose

The Business Rule Engine (BRE) is the authoritative source for every business rule governing the EMA Bakery Distribution Management System.

Its purpose is to separate business decisions from user interfaces, workflows, repositories, database queries, and infrastructure.

Business rules describe **what the business allows or prohibits**, while workflows describe **how the system executes operations**.

Every business rule must exist in this document before it is implemented in code.

---

## 2. Objectives

The Business Rule Engine exists to:

* Centralize all business rules.
* Prevent duplicate business logic.
* Ensure consistent behavior across the application.
* Simplify auditing.
* Simplify testing.
* Allow controlled evolution of business policies.
* Support future configuration-driven rules.

---

## 3. Guiding Principles

Every business rule must be:

* Explicit
* Testable
* Documented
* Deterministic
* Versioned
* Traceable
* Independent of UI

Business rules never reside inside:

* React Components
* Pages
* Layouts
* API Routes
* SQL Queries
* Repositories

They are evaluated within Domain Services and Workflows.

---

## 4. Rule Classification

Business rules are classified into the following categories:

### Authentication Rules

* Session timeout
* Password policy
* Login restrictions
* Account lockout

---

### Authorization Rules

* Role permissions
* Feature permissions
* Resource ownership
* Administrative privileges

---

### Salesperson Rules

* Active status
* Credit limits
* Outstanding balances
* Dispatch eligibility

---

### Product Rules

* Active products only
* Valid pricing required
* Product availability

---

### Pricing Rules

* One active price version per salesperson and product.
* Historical prices are immutable.
* Future prices require an effective date.
* Draft prices cannot be used in dispatches.

---

### Dispatch Rules

* Dispatch requires an active salesperson.
* Dispatch requires at least one product.
* Quantities must be greater than zero.
* Products must exist.
* Prices must resolve successfully.
* Dispatch numbers are unique.
* Posted dispatches cannot be edited.
* Cancelled dispatches cannot be reposted.

---

### Ledger Rules

* Every financial movement creates a ledger entry.
* Ledger entries are immutable.
* Reversals create balancing entries.
* Running balances are system-calculated only.

---

### Payment Rules

* Payment amount must be greater than zero.
* Payments cannot exceed configurable limits without approval.
* Payment reversals require elevated permission.
* Every payment generates a receipt.

---

### Reporting Rules

* Reports are read-only.
* Reports never modify data.
* Exports reflect current authorization.

---

## 5. Authentication Rules

### BR-AUTH-001

Only active users may authenticate.

---

### BR-AUTH-002

Locked users cannot authenticate.

---

### BR-AUTH-003

Inactive users cannot authenticate.

---

### BR-AUTH-004

Session timeout is configurable.

---

### BR-AUTH-005

Logout invalidates all session tokens immediately.

---

## 6. Authorization Rules

### BR-AUTHZ-001

Every protected action requires permission validation.

---

### BR-AUTHZ-002

Permissions are evaluated on the server.

---

### BR-AUTHZ-003

Client-side permission checks are advisory only.

---

### BR-AUTHZ-004

Administrative actions require explicit administrative permissions.

---

## 7. Salesperson Rules

### BR-SP-001

Salesperson must be active before dispatch creation.

---

### BR-SP-002

Frozen salespersons cannot receive dispatches.

---

### BR-SP-003

Credit limit validation occurs before dispatch posting.

---

### BR-SP-004

Outstanding balances are calculated from the ledger only.

---

### BR-SP-005

Salesperson deletion is prohibited.

Inactive status is used instead.

---

## 8. Product Rules

### BR-PROD-001

Only active products appear in dispatch selection.

---

### BR-PROD-002

Archived products remain available for historical reporting.

---

### BR-PROD-003

Products require a valid category.

---

### BR-PROD-004

Products cannot be dispatched without an active price.

---

## 9. Pricing Rules

### BR-PRICE-001

Each salesperson-product combination has only one active price.

---

### BR-PRICE-002

Price history is immutable.

---

### BR-PRICE-003

Price modifications create new versions.

---

### BR-PRICE-004

Effective dates cannot overlap.

---

### BR-PRICE-005

Expired prices cannot be used.

---

## 10. Dispatch Rules

### BR-DISP-001

Dispatch numbers must be unique.

---

### BR-DISP-002

Dispatch requires authentication.

---

### BR-DISP-003

Dispatch requires authorization.

---

### BR-DISP-004

Dispatch requires a valid salesperson.

---

### BR-DISP-005

Dispatch requires valid pricing.

---

### BR-DISP-006

Dispatch totals are calculated by the system.

Manual totals are prohibited.

---

### BR-DISP-007

Posted dispatches become read-only.

---

### BR-DISP-008

Cancellation creates reversing ledger entries.

---

## 11. Ledger Rules

### BR-LEDGER-001

Every debit creates a ledger transaction.

---

### BR-LEDGER-002

Every credit creates a ledger transaction.

---

### BR-LEDGER-003

Ledger balances are never manually edited.

---

### BR-LEDGER-004

Reversals preserve historical accuracy.

---

### BR-LEDGER-005

Ledger history cannot be deleted.

---

## 12. Payment Rules

### BR-PAY-001

Payments require authentication.

---

### BR-PAY-002

Payments require authorization.

---

### BR-PAY-003

Payments require a valid salesperson.

---

### BR-PAY-004

Payment reversals create compensating entries.

---

### BR-PAY-005

Receipts are generated automatically.

---

## 13. Notification Rules

### BR-NOTIFY-001

Successful dispatch posting queues WhatsApp delivery when enabled.

---

### BR-NOTIFY-002

Notification failures never roll back completed business transactions.

---

### BR-NOTIFY-003

Retry policy follows system configuration.

---

## 14. Audit Rules

Every critical operation generates an audit entry.

Examples:

* Login
* Logout
* User Creation
* User Update
* Dispatch Creation
* Dispatch Cancellation
* Payment Recording
* Payment Reversal
* Price Update
* Permission Change
* System Configuration Change

Audit entries are append-only.

---

## 15. Rule Evaluation Order

Every workflow evaluates rules in the following order:

```text
Authentication

↓

Authorization

↓

Input Validation

↓

Business Rule Validation

↓

Domain Logic

↓

Database Transaction

↓

Publish Events

↓

Audit

↓

Notifications

↓

Success
```

No business rule evaluation occurs after the database transaction has been committed.

---

## 16. Rule Versioning

Business rules evolve over time.

Each rule has:

* Rule Identifier
* Version
* Status
* Effective Date
* Description
* Owner

Historical rule definitions remain documented for audit purposes.

---

## 17. Future Configuration

Selected rules will become configurable through the System Settings module.

Examples:

* Session timeout
* Credit warning threshold
* Maximum payment without approval
* WhatsApp enable/disable
* Dispatch number format
* Receipt footer
* Default currency

Rules affecting financial integrity remain hard-coded and require software changes.

---

## 18. Governance

Every new business capability must identify and document its business rules before implementation.

Rule changes require:

* Business approval
* Architecture review
* Documentation update
* Test updates
* Version increment

No implementation may contradict this document.

---

## Conclusion

The Business Rule Engine defines the operational policies that govern the EMA Bakery Distribution Management System.

By separating business decisions from workflows and infrastructure, the platform remains predictable, testable, maintainable, and auditable.

This document is the single source of truth for all business behavior and must be consulted before implementing or modifying any feature.
