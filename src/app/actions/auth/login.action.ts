"use server";

/**
 * signInAction — Login Server Action
 * ============================================================
 * Handles user authentication. Called from the /login form.
 *
 * Flow:
 *   1. Validate input with loginSchema (Zod)
 *   2. Call supabase.auth.signInWithPassword()
 *   3. On Supabase failure → write login_failed audit → return generic error
 *   4. Fetch user_profiles row → check status (active / locked / inactive)
 *   5. On success → write login_success audit → return UserProfile
 *
 * Security:
 *   - Never reveals whether email or password is incorrect (AUTH-003)
 *   - Never logs or returns passwords
 *   - Account status checked AFTER Supabase auth to prevent enumeration
 *
 * Aligned with:
 *   - docs/functional-specification/AUTHENTICATION.md §11, §12, §14
 *   - docs/functional-specification/ERROR_HANDLING.md §11
 *   - docs/functional-specification/AUDIT_LOG.md §24
 * ============================================================
 */

import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  writeAuditLog,
  writeLoginHistory,
  extractIpAddress,
  extractUserAgent,
} from "@/lib/audit/audit-logger";
import {
  createActionError,
  createActionSuccess,
  safeServerAction,
} from "@/lib/errors/app-error";
import { AUTH_ERRORS } from "@/lib/errors/error-codes";
import { loginSchema, parseFormData } from "@/lib/validation/auth.schemas";
import { AuthEventType } from "@/lib/types/auth.types";
import type {
  ActionResult,
  UserProfile,
  UserRole,
  UserStatus,
} from "@/lib/types/auth.types";
import type { UserProfileRow } from "@/lib/types/database.types";

function mapRowToProfile(row: UserProfileRow): UserProfile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role as UserRole,
    status: row.status as UserStatus,
    failedLoginAttempts: row.failed_login_attempts,
    lockedUntil: row.locked_until ? new Date(row.locked_until) : null,
    lastLoginAt: row.last_login_at ? new Date(row.last_login_at) : null,
    lastLoginIp: row.last_login_ip as string | null,
    passwordChangedAt: row.password_changed_at
      ? new Date(row.password_changed_at)
      : null,
    mustChangePassword: row.must_change_password,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export async function signInAction(
  formData: FormData,
): Promise<ActionResult<UserProfile>> {
  const correlationId = randomUUID();

  return safeServerAction(correlationId, async () => {
    // ── Step 1: Validate input ─────────────────────────────────
    const parsed = parseFormData(loginSchema, formData);
    if (!parsed.success) {
      // Return the first field error encountered
      const firstError = Object.values(parsed.fieldErrors)[0]?.[0];
      const errorDef = firstError?.includes("email")
        ? AUTH_ERRORS.INVALID_EMAIL
        : AUTH_ERRORS.INVALID_PASSWORD;
      return createActionError(errorDef, correlationId);
    }

    const { email, password } = parsed.data;

    // ── Step 2: Extract request metadata ──────────────────────
    const reqHeaders = await headers();
    const ipAddress = extractIpAddress(reqHeaders);
    const userAgent = extractUserAgent(reqHeaders);

    const supabase = await createSupabaseServerClient();

    // ── Step 3: Authenticate with Supabase ────────────────────
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user) {
      // Fire-and-forget audit — must not block response
      void writeLoginHistory({
        userId: null,
        email,
        eventType: AuthEventType.LOGIN_FAILED,
        success: false,
        ipAddress,
        userAgent,
        failureReason: "Invalid credentials",
        correlationId,
      });
      void writeAuditLog({
        userId: null,
        eventType: AuthEventType.LOGIN_FAILED,
        module: "authentication",
        action: "login_failed",
        description: `Failed login attempt for email: ${email}`,
        ipAddress,
        userAgent,
        correlationId,
      });
      // Always return generic message — never reveal which field failed
      return createActionError(AUTH_ERRORS.INVALID_CREDENTIALS, correlationId);
    }

    const supabaseUser = authData.user;

    // ── Step 4: Fetch user profile and check status ───────────
    const { data: profileRow, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", supabaseUser.id)
      .single();

    if (profileError || !profileRow) {
      void writeAuditLog({
        userId: supabaseUser.id,
        eventType: AuthEventType.PERMISSION_LOAD_FAILURE,
        module: "authentication",
        action: "profile_not_found",
        description: "User authenticated but profile row was not found.",
        ipAddress,
        userAgent,
        correlationId,
      });
      return createActionError(AUTH_ERRORS.PROFILE_NOT_FOUND, correlationId);
    }

    if (profileRow.status === "locked") {
      void writeLoginHistory({
        userId: supabaseUser.id,
        email,
        eventType: AuthEventType.ACCOUNT_LOCKED,
        success: false,
        ipAddress,
        userAgent,
        failureReason: "Account locked",
        correlationId,
      });
      return createActionError(AUTH_ERRORS.ACCOUNT_LOCKED, correlationId);
    }

    if (profileRow.status === "inactive") {
      void writeLoginHistory({
        userId: supabaseUser.id,
        email,
        eventType: AuthEventType.LOGIN_FAILED,
        success: false,
        ipAddress,
        userAgent,
        failureReason: "Account inactive",
        correlationId,
      });
      return createActionError(AUTH_ERRORS.ACCOUNT_INACTIVE, correlationId);
    }

    // ── Step 5: Success — write audit records ──────────────────
    void writeLoginHistory({
      userId: supabaseUser.id,
      email,
      eventType: AuthEventType.LOGIN_SUCCESS,
      success: true,
      ipAddress,
      userAgent,
      correlationId,
    });
    void writeAuditLog({
      userId: supabaseUser.id,
      eventType: AuthEventType.LOGIN_SUCCESS,
      module: "authentication",
      action: "login_success",
      description: `User successfully authenticated.`,
      ipAddress,
      userAgent,
      correlationId,
    });

    return createActionSuccess<UserProfile>(
      mapRowToProfile(profileRow),
      correlationId,
    );
  });
}
