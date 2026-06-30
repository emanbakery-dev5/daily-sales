"use server";

/**
 * Session & Profile Server Actions
 * ============================================================
 * Provides two lightweight actions consumed by layouts,
 * middleware, and protected route guards:
 *
 *   getSessionAction()      → Returns the current session or null
 *   getUserProfileAction()  → Returns UserProfile or null
 *
 * These actions are used by:
 *   - Root layout to initialise the auth context
 *   - Server Components rendering navigation
 *   - Middleware (indirectly via helper functions)
 *
 * Neither action throws — callers check `result.success`.
 *
 * Aligned with:
 *   - docs/functional-specification/AUTHENTICATION.md §25
 *   - docs/functional-specification/PERMISSIONS_MATRIX.md §17
 * ============================================================
 */

import { randomUUID } from "crypto";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createActionSuccess, createActionError } from "@/lib/errors/app-error";
import { AUTH_ERRORS } from "@/lib/errors/error-codes";
import type {
  ActionResult,
  UserProfile,
  UserRole,
  UserStatus,
} from "@/lib/types/auth.types";
import type { UserProfileRow } from "@/lib/types/database.types";
import type { Session } from "@supabase/supabase-js";

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

// ---------------------------------------------------------------------------
// getSessionAction
// ---------------------------------------------------------------------------

/**
 * Returns the current Supabase Session or an AUTH-006 error.
 * Safe to call from any Server Component or layout.
 */
export async function getSessionAction(): Promise<ActionResult<Session>> {
  const correlationId = randomUUID();
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      return createActionError(AUTH_ERRORS.SESSION_NOT_FOUND, correlationId);
    }

    return createActionSuccess<Session>(data.session, correlationId);
  } catch {
    return createActionError(AUTH_ERRORS.INTERNAL_ERROR, correlationId);
  }
}

// ---------------------------------------------------------------------------
// getUserProfileAction
// ---------------------------------------------------------------------------

/**
 * Returns the UserProfile for the currently authenticated user.
 *
 * On success: `result.data` contains the full UserProfile.
 * On failure: `result.error` contains an ActionError.
 *
 * Also validates account status — returns AUTH-004 if locked,
 * AUTH-005 if inactive.
 */
export async function getUserProfileAction(): Promise<
  ActionResult<UserProfile>
> {
  const correlationId = randomUUID();
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return createActionError(AUTH_ERRORS.SESSION_NOT_FOUND, correlationId);
    }

    const { data: profileRow, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profileRow) {
      return createActionError(AUTH_ERRORS.PROFILE_NOT_FOUND, correlationId);
    }

    if (profileRow.status === "locked") {
      return createActionError(AUTH_ERRORS.ACCOUNT_LOCKED, correlationId);
    }
    if (profileRow.status === "inactive") {
      return createActionError(AUTH_ERRORS.ACCOUNT_INACTIVE, correlationId);
    }

    return createActionSuccess<UserProfile>(
      mapRowToProfile(profileRow),
      correlationId,
    );
  } catch {
    return createActionError(AUTH_ERRORS.INTERNAL_ERROR, correlationId);
  }
}
