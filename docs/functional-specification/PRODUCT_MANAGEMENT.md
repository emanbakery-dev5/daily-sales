# Product Management Functional Specification

**Project:** EMA Bakery Distribution Management System (EMA-BDMS)

**Module:** Product Management

**Version:** 1.0.0

**Status:** Approved

---

## 1. Purpose

The Product Management module is the authoritative source for every bakery product sold through the EMA Bakery Distribution Management System.

It enables authorized users to create, maintain, activate, deactivate, and organize products used throughout dispatch operations, pricing, inventory calculations, payment processing, ledger entries, and business reporting.

Products created in this module are referenced throughout the application and therefore become immutable business entities once used in transactions.

---

## 2. Business Objectives

The Product Management module shall:

- Maintain a centralized product catalog.
- Associate every product with one product category.
- Store product identification details.
- Store pricing reference information.
- Manage product availability.
- Prevent duplicate product records.
- Support searching, filtering, and sorting.
- Integrate with Pricing Management.
- Integrate with Dispatch Management.
- Integrate with Reporting.
- Preserve historical product integrity.

---

## 3. User Roles & Permissions

| Role                 | Access      |
| -------------------- | ----------- |
| System Administrator | Full Access |
| Operations Manager   | Full Access |
| Finance Officer      | View Only   |
| Sales Coordinator    | View Only   |
| Read-Only User       | View Only   |

Permission enforcement occurs on the server.

Users without permission shall never see create, edit, activate, or deactivate actions.

---

## 4. Routes

Product List

```text
/products
```

Create Product

```text
/products/new
```

View Product

```text
/products/{id}
```

Edit Product

```text
/products/{id}/edit
```

---

## 5. Navigation

Users access this module through:

Dashboard

↓

Products

The navigation item is displayed only to users with Product.View permission.

---

## 6. Navigation Flow

```text
Dashboard

↓

Products

↓

Product List

↓

View Product

↓

Edit Product

↓

Save Changes

↓

Return to Product Details
```

---

## 7. Screen Inventory

The module consists of:

- Product List
- Create Product
- View Product
- Edit Product

Future releases may add:

- Product Images
- Product Variants
- Product Availability Calendar
- Product Cost History

---

## 8. Product List Screen

### Purpose

Displays all registered bakery products.

Authorized users may:

- Search
- Filter
- Sort
- View
- Edit
- Activate
- Deactivate

depending on assigned permissions.

---

### Screen Layout

The page contains:

- Breadcrumb
- Page Header
- Search Input
- Category Filter
- Status Filter
- Refresh Button
- New Product Button
- Product Table
- Pagination Controls

---

## 9. Page Header

Title

```text
Product Management
```

Subtitle

```text
Manage bakery products available for pricing, dispatch, and reporting.
```

---

## 10. Breadcrumb

```text
Home

↓

Products
```

---

## 11. Toolbar

Toolbar components:

- Search
- Category Filter
- Status Filter
- Refresh Button
- New Product Button

Desktop:

Horizontal layout.

Tablet:

Wrapped layout.

Mobile:

Vertical layout.

---

## 12. New Product Button

Label

```text
New Product
```

Style

Primary Button

Action

Navigate to:

```text
/ products/new
```

Permission Required

Product.Create

If permission is absent, the button is hidden.

---

## 13. Search

Search uses a 300 ms debounce.

Searchable fields:

- Product Code
- Product Name
- Category Name
- SKU (Future)

Search behavior:

- Case-insensitive.
- Trims whitespace.
- Supports partial matching.

---

## 14. Filters

Available filters:

Category

Status

Sort Order

---

### Category

Displays all active product categories.

Default

All Categories

---

### Status

Options:

- All
- Active
- Inactive

---

### Sort Order

Options:

- Newest First
- Oldest First
- Name A–Z
- Name Z–A

---

## 15. Product Table

Columns:

- Product Code
- Product Name
- Category
- Base Unit
- Status
- Created Date
- Actions

Default Sort:

Created Date (Descending)

Newest products appear first.

---

## 16. Status Indicators

Available statuses:

Active

Green Badge

Inactive

Gray Badge

Status updates immediately following successful changes.

---

## 17. Row Actions

Each product row provides:

- View
- Edit
- Activate
- Deactivate

Actions not permitted by the user's role are hidden.

---

## 18. Row Click Behaviour

Selecting a table row navigates to:

```text
/products/{id}
```

Exceptions:

- Action menu
- Hyperlinks

perform only their intended action.

---

## 19. Pagination

Default page size:

25

Supported sizes:

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

Pagination is processed server-side.

---

## 20. Loading State

While product data loads:

- Skeleton table rows displayed.
- Search disabled.
- Filters disabled.
- Buttons disabled.

The table structure remains visible to avoid layout shift.

---

## 21. Empty State

If no products exist:

Title

```text
No Products Found
```

Message

```text
Create your first product to begin managing bakery inventory and dispatch items.
```

Primary Button

```text
Create Product
```

Displayed only when the user has Product.Create permission.

---

## 22. No Search Results

Display

```text
No products match your search criteria.
```

Button

```text
Clear Filters
```

Selecting Clear Filters:

- Clears search.
- Clears all filters.
- Reloads the complete product list.

---

## 23. Error State

If products cannot be loaded:

Display

```text
Unable to load products.

Please try again.
```

Retry Button

```text
Retry
```

Retry reloads only the product table.

---

## 24. Micro-Interactions

Search Input

- Focus highlight.
- Clear icon appears automatically.

Buttons

- Hover elevation.
- Smooth transitions.
- Pointer cursor.

Rows

- Hover highlight.
- Pointer cursor.

Status Badge

- Tooltip describing current status.

Action Menu

- Fade animation.
- Closes on outside click.
- Closes with Escape key.

---

## 25. Acceptance Criteria (Part 1)

This section is complete when:

- Product list loads successfully.
- Search functions correctly.
- Category and status filters operate without page reload.
- Pagination functions correctly.
- Permission-based actions are enforced.
- Loading, empty, and error states behave correctly.
- Navigation to product details functions correctly.

---

## 26. Create Product Screen

### Route

```text
/products/new
```

### Purpose

Allows authorized users to create a new bakery product that can be used throughout Pricing Management, Dispatch Management, Ledger Management, Reporting, and future Inventory Management.

Each product becomes a permanent business entity once referenced by operational transactions.

---

## 27. Screen Layout

The Create Product screen contains:

- Breadcrumb
- Page Header
- Product Information Card
- Category Information Card
- Unit Information Card
- Status Information Card
- Additional Information Card
- Action Bar

Desktop:

Two-column responsive layout.

Tablet:

Single-column responsive layout.

Mobile:

Single-column stacked layout.

---

## 28. Breadcrumb

```text
Home

↓

Products

↓

New Product
```

---

## 29. Product Information

### Product Code

Required.

Generated automatically.

Example

```text
PRD-000124
```

Rules

- Unique
- Read-only
- Sequential numbering
- Cannot be modified after creation

---

### Product Name

Required.

Maximum Length

150 characters.

Validation

- Required
- Trim whitespace
- Cannot contain only spaces
- Must be unique within the selected category

Examples

```text
White Sandwich Bread
```

```text
Whole Wheat Bread
```

```text
Burger Bun
```

---

### Short Name

Optional.

Maximum Length

50 characters.

Displayed in compact reports and dispatch screens.

Example

```text
White Bread
```

---

## 30. Product Category

Required.

Dropdown populated from active Product Categories.

Only active categories are selectable.

Validation

- Category must exist.
- Category must be active.
- Category cannot be deleted while products reference it.

Example

```text
Bread
```

---

## 31. Unit Information

### Base Unit

Required.

Available values

- Piece
- Packet
- Tray
- Box
- Carton

Future versions may support configurable measurement units.

---

### Pack Size

Optional.

Positive whole number.

Example

```text
12
```

Meaning:

12 pieces per carton.

---

## 32. Product Status

Available values

- Active
- Inactive

Default

Active.

Inactive products:

- Cannot appear in new dispatches.
- Cannot receive new pricing.
- Continue appearing in historical records.

---

## 33. Product Description

Optional.

Maximum Length

1000 characters.

Supports plain text only.

Displayed in Product Details.

---

## 34. Form Validation

Validation occurs:

- On field blur.
- On Save.
- On server.

Server validation always takes precedence.

Validation examples

```text
Product Name is required.
```

```text
Product Code already exists.
```

```text
Please select a Product Category.
```

```text
Selected Product Category is inactive.
```

---

## 35. Save Button

Label

```text
Create Product
```

Workflow

1. Validate fields.
2. Disable form controls.
3. Display loading indicator.
4. Create product.
5. Generate audit event.
6. Refresh product cache.
7. Display success notification.
8. Redirect to Product Details.

Loading Label

```text
Creating Product...
```

---

## 36. Cancel Button

If no modifications exist:

Return immediately to Product List.

If unsaved changes exist:

Display confirmation dialog.

---

## 37. Unsaved Changes Dialog

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

No changes are saved.

---

## 38. View Product

### Route

```text
/products/{id}
```

Purpose

Displays complete product information.

Read-only.

---

Displayed Information

- Product Code
- Product Name
- Short Name
- Category
- Base Unit
- Pack Size
- Status
- Description
- Created Date
- Last Updated

Available Actions

- Edit
- Activate
- Deactivate

Displayed according to user permissions.

---

## 39. Edit Product

### Route

```text
/products/{id}/edit
```

Purpose

Allows authorized users to update product information.

Editable Fields

- Product Name
- Short Name
- Category
- Base Unit
- Pack Size
- Description
- Status

Read-only Fields

- Product Code
- Created Date

---

## 40. Save Changes Workflow

Workflow

Validate

↓

Update Product

↓

Refresh Cache

↓

Generate Audit Event

↓

Display Success Notification

↓

Return to Product Details

---

Success Message

```text
Product updated successfully.
```

---

## 41. Validation Summary

Validation includes

- Required fields
- Duplicate Product Name within category
- Duplicate Product Code
- Invalid Product Category
- Invalid Unit
- Invalid Pack Size

---

## 42. Loading States

During Create and Update

- Inputs disabled.
- Buttons disabled.
- Spinner displayed.
- Duplicate submissions prevented.

---

## 43. Success Notifications

Product Created

```text
Product created successfully.
```

Product Updated

```text
Product updated successfully.
```

Status Updated

```text
Product status updated successfully.
```

---

## 44. Error Messages

Duplicate Product Code

```text
Product Code already exists.
```

Duplicate Product Name

```text
A product with this name already exists in the selected category.
```

Inactive Category

```text
Selected Product Category is inactive.
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

This section is complete when:

- Authorized users can create products.
- Authorized users can edit products.
- Product Category selection validates correctly.
- Duplicate products cannot be created.
- Product Codes remain immutable.
- Unsaved changes trigger confirmation dialogs.
- Success and error notifications display correctly.
- Loading states prevent duplicate submissions.

---

## 46. Activate Product Workflow

### Purpose

Allows an authorized user to reactivate a previously inactive product, making it available for pricing, dispatch planning, sales, and reporting.

---

### Trigger

Available from:

- Product List
- Product Details

Action:

Activate Product

---

### Confirmation Dialog

#### Title

```text
Activate Product
```

#### Message

```text
This product will become available for pricing, dispatch planning and future sales transactions.

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
2. Verify the product exists.
3. Verify the product is currently inactive.
4. Verify the assigned category is active.
5. Update product status to Active.
6. Record an audit event.
7. Refresh cached product data.
8. Display a success notification.

---

### Success Message

```text
Product activated successfully.
```

---

### Cancel Action

No changes are made.

The dialog closes.

Keyboard focus returns to the Activate Product action.

---

## 47. Deactivate Product Workflow

### Purpose

Prevents a product from being used in future operational transactions while preserving all historical records.

---

### Trigger

Available from:

- Product List
- Product Details

---

### Confirmation Dialog

#### Title

```text
Deactivate Product
```

#### Message

```text
This product will no longer be available for new pricing records, dispatches or sales transactions.

Historical records will remain unchanged.

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
2. Verify product exists.
3. Verify product is currently active.
4. Check for active dispatch references.
5. Check for pending pricing updates.
6. Prevent deactivation if operational dependencies exist.
7. Update status to Inactive.
8. Record audit event.
9. Refresh displayed data.
10. Display success notification.

---

### Validation Rules

Product deactivation is blocked when:

- Product exists in an open dispatch.
- Product exists in a pending delivery.
- Product is referenced by an unfinished operational transaction.

Historical transactions never block viewing.

---

### Success Message

```text
Product deactivated successfully.
```

---

## 48. Pricing Management Integration

The Product module integrates directly with Pricing Management.

Business rules:

- Every pricing record references one active product.
- Inactive products cannot receive new prices.
- Historical pricing remains unchanged.
- Price history is never deleted.
- Product updates never modify historical pricing records.

---

## 49. Dispatch Management Integration

Products are selected during dispatch preparation.

Business rules:

- Only Active products are available for new dispatches.
- Product quantities are validated before dispatch confirmation.
- Inactive products cannot be added to new dispatchs.
- Existing dispatch records remain unchanged if a product later becomes inactive.

---

## 50. Ledger & Payment Integration

Products contribute to financial calculations through dispatch and invoice processing.

The Ledger module references products for:

- Sales value calculations
- Revenue summaries
- Daily sales totals
- Outstanding customer balances

Business rules:

- Product edits never modify historical ledger entries.
- Product status does not affect completed financial transactions.

---

## 51. Reporting Integration

Reports utilize product data for:

- Daily product sales
- Product performance
- Best-selling products
- Slow-moving products
- Sales by category
- Revenue by product
- Dispatch summaries
- Historical trend analysis

Inactive products remain visible in historical reports.

---

## 52. Business Rules

The Product Management module enforces the following rules:

- Every product has one unique Product Code.
- Product Codes are immutable.
- Every product belongs to exactly one Product Category.
- Product Categories must be active before new products can be assigned.
- Product Names must be unique within the same category.
- Only Active products can appear in new dispatches.
- Only Active products can receive new pricing records.
- Historical transactions must never be modified by product updates.
- Product deletion is not permitted.
- Products may only be deactivated.

---

## 53. Security Requirements

The module complies with the system Security Model.

Requirements include:

- Role-Based Access Control (RBAC).
- Server-side authorization.
- Supabase Row-Level Security (RLS).
- HTTPS-only communication.
- Validation of all requests.
- Audit logging for administrative actions.
- Protection against unauthorized modification.
- Secure API endpoints.
- Input sanitization.
- Output encoding where applicable.

---

## 54. Audit Events

The following events shall be recorded:

- Product Created
- Product Updated
- Product Activated
- Product Deactivated
- Product Viewed
- Failed Product Creation
- Failed Product Update
- Permission Denied

Each audit record includes:

- Event ID
- Timestamp
- User ID
- Product ID
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
Product created successfully.
```

```text
Product updated successfully.
```

```text
Product activated successfully.
```

```text
Product deactivated successfully.
```

Error notifications:

```text
Product not found.
```

```text
Permission denied.
```

```text
Product is currently used in an active dispatch.
```

```text
Selected Product Category is inactive.
```

```text
Unexpected server error.
```

Notifications automatically dismiss after the configured timeout.

---

## 56. Responsive Behaviour

### Desktop

- Full-width product table.
- Inline actions.
- Persistent filters.

---

### Tablet

- Responsive table layout.
- Wrapped toolbar.
- Overflow action menu.

---

### Mobile

- Card-based product list.
- Bottom-sheet action menu.
- Large touch targets.
- Optimized spacing.
- No horizontal scrolling where possible.

All functionality remains available on every supported device.

---

## 57. Performance Requirements

Target performance:

| Operation            | Target      |
| -------------------- | ----------- |
| Product List         | < 1 second  |
| Product Search       | < 300 ms    |
| Product Creation     | < 2 seconds |
| Product Update       | < 2 seconds |
| Product Activation   | < 1 second  |
| Product Deactivation | < 1 second  |

Searching, filtering, sorting, and pagination shall be performed server-side.

---

## 58. Accessibility

The Product Management module shall comply with WCAG 2.1 AA.

Requirements include:

- Keyboard navigation.
- Screen-reader compatibility.
- Semantic HTML.
- Accessible dialogs.
- Logical focus order.
- Visible focus indicators.
- Accessible validation messages.
- Minimum AA color contrast compliance.

---

## 59. Acceptance Criteria

The Product Management module is considered complete when:

- Authorized users can create products.
- Authorized users can edit products.
- Product Categories validate correctly.
- Duplicate products are prevented.
- Product Codes remain immutable.
- Products can be activated and deactivated according to business rules.
- Active products are available for pricing and dispatch.
- Inactive products are excluded from future operational workflows.
- Historical business records remain unchanged.
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

- `/docs/functional-specification/PRODUCT_CATEGORY_MANAGEMENT.md`
- `/docs/functional-specification/PRICING_MANAGEMENT.md`
- `/docs/functional-specification/DISPATCH_MANAGEMENT.md`

---

## 61. Conclusion

The Product Management module serves as the master catalog for all bakery products within the EMA Bakery Distribution Management System.

It provides a secure and controlled lifecycle for products, ensuring every operational area—including Pricing, Dispatch, Ledger, Payments, and Reporting—uses a single authoritative source of product data. By enforcing immutable product identifiers, preserving historical transaction integrity, and integrating with role-based security and comprehensive audit logging, the module establishes a scalable foundation for future enhancements such as inventory management, barcode support, product images, production planning, and stock control while maintaining enterprise-grade reliability and consistency.
