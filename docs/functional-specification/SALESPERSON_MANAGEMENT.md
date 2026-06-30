# Salesperson Management Functional Specification

**Project:** EMA Bakery Distribution Management System (EMA-BDMS)

**Module:** Salesperson Management

**Version:** 1.0.0

**Status:** Approved

---

## 1. Purpose

The Salesperson Management module provides centralized management of all sales representatives operating within the bakery distribution network.

It enables authorized users to create, maintain, activate, deactivate, and monitor salesperson records used throughout dispatch, pricing, collections, ledger management, and reporting.

Each salesperson acts as a business entity linked to operational transactions throughout the system.

---

## 2. Business Objectives

The module shall:

- Maintain a centralized salesperson master.
- Store contact information.
- Store employment information.
- Assign operational status.
- Prevent duplicate salesperson records.
- Support searching and filtering.
- Integrate with Dispatch Management.
- Integrate with Ledger Management.
- Integrate with Reporting.
- Maintain complete audit history.

---

## 3. User Roles & Permissions

| Role                 | Access      |
| -------------------- | ----------- |
| System Administrator | Full Access |
| Operations Manager   | Full Access |
| Finance Officer      | View Only   |
| Sales Coordinator    | View Only   |
| Read-Only User       | View Only   |

Permission checks are enforced on the server.

Users without permission never see management actions.

---

## 4. Routes

Salesperson List

```text
/salespersons
```

Create Salesperson

```text
/salespersons/new
```

View Salesperson

```text
/salespersons/{id}
```

Edit Salesperson

```text
/salespersons/{id}/edit
```

---

## 5. Navigation

Users access this module through:

Dashboard

↓

Salespersons

The navigation item is displayed only to users with permission.

---

## 6. Navigation Flow

```text
Dashboard

↓

Salesperson List

↓

View Salesperson

↓

Edit Salesperson

↓

Save Changes

↓

Return to Details
```

---

## 7. Screen Inventory

The module contains four primary screens:

- Salesperson List
- Create Salesperson
- View Salesperson
- Edit Salesperson

Future enhancements may introduce:

- Territory Assignment
- Performance Dashboard
- Commission History

---

## 8. Salesperson List Screen

### Purpose

Displays every registered salesperson.

Allows authorized users to:

- Search
- Filter
- Sort
- View
- Edit
- Activate
- Deactivate

depending on permissions.

---

### Layout

The screen contains:

- Breadcrumb
- Page Title
- Search Bar
- Status Filter
- Refresh Button
- Create Salesperson Button
- Salesperson Table
- Pagination Controls

---

## 9. Breadcrumb

Displays:

```text
Home

↓

Salespersons
```

---

## 10. Page Header

Title

```text
Salesperson Management
```

Subtitle

```text
Manage sales representatives responsible for product distribution and customer collections.
```

---

## 11. Toolbar

Toolbar components:

- Search Box
- Status Filter
- Refresh Button
- New Salesperson Button

Desktop:

Horizontal layout

Tablet:

Responsive wrapping

Mobile:

Vertical stacking

---

## 12. Create Salesperson Button

Label

```text
New Salesperson
```

Style

Primary Button

Icon

Person Add

Click Action

Navigate to:

```text
/salespersons/new
```

Permission Required

Salesperson.Create

If permission is missing, the button is hidden.

---

## 13. Search

Search updates automatically after 300 ms debounce.

Searchable fields:

- Employee Code
- First Name
- Last Name
- Mobile Number
- Email Address

Search ignores case.

Leading and trailing spaces are trimmed.

---

## 14. Filters

Available filters:

Status

Sort Order

---

### Status

Options:

- All
- Active
- Inactive

---

### Sort Order

Available options:

- Newest First
- Oldest First
- Name A–Z
- Name Z–A

---

## 15. Salesperson Table

Columns:

- Employee Code
- Full Name
- Mobile Number
- Email Address
- Territory (Future)
- Status
- Created Date
- Actions

Default Sort:

Created Date (Descending)

Newest salesperson records appear first.

---

## 16. Status Indicators

Each salesperson displays one status badge.

Available values:

Active

Green Badge

Inactive

Gray Badge

Status updates immediately after successful changes.

---

## 17. Row Actions

Each row includes an Actions menu.

Available actions:

- View
- Edit
- Activate
- Deactivate

Actions are displayed only when permitted.

---

## 18. Row Click Behaviour

Clicking a row navigates to:

```text
/salespersons/{id}
```

Exceptions:

- Action Menu
- Checkboxes (Future)
- Hyperlinks

perform only their assigned action.

---

## 19. Pagination

Default Page Size

25

Supported values:

- 10
- 25
- 50
- 100

Pagination displays:

- Current Page
- Total Pages
- Total Records
- First
- Previous
- Next
- Last

Pagination is performed server-side.

---

## 20. Loading State

During loading:

- Skeleton rows displayed.
- Search disabled.
- Filters disabled.
- Buttons disabled.

No layout shift occurs.

---

## 21. Empty State

If no salesperson records exist:

Title

```text
No Salespersons Found
```

Message

```text
Create your first salesperson to begin managing distribution operations.
```

Primary Button

```text
Create Salesperson
```

Displayed only if the user has create permission.

---

## 22. No Search Results

Message

```text
No salespersons match your search criteria.
```

Button

```text
Clear Filters
```

Selecting Clear Filters:

- Clears search
- Clears filters
- Reloads complete list

---

## 23. Error State

If data retrieval fails:

Display

```text
Unable to load salesperson records.

Please try again.
```

Retry Button

```text
Retry
```

Retry reloads only the table data.

---

## 24. Micro-Interactions

Search Field

- Focus highlight
- Clear icon appears automatically

Buttons

- Hover elevation
- Pointer cursor
- Smooth transitions

Table Rows

- Hover background
- Pointer cursor

Status Badges

- Tooltip on hover

Action Menu

- Fade animation
- Close on outside click
- Close on Escape key

---

## 25. Acceptance Criteria (Part 1)

This section is complete when:

- Salesperson list loads successfully.
- Search functions correctly.
- Filters work without page reload.
- Pagination behaves correctly.
- Permission-based actions display correctly.
- Loading, empty, and error states function as expected.
- Table navigation behaves consistently.

---

## 26. Create Salesperson Screen

### Route

```text
/salespersons/new
```

### Purpose

Allows authorized users to register a new salesperson who will participate in dispatch operations, payment collections, customer servicing, and business reporting.

Every salesperson must have a unique identity within the system.

---

## 27. Screen Layout

The page consists of:

- Breadcrumb
- Page Header
- Personal Information Card
- Employment Information Card
- Contact Information Card
- Status Information Card
- Action Bar

Desktop:

Two-column layout.

Tablet:

Single-column responsive layout.

Mobile:

Single-column stacked layout.

---

## 28. Breadcrumb

```text
Home

↓

Salespersons

↓

New Salesperson
```

---

## 29. Personal Information

### Employee Code

Required

Generated automatically.

Example:

```text
SP-000125
```

Rules:

- Unique.
- Read-only.
- Sequential numbering.
- Cannot be edited.

---

### First Name

Required

Maximum Length:

100 characters

Validation:

- Required.
- Alphabetic characters only.
- Leading/trailing spaces removed.

---

### Last Name

Required

Maximum Length:

100 characters

Validation:

Same as First Name.

---

### Full Name

Calculated automatically.

Displayed as:

```text
First Name + Last Name
```

Read-only.

---

## 30. Employment Information

### Date Joined

Required.

Default:

Current Date.

Cannot be a future date.

---

### Employment Status

Available values:

- Active
- Inactive

Default:

Active.

---

### Designation

Required.

Examples:

- Sales Representative
- Senior Sales Representative
- Distribution Officer

Maximum:

100 characters.

---

## 31. Contact Information

### Mobile Number

Required.

Validation:

- Digits only.
- Country code optional.
- Maximum 20 characters.

Example:

```text
+966501234567
```

---

### Email Address

Optional.

Validation:

- Valid email format.
- Unique if provided.
- Maximum 255 characters.

---

### Address

Optional.

Maximum Length:

500 characters.

Supports multiple lines.

---

## 32. Assignment Information

Version 1

No territory assignment.

Future versions may support:

- Distribution Zones
- Delivery Routes
- Assigned Customers

This section remains hidden until implemented.

---

## 33. Form Validation

Validation occurs:

- On blur.
- On Save.
- On server.

Server validation always overrides client validation.

Examples:

```text
First Name is required.
```

```text
Employee Code already exists.
```

```text
Invalid mobile number.
```

---

## 34. Save Button

Label

```text
Create Salesperson
```

Workflow

1. Validate fields.
2. Disable controls.
3. Display loading indicator.
4. Create salesperson.
5. Generate audit record.
6. Display success notification.
7. Redirect to Salesperson Details.

Loading Label

```text
Creating Salesperson...
```

---

## 35. Cancel Button

If no changes exist:

Return immediately to Salesperson List.

If unsaved changes exist:

Display confirmation dialog.

---

## 36. Unsaved Changes Dialog

Title

```text
Discard Changes?
```

Message

```text
You have unsaved changes.

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

Backdrop Click:

Close dialog.

Escape Key:

Close dialog.

No data is saved.

---

## 37. View Salesperson

### Route

```text
/salespersons/{id}
```

Purpose:

Displays complete salesperson information.

Read-only.

---

Information displayed:

- Employee Code
- Full Name
- Mobile Number
- Email
- Designation
- Employment Status
- Date Joined
- Created Date
- Last Updated

---

Actions available:

- Edit
- Activate
- Deactivate

Based on permissions.

---

## 38. Edit Salesperson

### Route

```text
/salespersons/{id}/edit
```

Purpose

Allows modification of salesperson information.

Editable Fields

- First Name
- Last Name
- Mobile Number
- Email
- Address
- Designation
- Employment Status

Read-only Fields

- Employee Code
- Date Joined
- Created Date

---

## 39. Save Changes Workflow

Validate

↓

Update Record

↓

Refresh Cache

↓

Audit Event

↓

Success Notification

↓

Return to Details

---

Success Message

```text
Salesperson updated successfully.
```

---

## 40. Validation Summary

Validation includes:

- Required fields.
- Duplicate email.
- Duplicate employee code.
- Invalid phone number.
- Invalid designation.
- Invalid employment status.

---

## 41. Loading States

During create/update:

- Inputs disabled.
- Buttons disabled.
- Spinner displayed.
- Duplicate submissions prevented.

---

## 42. Success Notifications

Salesperson Created

```text
Salesperson created successfully.
```

Salesperson Updated

```text
Salesperson updated successfully.
```

Status Updated

```text
Salesperson status updated successfully.
```

---

## 43. Error Messages

Duplicate Employee Code

```text
Employee Code already exists.
```

Duplicate Email

```text
Email address already exists.
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

## 44. Accessibility

Forms support:

- Keyboard navigation.
- Screen-reader labels.
- Visible focus indicators.
- Accessible validation messages.
- Semantic HTML controls.

---

## 45. Acceptance Criteria (Part 2)

This section is complete when:

- Authorized users can create salespersons.
- Authorized users can edit salesperson records.
- Validation prevents invalid data.
- Duplicate records cannot be created.
- Unsaved changes trigger confirmation dialogs.
- Success and error notifications display correctly.
- Loading states prevent duplicate submissions.

---

## 46. Activate Salesperson Workflow

### Purpose

Allows an authorized user to reactivate an inactive salesperson, making them available for operational activities such as dispatch assignment and reporting.

---

### Trigger

Available from:

- Salesperson List
- Salesperson Details

Action:

Activate Salesperson

---

### Confirmation Dialog

#### Title

```text
Activate Salesperson
```

#### Message

```text
This salesperson will immediately become available for dispatch assignment and operational activities.

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
2. Verify the salesperson exists.
3. Verify the salesperson is currently inactive.
4. Update status to Active.
5. Record an audit event.
6. Refresh cached data.
7. Display a success notification.

---

### Success Message

```text
Salesperson activated successfully.
```

---

### Cancel Action

No changes are made.

The confirmation dialog closes.

Keyboard focus returns to the Activate action.

---

## 47. Deactivate Salesperson Workflow

### Purpose

Temporarily prevents a salesperson from participating in operational activities while preserving historical records.

---

### Trigger

Available from:

- Salesperson List
- Salesperson Details

---

### Confirmation Dialog

#### Title

```text
Deactivate Salesperson
```

#### Message

```text
This salesperson will no longer be available for future dispatches.

Existing historical records will remain unchanged.

Do you want to continue?
```

---

#### Buttons

Primary

```text
Deactivate
```

Secondary

```text
Cancel
```

---

### Confirm Workflow

The system shall:

1. Validate permissions.
2. Verify salesperson exists.
3. Verify salesperson is currently active.
4. Check for active dispatches.
5. Prevent deactivation if unfinished dispatches exist.
6. Update status to Inactive.
7. Record audit event.
8. Refresh displayed data.
9. Display success notification.

---

### Validation Rules

Deactivation is blocked when:

- Assigned to an open dispatch.
- Assigned to a dispatch awaiting payment reconciliation.
- Assigned to an unfinished operational workflow.

The administrator must resolve outstanding work before deactivation.

---

### Success Message

```text
Salesperson deactivated successfully.
```

---

## 48. Dispatch Integration

The Salesperson module integrates directly with Dispatch Management.

Business rules:

- Only Active salespersons appear in dispatch creation.
- Inactive salespersons cannot be assigned.
- Historical dispatches always retain their original salesperson.
- Editing salesperson information updates future displays but never modifies historical dispatch records.

---

## 49. Ledger Integration

Each salesperson is associated with financial activity.

The Ledger module references salesperson records for:

- Outstanding balances
- Cash collections
- Credit adjustments
- Daily reconciliation

Historical ledger records remain immutable regardless of salesperson status.

---

## 50. Payment Integration

Payments recorded against customers are linked to the responsible salesperson.

Business rules:

- Payments continue referencing inactive salespersons for historical accuracy.
- Reassigning a salesperson does not alter existing payment records.
- Reports always display the salesperson assigned at the time of payment.

---

## 51. Reporting Integration

The Reporting module uses salesperson data for:

- Daily sales reports
- Collection reports
- Dispatch summaries
- Outstanding balance reports
- Performance metrics

Inactive salespersons remain available in historical reports.

---

## 52. Business Rules

The Salesperson Management module enforces the following rules:

- Every salesperson has one unique Employee Code.
- Employee Codes are immutable after creation.
- Only Active salespersons may receive new dispatch assignments.
- Inactive salespersons remain visible in historical records.
- Duplicate email addresses are prohibited when provided.
- Date Joined cannot be a future date.
- Historical operational data must never be modified by profile changes.
- Deactivation is blocked when operational dependencies exist.

---

## 53. Security Requirements

The module complies with the Security Model.

Requirements include:

- Role-Based Access Control (RBAC).
- Server-side authorization.
- Supabase Row-Level Security (RLS).
- HTTPS-only communication.
- Audit logging for all administrative actions.
- Protection against unauthorized record modification.
- Validation of every update request on the server.

---

## 54. Audit Events

The following events are recorded:

- Salesperson Created
- Salesperson Updated
- Salesperson Activated
- Salesperson Deactivated
- Salesperson Viewed
- Failed Create Attempt
- Failed Update Attempt
- Permission Denied

Each audit event records:

- Event ID
- Timestamp
- Administrator User ID
- Salesperson ID
- Action
- Previous Values
- Updated Values
- Correlation ID

---

## 55. Notifications

Success notifications include:

- Salesperson created successfully.
- Salesperson updated successfully.
- Salesperson activated successfully.
- Salesperson deactivated successfully.

Error notifications include:

- Validation failed.
- Duplicate employee code.
- Duplicate email.
- Permission denied.
- Active dispatch prevents deactivation.
- Unexpected server error.

Notifications automatically dismiss after the configured timeout.

---

## 56. Responsive Behaviour

### Desktop

- Full data table.
- Complete toolbar.
- Inline row actions.

---

### Tablet

- Responsive columns.
- Wrapped toolbar.
- Overflow action menu.

---

### Mobile

- Card-based layout.
- Bottom-sheet action menu.
- Vertical information stacking.
- Optimized touch targets.

All functionality remains available on supported devices.

---

## 57. Performance Requirements

Performance targets:

- Salesperson list load: < 1 second.
- Search response: < 300 milliseconds.
- Create salesperson: < 2 seconds.
- Update salesperson: < 2 seconds.
- Activate/Deactivate: < 1 second.

Filtering, searching, and pagination are performed server-side.

---

## 58. Accessibility

The Salesperson Management module complies with WCAG 2.1 AA.

Requirements:

- Keyboard-only navigation.
- Screen reader compatibility.
- Accessible form labels.
- Logical focus order.
- Visible focus indicators.
- Semantic HTML.
- Sufficient color contrast.
- Accessible validation messages.

---

## 59. Acceptance Criteria

The module is considered complete when:

- Authorized users can create salesperson records.
- Authorized users can edit salesperson records.
- Search, filtering, sorting, and pagination function correctly.
- Duplicate records are prevented.
- Employee Codes remain immutable.
- Active salespersons are available for dispatch assignment.
- Inactive salespersons cannot receive new assignments.
- Deactivation is blocked when operational dependencies exist.
- Historical records remain unchanged.
- Audit events are generated for all administrative actions.
- Security requirements are enforced.
- Accessibility requirements are satisfied.
- Performance targets are achieved.

---

## 60. References

This module is governed by:

- `/architecture/DOMAIN_MODEL.md`
- `/architecture/BUSINESS_RULE_ENGINE.md`
- `/architecture/WORKFLOW_ENGINE.md`
- `/architecture/SECURITY_MODEL.md`
- `/architecture/CQRS.md`
- `/docs/SYSTEM_REQUIREMENTS_SPECIFICATION.md`

---

## 61. Conclusion

The Salesperson Management module establishes the authoritative source of salesperson information for the EMA Bakery Distribution Management System.

By providing secure lifecycle management, strict validation, operational safeguards, and seamless integration with Dispatch, Ledger, Payments, and Reporting, the module ensures that salesperson data remains accurate, consistent, and reliable throughout the application.

The design preserves historical business integrity while supporting future enhancements such as territory management, commission calculation, route optimization, attendance tracking, and performance analytics without requiring structural changes to the core domain model.
