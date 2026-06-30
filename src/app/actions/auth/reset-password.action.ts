"use server";

/**
 * confirmPasswordResetAction — Reset Password Server Action
 * ============================================================
 * Updates the authenticated user's password after they arrive
 * via the Supabase magic-link from the reset email.
 *
 * When the user clicks the reset link in their email, Supabase
 * exchanges the one-time token for a session automatically.
 * This action then calls updateUser() to set the new password.
 *
 * Post-reset behaviour (AUTHENTICATION.md §20):
 *   - Password updated
 *   - Existing sessions revoked (Supabase handles this)
 *   - Audit event recorded
 *   - Returns success → UI redirects to /login
 *
 * Flow:
 *   1. Validate input with resetPasswordSchema (Zod)
 *   2. Verify session (user must arrive via reset link)
 *   3. Call supabase.auth.updateUser({ password })
 *   4. Write password_reset_completed audit log
 *   5. Return ActionResult<void>
 *
 * Aligned with:
 *   - docs/functional-specification/AUTHENTICATION.md §19–20
 *   - docs/functional-specification/AUDIT_LOG.md §24
 * ============================================================
 */

import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  writeAuditLog,
  extractIpAddress,
  extractUserAgent,
} from "@/lib/audit/audit-logger";
import {
  createActionError,
  createActionSuccess,
  safeServerAction,
} from "@/lib/errors/app-error";
import { AUTH_ERRORS } from "@/lib/errors/error-codes";
import {
  resetPasswordSchema,
  parseFormData,
} from "@/lib/validation/auth.schemas";
import { AuthEventType } from "@/lib/types/auth.types";
import type { ActionResult } from "@/lib/types/auth.types";

export async function confirmPasswordResetAction(
  formData: FormData,
): Promise<ActionResult<void>> {
  const correlationId = randomUUID();

  return safeServerAction(correlationId, async () => {
    // ── Step 1: Validate input ─────────────────────────────────
    const parsed = parseFormData(resetPasswordSchema, formData);
    if (!parsed.success) {
      // Return the first relevant field error
      const errors = parsed.fieldErrors;
      if (errors.confirmPassword) {
        return createActionError(
          AUTH_ERRORS.PASSWORDS_DO_NOT_MATCH,
          correlationId,
        );
      }
      return createActionError(AUTH_ERRORS.WEAK_PASSWORD, correlationId);
    }

    const { newPassword } = parsed.data;

    const reqHeaders = await headers();
    const ipAddress = extractIpAddress(reqHeaders);
    const userAgent = extractUserAgent(reqHeaders);

    // ── Step 2: Verify active session (from reset link exchange) ─
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return createActionError(AUTH_ERRORS.INVALID_RESET_TOKEN, correlationId);
    }

    // ── Step 3: Update password ───────────────────────────────
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      console.error("[confirmPasswordResetAction] updateUser failed:", {
        correlationId,
        userId: user.id,
        supabaseError: updateError.message,
      });

      // Supabase returns specific messages for weak/same password
      if (updateError.message.toLowerCase().includes("same password")) {
        return createActionError(AUTH_ERRORS.WEAK_PASSWORD, correlationId);
      }
      return createActionError(AUTH_ERRORS.INTERNAL_ERROR, correlationId);
    }

    // ── Step 4: Write audit record ────────────────────────────
    void writeAuditLog({
      userId: user.id,
      eventType: AuthEventType.PASSWORD_RESET_COMPLETED,
      module: "authentication",
      action: "password_reset_completed",
      description: "User successfully reset their password.",
      ipAddress,
      userAgent,
      correlationId,
    });

    return createActionSuccess<void>(undefined, correlationId);
  });
}
