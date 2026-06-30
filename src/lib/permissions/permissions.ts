/**
 * Permission Constants and Role–Permission Mapping
 * ============================================================
 * Defines every permission string constant used across the
 * application, following the <Resource>.<Action> naming
 * convention from PERMISSIONS_MATRIX.md §4.
 *
 * Also defines the static mapping from each role to its
 * granted permissions as specified in PERMISSIONS_MATRIX.md.
 *
 * Aligned with:
 *   - docs/functional-specification/PERMISSIONS_MATRIX.md
 * ============================================================
 */

import type { UserRole } from "@/lib/types/auth.types";

// ---------------------------------------------------------------------------
// Permission String Constants
// ---------------------------------------------------------------------------

export const Permission = {
  // Authentication
  AUTHENTICATION_LOGIN: "Authentication.Login",
  AUTHENTICATION_LOGOUT: "Authentication.Logout",
  AUTHENTICATION_PASSWORD_CHANGE: "Authentication.PasswordChange",
  AUTHENTICATION_RESET_PASSWORD: "Authentication.ResetPassword",

  // Dashboard
  DASHBOARD_VIEW: "Dashboard.View",
  DASHBOARD_CONFIGURE: "Dashboard.Configure",

  // User Management
  USER_VIEW: "User.View",
  USER_CREATE: "User.Create",
  USER_UPDATE: "User.Update",
  USER_DELETE: "User.Delete",
  USER_ACTIVATE: "User.Activate",
  USER_DEACTIVATE: "User.Deactivate",
  USER_ASSIGN_ROLE: "User.AssignRole",
  USER_RESET_PASSWORD: "User.ResetPassword",

  // Salesperson
  SALESPERSON_VIEW: "Salesperson.View",
  SALESPERSON_CREATE: "Salesperson.Create",
  SALESPERSON_UPDATE: "Salesperson.Update",
  SALESPERSON_DELETE: "Salesperson.Delete",
  SALESPERSON_ASSIGN_DISPATCH: "Salesperson.AssignDispatch",

  // Product
  PRODUCT_VIEW: "Product.View",
  PRODUCT_CREATE: "Product.Create",
  PRODUCT_UPDATE: "Product.Update",
  PRODUCT_DELETE: "Product.Delete",
  PRODUCT_EXPORT: "Product.Export",

  // Product Category
  CATEGORY_VIEW: "Category.View",
  CATEGORY_CREATE: "Category.Create",
  CATEGORY_UPDATE: "Category.Update",
  CATEGORY_DELETE: "Category.Delete",

  // Pricing
  PRICING_VIEW: "Pricing.View",
  PRICING_CREATE: "Pricing.Create",
  PRICING_UPDATE: "Pricing.Update",
  PRICING_APPROVE: "Pricing.Approve",
  PRICING_EXPORT: "Pricing.Export",

  // Dispatch
  DISPATCH_VIEW: "Dispatch.View",
  DISPATCH_CREATE: "Dispatch.Create",
  DISPATCH_UPDATE: "Dispatch.Update",
  DISPATCH_ASSIGN: "Dispatch.Assign",
  DISPATCH_COMPLETE: "Dispatch.Complete",
  DISPATCH_CANCEL: "Dispatch.Cancel",

  // Ledger
  LEDGER_VIEW: "Ledger.View",
  LEDGER_CREATE: "Ledger.Create",
  LEDGER_UPDATE: "Ledger.Update",
  LEDGER_POST: "Ledger.Post",
  LEDGER_EXPORT: "Ledger.Export",
  LEDGER_REVERSE: "Ledger.Reverse",

  // Payment
  PAYMENT_VIEW: "Payment.View",
  PAYMENT_CREATE: "Payment.Create",
  PAYMENT_UPDATE: "Payment.Update",
  PAYMENT_POST: "Payment.Post",
  PAYMENT_REVERSE: "Payment.Reverse",
  PAYMENT_EXPORT: "Payment.Export",

  // Reports
  REPORT_VIEW: "Report.View",
  REPORT_GENERATE: "Report.Generate",
  REPORT_EXPORT: "Report.Export",
  REPORT_PRINT: "Report.Print",

  // Notifications
  NOTIFICATION_VIEW: "Notification.View",
  NOTIFICATION_SEND: "Notification.Send",
  NOTIFICATION_MANAGE: "Notification.Manage",
  NOTIFICATION_CONFIGURE: "Notification.Configure",

  // System Configuration
  CONFIGURATION_VIEW: "Configuration.View",
  CONFIGURATION_UPDATE: "Configuration.Update",
  CONFIGURATION_RESTORE: "Configuration.Restore",
  CONFIGURATION_FEATURE: "Configuration.Feature",
  CONFIGURATION_BACKUP: "Configuration.Backup",

  // Audit Log
  AUDIT_VIEW: "Audit.View",
  AUDIT_EXPORT: "Audit.Export",
  AUDIT_INVESTIGATE: "Audit.Investigate",
  AUDIT_ADMIN: "Audit.Admin",
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

// ---------------------------------------------------------------------------
// Role → Permissions mapping
// ---------------------------------------------------------------------------
// PERMISSIONS_MATRIX.md specifies which roles hold which permissions.
// System Administrator receives ALL permissions.
// All authenticated users receive login/logout and dashboard.view.

const BASE_AUTH_PERMISSIONS: Permission[] = [
  Permission.AUTHENTICATION_LOGIN,
  Permission.AUTHENTICATION_LOGOUT,
  Permission.AUTHENTICATION_PASSWORD_CHANGE,
  Permission.AUTHENTICATION_RESET_PASSWORD,
  Permission.DASHBOARD_VIEW,
  Permission.NOTIFICATION_VIEW,
];

const ALL_PERMISSIONS: Permission[] = Object.values(Permission);

export const ROLE_PERMISSIONS: Record<UserRole, Set<Permission>> = {
  system_administrator: new Set<Permission>(ALL_PERMISSIONS),

  operations_manager: new Set<Permission>([
    ...BASE_AUTH_PERMISSIONS,
    Permission.DASHBOARD_CONFIGURE,
    Permission.USER_VIEW,
    Permission.SALESPERSON_VIEW,
    Permission.SALESPERSON_CREATE,
    Permission.SALESPERSON_UPDATE,
    Permission.SALESPERSON_DELETE,
    Permission.SALESPERSON_ASSIGN_DISPATCH,
    Permission.PRODUCT_VIEW,
    Permission.CATEGORY_VIEW,
    Permission.PRICING_VIEW,
    Permission.DISPATCH_VIEW,
    Permission.DISPATCH_CREATE,
    Permission.DISPATCH_UPDATE,
    Permission.DISPATCH_ASSIGN,
    Permission.DISPATCH_COMPLETE,
    Permission.DISPATCH_CANCEL,
    Permission.REPORT_VIEW,
    Permission.REPORT_GENERATE,
    Permission.REPORT_EXPORT,
    Permission.REPORT_PRINT,
    Permission.NOTIFICATION_SEND,
    Permission.AUDIT_VIEW,
  ]),

  finance_officer: new Set<Permission>([
    ...BASE_AUTH_PERMISSIONS,
    Permission.DASHBOARD_CONFIGURE,
    Permission.PRODUCT_VIEW,
    Permission.CATEGORY_VIEW,
    Permission.PRICING_VIEW,
    Permission.PRICING_CREATE,
    Permission.PRICING_UPDATE,
    Permission.PRICING_APPROVE,
    Permission.PRICING_EXPORT,
    Permission.LEDGER_VIEW,
    Permission.LEDGER_CREATE,
    Permission.LEDGER_UPDATE,
    Permission.LEDGER_POST,
    Permission.LEDGER_EXPORT,
    Permission.LEDGER_REVERSE,
    Permission.PAYMENT_VIEW,
    Permission.PAYMENT_CREATE,
    Permission.PAYMENT_UPDATE,
    Permission.PAYMENT_POST,
    Permission.PAYMENT_REVERSE,
    Permission.PAYMENT_EXPORT,
    Permission.REPORT_VIEW,
    Permission.REPORT_GENERATE,
    Permission.REPORT_EXPORT,
    Permission.REPORT_PRINT,
    Permission.AUDIT_VIEW,
  ]),

  sales_coordinator: new Set<Permission>([
    ...BASE_AUTH_PERMISSIONS,
    Permission.PRODUCT_VIEW,
    Permission.CATEGORY_VIEW,
    Permission.PRICING_VIEW,
    Permission.DISPATCH_VIEW,
    Permission.SALESPERSON_VIEW,
    Permission.REPORT_VIEW,
  ]),

  read_only_user: new Set<Permission>([...BASE_AUTH_PERMISSIONS]),
};

// ---------------------------------------------------------------------------
// hasPermission — pure function, no DB call required
// ---------------------------------------------------------------------------

/**
 * Returns true if the given role includes the requested permission.
 * This is the single source of truth for all permission checks.
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.has(permission) ?? false;
}
