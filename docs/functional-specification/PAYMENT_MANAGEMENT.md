# Payment Management Functional Specification

**Project:** EMA Bakery Distribution Management System (EMA-BDMS)

**Module:** Payment Management

**Version:** 1.0.0

**Status:** Approved

---

## 1. Purpose

The Payment Management module manages all customer payment transactions within the EMA Bakery Distribution Management System.

It records payments received from customers, allocates them to outstanding ledger balances, generates official receipts, updates customer account balances, and provides complete payment traceability.

Every payment is permanently linked to its originating customer, ledger transactions, dispatches, and audit records.

Payments become immutable after posting.

Corrections are performed using reversing or adjustment entries rather than editing historical payment records.

---

## 2. Business Objectives

The Payment Management module shall:

- Record customer payments.
- Support multiple payment methods.
- Allocate payments against outstanding balances.
- Generate payment receipts.
- Update customer ledger balances automatically.
- Handle partial payments.
- Handle overpayments according to configuration.
- Integrate with Ledger Management.
- Integrate with Dispatch Management.
- Integrate with Reporting.
- Maintain complete audit history.

---

## 3. User Roles & Permissions

| Role                 | Access                            |
| -------------------- | --------------------------------- |
| System Administrator | Full Access                       |
| Finance Officer      | Full Access                       |
| Operations Manager   | View Only                         |
| Sales Coordinator    | Record Payments                   |
| Salesperson          | Record Assigned Customer Payments |
| Read-Only User       | View Only                         |

Permission enforcement is performed on the server.

Only users with **Payment.View** permission may access this module.

Only users with **Payment.Create** permission may record payments.

---

## 4. Routes

Payment List

```text
/payment
```

Record Payment

```text
/payment/new
```

Payment Details

```text
/payment/{paymentId}
```

Payment Receipt

```text
/payment/{paymentId}/receipt
```

Customer Payments

```text
/payment/customer/{customerId}
```

---

## 5. Navigation

```text
Dashboard

↓

Finance

↓

Payments
```

---

## 6. Navigation Flow

```text
Dashboard

↓

Payment List

↓

Record Payment

↓

Payment Details

↓

Receipt

↓

Print / Export
```

---

## 7. Payment Lifecycle

```text
Payment Created

↓

Validated

↓

Allocated

↓

Posted

↓

Ledger Updated

↓

Receipt Generated

↓

Locked
```

Definitions

**Payment Created**

Payment information entered.

**Validated**

Business rules verified.

**Allocated**

Payment applied to customer balance.

**Posted**

Financial transaction finalized.

**Ledger Updated**

Outstanding balance recalculated.

**Receipt Generated**

Official receipt available.

**Locked**

Payment becomes immutable.

---

## 8. Screen Inventory

The module contains:

- Payment List
- Record Payment
- Payment Details
- Customer Payments
- Payment Receipt

Future releases may include:

- Online payment gateway
- QR code payments
- Mobile wallet integration
- Auto bank reconciliation
- Refund processing
- Scheduled payments
- Payment reminders

---

## 9. Payment List Screen

### Purpose

Displays all recorded customer payments.

Authorized users may:

- Search
- Filter
- View
- Print
- Export

Users with Payment.Create permission additionally see:

- Record Payment

---

### Screen Layout

The page contains:

- Breadcrumb
- Page Header
- Search Box
- Customer Filter
- Payment Method Filter
- Date Range Filter
- Refresh Button
- Export Button
- Record Payment Button
- Payment Table
- Pagination Controls

---

## 10. Page Header

Title

```text
Payment Management
```

Subtitle

```text
Record customer payments and monitor financial collections.
```

---

## 11. Breadcrumb

```text
Home

↓

Finance

↓

Payments
```

---

## 12. Toolbar

Components

- Search
- Customer Filter
- Payment Method Filter
- Date Filter
- Refresh
- Export
- Record Payment

Desktop

Horizontal toolbar.

Tablet

Wrapped toolbar.

Mobile

Stacked layout.

---

## 13. Search

Search updates after a 300 ms debounce.

Searchable fields

- Receipt Number
- Payment Reference
- Customer Name
- Customer Code
- Dispatch Number

Supports:

- Partial matches
- Case-insensitive search
- Trimmed whitespace

---

## 14. Filters

Available filters

Customer

Payment Method

Posting Date

Status

Payment methods

- Cash
- Bank Transfer
- Cheque
- Credit Adjustment

Status

- Pending
- Posted
- Cancelled

---

## 15. Payment Table

Columns

- Receipt Number
- Payment Date
- Customer
- Payment Method
- Amount
- Status
- Recorded By
- Actions

Default Sort

Payment Date (Descending)

Newest payments appear first.

---

## 16. Row Actions

Available actions

- View
- Print Receipt
- Export PDF

Finance users additionally see

- Reverse Payment (future enhancement)

Historical payments cannot be edited.

Historical payments cannot be deleted.

---

## 17. Row Click Behaviour

Selecting a payment row opens

```text
/payment/{paymentId}
```

Action buttons perform only their assigned actions.

---

## 18. Pagination

Default

25 records

Available page sizes

- 10
- 25
- 50
- 100

Pagination is executed on the server.

---

## 19. Loading State

During loading

- Skeleton table displayed.
- Filters disabled.
- Search disabled.
- Buttons disabled.

Layout remains stable.

---

## 20. Empty State

Title

```text
No Payments Found
```

Message

```text
Recorded customer payments will appear here.
```

Primary Action

```text
Record Payment
```

Displayed only to users with Payment.Create permission.

---

## 21. No Search Results

Display

```text
No payments match your search criteria.
```

Button

```text
Clear Filters
```

Selecting the button clears all filters and reloads the payment list.

---

## 22. Error State

Display

```text
Unable to load payments.

Please try again.
```

Retry Button

```text
Retry
```

Retry reloads only the payment table.

---

## 23. Micro-Interactions

Search Field

- Focus highlight.
- Clear icon appears automatically.

Buttons

- Hover elevation.
- Smooth transition.

Rows

- Hover highlight.
- Pointer cursor.

Status Badge

Displays tooltip describing payment status.

Action Menu

- Fade animation.
- Closes on outside click.
- Closes using Escape key.

---

## 24. Business Rules

The Payment List enforces:

- Payments are read-only after posting.
- Cancelled payments remain visible.
- Receipt numbers are unique.
- Results respect user permissions.
- Pagination, search, and filtering occur server-side.

---

## 25. Acceptance Criteria (Part 1)

The Payment List functionality is complete when:

- Payments load successfully.
- Search and filters operate correctly.
- Pagination functions correctly.
- Permission-based actions are enforced.
- Loading, empty, and error states behave correctly.
- Navigation to payment details works correctly.
- Historical payment records remain immutable.

---

## 26. Record Payment Screen

### Route

```text
/payment/new
```

### Purpose

Allows an authorized user to record a customer payment and allocate it against outstanding ledger balances.

The system supports full payments, partial payments, advance payments (when enabled), and multiple payment methods.

Once a payment is posted, it becomes immutable.

---

## 27. Screen Layout

The page contains:

- Breadcrumb
- Customer Information Card
- Outstanding Balance Card
- Payment Information Card
- Payment Allocation Grid
- Payment Summary Card
- Notes Card
- Action Bar

Desktop

Two-column responsive layout.

Tablet

Single-column responsive layout.

Mobile

Single-column stacked layout.

---

## 28. Breadcrumb

```text
Home

↓

Finance

↓

Payments

↓

Record Payment
```

---

## 29. Customer Information

### Customer

Required.

Searchable dropdown.

Displays

- Customer Code
- Customer Name
- Territory

Validation

- Customer must exist.
- Customer must be Active.

Error

```text
Selected customer is unavailable.
```

---

### Customer Details

Automatically populated.

Displays

- Credit Limit
- Payment Terms
- Assigned Salesperson
- Outstanding Balance

Read-only.

---

## 30. Outstanding Balance

Automatically retrieved from Ledger Management.

Displays

```text
Outstanding Balance

SAR 4,850.00
```

Updates immediately after payment posting.

---

## 31. Payment Information

### Receipt Number

Automatically generated.

Example

```text
RCT-20250718-00015
```

Read-only.

Unique.

Immutable.

---

### Payment Date

Required.

Default

Current business date.

Validation

- Cannot be empty.
- Cannot precede accounting lock date.
- Future dates require Payment.Override permission.

---

### Payment Method

Required.

Available options

- Cash
- Bank Transfer
- Cheque
- Credit Adjustment

Validation

Selection is mandatory.

---

### Payment Reference

Required for:

- Bank Transfer
- Cheque

Optional for:

- Cash

Maximum Length

100 characters.

Example

```text
TXN-458923771
```

---

### Amount Received

Required.

Decimal.

Currency

SAR

Validation

- Greater than zero.
- Maximum two decimal places.

Example

```text
2500.00
```

---

## 32. Payment Allocation Grid

Purpose

Displays outstanding ledger transactions available for allocation.

Columns

- Ledger Reference
- Posting Date
- Transaction Type
- Outstanding Amount
- Allocated Amount
- Remaining Balance

Default Sort

Oldest outstanding transaction first.

---

## 33. Automatic Allocation

Default allocation method

```text
FIFO (First In, First Out)
```

Workflow

Oldest outstanding balance

↓

Allocate payment

↓

Continue until payment exhausted

↓

Update remaining balances

Users with appropriate permission may manually modify allocation before posting.

---

## 34. Manual Allocation

Editable Column

Allocated Amount

Validation

- Cannot exceed Outstanding Amount.
- Cannot be negative.
- Total Allocated Amount cannot exceed Amount Received.

Remaining Balance updates automatically.

---

## 35. Payment Summary

Automatically calculated.

Displays

- Amount Received
- Total Allocated
- Unallocated Amount
- Remaining Customer Balance

Formula

```text
Amount Received

-

Allocated Amount

=

Unallocated Amount
```

When advance payments are disabled, Unallocated Amount must equal zero before posting.

---

## 36. Advance Payments

If enabled in System Configuration:

Unallocated Amount

>

0

Creates an Advance Payment credit balance.

If disabled

Display

```text
Allocated amount must equal the payment amount.
```

Posting is blocked.

---

## 37. Notes

Optional.

Maximum Length

500 characters.

Supports plain text only.

Example

```text
Collected during morning delivery.
```

---

## 38. Save as Draft

Button

```text
Save Draft
```

Purpose

Stores payment information without posting to the ledger.

Workflow

Validate

↓

Save Draft

↓

Generate Audit Event

↓

Remain Editable

Success Message

```text
Payment draft saved successfully.
```

Draft payments do not affect customer balances.

---

## 39. Post Payment

Button

```text
Post Payment
```

Workflow

Validate

↓

Verify Permissions

↓

Validate Allocation

↓

Create Payment Record

↓

Generate Receipt Number

↓

Post Ledger Entries

↓

Update Customer Balance

↓

Generate Receipt

↓

Generate Audit Event

↓

Redirect to Payment Details

Loading Label

```text
Posting Payment...
```

---

## 40. Confirmation Dialog

Title

```text
Post Payment
```

Message

```text
Posting this payment will permanently update the customer's financial records.

This action cannot be undone.

Do you want to continue?
```

Buttons

Primary

```text
Post Payment
```

Secondary

```text
Cancel
```

Backdrop Click

Close dialog.

Escape Key

Close dialog.

---

## 41. Payment Details

### Route

```text
/payment/{paymentId}
```

Displays

- Receipt Number
- Customer
- Payment Date
- Payment Method
- Payment Reference
- Amount Received
- Allocated Amount
- Remaining Balance
- Created By
- Created Date
- Notes

All fields are read-only.

---

## 42. Payment Receipt

### Route

```text
/payment/{paymentId}/receipt
```

Displays

- Company Header
- Receipt Number
- Customer Details
- Payment Details
- Allocation Summary
- Total Paid
- Payment Method
- Authorized Signature Area

Available Actions

- Print
- Export PDF

Receipts are generated immediately after posting.

---

## 43. Validation Rules

Validation occurs

- On field blur.
- On Save.
- Server-side.

Validation includes

- Active customer.
- Valid payment amount.
- Required payment reference.
- Allocation totals.
- Duplicate payment reference prevention.
- Accounting period validation.
- User permissions.

Server-side validation overrides client-side validation.

---

## 44. Success Notifications

Payment Posted

```text
Payment recorded successfully.
```

Receipt Generated

```text
Receipt generated successfully.
```

Draft Saved

```text
Payment draft saved successfully.
```

---

## 45. Error Messages

Duplicate Reference

```text
Payment reference already exists.
```

Invalid Customer

```text
Selected customer is inactive.
```

Allocation Error

```text
Allocated amount exceeds outstanding balance.
```

Validation Error

```text
Please correct the highlighted fields.
```

Unexpected Error

```text
An unexpected error occurred.

Please try again.
```

---

## 46. Micro-Interactions

Customer Search

- Debounced search.
- Keyboard navigation.
- Auto-focus on open.

Allocation Grid

- Inline calculations.
- Real-time balance updates.
- Highlight modified rows.

Summary Card

- Smooth number animations.
- Immediate recalculation after edits.

Buttons

- Disabled while processing.
- Loading spinner displayed.

Dialogs

- Focus trap.
- Escape key closes dialog.
- Backdrop click closes dialog when not processing.

---

## 47. Acceptance Criteria (Part 2)

The Record Payment workflow is complete when:

- Payments can be recorded successfully.
- Customer balances display correctly.
- FIFO allocation functions automatically.
- Manual allocation validates correctly.
- Receipt numbers are generated automatically.
- Payment receipts generate successfully.
- Draft payments remain editable.
- Posted payments become immutable.
- Confirmation dialogs function correctly.
- Audit events are generated.
- Success and error notifications display correctly.

---

## 48. Ledger Management Integration

The Payment Management module is tightly integrated with the Ledger Management module.

Every successfully posted payment automatically generates one or more ledger entries that update the customer's outstanding balance.

No manual ledger posting is required.

---

### Posting Workflow

```text
Payment Posted

↓

Validate Payment

↓

Validate Allocation

↓

Create Payment Record

↓

Generate Ledger Entries

↓

Update Customer Balance

↓

Generate Audit Event

↓

Generate Receipt

↓

Available for Reporting
```

All posting operations execute within a single database transaction.

If any step fails, the transaction is rolled back and no financial data is committed.

---

## 49. Dispatch Management Integration

Payments may be linked directly to completed dispatches.

Business Rules

- Payments can only reference Completed dispatches.
- Draft, Ready and In Progress dispatches cannot receive posted payments.
- Multiple dispatches may be settled with a single payment.
- Multiple payments may be allocated to a single dispatch until the balance reaches zero.

Displayed Information

- Dispatch Number
- Dispatch Date
- Salesperson
- Original Dispatch Value
- Outstanding Amount
- Allocated Amount

Historical dispatch values remain immutable.

---

## 50. Customer Balance Recalculation

Customer balances are recalculated automatically after every financial posting.

Formula

```text
Previous Outstanding Balance

-

Allocated Payment

=

New Outstanding Balance
```

If advance payments are enabled

```text
Outstanding Balance

<

0
```

The remaining amount becomes a Customer Credit Balance.

Manual balance editing is prohibited.

---

## 51. Receipt Generation

Every posted payment generates an official receipt.

Receipt Information

- Company Name
- Company Address
- Receipt Number
- Payment Date
- Customer Details
- Payment Method
- Payment Reference
- Allocation Details
- Amount Paid
- Outstanding Balance After Payment
- Generated By
- Generated Date

Receipt Numbers are unique and immutable.

Receipts are available immediately after posting.

---

## 52. Customer Payment History

### Route

```text
/payment/customer/{customerId}
```

Purpose

Displays every payment received from a customer.

Columns

- Receipt Number
- Payment Date
- Payment Method
- Amount
- Allocated Amount
- Remaining Credit
- Status

Default Sort

Newest payment first.

Users may:

- View
- Print Receipt
- Export PDF

Historical records are read-only.

---

## 53. Reporting Integration

Payment information feeds the following reports.

Financial Reports

- Daily Collections
- Monthly Collections
- Cash Summary
- Bank Transfer Summary
- Outstanding Receivables
- Collection Performance
- Payment Method Analysis

Operational Reports

- Salesperson Collections
- Territory Collections
- Customer Payment History

Management Reports

- Cash Flow Dashboard
- Accounts Receivable Summary
- Collection Efficiency
- Aging Analysis

Only Posted payments are included in financial reporting.

Draft payments are excluded.

---

## 54. Business Rules

The Payment Management module enforces the following rules:

- Every payment has a unique Receipt Number.
- Receipt Numbers are immutable.
- Posted payments cannot be edited.
- Posted payments cannot be deleted.
- Payment allocation cannot exceed outstanding balances unless advance payments are enabled.
- Duplicate payment references are prevented for the same payment method.
- Customer balances update automatically.
- Receipts are generated automatically.
- Historical payment records remain immutable.
- Payment posting is transaction-safe.

---

## 55. Security Requirements

The module complies with the EMA-BDMS Security Model.

Requirements include:

- Role-Based Access Control (RBAC).
- Server-side authorization.
- Supabase Row-Level Security (RLS).
- HTTPS-only communication.
- Secure API endpoints.
- Input validation.
- Output encoding.
- CSRF protection where applicable.
- Rate limiting.
- Comprehensive audit logging.

Permission Matrix

| Permission       | Description                        |
| ---------------- | ---------------------------------- |
| Payment.View     | View payments                      |
| Payment.Create   | Record new payments                |
| Payment.Export   | Export reports and receipts        |
| Payment.Override | Override posting date restrictions |
| Payment.Admin    | Administrative operations          |

Permission checks are enforced on both the client and server, with the server acting as the final authority.

---

## 56. Audit Events

The following events shall be recorded:

- Payment Draft Saved
- Payment Posted
- Payment Allocated
- Receipt Generated
- Payment Viewed
- Payment Exported
- Customer Balance Updated
- Failed Payment Posting
- Permission Denied

Each audit record includes:

- Event ID
- Timestamp
- User ID
- Customer ID
- Payment ID
- Receipt Number
- Payment Method
- Amount
- Allocation Details
- Correlation ID
- Client IP Address
- User Agent

Audit records are immutable.

---

## 57. Notifications

Success Notifications

```text
Payment recorded successfully.
```

```text
Customer balance updated successfully.
```

```text
Receipt generated successfully.
```

```text
Payment allocation completed successfully.
```

Error Notifications

```text
Payment posting failed.
```

```text
Duplicate payment reference detected.
```

```text
Insufficient outstanding balance for allocation.
```

```text
Permission denied.
```

```text
Unexpected server error.
```

Success notifications automatically dismiss after the configured timeout.

Critical posting failures remain visible until acknowledged.

---

## 58. Responsive Behaviour

### Desktop

- Full payment table.
- Sticky payment summary.
- Persistent filters.
- Side-by-side allocation grid.

---

### Tablet

- Responsive payment table.
- Wrapped toolbar.
- Collapsible summary cards.
- Adaptive allocation grid.

---

### Mobile

- Card-based payment list.
- Expandable payment details.
- Bottom-sheet action menu.
- Optimized numeric keyboard for amount entry.
- Sticky action buttons.

All payment functionality remains available across supported devices.

---

## 59. Performance Requirements

Target performance

| Operation                | Target      |
| ------------------------ | ----------- |
| Payment List             | < 1 second  |
| Customer Payment History | < 1 second  |
| Record Payment           | < 2 seconds |
| Post Payment             | < 3 seconds |
| Receipt Generation       | < 2 seconds |
| Search                   | < 300 ms    |
| Export PDF               | < 5 seconds |
| Export Excel             | < 5 seconds |

Additional requirements

- Server-side pagination.
- Server-side filtering.
- Indexed searches.
- Atomic payment posting.
- Optimistic UI updates where appropriate.

---

## 60. Accessibility

The Payment Management module complies with WCAG 2.1 AA.

Requirements include:

- Full keyboard navigation.
- Screen-reader compatibility.
- Semantic HTML.
- Accessible forms.
- Logical tab order.
- Visible focus indicators.
- Accessible confirmation dialogs.
- Accessible validation messages.
- Minimum AA color contrast.

Receipts generated in PDF format must preserve accessible reading order where supported.

---

## 61. Acceptance Criteria

The Payment Management module is complete when:

- Authorized users can record payments.
- FIFO allocation functions correctly.
- Manual allocation validates successfully.
- Customer balances update automatically.
- Ledger entries are generated automatically.
- Receipts generate successfully.
- Posted payments become immutable.
- Duplicate payment references are prevented.
- Audit events are generated correctly.
- Security requirements are enforced.
- Accessibility requirements are satisfied.
- Performance targets are achieved.

---

## 62. References

This module is governed by:

- `/architecture/DOMAIN_MODEL.md`
- `/architecture/BUSINESS_RULE_ENGINE.md`
- `/architecture/WORKFLOW_ENGINE.md`
- `/architecture/SECURITY_MODEL.md`
- `/architecture/CQRS.md`
- `/docs/SYSTEM_REQUIREMENTS_SPECIFICATION.md`

Related functional specifications:

- `/docs/functional-specification/DISPATCH_MANAGEMENT.md`
- `/docs/functional-specification/LEDGER_MANAGEMENT.md`
- `/docs/functional-specification/REPORTING.md`

---

## 63. Future Enhancements

The Payment Management module has been designed to support future expansion without architectural redesign.

Planned enhancements include:

- Online payment gateway integration.
- QR code payments.
- Mobile wallet support.
- Automated bank reconciliation.
- Refund management.
- Recurring customer payments.
- Scheduled payment reminders.
- Multi-currency payments.
- Digital receipt delivery by email.
- Customer self-service payment portal.
- AI-assisted payment anomaly detection.

---

## 64. Conclusion

The Payment Management module provides a secure, auditable, and scalable framework for managing customer collections within the EMA Bakery Distribution Management System.

By integrating seamlessly with Dispatch Management and Ledger Management, the module ensures every payment is accurately allocated, permanently recorded, and immediately reflected in customer balances and financial reports. Its immutable transaction model, comprehensive audit trail, enterprise-grade security, and extensible architecture provide a robust financial foundation capable of supporting both current operational needs and future business growth.
