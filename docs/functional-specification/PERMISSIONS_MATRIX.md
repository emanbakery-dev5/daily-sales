# Permissions Matrix Functional Specification

**Project:** EMA Bakery Distribution Management System (EMA-BDMS)

**Module:** Permissions Matrix

**Version:** 1.0.0

**Status:** Approved

---

## 1. Purpose

The Permissions Matrix defines the Role-Based Access Control (RBAC) model for the EMA Bakery Distribution Management System.

It establishes which users can view, create, update, delete, approve, export, or administer each module and feature within the application.

The objective is to ensure secure, predictable, and maintainable authorization while supporting future expansion without redesigning the security architecture.

---

## 2. Business Objectives

The Permissions Matrix shall:

- Enforce Role-Based Access Control (RBAC).
- Protect sensitive business information.
- Restrict administrative functionality.
- Support least-privilege access.
- Enable permission-based UI rendering.
- Secure API endpoints.
- Support future custom roles.
- Integrate with Audit Logging.
- Integrate with Authentication.

---

## 3. Authorization Architecture

Authorization occurs at multiple layers.

```text
User Login

↓

Authentication

↓

Load Roles

↓

Load Permissions

↓

Authorize Route

↓

Authorize API

↓

Execute Business Rule

↓

Return Response
```

Authorization is always enforced on the server.

Client-side permission checks improve usability but never replace server validation.

---

## 4. Permission Naming Standard

Every permission follows a consistent naming convention.

```text
<Resource>.<Action>
```

Examples

```text
Product.View
Product.Create
Product.Update
Product.Delete
```

```text
Dispatch.View
Dispatch.Assign
Dispatch.Complete
```

```text
Payment.View
Payment.Post
Payment.Reverse
```

---

## 5. Default System Roles

The initial release includes the following roles.

| Role                 | Purpose                       |
| -------------------- | ----------------------------- |
| System Administrator | Full system control           |
| Operations Manager   | Operational oversight         |
| Finance Officer      | Financial management          |
| Salesperson          | Sales and dispatch operations |
| Auditor              | Read-only audit access        |

Future versions may support custom roles.

---

## 6. Role Descriptions

### System Administrator

Full access to every module.

Capabilities include:

- User management
- Configuration
- Security
- Products
- Pricing
- Dispatch
- Payments
- Ledger
- Reporting
- Audit
- Notifications

---

### Operations Manager

Responsible for daily operational activities.

Typical capabilities:

- Dispatch management
- Salesperson management
- Product viewing
- Reporting
- Notifications

Cannot modify security settings.

---

### Finance Officer

Responsible for financial operations.

Typical capabilities:

- Payments
- Ledger
- Pricing
- Financial reports

Cannot manage users.

---

### Salesperson

Operational field user.

Typical capabilities:

- View assigned dispatches
- Record collections
- View customers
- View assigned products

Cannot access administration modules.

---

### Auditor

Read-only access.

Capabilities include:

- Audit logs
- Reports
- Financial history
- Operational history

Cannot modify any business data.

---

## 7. Permission Types

Each module may define the following permission types.

| Permission | Description                |
| ---------- | -------------------------- |
| View       | Read information           |
| Create     | Add records                |
| Update     | Modify records             |
| Delete     | Remove records             |
| Approve    | Approve workflow           |
| Export     | Export data                |
| Print      | Print reports              |
| Configure  | Change settings            |
| Manage     | Full module administration |

Not every module requires every permission type.

---

## 8. Module Inventory

Permissions are defined for:

- Authentication
- Dashboard
- Users
- Salespersons
- Products
- Product Categories
- Pricing
- Dispatch
- Ledger
- Payments
- Reports
- Notifications
- System Configuration
- Audit Log

Future modules inherit the same permission model.

---

## 9. Dashboard Permissions

| Permission          | Description                 |
| ------------------- | --------------------------- |
| Dashboard.View      | View dashboard              |
| Dashboard.Configure | Personal dashboard settings |

Dashboard access is available to all authenticated users.

---

## 10. Authentication Permissions

| Permission                    | Description         |
| ----------------------------- | ------------------- |
| Authentication.Login          | Sign in             |
| Authentication.Logout         | Sign out            |
| Authentication.PasswordChange | Change own password |
| Authentication.ResetPassword  | Reset password      |

Administrative password resets require additional authorization.

---

## 11. User Management Permissions

| Permission         | Description       |
| ------------------ | ----------------- |
| User.View          | View users        |
| User.Create        | Create users      |
| User.Update        | Edit users        |
| User.Delete        | Archive users     |
| User.Activate      | Activate accounts |
| User.Deactivate    | Disable accounts  |
| User.AssignRole    | Assign roles      |
| User.ResetPassword | Reset passwords   |

Only System Administrators may assign roles.

---

## 12. Salesperson Permissions

| Permission                 | Description         |
| -------------------------- | ------------------- |
| Salesperson.View           | View salespersons   |
| Salesperson.Create         | Create salesperson  |
| Salesperson.Update         | Edit salesperson    |
| Salesperson.Delete         | Archive salesperson |
| Salesperson.AssignDispatch | Assign dispatch     |

---

## 13. Product Permissions

| Permission     | Description     |
| -------------- | --------------- |
| Product.View   | View products   |
| Product.Create | Create product  |
| Product.Update | Update product  |
| Product.Delete | Archive product |
| Product.Export | Export products |

---

## 14. Product Category Permissions

| Permission      | Description      |
| --------------- | ---------------- |
| Category.View   | View categories  |
| Category.Create | Create category  |
| Category.Update | Update category  |
| Category.Delete | Archive category |

---

## 15. Pricing Permissions

| Permission      | Description     |
| --------------- | --------------- |
| Pricing.View    | View pricing    |
| Pricing.Create  | Create pricing  |
| Pricing.Update  | Update pricing  |
| Pricing.Approve | Approve pricing |
| Pricing.Export  | Export pricing  |

Price approval is restricted to authorized personnel.

---

## 16. Dispatch Permissions

| Permission        | Description       |
| ----------------- | ----------------- |
| Dispatch.View     | View dispatches   |
| Dispatch.Create   | Create dispatch   |
| Dispatch.Update   | Update dispatch   |
| Dispatch.Assign   | Assign dispatch   |
| Dispatch.Complete | Complete dispatch |
| Dispatch.Cancel   | Cancel dispatch   |

Dispatch completion is irreversible.

---

## 17. Permission Resolution

Permission evaluation follows this order.

```text
Authenticated User

↓

Assigned Role

↓

Assigned Permissions

↓

Server Authorization

↓

Business Rule Validation

↓

Operation Allowed
```

Permission checks occur before business rule evaluation.

---

## 18. Business Rules

The Permissions Matrix enforces:

- Every authenticated user has at least one role.
- Every API request requires authorization.
- Unauthorized requests are denied.
- Permission checks occur before business validation.
- Server authorization is authoritative.
- Administrative actions generate audit events.

---

## 19. Acceptance Criteria (Part 1)

The Permissions Matrix is complete when:

- Roles are defined.
- Permission naming is standardized.
- Core modules define permissions.
- Authorization workflow is documented.
- Server-side authorization is enforced.
- Administrative actions are audited.

---

## 20. Ledger Permissions

| Permission     | Description                  |
| -------------- | ---------------------------- |
| Ledger.View    | View ledger                  |
| Ledger.Create  | Create manual ledger entries |
| Ledger.Update  | Edit pending entries         |
| Ledger.Post    | Post ledger transactions     |
| Ledger.Export  | Export ledger                |
| Ledger.Reverse | Reverse ledger entries       |

Business Rules

- Posted ledger entries cannot be edited.
- Reversal creates a new correcting transaction.
- Only authorized finance personnel may post entries.

---

## 21. Payment Permissions

| Permission      | Description         |
| --------------- | ------------------- |
| Payment.View    | View payments       |
| Payment.Create  | Record payments     |
| Payment.Update  | Edit draft payments |
| Payment.Post    | Post payment        |
| Payment.Reverse | Reverse payment     |
| Payment.Export  | Export payment data |

Business Rules

- Posted payments cannot be edited.
- Payment reversal requires appropriate authorization.
- All payment actions are audited.

---

## 22. Reporting Permissions

| Permission      | Description      |
| --------------- | ---------------- |
| Report.View     | View reports     |
| Report.Generate | Generate reports |
| Report.Export   | Export reports   |
| Report.Print    | Print reports    |

Reports are filtered according to the user's data access permissions.

---

## 23. Notification Permissions

| Permission             | Description                     |
| ---------------------- | ------------------------------- |
| Notification.View      | View notifications              |
| Notification.Send      | Send notifications              |
| Notification.Manage    | Manage notification templates   |
| Notification.Configure | Configure notification settings |

Business Rules

- Only administrators may modify templates.
- Users may manage only their personal notification preferences.

---

## 24. System Configuration Permissions

| Permission            | Description               |
| --------------------- | ------------------------- |
| Configuration.View    | View configuration        |
| Configuration.Update  | Modify configuration      |
| Configuration.Restore | Restore configuration     |
| Configuration.Feature | Manage feature flags      |
| Configuration.Backup  | Configure backup settings |

Configuration changes generate audit records automatically.

---

## 25. Audit Log Permissions

| Permission        | Description                    |
| ----------------- | ------------------------------ |
| Audit.View        | View audit records             |
| Audit.Export      | Export audit logs              |
| Audit.Investigate | View correlation history       |
| Audit.Admin       | Administrative audit functions |

Audit records remain read-only for every role.

---

## 26. Route Protection

Every application route specifies one or more required permissions.

Example

| Route      | Required Permission |
| ---------- | ------------------- |
| /users     | User.View           |
| /users/new | User.Create         |
| /products  | Product.View        |
| /pricing   | Pricing.View        |
| /dispatch  | Dispatch.View       |
| /payments  | Payment.View        |
| /reports   | Report.View         |
| /settings  | Configuration.View  |
| /audit     | Audit.View          |

Users without the required permission receive an authorization error.

---

## 27. API Authorization

Every API endpoint validates authorization before executing business logic.

Workflow

```text
API Request

↓

Authentication

↓

Role Resolution

↓

Permission Check

↓

Business Rule Validation

↓

Execute Operation

↓

Return Response
```

Unauthorized requests return:

```text
HTTP 403 Forbidden
```

---

## 28. UI Authorization

The user interface dynamically adapts according to granted permissions.

Examples

Hidden Elements

- Navigation items
- Action buttons
- Administrative panels

Disabled Actions

- Edit
- Delete
- Export
- Configuration

Hidden functionality improves usability but does not replace server authorization.

---

## 29. Field-Level Security

Certain fields require additional permissions.

Examples

Finance

- Customer Credit Limit
- Outstanding Balance
- Financial Adjustments

Administration

- User Roles
- Security Policies
- Feature Flags

Only authorized users may modify protected fields.

---

## 30. Permission Inheritance

Permissions are inherited through assigned roles.

Example

```text
System Administrator

↓

All Permissions
```

```text
Finance Officer

↓

Payments

↓

Ledger

↓

Financial Reports
```

Inheritance simplifies permission management while maintaining least-privilege principles.

---

## 31. Multiple Roles

A user may be assigned multiple roles.

Effective permissions are calculated as the union of all assigned permissions.

Example

```text
Operations Manager

+

Finance Officer

↓

Combined Permissions
```

Conflicting permissions are resolved by the server according to security policy.

---

## 32. Permission Evaluation

Permission evaluation follows this sequence.

```text
Authenticated User

↓

Assigned Roles

↓

Effective Permissions

↓

Route Authorization

↓

API Authorization

↓

Business Rule Validation

↓

Database Operation
```

Authorization is always evaluated before any data modification.

---

## 33. Data Visibility Rules

Permissions govern not only actions but also visibility.

Examples

Salesperson

- View only assigned dispatches.
- View assigned customers.

Finance Officer

- View all financial transactions.

Auditor

- Read-only access to all authorized records.

System Administrator

- Full visibility.

Visibility rules are enforced at the database and API layers.

---

## 34. Row-Level Security (RLS)

The application uses Supabase Row-Level Security.

Examples

Salesperson

```text
Can view only assigned dispatch records.
```

Finance Officer

```text
Can view all payment records.
```

Administrator

```text
Full access.
```

All database access must respect RLS policies.

---

## 35. Temporary Access

Future enhancement

Administrators may grant temporary permissions.

Examples

- Temporary Reporting Access
- Temporary Financial Approval
- Temporary Audit Access

Temporary permissions include:

- Start Date
- End Date
- Approval Reason
- Approving Administrator

Expired permissions are revoked automatically.

---

## 36. Permission Cache

To improve performance, permissions are cached after authentication.

Cache lifecycle

```text
User Login

↓

Load Roles

↓

Load Permissions

↓

Store in Session

↓

Permission Validation

↓

Logout

↓

Cache Cleared
```

Permission changes invalidate cached permissions immediately.

---

## 37. Acceptance Criteria (Part 2)

The Permissions Matrix is complete when:

- Every module defines permissions.
- Routes enforce authorization.
- APIs validate permissions.
- UI adapts according to permissions.
- Field-level security is enforced.
- Row-Level Security protects database access.
- Multiple roles resolve correctly.
- Permission caching functions correctly.

---

## 38. Custom Roles (Future Enhancement)

The authorization architecture is designed to support custom roles without changes to the core permission model.

Future capabilities include:

- Create custom roles
- Edit existing roles
- Clone roles
- Disable roles
- Archive unused roles
- Assign role descriptions
- Group permissions by module
- Preview effective permissions before saving

Business Rules

- Role names must be unique.
- System roles cannot be deleted.
- At least one System Administrator role must always exist.
- Every custom role must contain at least one permission.

---

## 39. Permission Auditing

All permission-related changes shall generate audit events.

Audited Activities

- Role created
- Role updated
- Role archived
- Permission granted
- Permission revoked
- User assigned to role
- User removed from role
- Temporary access granted
- Temporary access expired

Audit Record Contents

- User performing the change
- Affected user or role
- Previous values
- New values
- Timestamp (UTC)
- Correlation ID
- Reason (optional)

---

## 40. Security Controls

The Permissions Matrix works in conjunction with the Security Model to enforce authorization.

Security requirements

- Server-side authorization is mandatory.
- Client-side checks are informational only.
- Every request validates authentication before authorization.
- Role information must never be trusted from the client.
- Permissions are resolved on the server.
- Unauthorized requests are logged.
- Administrative permission changes require revalidation.

All authorization failures shall be recorded in the Audit Log.

---

## 41. Session and Permission Refresh

Permissions are evaluated when:

- User signs in.
- Session is refreshed.
- Access token is renewed.
- User roles change.
- Administrator updates permissions.

When permissions change during an active session:

```text
Permission Updated

↓

Session Invalidated

↓

Permissions Reloaded

↓

User Continues with Updated Access
```

This prevents stale permissions from remaining active.

---

## 42. Administrative Safeguards

Administrative operations require additional protections.

Examples

- Role assignment
- Role removal
- Security configuration
- Feature flag changes
- User activation or deactivation

Safeguards

- Confirmation dialogs
- Audit logging
- Permission verification
- Server-side validation

Future enhancements may include approval workflows for high-risk administrative actions.

---

## 43. Performance Requirements

Target performance

| Operation               | Target   |
| ----------------------- | -------- |
| Permission Resolution   | < 100 ms |
| Route Authorization     | < 50 ms  |
| API Authorization       | < 100 ms |
| Role Loading            | < 200 ms |
| Permission Cache Lookup | < 20 ms  |
| Permission Refresh      | < 500 ms |

Performance requirements

- Authorization must not noticeably delay user interactions.
- Permission lookups should use indexed data.
- Cached permissions must remain synchronized with server changes.

---

## 44. Accessibility

The Permissions Matrix module supports WCAG 2.1 AA through permission-aware user interfaces.

Requirements

- Hidden controls are removed from keyboard navigation.
- Disabled controls include explanatory tooltips where appropriate.
- Screen readers announce access restrictions.
- Permission errors are presented using accessible alert components.
- Focus is managed after authorization failures.

Users should understand why an action is unavailable without exposing sensitive authorization details.

---

## 45. Compliance Requirements

The authorization model supports organizational governance by providing:

- Least-privilege access
- Separation of duties
- Complete auditability
- Centralized permission management
- Consistent authorization across all modules

Where applicable, implementation may support compliance with:

- ISO/IEC 27001
- SOC 2
- GDPR
- Local financial and tax regulations

---

## 46. Future Enhancements

Planned enhancements include:

- Custom role management UI
- Approval workflows for privileged actions
- Attribute-Based Access Control (ABAC)
- Time-based access policies
- Location-aware access restrictions
- Risk-based authentication
- Multi-level approval permissions
- Delegated administration
- Permission simulation tools
- External identity provider integration

The RBAC architecture is designed to evolve without requiring significant changes to existing modules.

---

## 47. Business Rules Summary

The Permissions Matrix enforces:

- Every authenticated user has at least one role.
- Every protected action requires authorization.
- Server-side authorization is authoritative.
- Permission checks occur before business logic.
- Unauthorized actions are denied and audited.
- Sensitive fields require additional permissions.
- Row-Level Security protects database records.
- Permission changes take effect immediately.
- System roles remain protected from deletion.

---

## 48. Acceptance Criteria

The Permissions Matrix is complete when:

- All modules define required permissions.
- Roles resolve effective permissions correctly.
- Route and API authorization are enforced.
- Row-Level Security policies are active.
- Permission-aware UI rendering functions correctly.
- Administrative changes generate audit events.
- Session permission refresh operates correctly.
- Accessibility requirements are satisfied.
- Performance targets are achieved.

---

## 49. References

This module is governed by:

- `/architecture/SECURITY_MODEL.md`
- `/architecture/DOMAIN_MODEL.md`
- `/architecture/BUSINESS_RULE_ENGINE.md`
- `/architecture/EVENT_ARCHITECTURE.md`
- `/docs/SYSTEM_REQUIREMENTS_SPECIFICATION.md`

Related functional specifications:

- `/docs/functional-specification/AUTHENTICATION.md`
- `/docs/functional-specification/USER_MANAGEMENT.md`
- `/docs/functional-specification/AUDIT_LOG.md`
- `/docs/functional-specification/SYSTEM_CONFIGURATION.md`
- `/docs/functional-specification/ERROR_HANDLING.md`

---

## 50. Conclusion

The Permissions Matrix establishes a secure, scalable, and maintainable authorization framework for the EMA Bakery Distribution Management System.

By combining Role-Based Access Control (RBAC), server-side authorization, Row-Level Security, comprehensive audit logging, and permission-aware user interfaces, the system ensures that every user has appropriate access to the features and data required for their responsibilities. The architecture is prepared for future enhancements such as custom roles, Attribute-Based Access Control, delegated administration, and advanced governance while maintaining strong security, operational integrity, and regulatory compliance.
