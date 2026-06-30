"use server";

/**
 * signOutAction — Logout Server Action
 * ============================================================
 * Invalidates the current user session with Supabase, clears
 * server-side cookies, and writes an audit record.
 *
 * The confirmation dialog (spec §22) is handled in the UI.
 * This action is only called after the user confirms.
 *
 * Flow:
 *   1. requireAuth() — ensures caller is authenticated
 *   2. Call supabase.auth.signOut() to invalidate session + cookies
 *   3. Write logout audit record
 *   4. Return ActionResult<void>
 *
 * Aligned with:
 *   - docs/functional-specification/AUTHENTICATION.md §21–22
 *   - docs/functional-specification/AUDIT_LOG.md §24
 * ============================================================
 */

import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/permissions/guard";
import {
  writeAuditLog,
  writeLoginHistory,
  extractIpAddress,
  extractUserAgent,
} from "@/lib/audit/audit-logger";
import {
  createActionSuccess,
  createActionError,
  safeServerAction,
} from "@/lib/errors/app-error";
import { AUTH_ERRORS } from "@/lib/errors/error-codes";
import { AuthEventType } from "@/lib/types/auth.types";
import type { ActionResult } from "@/lib/types/auth.types";

export async function signOutAction(): Promise<ActionResult<void>> {
  const correlationId = randomUUID();

  return safeServerAction(correlationId, async () => {
    // ── Step 1: Verify session ─────────────────────────────────
    let profile;
    try {
      const auth = await requireAuth();
      profile = auth.profile;
    } catch {
      // Already logged out — treat as success
      return createActionSuccess<void>(undefined, correlationId);
    }

    const reqHeaders = await headers();
    const ipAddress = extractIpAddress(reqHeaders);
    const userAgent = extractUserAgent(reqHeaders);

    // ── Step 2: Sign out with Supabase ────────────────────────
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("[signOutAction] Supabase signOut failed:", {
        correlationId,
        userId: profile.id,
        error: error.message,
      });
      return createActionError(AUTH_ERRORS.INTERNAL_ERROR, correlationId);
    }

    // ── Step 3: Write audit records ───────────────────────────
    void writeLoginHistory({
      userId: profile.id,
      email: profile.email,
      eventType: AuthEventType.LOGOUT,
      success: true,
      ipAddress,
      userAgent,
      correlationId,
    });
    void writeAuditLog({
      userId: profile.id,
      eventType: AuthEventType.LOGOUT,
      module: "authentication",
      action: "logout",
      description: `User signed out successfully.`,
      ipAddress,
      userAgent,
      correlationId,
    });

    return createActionSuccess<void>(undefined, correlationId);
  });
}
