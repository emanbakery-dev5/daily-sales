# System Requirements Specification (SRS)

**Project:** EMA Bakery Distribution Management System (EMA-BDMS)

**Version:** 1.0.0

**Document Owner:** Solution Architecture

**Status:** Approved

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) defines the complete functional and non-functional requirements for the EMA Bakery Distribution Management System.

It serves as the contractual specification between business stakeholders, architects, developers, testers, and future AI-assisted development processes.

All implementation must conform to this document.

---

### 1.2 Business Goal

EMA Bakery requires a centralized enterprise platform to manage:

- Salespersons
- Product pricing
- Daily dispatches
- Customer ledger
- Payment collection
- Financial reporting
- Notifications
- User management
- System administration

The objective is to eliminate manual spreadsheets, improve operational visibility, reduce accounting errors, and provide real-time business intelligence.

---

## 2. Project Scope

The first production release includes:

- Secure authentication
- Role-based authorization
- Dashboard
- User management
- Salesperson management
- Product management
- Product categories
- Pricing management
- Dispatch management
- Customer ledger
- Payment management
- PDF generation
- WhatsApp notification integration
- Reporting
- Audit logging
- System configuration

The following modules are intentionally excluded from Version 1:

- Fleet Management
- Warehouse Management
- Manufacturing
- Inventory Control
- Procurement
- Supplier Portal
- Customer Portal
- Native Mobile Application

These are planned for future releases.

---

## 3. Business Objectives

The system shall:

- Centralize operational data.
- Eliminate duplicate data entry.
- Reduce financial calculation errors.
- Provide accurate customer balances.
- Produce printable dispatch notes.
- Generate financial statements.
- Maintain immutable audit history.
- Support future expansion.

---

## 4. User Roles

The platform defines the following primary roles.

### System Administrator

Responsibilities:

- Manage users
- Manage permissions
- Configure system settings
- View all reports
- Manage pricing
- View audit logs

---

### Operations Manager

Responsibilities:

- Manage dispatches
- Manage products
- View financial summaries
- Print reports

---

### Finance Officer

Responsibilities:

- Record payments
- Reverse payments
- View customer ledgers
- Generate statements

---

### Sales Coordinator

Responsibilities:

- Create dispatches
- Print dispatch notes
- View customer balances

---

### Read-Only User

Responsibilities:

- View permitted reports
- Search data
- Export reports

Cannot modify business data.

---

## 5. Functional Requirements

### Authentication

The system shall:

- Authenticate users.
- Support secure login.
- Support logout.
- Support password reset.
- Enforce configurable session timeout.

---

### User Management

The system shall:

- Create users.
- Edit users.
- Disable users.
- Enable users.
- Assign roles.
- Assign permissions.

---

### Salesperson Management

The system shall:

- Create salesperson profiles.
- Edit salesperson details.
- Freeze salesperson accounts.
- Activate salesperson accounts.
- Maintain credit limits.
- Generate customer statements.

---

### Product Management

The system shall:

- Create products.
- Categorize products.
- Archive products.
- Restore archived products.
- Search products.

---

### Pricing Management

The system shall:

- Create price versions.
- Activate prices.
- Schedule future prices.
- Preserve historical prices.
- Resolve active prices automatically.

---

### Dispatch Management

The system shall:

- Create dispatches.
- Edit draft dispatches.
- Validate dispatches.
- Post dispatches.
- Cancel dispatches.
- Print dispatch notes.
- Generate PDFs.

---

### Ledger Management

The system shall:

- Maintain running balances.
- Generate statements.
- Preserve financial history.
- Support reversals.

---

### Payment Management

The system shall:

- Record payments.
- Allocate payments.
- Reverse payments.
- Generate receipts.

---

### Reporting

The system shall generate:

- Daily Dispatch Report
- Weekly Dispatch Report
- Monthly Dispatch Report
- Outstanding Balance Report
- Payment Report
- Product Report
- Salesperson Report
- Financial Summary

Reports shall support:

- PDF export
- Excel export
- Printing

---

### Notifications

The system shall support:

- WhatsApp dispatch notifications
- WhatsApp payment receipts
- Retry failed notifications

---

### Audit

The system shall record:

- Login
- Logout
- User changes
- Pricing changes
- Dispatch creation
- Dispatch cancellation
- Payment recording
- Configuration changes

Audit records shall be immutable.

---

## 6. Non-Functional Requirements

### Performance

- Dashboard < 1 second
- Search < 300 ms
- Dispatch creation < 3 seconds
- Payment posting < 2 seconds

---

### Availability

Target uptime:

99.9%

---

### Scalability

The architecture shall support:

- Multiple branches
- Multiple warehouses
- Increased transaction volume
- Additional business modules

without architectural redesign.

---

### Security

The platform shall:

- Enforce HTTPS.
- Use Supabase Authentication.
- Use Row-Level Security.
- Encrypt sensitive data.
- Validate all server requests.

---

### Reliability

The system shall:

- Prevent duplicate dispatches.
- Prevent duplicate payments.
- Support transactional rollback.
- Guarantee audit logging.

---

### Maintainability

The platform shall:

- Follow Domain-Driven Design.
- Follow CQRS.
- Follow Repository Pattern.
- Follow Clean Architecture.
- Use TypeScript Strict Mode.

---

## 7. Business Constraints

The following constraints apply:

- Historical pricing cannot be modified.
- Ledger entries cannot be deleted.
- Dispatch totals are system-calculated.
- Payment reversals create compensating entries.
- Posted dispatches are immutable.
- Audit history is append-only.

---

## 8. External Integrations

Version 1 integrates with:

- Supabase
- PostgreSQL
- WhatsApp Business API
- PDF Generation Engine

Future integrations include:

- ERP
- Accounting Software
- SMS Gateway
- Email Provider

---

## 9. Acceptance Criteria

The system will be considered production-ready when:

- All functional requirements are implemented.
- All business rules pass validation.
- All automated tests pass.
- Performance targets are achieved.
- Security review is approved.
- Documentation is complete.

---

## 10. Revision History

| Version | Date            | Description |
| ------- | --------------- | ----------- |
| 1.0.0   | Initial Release | Initial SRS |

---

## Conclusion

This Software Requirements Specification defines the functional scope, operational expectations, quality attributes, and acceptance criteria for the EMA Bakery Distribution Management System.

It serves as the authoritative requirements document for the project and forms the basis for architecture, implementation, testing, deployment, and future enhancements.
