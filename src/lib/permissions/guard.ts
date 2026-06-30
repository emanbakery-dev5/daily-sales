/**
 * Permission Guard Functions
 * ============================================================
 * Provides composable guard utilities for Server Actions:
 *
 *   getSession()          → Returns the raw Supabase session or null
 *   getCurrentUser()      → Returns the UserProfile or null
 *   requireAuth()         → Throws AppError(AUTH-006) if no session
 *   requirePermission()   → Throws AppError(AUTH-020) if role lacks permission
 *
 * Pattern — every protected Server Action starts like this:
 *
 *   const { profile } = await requirePermission(Permission.USER_CREATE);
 *   // ... proceed knowing session + permission are valid
 *
 * Aligned with:
 *   - docs/functional-specification/PERMISSIONS_MATRIX.md §17, §27
 *   - docs/functional-specification/AUTHENTICATION.md §25
 * ============================================================
 */

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AppError } from "@/lib/errors/app-error";
import { AUTH_ERRORS } from "@/lib/errors/error-codes";
import { hasPermission, type Permission } from "@/lib/permissions/permissions";
import type { UserProfile, UserRole, UserStatus } from "@/lib/types/auth.types";
import type { Session, User } from "@supabase/supabase-js";
import type { UserProfileRow } from "@/lib/types/database.types";

// ---------------------------------------------------------------------------
// Row → Domain mapper
// ---------------------------------------------------------------------------

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
// getSession
// ---------------------------------------------------------------------------

/**
 * Returns the current Supabase session, or null if unauthenticated.
 * Does NOT throw — use requireAuth() to enforce authentication.
 */
export async function getSession(): Promise<Session | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) return null;
  return data.session;
}

// ---------------------------------------------------------------------------
// getCurrentUser
// ---------------------------------------------------------------------------

/**
 * Returns the UserProfile for the currently authenticated user,
 * or null if unauthenticated or profile not found.
 * Does NOT throw — use requireAuth() to enforce.
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data: profileRow, error: profileError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profileRow) return null;

  return mapRowToProfile(profileRow);
}

// ---------------------------------------------------------------------------
// requireAuth
// ---------------------------------------------------------------------------

/**
 * Asserts the caller has a valid Supabase session.
 * Returns the Supabase User and the application UserProfile.
 *
 * Throws AppError(AUTH-006) if unauthenticated.
 * Throws AppError(AUTH-030) if profile row is missing.
 */
export async function requireAuth(): Promise<{
  supabaseUser: User;
  profile: UserProfile;
}> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AppError(AUTH_ERRORS.SESSION_NOT_FOUND);
  }

  const { data: profileRow, error: profileError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profileRow) {
    throw new AppError(AUTH_ERRORS.PROFILE_NOT_FOUND);
  }

  return { supabaseUser: user, profile: mapRowToProfile(profileRow) };
}

// ---------------------------------------------------------------------------
// requirePermission
// ---------------------------------------------------------------------------

/**
 * Asserts the caller is authenticated AND has the specified permission.
 * Returns { supabaseUser, profile } on success.
 *
 * Throws AppError(AUTH-006)  if not authenticated.
 * Throws AppError(AUTH-004)  if account is locked.
 * Throws AppError(AUTH-005)  if account is inactive.
 * Throws AppError(AUTH-020)  if role lacks the permission.
 */
export async function requirePermission(permission: Permission): Promise<{
  supabaseUser: User;
  profile: UserProfile;
}> {
  const { supabaseUser, profile } = await requireAuth();

  // Enforce account status before permission check
  if (profile.status === "locked") {
    throw new AppError(AUTH_ERRORS.ACCOUNT_LOCKED);
  }
  if (profile.status === "inactive") {
    throw new AppError(AUTH_ERRORS.ACCOUNT_INACTIVE);
  }

  if (!hasPermission(profile.role, permission)) {
    throw new AppError(AUTH_ERRORS.PERMISSION_DENIED);
  }

  return { supabaseUser, profile };
}
