# Product Category Management Functional Specification

**Project:** EMA Bakery Distribution Management System (EMA-BDMS)

**Module:** Product Category Management

**Version:** 1.0.0

**Status:** Approved

---

## 1. Purpose

The Product Category Management module provides centralized management of product categories used throughout the EMA Bakery Distribution Management System.

Categories organize products into logical business groups, simplify reporting, improve product selection during dispatch, and provide the foundation for pricing, inventory, analytics, and future product expansion.

Every product must belong to exactly one active category.

---

## 2. Business Objectives

The Product Category Management module shall:

- Maintain a centralized category master.
- Prevent duplicate category names.
- Organize products into business groups.
- Support category activation and deactivation.
- Prevent deletion of referenced categories.
- Improve product searching and filtering.
- Integrate with Product Management.
- Integrate with Pricing.
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

Permission enforcement occurs entirely on the server.

Users without permission never see administrative actions.

---

## 4. Routes

Category List

```text
/product-categories
```

Create Category

```text
/product-categories/new
```

View Category

```text
/product-categories/{id}
```

Edit Category

```text
/product-categories/{id}/edit
```

---

## 5. Navigation

Dashboard

↓

Products

↓

Product Categories

The navigation item is displayed only to users with Category.View permission.

---

## 6. Navigation Flow

```text
Dashboard

↓

Product Categories

↓

Category List

↓

View Category

↓

Edit Category

↓

Save Changes

↓

Return to Category Details
```

---

## 7. Screen Inventory

The module contains:

- Category List
- Create Category
- View Category
- Edit Category

Future versions may include:

- Category Images
- Display Order
- Parent/Child Categories
- Category Icons
- Category Color Coding

---

## 8. Category List Screen

### Purpose

Displays every product category configured within the system.

Authorized users may:

- Search
- Filter
- Sort
- View
- Edit
- Activate
- Deactivate

according to assigned permissions.

---

### Screen Layout

The page contains:

- Breadcrumb
- Page Header
- Search Box
- Status Filter
- Refresh Button
- New Category Button
- Category Table
- Pagination Controls

---

## 9. Page Header

Title

```text
Product Category Management
```

Subtitle

```text
Organize bakery products into structured business categories.
```

---

## 10. Breadcrumb

```text
Home

↓

Products

↓

Product Categories
```

---

## 11. Toolbar

Toolbar components:

- Search
- Status Filter
- Refresh Button
- New Category Button

Desktop

Horizontal layout.

Tablet

Wrapped layout.

Mobile

Vertical stacking.

---

## 12. New Category Button

Label

```text
New Category
```

Style

Primary Button

Action

Navigate to:

```text
/product-categories/new
```

Permission Required

Category.Create

Hidden if permission is unavailable.

---

## 13. Search

Search updates after a 300 millisecond debounce.

Searchable fields:

- Category Code
- Category Name
- Description

Search behavior:

- Case-insensitive.
- Ignores leading and trailing whitespace.
- Supports partial matches.

---

## 14. Filters

Available filters:

Status

Sort Order

---

### Status

- All
- Active
- Inactive

---

### Sort Order

- Newest First
- Oldest First
- Name A–Z
- Name Z–A

---

## 15. Category Table

Columns

- Category Code
- Category Name
- Description
- Products Count
- Status
- Created Date
- Actions

Default Sort

Created Date (Descending)

Newest categories appear first.

---

## 16. Status Indicators

Available values

Active

Green Badge

Inactive

Gray Badge

Status updates immediately after successful changes.

---

## 17. Row Actions

Available actions:

- View
- Edit
- Activate
- Deactivate

Unavailable actions remain hidden.

---

## 18. Row Click Behaviour

Selecting a row opens:

```text
/product-categories/{id}
```

Exceptions:

- Action Menu
- Hyperlinks

perform only their own action.

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

- Skeleton rows displayed.
- Search disabled.
- Filters disabled.
- Buttons disabled.

Layout remains stable to avoid content shifting.

---

## 21. Empty State

If no categories exist:

Title

```text
No Product Categories Found
```

Message

```text
Create your first product category to organize bakery products.
```

Primary Action

```text
Create Category
```

Displayed only when the user has Category.Create permission.

---

## 22. No Search Results

Display

```text
No product categories match your search criteria.
```

Button

```text
Clear Filters
```

Selecting Clear Filters:

- Clears search.
- Clears filters.
- Reloads all categories.

---

## 23. Error State

If categories cannot be loaded:

Display

```text
Unable to load product categories.

Please try again.
```

Retry Button

```text
Retry
```

Retry reloads only the category table.

---

## 24. Micro-Interactions

Search Field

- Focus highlight.
- Clear icon appears automatically.

Buttons

- Hover elevation.
- Smooth transition.
- Pointer cursor.

Rows

- Hover background highlight.
- Pointer cursor.

Status Badge

- Tooltip describing current status.

Action Menu

- Fade animation.
- Closes on outside click.
- Closes on Escape key.

---

## 25. Acceptance Criteria (Part 1)

This section is complete when:

- Category list loads successfully.
- Search functions correctly.
- Filters operate without page reload.
- Pagination behaves correctly.
- Permission-based actions are enforced.
- Loading, empty, and error states function correctly.
- Navigation to category details works as expected.

---

## 26. Create Product Category Screen

### Route

```text
/product-categories/new
```

### Purpose

Allows authorized users to create a new product category used to organize bakery products throughout the system.

Each category serves as a logical grouping for products and becomes available immediately for product assignment after successful creation.

---

## 27. Screen Layout

The page contains:

- Breadcrumb
- Page Header
- Category Information Card
- Status Information Card
- Additional Information Card
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

Products

↓

Product Categories

↓

New Category
```

---

## 29. Category Information

### Category Code

Required.

Automatically generated.

Example

```text
CAT-000015
```

Rules

- Unique.
- Sequential numbering.
- Read-only.
- Cannot be modified after creation.

---

### Category Name

Required.

Maximum Length

100 characters.

Validation

- Required.
- Trim whitespace.
- Cannot contain only spaces.
- Must be unique.

Examples

```text
Bread
```

```text
Buns
```

```text
Cakes
```

```text
Pastries
```

---

### Description

Optional.

Maximum Length

500 characters.

Supports plain text only.

Example

```text
Products classified under standard bakery bread items.
```

---

## 30. Status Information

### Category Status

Default

Active

Available values

- Active
- Inactive

Business Rules

Active categories:

- Can receive new products.
- Appear in Product Management.
- Appear in Pricing Management.

Inactive categories:

- Cannot receive new products.
- Remain available in historical records.

---

## 31. Product Statistics

Version 1

Hidden during creation.

Displayed only after the category has been created.

Statistics include:

- Total Products
- Active Products
- Inactive Products

---

## 32. Form Validation

Validation occurs:

- On blur.
- On Save.
- On server.

Server validation always takes precedence.

Validation messages

```text
Category Name is required.
```

```text
Category Name already exists.
```

```text
Category Code already exists.
```

---

## 33. Save Button

Label

```text
Create Category
```

Workflow

1. Validate all fields.
2. Disable all form controls.
3. Display loading indicator.
4. Create category.
5. Generate audit event.
6. Refresh category cache.
7. Display success notification.
8. Redirect to Category Details.

Loading Label

```text
Creating Category...
```

---

## 34. Cancel Button

If no changes exist

Return immediately to Category List.

If changes exist

Display confirmation dialog.

---

## 35. Unsaved Changes Dialog

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

Backdrop Click

Close dialog.

Escape Key

Close dialog.

No information is saved.

---

## 36. View Category

### Route

```text
/product-categories/{id}
```

Purpose

Displays complete category information.

Read-only.

Displayed Information

- Category Code
- Category Name
- Description
- Status
- Product Count
- Active Products
- Inactive Products
- Created Date
- Last Updated

Available Actions

- Edit
- Activate
- Deactivate

Actions displayed according to user permissions.

---

## 37. Products Using This Category

The Category Details page includes a related Products section.

Displays

- Product Code
- Product Name
- Status

Default

First 10 products.

If additional products exist:

Display

```text
View All Products
```

Selecting the button navigates to

```text
/products
```

with the selected category filter automatically applied.

---

## 38. Edit Category

### Route

```text
/product-categories/{id}/edit
```

Purpose

Allows authorized users to update category information.

Editable Fields

- Category Name
- Description
- Status

Read-only Fields

- Category Code
- Created Date
- Product Statistics

---

## 39. Save Changes Workflow

Workflow

Validate

↓

Update Category

↓

Refresh Cache

↓

Generate Audit Event

↓

Display Success Notification

↓

Return to Category Details

---

Success Message

```text
Category updated successfully.
```

---

## 40. Validation Summary

Validation includes

- Required fields.
- Duplicate category name.
- Duplicate category code.
- Maximum description length.
- Invalid status.

---

## 41. Loading States

During Create and Update

- Inputs disabled.
- Buttons disabled.
- Loading spinner displayed.
- Duplicate submissions prevented.

---

## 42. Success Notifications

Category Created

```text
Category created successfully.
```

Category Updated

```text
Category updated successfully.
```

Status Updated

```text
Category status updated successfully.
```

---

## 43. Error Messages

Duplicate Category Name

```text
A category with this name already exists.
```

Duplicate Category Code

```text
Category Code already exists.
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

Forms support

- Keyboard navigation.
- Screen reader compatibility.
- Accessible labels.
- Logical tab order.
- Visible focus indicators.
- Accessible validation messages.
- Semantic HTML controls.

---

## 45. Acceptance Criteria (Part 2)

The Create, View and Edit Category functionality is complete when:

- Authorized users can create categories.
- Authorized users can edit categories.
- Duplicate category names are prevented.
- Category Codes remain immutable.
- Related products are visible.
- Validation behaves correctly.
- Loading states prevent duplicate submissions.
- Success and error notifications display correctly.
- Unsaved changes trigger confirmation dialogs.

---

## 46. Activate Category Workflow

### Purpose

Allows an authorized user to reactivate an inactive product category, making it available for assigning new products and future operational use.

---

### Trigger

Available from:

- Product Category List
- Product Category Details

Action:

Activate Category

---

### Confirmation Dialog

#### Title

```text
Activate Product Category
```

#### Message

```text
This category will become available for assigning products and future pricing activities.

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
2. Verify the category exists.
3. Verify the category is currently inactive.
4. Update the category status to Active.
5. Record an audit event.
6. Refresh cached category data.
7. Refresh Product Management category lookups.
8. Display a success notification.

---

### Success Message

```text
Product category activated successfully.
```

---

### Cancel Action

No changes are made.

The dialog closes.

Keyboard focus returns to the Activate Category action.

---

## 47. Deactivate Category Workflow

### Purpose

Prevents a category from being assigned to new products while preserving all historical relationships.

---

### Trigger

Available from:

- Product Category List
- Product Category Details

---

### Confirmation Dialog

#### Title

```text
Deactivate Product Category
```

#### Message

```text
This category will no longer be available for creating new products.

Existing products assigned to this category will remain unchanged.

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
2. Verify the category exists.
3. Verify the category is currently active.
4. Count products assigned to the category.
5. Allow deactivation.
6. Update status to Inactive.
7. Record audit event.
8. Refresh cached category data.
9. Display success notification.

---

### Business Behaviour

Products already assigned to an inactive category:

- Continue to exist.
- Continue appearing in reports.
- Continue appearing in historical dispatches.
- Cannot receive newly created products.

Administrators may later:

- Reactivate the category.
- Move products to another category individually.

---

### Success Message

```text
Product category deactivated successfully.
```

---

## 48. Product Management Integration

The Product Category module integrates directly with Product Management.

Business rules:

- Every product belongs to exactly one category.
- Only Active categories appear during product creation.
- Existing products retain their category even if the category becomes inactive.
- Category name updates are immediately reflected throughout Product Management.
- Category deletion is never permitted.

---

## 49. Pricing Management Integration

Pricing records inherit product category information through the associated product.

Business rules:

- Category changes never modify historical pricing.
- Inactive categories cannot receive newly created products.
- Existing pricing remains unchanged.

---

## 50. Dispatch Management Integration

Dispatch operations reference products rather than categories directly.

Category information is used for:

- Product grouping.
- Dispatch summaries.
- Operational filtering.
- Future route optimization.

Historical dispatch records always retain their original category reference.

---

## 51. Reporting Integration

Reports utilize category information for:

- Sales by category.
- Revenue by category.
- Product distribution.
- Product performance.
- Dispatch summaries.
- Historical trend analysis.

Inactive categories remain visible in historical reports.

---

## 52. Business Rules

The Product Category Management module enforces the following rules:

- Every category has one unique Category Code.
- Category Codes are immutable.
- Category Names are unique.
- Every product belongs to exactly one category.
- Only Active categories can receive newly created products.
- Categories cannot be deleted.
- Categories may only be activated or deactivated.
- Historical transactions must never be modified.
- Category changes immediately affect future product selection.

---

## 53. Security Requirements

The module complies with the Security Model.

Requirements include:

- Role-Based Access Control (RBAC).
- Server-side authorization.
- Supabase Row-Level Security (RLS).
- HTTPS-only communication.
- Audit logging.
- Secure API endpoints.
- Input validation.
- Output encoding.
- Protection against unauthorized modification.

---

## 54. Audit Events

The following events are recorded:

- Category Created
- Category Updated
- Category Activated
- Category Deactivated
- Category Viewed
- Failed Category Creation
- Failed Category Update
- Permission Denied

Each audit record stores:

- Event ID
- Timestamp
- User ID
- Category ID
- Action
- Previous Values
- New Values
- Correlation ID
- Client IP Address
- User Agent

Audit records are immutable.

---

## 55. Notifications

Success notifications:

```text
Category created successfully.
```

```text
Category updated successfully.
```

```text
Product category activated successfully.
```

```text
Product category deactivated successfully.
```

Error notifications:

```text
Category not found.
```

```text
Permission denied.
```

```text
Category Code already exists.
```

```text
Category Name already exists.
```

```text
Unexpected server error.
```

Notifications automatically dismiss after the configured timeout.

---

## 56. Responsive Behaviour

### Desktop

- Full-width category table.
- Inline actions.
- Persistent toolbar.

---

### Tablet

- Responsive columns.
- Wrapped toolbar.
- Overflow action menu.

---

### Mobile

- Card-based category list.
- Bottom-sheet action menu.
- Large touch targets.
- Optimized spacing.
- Vertical information layout.

All functionality remains available across supported devices.

---

## 57. Performance Requirements

Target performance:

| Operation             | Target      |
| --------------------- | ----------- |
| Category List         | < 1 second  |
| Search                | < 300 ms    |
| Category Creation     | < 2 seconds |
| Category Update       | < 2 seconds |
| Category Activation   | < 1 second  |
| Category Deactivation | < 1 second  |

Searching, filtering, sorting, and pagination are executed server-side.

---

## 58. Accessibility

The Product Category Management module complies with WCAG 2.1 AA.

Requirements:

- Keyboard navigation.
- Screen-reader compatibility.
- Semantic HTML.
- Accessible dialogs.
- Logical focus order.
- Visible focus indicators.
- Accessible validation messages.
- Minimum AA color contrast.

---

## 59. Acceptance Criteria

The module is complete when:

- Authorized users can create categories.
- Authorized users can edit categories.
- Duplicate category names are prevented.
- Category Codes remain immutable.
- Categories can be activated and deactivated.
- Active categories are available for new product creation.
- Inactive categories cannot receive newly created products.
- Historical records remain unchanged.
- Audit events are generated correctly.
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

Related functional specifications:

- `/docs/functional-specification/PRODUCT_MANAGEMENT.md`
- `/docs/functional-specification/PRICING_MANAGEMENT.md`
- `/docs/functional-specification/DISPATCH_MANAGEMENT.md`

---

## 61. Future Enhancements

The module has been designed to support future expansion without structural changes, including:

- Hierarchical parent/child categories.
- Custom display ordering.
- Category icons and branding.
- Category-specific pricing rules.
- Category-level sales targets.
- Inventory grouping.
- Production planning by category.
- Seasonal category activation.
- Multi-language category names.

---

## 62. Conclusion

The Product Category Management module provides the organizational structure for the product catalog within the EMA Bakery Distribution Management System.

It establishes a secure and centralized category master that integrates seamlessly with Product Management, Pricing, Dispatch, and Reporting. By enforcing immutable category identifiers, preserving historical business integrity, and preventing destructive operations such as deletion, the module ensures long-term consistency, scalability, and maintainability. Its design also provides a solid foundation for future capabilities such as hierarchical categorization, advanced reporting, and inventory planning while maintaining enterprise-grade standards for security, auditability, and performance.
