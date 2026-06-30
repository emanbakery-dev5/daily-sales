/**
 * Application Error Codes — Authentication Module
 * ============================================================
 * Defines every AUTH-xxx error code with its category, HTTP
 * status, and user-safe message.
 *
 * Aligned with:
 *   - docs/functional-specification/ERROR_HANDLING.md §5, §6
 *   - docs/functional-specification/AUTHENTICATION.md §34
 *
 * Rules:
 *   - message  → safe for client display
 *   - category → matches ErrorCategory union in auth.types.ts
 *   - status   → HTTP-equivalent status code
 * ============================================================
 */

import type { ErrorCategory } from "@/lib/types/auth.types";

export interface ErrorCodeDefinition {
  code: string;
  category: ErrorCategory;
  message: string;
  httpStatus: number;
}

export const AUTH_ERRORS = {
  // ── Validation ─────────────────────────────────────────────
  /** Email field missing or empty */
  INVALID_EMAIL: {
    code: "AUTH-001",
    category: "Validation" as ErrorCategory,
    message: "Please enter a valid email address.",
    httpStatus: 400,
  },
  /** Password field missing or whitespace-only */
  INVALID_PASSWORD: {
    code: "AUTH-002",
    category: "Validation" as ErrorCategory,
    message: "Password is required.",
    httpStatus: 400,
  },
  /** Passwords do not match (reset form) */
  PASSWORDS_DO_NOT_MATCH: {
    code: "AUTH-010",
    category: "Validation" as ErrorCategory,
    message: "Passwords do not match.",
    httpStatus: 400,
  },
  /** New password does not satisfy complexity rules */
  WEAK_PASSWORD: {
    code: "AUTH-011",
    category: "Validation" as ErrorCategory,
    message:
      "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number.",
    httpStatus: 400,
  },
  /** Reset token missing from request */
  MISSING_RESET_TOKEN: {
    code: "AUTH-012",
    category: "Validation" as ErrorCategory,
    message: "Invalid or missing password reset token.",
    httpStatus: 400,
  },

  // ── Authentication ──────────────────────────────────────────
  /** Supabase rejected credentials — generic, no enumeration */
  INVALID_CREDENTIALS: {
    code: "AUTH-003",
    category: "Authentication" as ErrorCategory,
    message: "Invalid email or password.",
    httpStatus: 401,
  },
  /** account status = 'locked' */
  ACCOUNT_LOCKED: {
    code: "AUTH-004",
    category: "Authentication" as ErrorCategory,
    message:
      "Your account has been temporarily locked. Please contact an administrator.",
    httpStatus: 401,
  },
  /** account status = 'inactive' */
  ACCOUNT_INACTIVE: {
    code: "AUTH-005",
    category: "Authentication" as ErrorCategory,
    message: "Your account is inactive. Please contact an administrator.",
    httpStatus: 401,
  },
  /** No valid Supabase session cookie found */
  SESSION_NOT_FOUND: {
    code: "AUTH-006",
    category: "Authentication" as ErrorCategory,
    message: "Your session has expired. Please sign in again.",
    httpStatus: 401,
  },
  /** Supabase refresh token exchange failed */
  SESSION_REFRESH_FAILED: {
    code: "AUTH-007",
    category: "Authentication" as ErrorCategory,
    message: "Your session has expired. Please sign in again.",
    httpStatus: 401,
  },
  /** Password reset token invalid or expired */
  INVALID_RESET_TOKEN: {
    code: "AUTH-008",
    category: "Authentication" as ErrorCategory,
    message:
      "The password reset link is invalid or has expired. Please request a new one.",
    httpStatus: 401,
  },
  /** must_change_password flag is true */
  MUST_CHANGE_PASSWORD: {
    code: "AUTH-009",
    category: "Authentication" as ErrorCategory,
    message: "You must change your password before continuing.",
    httpStatus: 403,
  },

  // ── Authorization ───────────────────────────────────────────
  /** Caller lacks the required permission */
  PERMISSION_DENIED: {
    code: "AUTH-020",
    category: "Authorization" as ErrorCategory,
    message: "You do not have permission to perform this action.",
    httpStatus: 403,
  },

  // ── System ──────────────────────────────────────────────────
  /** User profile row not found after successful Supabase auth */
  PROFILE_NOT_FOUND: {
    code: "AUTH-030",
    category: "System" as ErrorCategory,
    message:
      "Unable to load your user profile. Please contact an administrator.",
    httpStatus: 500,
  },
  /** Permission data could not be loaded */
  PERMISSION_LOAD_FAILURE: {
    code: "AUTH-031",
    category: "System" as ErrorCategory,
    message: "Unable to load permissions. Please sign in again.",
    httpStatus: 500,
  },
  /** Unexpected server-side exception */
  INTERNAL_ERROR: {
    code: "AUTH-099",
    category: "System" as ErrorCategory,
    message: "An unexpected error occurred. Please try again.",
    httpStatus: 500,
  },
} as const satisfies Record<string, ErrorCodeDefinition>;
