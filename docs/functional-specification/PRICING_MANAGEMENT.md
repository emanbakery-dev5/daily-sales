# Pricing Management Functional Specification

**Project:** EMA Bakery Distribution Management System (EMA-BDMS)

**Module:** Pricing Management

**Version:** 1.0.0

**Status:** Approved

---

## 1. Purpose

The Pricing Management module is the authoritative source for all product selling prices within the EMA Bakery Distribution Management System.

It enables authorized users to create, maintain, activate, and retire product prices while preserving complete pricing history. The module ensures that every dispatch, invoice, ledger entry, and sales report references the correct price that was effective at the time of the transaction.

Prices are never overwritten. Any price change creates a new pricing version while retaining historical records for auditing and reporting.

---

## 2. Business Objectives

The Pricing Management module shall:

- Maintain a centralized pricing master.
- Support product-specific pricing.
- Preserve historical price versions.
- Allow scheduled future prices.
- Prevent overlapping effective periods.
- Support activation and expiration of prices.
- Integrate with Dispatch Management.
- Integrate with Ledger Management.
- Integrate with Payment Management.
- Integrate with Reporting.
- Maintain a complete audit history.

---

## 3. User Roles & Permissions

| Role                 | Access             |
| -------------------- | ------------------ |
| System Administrator | Full Access        |
| Operations Manager   | Full Access        |
| Finance Officer      | Create, Edit, View |
| Sales Coordinator    | View Only          |
| Read-Only User       | View Only          |

Permission enforcement occurs entirely on the server.

Users without permission never see pricing administration actions.

---

## 4. Routes

Pricing List

```text
/pricing
```

Create Price

```text
/pricing/new
```

View Price

```text
/pricing/{id}
```

Price History

```text
/pricing/{id}/history
```

Edit Future Price

```text
/pricing/{id}/edit
```

---

## 5. Navigation

Dashboard

↓

Pricing

Only users with **Pricing.View** permission can access this module.

---

## 6. Navigation Flow

```text
Dashboard

↓

Pricing

↓

Pricing List

↓

View Price

↓

Price History

↓

Future Price Edit

↓

Save

↓

Return to Price Details
```

---

## 7. Screen Inventory

The module contains:

- Pricing List
- Create Price
- View Price
- Price History
- Edit Future Price

Future releases may include:

- Customer-specific pricing
- Promotional pricing
- Territory pricing
- Bulk pricing
- Discount rules
- Seasonal pricing
- Contract pricing

---

## 8. Pricing List Screen

### Purpose

Displays all active, scheduled, expired, and historical pricing records.

Authorized users may:

- Search
- Filter
- View
- Create
- Schedule
- Activate
- Expire

according to assigned permissions.

---

### Screen Layout

The page contains:

- Breadcrumb
- Page Header
- Search Box
- Product Filter
- Category Filter
- Status Filter
- Effective Date Filter
- Refresh Button
- New Price Button
- Pricing Table
- Pagination Controls

---

## 9. Page Header

Title

```text
Pricing Management
```

Subtitle

```text
Manage selling prices for bakery products across all operational workflows.
```

---

## 10. Breadcrumb

```text
Home

↓

Pricing
```

---

## 11. Toolbar

Components

- Search
- Product Filter
- Category Filter
- Status Filter
- Effective Date Filter
- Refresh Button
- New Price Button

Desktop

Horizontal layout.

Tablet

Wrapped layout.

Mobile

Vertical stacked layout.

---

## 12. New Price Button

Label

```text
New Price
```

Action

Navigate to

```text
/pricing/new
```

Permission Required

Pricing.Create

Hidden when permission is unavailable.

---

## 13. Search

Search uses a 300-millisecond debounce.

Searchable fields:

- Product Code
- Product Name
- Category
- Price Reference Number

Search behavior:

- Case-insensitive.
- Ignores leading and trailing whitespace.
- Supports partial matching.

---

## 14. Filters

Available filters:

Product

Category

Status

Effective Date

---

### Status Values

- Active
- Scheduled
- Expired
- Historical

---

### Effective Date

Allows filtering by:

- Today
- This Week
- This Month
- Custom Date Range

---

## 15. Pricing Table

Columns

- Price Reference
- Product Code
- Product Name
- Category
- Selling Price
- Effective From
- Effective To
- Status
- Created By
- Actions

Default Sort

Effective From (Descending)

Newest effective prices appear first.

---

## 16. Status Indicators

Available statuses

Active

Green Badge

Scheduled

Blue Badge

Expired

Gray Badge

Historical

Dark Gray Badge

Status updates automatically based on the current date and effective period.

---

## 17. Row Actions

Available actions

- View
- View History
- Edit (Future Prices Only)
- Activate
- Expire

Unavailable actions remain hidden.

Historical pricing records are read-only.

---

## 18. Row Click Behaviour

Selecting a pricing row opens

```text
/pricing/{id}
```

Exceptions

- Action menu
- Hyperlinks

perform only their intended action.

---

## 19. Pagination

Default

25 records

Available sizes

- 10
- 25
- 50
- 100

Displays

- Current Page
- Total Pages
- Total Records
- First
- Previous
- Next
- Last

Pagination executes on the server.

---

## 20. Loading State

While loading:

- Skeleton table rows displayed.
- Filters disabled.
- Search disabled.
- Buttons disabled.

Layout remains stable to prevent content shifting.

---

## 21. Empty State

Title

```text
No Pricing Records Found
```

Message

```text
Create your first product price to begin managing bakery pricing.
```

Primary Action

```text
Create Price
```

Displayed only when the user has Pricing.Create permission.

---

## 22. No Search Results

Display

```text
No pricing records match your search criteria.
```

Button

```text
Clear Filters
```

Selecting the button:

- Clears search.
- Clears filters.
- Reloads all pricing records.

---

## 23. Error State

Display

```text
Unable to load pricing records.

Please try again.
```

Retry Button

```text
Retry
```

Retry reloads only the pricing table.

---

## 24. Micro-Interactions

Search Box

- Focus highlight.
- Clear icon appears automatically.

Buttons

- Hover elevation.
- Smooth transition.
- Pointer cursor.

Rows

- Hover highlight.
- Pointer cursor.

Status Badge

- Tooltip describing pricing status.

Action Menu

- Fade animation.
- Closes on outside click.
- Closes on Escape key.

---

## 25. Acceptance Criteria (Part 1)

This section is complete when:

- Pricing list loads successfully.
- Search functions correctly.
- Product, Category, Status, and Date filters operate correctly.
- Pagination functions without page reload.
- Permission-based actions are enforced.
- Loading, empty, and error states function correctly.
- Navigation to pricing details operates correctly.

---

## 26. Create Price Screen

### Route

```text
/pricing/new
```

### Purpose

Allows an authorized user to create a new selling price for a product.

The system uses pricing versioning. Existing prices are never overwritten. Every new price creates a new pricing record that becomes effective on its configured effective date.

Only one Active price may exist for a product at any given time.

---

## 27. Screen Layout

The page contains:

- Breadcrumb
- Page Header
- Product Information Card
- Pricing Information Card
- Effective Date Card
- Status Information Card
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

Pricing

↓

New Price
```

---

## 29. Product Information

### Product

Required.

Dropdown populated with Active products only.

Searchable.

Displayed columns:

- Product Code
- Product Name
- Category

Example

```text
PRD-000021

White Sandwich Bread
```

Validation

- Product must exist.
- Product must be Active.
- Product cannot be archived.

---

### Category

Automatically populated.

Read-only.

Changes automatically when another product is selected.

---

### Current Active Price

Read-only.

Displays

```text
Current Selling Price

Effective From

Effective To

Status
```

If no current price exists:

```text
No active price found.
```

---

## 30. Pricing Information

### Selling Price

Required.

Currency

SAR

Input Type

Decimal

Precision

2 decimal places.

Validation

- Greater than zero.
- Maximum two decimal places.
- Cannot exceed configured business limits.

Example

```text
6.50
```

---

### Price Reference Number

Automatically generated.

Example

```text
PRICE-000243
```

Read-only.

Unique.

Immutable.

---

## 31. Effective Dates

### Effective From

Required.

Date Picker.

Validation

- Cannot be empty.
- Cannot overlap another Active price.
- Cannot be earlier than today unless the user has Pricing.Override permission.

---

### Effective To

Optional.

If empty

Price remains active indefinitely until superseded.

Validation

Must be later than Effective From.

---

## 32. Scheduled Pricing

The system supports future pricing.

Example

Current Price

```text
6.50

Effective Today
```

Future Price

```text
7.00

Effective Next Monday
```

System behaviour

Current price remains Active until the scheduled date.

Future price remains Scheduled.

At midnight on the Effective From date:

- Current price automatically expires.
- Scheduled price automatically becomes Active.
- Audit event generated.
- Reports begin using the new price.

No manual intervention required.

---

## 33. Price Notes

Optional.

Maximum Length

500 characters.

Examples

```text
Annual price adjustment.
```

```text
Supplier cost increase.
```

Supports plain text only.

---

## 34. Validation Rules

Validation occurs:

- On field blur.
- On Save.
- Server-side.

Server validation always overrides client validation.

Validation includes:

- Required product.
- Active product.
- Valid selling price.
- Valid effective dates.
- No overlapping pricing periods.
- Duplicate future price prevention.

---

## 35. Save Button

Label

```text
Create Price
```

Workflow

1. Validate fields.
2. Disable controls.
3. Display loading indicator.
4. Create pricing version.
5. Generate audit event.
6. Refresh pricing cache.
7. Refresh product pricing cache.
8. Display success notification.
9. Redirect to Price Details.

Loading Label

```text
Creating Price...
```

---

## 36. Cancel Button

If no changes exist

Return to Pricing List.

If unsaved changes exist

Display confirmation dialog.

---

## 37. Unsaved Changes Dialog

Title

```text
Discard Changes?
```

Message

```text
You have unsaved pricing changes.

Do you want to discard them?
```

Buttons

Primary

```text
Discard
```

Secondary

```text
Continue Editing
```

Backdrop Click

Close dialog.

Escape Key

Close dialog.

No changes are saved.

---

## 38. View Price

### Route

```text
/pricing/{id}
```

Purpose

Displays the complete pricing record.

Read-only.

Displayed Information

- Price Reference
- Product
- Category
- Selling Price
- Effective From
- Effective To
- Status
- Created By
- Created Date
- Last Updated
- Notes

Available Actions

- View History
- Edit (Scheduled Prices Only)
- Activate
- Expire

Actions displayed according to permissions.

---

## 39. Price History

### Route

```text
/pricing/{id}/history
```

Purpose

Displays every historical pricing version for the selected product.

Columns

- Version
- Selling Price
- Effective From
- Effective To
- Status
- Created By
- Created Date

Default Sort

Newest Version First.

Historical records cannot be modified.

---

## 40. Edit Future Price

Only Scheduled pricing records may be edited.

Editable Fields

- Selling Price
- Effective From
- Effective To
- Notes

Read-only Fields

- Product
- Category
- Price Reference
- Version Number

If the pricing record becomes Active before editing is completed:

Display

```text
This pricing record is no longer editable because it is now active.
```

Redirect user back to the Price Details page.

---

## 41. Save Changes Workflow

Workflow

Validate

↓

Update Scheduled Price

↓

Refresh Cache

↓

Generate Audit Event

↓

Display Success Notification

↓

Return to Price Details

Success Message

```text
Pricing updated successfully.
```

---

## 42. Loading States

During Create and Update

- Inputs disabled.
- Buttons disabled.
- Spinner displayed.
- Duplicate submissions prevented.

---

## 43. Success Notifications

Price Created

```text
Price created successfully.
```

Scheduled Price Updated

```text
Scheduled price updated successfully.
```

Price Activated

```text
Price activated successfully.
```

Price Expired

```text
Price expired successfully.
```

---

## 44. Error Messages

Duplicate Pricing Period

```text
Another active or scheduled price already exists for the selected effective period.
```

Invalid Product

```text
Selected product is unavailable.
```

Inactive Product

```text
Selected product is inactive.
```

Invalid Date

```text
Effective To must be later than Effective From.
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

## 45. Acceptance Criteria (Part 2)

The pricing lifecycle is complete when:

- Authorized users can create pricing records.
- Future prices can be scheduled.
- Active prices cannot be edited.
- Historical prices remain immutable.
- Overlapping effective dates are prevented.
- Product pricing history is preserved.
- Validation behaves correctly.
- Loading states prevent duplicate submissions.
- Unsaved changes trigger confirmation dialogs.
- Success and error notifications display correctly.

---

## 46. Activate Price Workflow

### Purpose

Allows an authorized user to manually activate a scheduled pricing record before its scheduled effective date when business circumstances require an immediate price change.

Only users with the `Pricing.Override` permission may perform this action.

---

### Trigger

Available from:

- Pricing List
- Price Details

Action:

Activate Price

---

### Confirmation Dialog

#### Title

```text
Activate Price
```

#### Message

```text
Activating this price immediately will expire the currently active price.

This action cannot be undone.

Do you want to continue?
```

#### Buttons

Primary

```text
Activate
```

Secondary

```text
Cancel
```

---

### Confirm Workflow

The system shall:

1. Validate user permissions.
2. Verify pricing record exists.
3. Verify pricing record is Scheduled.
4. Expire current Active pricing.
5. Activate selected pricing.
6. Update Effective From timestamp.
7. Generate audit event.
8. Refresh pricing cache.
9. Refresh product cache.
10. Display success notification.

---

### Success Message

```text
Price activated successfully.
```

---

## 47. Expire Price Workflow

### Purpose

Allows an authorized user to manually retire an Active price.

---

### Trigger

Available from:

- Pricing List
- Price Details

---

### Confirmation Dialog

#### Title

```text
Expire Price
```

#### Message

```text
This price will no longer be available for future dispatches.

Historical transactions remain unchanged.

Do you want to continue?
```

---

#### Buttons

Primary

```text
Expire
```

Secondary

```text
Cancel
```

---

### Confirm Workflow

The system shall:

1. Validate permissions.
2. Verify price exists.
3. Verify price is Active.
4. Expire pricing record.
5. Generate audit event.
6. Refresh pricing cache.
7. Display success notification.

If no replacement Active price exists, the product becomes unavailable for new dispatches until another Active price is created.

---

### Success Message

```text
Price expired successfully.
```

---

## 48. Automatic Scheduled Price Activation

The system automatically evaluates scheduled prices using a scheduled background process.

Execution Frequency

```text
Every 5 minutes
```

Workflow

1. Locate Scheduled prices whose Effective From is less than or equal to the current server time.
2. Expire the existing Active price for the same product.
3. Activate the Scheduled price.
4. Update pricing status.
5. Record audit events.
6. Refresh application cache.

Business Rules

- Only one Active price may exist for a product.
- Scheduled prices never overlap.
- Historical prices remain immutable.

---

## 49. Dispatch Management Integration

Dispatch pricing is determined at dispatch creation.

Business rules:

- Only Active prices are selectable.
- Selling price is copied into the dispatch line item.
- Later price changes do not modify completed dispatches.
- Historical dispatch records always retain the original selling price.

---

## 50. Ledger Management Integration

Ledger entries derive financial values from the dispatch price captured at the time of sale.

Business Rules

- Ledger calculations never reference future prices.
- Historical ledger entries remain immutable.
- Price corrections never modify posted ledger transactions.

---

## 51. Payment Management Integration

Payments reference invoices and ledger balances generated from historical pricing.

Business Rules

- Payment calculations always use the invoiced amount.
- Price updates never alter payment history.
- Refunds reference the original transaction value.

---

## 52. Reporting Integration

Pricing information is used for:

- Daily sales reports.
- Revenue analysis.
- Gross sales summaries.
- Product profitability.
- Historical pricing reports.
- Price change history.
- Sales trend analysis.

Historical reports always display the price that was effective at the time of the transaction.

---

## 53. Business Rules

The Pricing Management module enforces the following rules:

- Every pricing record has a unique Price Reference Number.
- Price Reference Numbers are immutable.
- Only one Active price may exist per product.
- Multiple Scheduled prices are permitted only if their effective periods do not overlap.
- Historical prices cannot be edited.
- Active prices cannot be edited directly.
- Editing an Active price requires creating a new pricing version.
- Prices cannot be deleted.
- Expired prices remain permanently available for reporting and auditing.

---

## 54. Security Requirements

The module complies with the system Security Model.

Requirements include:

- Role-Based Access Control (RBAC).
- Server-side authorization.
- Supabase Row-Level Security (RLS).
- HTTPS-only communication.
- Secure API endpoints.
- Request validation.
- Audit logging.
- Input sanitization.
- Output encoding.

Only users with Pricing.Override permission may manually activate scheduled prices.

---

## 55. Audit Events

The following events shall be recorded:

- Price Created
- Price Updated
- Price Activated
- Price Expired
- Scheduled Price Activated Automatically
- Price Viewed
- Failed Price Creation
- Failed Price Update
- Permission Denied

Each audit record includes:

- Event ID
- Timestamp
- User ID
- Product ID
- Pricing Record ID
- Action
- Previous Values
- Updated Values
- Correlation ID
- Client IP Address
- User Agent

Audit records are immutable.

---

## 56. Notifications

Success notifications

```text
Price created successfully.
```

```text
Price updated successfully.
```

```text
Price activated successfully.
```

```text
Price expired successfully.
```

```text
Scheduled price activated automatically.
```

Error notifications

```text
Pricing record not found.
```

```text
Permission denied.
```

```text
Overlapping pricing period detected.
```

```text
Selected product is inactive.
```

```text
Unexpected server error.
```

Notifications automatically dismiss after the configured timeout.

---

## 57. Responsive Behaviour

### Desktop

- Full pricing table.
- Persistent filters.
- Inline row actions.

---

### Tablet

- Responsive table.
- Wrapped toolbar.
- Overflow action menu.

---

### Mobile

- Card-based pricing list.
- Bottom-sheet actions.
- Optimized touch targets.
- Responsive form layout.

All functionality remains available across supported devices.

---

## 58. Performance Requirements

Target performance:

| Operation            | Target      |
| -------------------- | ----------- |
| Pricing List         | < 1 second  |
| Search               | < 300 ms    |
| Price Creation       | < 2 seconds |
| Scheduled Activation | < 5 seconds |
| Price Update         | < 2 seconds |
| Price Expiration     | < 1 second  |

Searching, filtering, sorting, and pagination shall be executed server-side.

Background activation jobs must complete within one execution cycle.

---

## 59. Accessibility

The Pricing Management module complies with WCAG 2.1 AA.

Requirements include:

- Keyboard navigation.
- Screen-reader compatibility.
- Accessible form labels.
- Semantic HTML.
- Logical focus order.
- Visible focus indicators.
- Accessible validation messages.
- Minimum AA color contrast.

---

## 60. Acceptance Criteria

The Pricing Management module is complete when:

- Authorized users can create pricing records.
- Future prices can be scheduled.
- Scheduled prices activate automatically.
- Only one Active price exists per product.
- Historical pricing remains immutable.
- Active prices cannot be edited.
- Manual activation requires Pricing.Override permission.
- Price expiration functions correctly.
- Dispatches retain historical pricing.
- Ledger and payment records remain unchanged after pricing updates.
- Audit events are generated correctly.
- Security requirements are enforced.
- Accessibility requirements are satisfied.
- Performance targets are achieved.

---

## 61. References

This module is governed by:

- `/architecture/DOMAIN_MODEL.md`
- `/architecture/BUSINESS_RULE_ENGINE.md`
- `/architecture/WORKFLOW_ENGINE.md`
- `/architecture/SECURITY_MODEL.md`
- `/architecture/CQRS.md`
- `/docs/SYSTEM_REQUIREMENTS_SPECIFICATION.md`

Related functional specifications:

- `/docs/functional-specification/PRODUCT_MANAGEMENT.md`
- `/docs/functional-specification/PRODUCT_CATEGORY_MANAGEMENT.md`
- `/docs/functional-specification/DISPATCH_MANAGEMENT.md`
- `/docs/functional-specification/LEDGER_MANAGEMENT.md`
- `/docs/functional-specification/PAYMENT_MANAGEMENT.md`

---

## 62. Future Enhancements

The Pricing Management module has been designed to support future expansion without structural changes, including:

- Customer-specific pricing.
- Territory-based pricing.
- Quantity break pricing.
- Promotional pricing.
- Seasonal pricing.
- Contract pricing.
- Discount campaigns.
- Price approval workflows.
- Multi-currency pricing.
- AI-assisted pricing recommendations.

---

## 63. Conclusion

The Pricing Management module serves as the authoritative pricing engine for the EMA Bakery Distribution Management System.

By implementing immutable pricing versions, automatic scheduled activation, strict business-rule enforcement, and seamless integration with Dispatch, Ledger, Payments, and Reporting, the module guarantees accurate historical pricing, financial integrity, and complete auditability. Its version-based design ensures future scalability while maintaining enterprise-grade standards for consistency, security, performance, and compliance across all operational workflows.
