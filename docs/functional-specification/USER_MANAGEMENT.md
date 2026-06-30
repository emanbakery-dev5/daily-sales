# User Management Functional Specification

**Project:** EMA Bakery Distribution Management System (EMA-BDMS)

**Module:** User Management

**Version:** 1.0.0

**Status:** Approved

---

## 1. Purpose

The User Management module enables authorized administrators to manage system users, assign roles, control account status, and maintain secure access to the application.

This module ensures that only authorized personnel can access business functions appropriate to their responsibilities while maintaining a complete audit trail of all administrative actions.

---

## 2. Business Objectives

The User Management module shall:

- Create new users.
- Edit existing users.
- Enable and disable user accounts.
- Assign system roles.
- Assign custom permissions.
- Reset user passwords.
- Search and filter users.
- View user details.
- Prevent unauthorized administrative actions.
- Maintain complete audit history.

---

## 3. Authorized Roles

Only users with appropriate permissions may access this module.

| Role                 | Access               |
| -------------------- | -------------------- |
| System Administrator | Full Access          |
| Operations Manager   | View Only (Optional) |
| Finance Officer      | No Access            |
| Sales Coordinator    | No Access            |
| Read-Only User       | No Access            |

Permission checks are enforced server-side regardless of UI visibility.

---

## 4. Routes

```text
/users
```

Displays the User List.

---

```text
/users/new
```

Create User screen.

---

```text
/users/{id}
```

View User Details.

---

```text
/users/{id}/edit
```

Edit User.

---

## 5. Navigation

Users access this module through:

Administration

↓

Users

The menu item is visible only when the authenticated user has the required permission.

---

## 6. Navigation Flow

```text
Dashboard

↓

Administration

↓

User List

↓

Select User

↓

View Details

↓

Edit User

↓

Save Changes

↓

Return to User List
```

---

## 7. User List Screen

### Purpose

Displays all registered application users.

Allows administrators to:

- Search
- Filter
- Sort
- View
- Edit
- Enable
- Disable
- Reset Password

depending on permissions.

---

### Screen Layout

The page contains:

- Breadcrumb
- Page Title
- Search Bar
- Filters
- Refresh Button
- Create User Button
- User Table
- Pagination Controls

---

## 8. Page Header

Title

```text
User Management
```

Subtitle

```text
Manage application users, roles and access permissions.
```

---

## 9. Breadcrumb

Displays:

```text
Home

↓

Administration

↓

Users
```

---

## 10. Toolbar

Toolbar contains:

Search Input

Role Filter

Status Filter

Refresh Button

Create User Button

Items are horizontally aligned on desktop.

They stack vertically on smaller screens.

---

## 11. Create User Button

Label

```text
New User
```

Style

Primary Button

Icon

Add User

Click Action

Navigate to:

```text
/users/new
```

Permission Required

Create User

Users without permission never see this button.

---

## 12. Search

Search operates in real time with a debounce of 300 milliseconds.

Searchable fields:

- First Name
- Last Name
- Email
- Username
- Role

Search is case-insensitive.

Leading and trailing whitespace is ignored.

---

Empty search returns all users.

---

## 13. Filters

Available filters:

Role

Status

Sort Order

---

### Role Filter

Options:

All Roles

System Administrator

Operations Manager

Finance Officer

Sales Coordinator

Read-Only User

---

### Status Filter

Options:

All

Active

Disabled

Locked

Pending Invitation (Future)

---

## 14. Refresh Button

Clicking Refresh performs:

- Reload user list.
- Preserve filters.
- Preserve search query.
- Preserve pagination.

The page does not reload.

---

## 15. User Table

Columns:

Avatar

Full Name

Email

Role

Status

Last Login

Created Date

Actions

---

Default Sort

Created Date

Descending

Newest users appear first.

---

## 16. Status Indicators

Each user displays one status badge.

Available values:

Active

Green Badge

Disabled

Gray Badge

Locked

Red Badge

Pending

Orange Badge

Status updates immediately after successful changes.

---

## 17. Table Actions

Each row includes an Actions menu.

Available actions depend on permissions.

Possible actions:

View

Edit

Enable

Disable

Reset Password

Delete (Future)

Actions unavailable to the current user are hidden.

---

## 18. Row Click Behaviour

Clicking anywhere on a row:

Navigates to:

```text
/users/{id}
```

Exceptions:

Clicks on:

- Checkbox
- Action Menu
- Hyperlinks

perform only their intended action.

---

## 19. Pagination

Default Page Size

25 Users

Supported page sizes:

10

25

50

100

Pagination displays:

Current Page

Total Pages

Total Records

Next

Previous

First

Last

---

## 20. Loading State

While data loads:

- Skeleton rows are displayed.
- Search is disabled.
- Filters are disabled.
- Action buttons are disabled.

The table structure remains visible to prevent layout shift.

---

## 21. Empty State

If no users exist:

Display icon

Title

```text
No Users Found
```

Message

```text
Create your first application user to begin managing system access.
```

Primary Action

```text
Create User
```

Only displayed if the user has Create permission.

---

## 22. No Search Results

If the search returns no matches:

Display:

```text
No users match your search criteria.
```

Button

```text
Clear Filters
```

Selecting Clear Filters:

- Clears search.
- Clears filters.
- Reloads full list.

---

## 23. Error State

If the user list cannot be loaded:

Display:

```text
Unable to load users.

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

- Focus border highlights.
- Clear icon appears when text exists.

Buttons

- Hover elevation.
- Pointer cursor.
- Smooth transition.

Table Rows

- Hover background highlight.
- Pointer cursor.

Status Badge

- Tooltip displays full status description.

Action Menu

- Opens with fade animation.
- Closes on outside click.
- Closes on Escape key.

---

## 25. Acceptance Criteria (Part 1)

This section is complete when:

- User list displays successfully.
- Search functions correctly.
- Filters apply without page reload.
- Pagination functions correctly.
- Role-based visibility is enforced.
- Loading, empty and error states behave correctly.
- Table actions appear according to permissions.

---

## 26. Create User Screen

### Route

```text
/users/new
```

### Purpose

Allows authorized administrators to create a new application user and assign an initial role.

The new user account becomes available immediately after successful creation unless configured otherwise.

---

## 27. Screen Layout

The page contains:

- Breadcrumb
- Page Title
- User Information Card
- Account Settings Card
- Role Assignment Card
- Action Bar

Layout:

Desktop:

Two-column layout

Tablet:

Single-column layout

Mobile:

Single-column stacked layout

---

## 28. Breadcrumb

```text
Home

↓

Administration

↓

Users

↓

New User
```

---

## 29. User Information Card

Fields:

- First Name
- Last Name
- Email Address
- Username
- Phone Number (Optional)

Required fields are marked with a red asterisk.

---

### First Name

Required

Maximum Length:

100 characters

Validation:

- Cannot be empty.
- Leading/trailing spaces removed.
- Numbers not permitted.

---

### Last Name

Required

Maximum Length:

100 characters

Validation:

Same rules as First Name.

---

### Email Address

Required

Maximum Length:

255 characters

Validation:

- Valid email format.
- Must be unique.
- Case-insensitive uniqueness.
- Trim whitespace.

Example:

```text
john.smith@example.com
```

---

### Username

Required

Maximum Length:

50 characters

Validation:

- Unique.
- Letters
- Numbers
- Underscore
- Period

Spaces are not permitted.

Example:

```text
john.smith
```

---

### Phone Number

Optional

Validation:

- Digits only
- Country code supported
- Maximum 20 characters

---

## 30. Account Settings Card

Contains:

Status

Temporary Password

Require Password Change

---

### Status

Default:

Active

Available values:

- Active
- Disabled

---

### Temporary Password

Automatically generated by the system.

Displayed only once before saving.

Administrator may regenerate it.

Button:

```text
Generate New Password
```

Generated passwords must satisfy security policy.

---

### Require Password Change

Checkbox

Default:

Enabled

The user must change their password during first login.

---

## 31. Role Assignment

Users are assigned one primary role.

Dropdown options:

- System Administrator
- Operations Manager
- Finance Officer
- Sales Coordinator
- Read-Only User

Only authorized administrators may assign System Administrator.

---

## 32. Permission Overrides (Optional)

Version 1 supports:

Role-based permissions only.

Future versions may support:

Individual permission overrides.

Section remains hidden until implemented.

---

## 33. Form Validation

Validation occurs:

- On field blur.
- On Save.
- On server.

Errors appear directly below the relevant field.

---

Examples:

```text
First Name is required.
```

```text
Email address already exists.
```

```text
Username is already in use.
```

---

## 34. Save Button

Label

```text
Create User
```

Behavior:

1. Validate fields.
2. Submit request.
3. Disable controls.
4. Display loading spinner.
5. Create user.
6. Generate audit record.
7. Display success notification.
8. Redirect to User Details page.

---

Loading Label

```text
Creating User...
```

---

## 35. Cancel Button

Selecting Cancel opens a confirmation dialog if unsaved changes exist.

If no changes exist:

Return directly to User List.

---

## 36. Unsaved Changes Dialog

Title

```text
Discard Changes?
```

Body

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

---

Backdrop click:

Closes dialog.

Escape key:

Closes dialog.

---

## 37. View User Details

### Route

```text
/users/{id}
```

Purpose:

Displays complete information for a single user.

Read-only.

---

Information displayed:

- Avatar
- Name
- Email
- Username
- Role
- Status
- Phone
- Last Login
- Created Date
- Updated Date

---

Actions available:

- Edit
- Disable
- Enable
- Reset Password

based on permissions.

---

## 38. Edit User Screen

### Route

```text
/users/{id}/edit
```

Purpose:

Modify user information.

---

Editable fields:

- First Name
- Last Name
- Phone Number
- Role
- Status

Not editable:

- Email (Version 1)
- Username

---

## 39. Save Changes

Workflow:

Validate

↓

Submit

↓

Update User

↓

Refresh Cache

↓

Audit Event

↓

Display Success

↓

Return to User Details

---

Success Notification

```text
User updated successfully.
```

---

## 40. Validation Summary

Validation includes:

- Required fields
- Duplicate email
- Duplicate username
- Invalid phone number
- Invalid role
- Permission validation

Server validation always takes precedence.

---

## 41. Loading States

During create/update:

- Inputs disabled.
- Buttons disabled.
- Loading spinner visible.
- Duplicate submissions prevented.

---

## 42. Success Notifications

User Created

```text
User created successfully.
```

---

User Updated

```text
User updated successfully.
```

---

Role Updated

```text
Role updated successfully.
```

---

## 43. Error Messages

Duplicate Email

```text
This email address is already registered.
```

---

Duplicate Username

```text
This username is already in use.
```

---

Validation Failure

```text
Please correct the highlighted fields.
```

---

Server Error

```text
An unexpected error occurred.

Please try again.
```

---

## 44. Accessibility

Create and Edit forms support:

- Keyboard navigation
- Screen reader labels
- Visible focus indicators
- Accessible validation messages
- Semantic HTML form controls

---

## 45. Acceptance Criteria (Part 2)

This section is complete when:

- Administrators can create users.
- Administrators can edit users.
- Validation behaves correctly.
- Duplicate users cannot be created.
- Temporary passwords are generated securely.
- Unsaved changes trigger confirmation.
- Success and error notifications display correctly.
- Loading states prevent duplicate submissions.

---

## 46. Enable User Workflow

### Purpose

Allows an authorized administrator to reactivate a previously disabled user account.

Only users with the **User:Update** permission may perform this action.

---

### Trigger

The administrator selects **Enable User** from the row action menu or the User Details page.

---

### Confirmation Dialog

#### Title

Enable User

#### Message

This user account will regain access to the system immediately.

Do you want to continue?

#### Buttons

Primary

Enable User

Secondary

Cancel

---

### Confirm Action

After confirmation the system shall:

1. Validate administrator permission.
2. Verify the target user exists.
3. Verify the target user is currently disabled.
4. Update account status to Active.
5. Record an audit event.
6. Refresh the user list.
7. Display a success notification.

---

### Success Message

User account enabled successfully.

---

### Cancel Action

No changes are made.

Dialog closes.

Focus returns to the Enable User action.

---

## 47. Disable User Workflow

### Purpose

Temporarily prevents a user from accessing the application without deleting their account.

Historical records remain unchanged.

---

### Trigger

Available from:

- User List
- User Details

---

### Confirmation Dialog

#### Title

Disable User

#### Message

This user will no longer be able to sign in until the account is enabled again.

Do you want to continue?

#### Buttons

Primary

Disable User

Secondary

Cancel

---

### Confirm Action

The system shall:

1. Validate administrator permission.
2. Prevent disabling the currently authenticated user.
3. Prevent disabling the final active System Administrator.
4. Update account status.
5. Immediately invalidate all active sessions for the target user.
6. Record an audit event.
7. Refresh displayed data.
8. Display a success notification.

---

### Validation Rules

The following operations are prohibited:

- Disabling yourself.
- Disabling the final active administrator.
- Disabling an already disabled account.

---

### Success Message

User account disabled successfully.

---

## 48. Delete User

Version 1 Policy

Permanent deletion of user accounts is **not supported**.

Reason:

User records are referenced by:

- Audit Logs
- Dispatches
- Payments
- Pricing Changes
- Reports

Deleting users would compromise historical integrity.

Instead:

User accounts shall be disabled.

Future versions may implement archival functionality.

---

## 49. Reset User Password

### Purpose

Allows an administrator to initiate a secure password reset.

The administrator never views or sets the user's password directly.

---

### Trigger

Actions Menu

↓

Reset Password

---

### Confirmation Dialog

#### Title

Reset Password

#### Message

A password reset email will be sent to the user's registered email address.

Do you want to continue?

---

#### Buttons

Primary

Send Reset Email

Secondary

Cancel

---

### Successful Workflow

The system shall:

1. Validate administrator permission.
2. Generate a secure password reset request.
3. Send reset email using the configured authentication provider.
4. Record an audit event.
5. Display confirmation.

---

### Success Message

Password reset email sent successfully.

---

### Failure Message

Unable to send password reset email.

Please try again later.

---

## 50. Lockout Information

If a user's account is temporarily locked because of excessive failed login attempts:

The User Details page displays:

Account Status:

Locked

Reason:

Too many failed login attempts.

The administrator may unlock the account if authorized.

---

## 51. Business Rules

The User Management module enforces the following rules:

- Every user must have exactly one active role.
- Email addresses must be unique.
- Usernames must be unique.
- Disabled users cannot authenticate.
- Locked users cannot authenticate.
- Passwords are never stored or displayed in plain text.
- User creation requires a valid email address.
- Role assignments must match administrator permissions.
- The last active System Administrator cannot be disabled.
- Historical audit records are immutable.

---

## 52. Security Requirements

The module shall comply with the Security Model.

Requirements include:

- Role-Based Access Control (RBAC).
- Server-side authorization.
- Supabase Row-Level Security (RLS).
- CSRF protection where applicable.
- Secure password handling.
- HTTPS-only communication.
- No client-side trust for authorization decisions.
- Sensitive fields excluded from logs.

---

## 53. Audit Events

The following events shall be recorded:

- User Created
- User Updated
- User Enabled
- User Disabled
- Password Reset Requested
- Role Changed
- Failed User Creation
- Failed User Update
- Permission Denied
- User Viewed

Each audit record shall include:

- Event ID
- Timestamp
- Administrator User ID
- Target User ID
- Action
- Previous Values (where applicable)
- New Values (where applicable)
- Correlation ID

---

## 54. Notifications

Success notifications:

- User created successfully.
- User updated successfully.
- User enabled successfully.
- User disabled successfully.
- Password reset email sent successfully.

Error notifications:

- Permission denied.
- Validation failed.
- User not found.
- Duplicate email.
- Duplicate username.
- Unexpected server error.

Notifications automatically dismiss after the configured timeout.

---

## 55. Responsive Behaviour

### Desktop

- Full toolbar
- Multi-column table
- Inline actions

---

### Tablet

- Responsive table
- Condensed toolbar
- Overflow actions menu

---

### Mobile

- Card-based user list
- Stacked information
- Bottom-sheet actions menu
- Horizontal scrolling avoided where practical

All functionality remains available regardless of screen size.

---

## 56. Performance Requirements

Target response times:

- User list load: < 1 second
- Search results: < 300 ms after debounce
- User creation: < 2 seconds
- User update: < 2 seconds
- Status changes: < 1 second

Pagination and filtering shall be executed server-side.

---

## 57. Accessibility

The User Management module shall comply with WCAG 2.1 AA.

Requirements include:

- Keyboard-only navigation
- Screen reader compatibility
- Accessible form labels
- ARIA attributes for dialogs
- Logical focus order
- Visible focus indicators
- Sufficient color contrast
- Error messages announced to assistive technologies

---

## 58. Acceptance Criteria

The User Management module is considered complete when:

- Authorized administrators can create users.
- Authorized administrators can edit users.
- User details display correctly.
- Search, filtering, sorting, and pagination function correctly.
- Role assignments are validated.
- Duplicate email addresses and usernames are rejected.
- Users can be enabled and disabled according to business rules.
- Self-disable and disabling the last active administrator are prevented.
- Password reset requests are processed successfully.
- All administrative actions generate audit records.
- Responsive layouts function across supported devices.
- Accessibility requirements are satisfied.
- Security requirements are enforced.
- Performance targets are achieved.

---

## 59. References

This module is governed by:

- `/architecture/SECURITY_MODEL.md`
- `/architecture/BUSINESS_RULE_ENGINE.md`
- `/architecture/WORKFLOW_ENGINE.md`
- `/architecture/CQRS.md`
- `/architecture/DOMAIN_MODEL.md`
- `/docs/SYSTEM_REQUIREMENTS_SPECIFICATION.md`

---

## 60. Conclusion

The User Management module provides secure, centralized administration of application users within the EMA Bakery Distribution Management System.

By combining role-based access control, comprehensive validation, immutable audit logging, secure account lifecycle management, and responsive user interfaces, the module ensures that system administrators can manage user access confidently while preserving operational security and data integrity.

The module is designed to integrate seamlessly with the authentication, authorization, and auditing architecture, providing a scalable foundation for future enhancements such as multi-factor authentication, delegated administration, advanced permission models, and external identity providers.
