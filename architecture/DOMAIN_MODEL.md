# Domain Model

**Project:** EMA Bakery Distribution Management System

**Version:** 1.0

**Status:** Enterprise Domain Architecture Standard

---

## 1. Purpose

The Domain Model defines the business structure of the EMA Bakery Distribution Management System.

It identifies every core business domain, aggregate, entity, value object, relationship, ownership boundary, lifecycle, and invariant.

This document is the authoritative reference for the business model implemented throughout the application.

---

## 2. Domain-Driven Design Philosophy

The application follows Domain-Driven Design (DDD).

Business capabilities are divided into bounded contexts.

Each bounded context owns:

- Its business rules
- Its data
- Its workflows
- Its services
- Its repositories
- Its events

No domain directly manipulates another domain's internal state.

Communication occurs through published events or approved service contracts.

---

## 3. Core Domains

The platform is composed of the following domains:

- Authentication
- User Administration
- Role & Permission Management
- Salesperson Management
- Product Management
- Product Category Management
- Pricing Management
- Dispatch Management
- Ledger Management
- Payment Management
- Reporting
- Notification
- Audit
- System Configuration

Each domain has a clearly defined ownership boundary.

---

## 4. Aggregate Design

Aggregates enforce business consistency.

Only the Aggregate Root may be modified directly.

### Authentication Aggregate

Aggregate Root:

- User Session

Entities:

- Session
- Login History

---

### User Aggregate

Aggregate Root:

- User

Entities:

- User Profile
- User Role Assignment
- Permission Assignment

---

### Salesperson Aggregate

Aggregate Root:

- Salesperson

Entities:

- Contact Information
- Credit Profile
- Salesperson Status

Value Objects:

- Address
- Phone Number
- Email Address

---

### Product Aggregate

Aggregate Root:

- Product

Entities:

- Product Category
- Product Status

Value Objects:

- SKU
- Unit of Measure

---

### Pricing Aggregate

Aggregate Root:

- Price Version

Entities:

- Price Item

Value Objects:

- Money
- Effective Date

---

### Dispatch Aggregate

Aggregate Root:

- Dispatch

Entities:

- Dispatch Item

Value Objects:

- Quantity
- Unit Price
- Line Total
- Dispatch Number

---

### Ledger Aggregate

Aggregate Root:

- Ledger Account

Entities:

- Ledger Entry

Value Objects:

- Debit
- Credit
- Balance

---

### Payment Aggregate

Aggregate Root:

- Payment

Entities:

- Payment Allocation
- Receipt

Value Objects:

- Payment Amount
- Payment Method

---

### Configuration Aggregate

Aggregate Root:

- Configuration Set

Entities:

- Configuration Item
- Configuration Version

---

## 5. Entity Lifecycle

Each aggregate follows a defined lifecycle.

### Salesperson

Draft

↓

Created

↓

Active

↓

Frozen

↓

Inactive

Archived state is not permitted.

Historical records remain available.

---

### Product

Draft

↓

Active

↓

Inactive

↓

Archived

Archived products remain available for historical reporting.

---

### Dispatch

Draft

↓

Validated

↓

Posted

↓

Printed

↓

Completed

↓

Cancelled

Posted dispatches become immutable.

---

### Payment

Created

↓

Validated

↓

Posted

↓

Allocated

↓

Completed

↓

Reversed (if required)

Reversals create compensating records.

---

## 6. Value Objects

Value Objects are immutable and have no identity.

Examples include:

- Money
- Address
- Quantity
- Weight
- Email Address
- Phone Number
- Date Range
- Credit Limit
- Dispatch Number
- Receipt Number

Value Objects are compared by value rather than identity.

---

## 7. Domain Relationships

The principal relationships are:

- A User may manage many Salespersons.
- A Salesperson has many Dispatches.
- A Dispatch contains many Dispatch Items.
- A Product belongs to one Category.
- A Product has many Price Versions.
- A Salesperson has many Ledger Entries.
- A Salesperson has many Payments.
- A Payment may allocate to one or more Ledger Entries.
- Configuration Sets contain many Configuration Items.
- Audit Entries reference every business domain.

Relationships are enforced through foreign keys and domain services.

---

## 8. Ownership Boundaries

Each domain owns its own data.

Examples:

Authentication owns:

- Sessions
- Login History

User Administration owns:

- Users
- Roles
- Permissions

Salesperson owns:

- Customer Profile
- Credit Profile

Dispatch owns:

- Dispatch Header
- Dispatch Items

Ledger owns:

- Financial History

Payment owns:

- Receipts
- Payment Allocations

Audit owns:

- Audit Entries

Ownership boundaries prevent unintended coupling.

---

## 9. Domain Invariants

The following invariants must always hold true.

### Dispatch

- Must reference an active Salesperson.
- Must contain at least one Dispatch Item.
- Must use active pricing.
- Totals are system-calculated.

---

### Pricing

- Only one active Price Version exists per Product/Salesperson combination.
- Historical prices remain immutable.

---

### Ledger

- Balance is calculated from transactions.
- Ledger Entries are immutable.

---

### Payment

- Payment Amount must be positive.
- Reversals create compensating entries.

---

### User

- Username is unique.
- Email address is unique.
- Roles determine permissions.

Violating an invariant results in command rejection.

---

## 10. Domain Events

Each aggregate publishes business events.

Examples:

Authentication

- UserLoggedIn
- UserLoggedOut

Salesperson

- SalespersonCreated
- SalespersonFrozen

Product

- ProductCreated
- ProductArchived

Pricing

- PriceActivated
- PriceExpired

Dispatch

- DispatchCreated
- DispatchPosted
- DispatchCancelled

Ledger

- LedgerEntryCreated
- LedgerEntryReversed

Payment

- PaymentReceived
- PaymentReversed

Configuration

- ConfigurationUpdated

Audit

- AuditEntryCreated

Events communicate facts across domains.

---

## 11. Domain Services

Domain Services encapsulate business operations that do not naturally belong to a single entity.

Examples:

- Credit Validation Service
- Pricing Resolution Service
- Dispatch Calculation Service
- Ledger Posting Service
- Payment Allocation Service
- Statement Generation Service
- Report Generation Service

Services remain stateless and reusable.

---

## 12. Repository Responsibilities

Each aggregate has a dedicated repository.

Repositories are responsible only for persistence.

Responsibilities include:

- Create
- Read
- Update (where permitted)
- Soft Delete (where permitted)
- Search
- Pagination

Repositories never contain business rules.

---

## 13. Domain Evolution

The model is designed to support future expansion without structural redesign.

Future domains may include:

- Inventory Management
- Warehouse Management
- Fleet Management
- Route Planning
- Manufacturing
- Procurement
- Supplier Management
- Customer Self-Service Portal
- AI Forecasting
- Business Intelligence

These domains integrate through events while respecting existing ownership boundaries.

---

## 14. Governance

Changes to the domain model require:

- Business approval
- Architecture review
- Documentation update
- Database review
- Migration planning
- Test updates

The Domain Model must remain synchronized with the database schema and business rules.

---

## Conclusion

The Domain Model provides the conceptual foundation of the EMA Bakery Distribution Management System.

By defining aggregates, entities, value objects, relationships, ownership boundaries, lifecycles, invariants, and domain responsibilities, it ensures that the software faithfully represents the business while remaining scalable, maintainable, and extensible.

Every future implementation—from database tables to workflows and services—must align with this Domain Model.
