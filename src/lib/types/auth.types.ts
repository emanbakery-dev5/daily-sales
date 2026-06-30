/**
 * Shared Application Types — Authentication Module
 * ============================================================
 * Centralised TypeScript types used across Server Actions,
 * guards, and permission utilities for the Authentication module.
 *
 * Aligned with:
 *   - docs/functional-specification/AUTHENTICATION.md
 *   - docs/functional-specification/PERMISSIONS_MATRIX.md
 *   - docs/functional-specification/ERROR_HANDLING.md
 * ============================================================
 */

// ---------------------------------------------------------------------------
// Role & Status (mirrors PostgreSQL ENUMs)
// ---------------------------------------------------------------------------

export const UserRole = {
  SYSTEM_ADMINISTRATOR: "system_administrator",
  OPERATIONS_MANAGER: "operations_manager",
  FINANCE_OFFICER: "finance_officer",
  SALES_COORDINATOR: "sales_coordinator",
  READ_ONLY_USER: "read_only_user",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  LOCKED: "locked",
  PENDING_PASSWORD_RESET: "pending_password_reset",
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

// ---------------------------------------------------------------------------
// User Profile (mirrors public.user_profiles table)
// ---------------------------------------------------------------------------

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
  lastLoginAt: Date | null;
  lastLoginIp: string | null;
  passwordChangedAt: Date | null;
  mustChangePassword: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Standardised Action Result
// Matches the error envelope in ERROR_HANDLING.md §5
// ---------------------------------------------------------------------------

export interface ActionError {
  /** Machine-readable code e.g. AUTH-003  */
  code: string;
  /** Human-readable category e.g. Authentication */
  category: ErrorCategory;
  /** Safe user-facing message — never expose stack traces */
  message: string;
  /** UUID shared across all log entries for one request */
  correlationId: string;
  /** UTC ISO timestamp */
  timestamp: string;
  /** HTTP-equivalent status code */
  httpStatus: number;
}

export type ErrorCategory =
  | "Validation"
  | "Authentication"
  | "Authorization"
  | "ResourceNotFound"
  | "BusinessRule"
  | "Conflict"
  | "Database"
  | "ExternalService"
  | "Network"
  | "System";

/**
 * Every Server Action returns ActionResult<T>.
 *
 * Callers should check `result.success` before accessing `result.data`.
 */
export type ActionResult<T = void> =
  | { success: true; data: T; correlationId: string }
  | { success: false; error: ActionError };

// ---------------------------------------------------------------------------
// Auth Event Types (mirrors PostgreSQL ENUM auth_event_type)
// ---------------------------------------------------------------------------

export const AuthEventType = {
  LOGIN_SUCCESS: "login_success",
  LOGIN_FAILED: "login_failed",
  LOGOUT: "logout",
  PASSWORD_RESET_REQUESTED: "password_reset_requested",
  PASSWORD_RESET_COMPLETED: "password_reset_completed",
  SESSION_EXPIRED: "session_expired",
  SESSION_REFRESHED: "session_refreshed",
  UNAUTHORIZED_ACCESS: "unauthorized_access",
  ACCOUNT_LOCKED: "account_locked",
  ACCOUNT_UNLOCKED: "account_unlocked",
  PERMISSION_LOAD_FAILURE: "permission_load_failure",
} as const;
export type AuthEventType = (typeof AuthEventType)[keyof typeof AuthEventType];

// ---------------------------------------------------------------------------
// Login History Insert Payload
// ---------------------------------------------------------------------------

export interface LoginHistoryPayload {
  userId: string | null;
  email: string;
  eventType: AuthEventType;
  success: boolean;
  ipAddress: string | null;
  userAgent: string | null;
  failureReason?: string;
  correlationId: string;
}

// ---------------------------------------------------------------------------
// Audit Log Insert Payload
// ---------------------------------------------------------------------------

export interface AuditLogPayload {
  userId: string | null;
  eventType: string;
  module: string;
  action: string;
  description?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress: string | null;
  userAgent: string | null;
  correlationId: string;
}
