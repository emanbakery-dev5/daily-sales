"use server";

/**
 * requestPasswordResetAction — Forgot Password Server Action
 * ============================================================
 * Triggers a Supabase password reset email for the given address.
 *
 * Security requirements:
 *   - ALWAYS returns the same success message regardless of whether
 *     the email is registered (AUTHENTICATION.md §18, prevents user
 *     enumeration attacks).
 *   - Never confirms or denies whether the email exists.
 *
 * Flow:
 *   1. Validate email with forgotPasswordSchema (Zod)
 *   2. Call supabase.auth.resetPasswordForEmail()
 *   3. Write password_reset_requested audit log (email only)
 *   4. Return success regardless of outcome
 *
 * Aligned with:
 *   - docs/functional-specification/AUTHENTICATION.md §16–18
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
  forgotPasswordSchema,
  parseFormData,
} from "@/lib/validation/auth.schemas";
import { AuthEventType } from "@/lib/types/auth.types";
import type { ActionResult } from "@/lib/types/auth.types";

export async function requestPasswordResetAction(
  formData: FormData,
): Promise<ActionResult<void>> {
  const correlationId = randomUUID();

  return safeServerAction(correlationId, async () => {
    // ── Step 1: Validate input ─────────────────────────────────
    const parsed = parseFormData(forgotPasswordSchema, formData);
    if (!parsed.success) {
      return createActionError(AUTH_ERRORS.INVALID_EMAIL, correlationId);
    }

    const { email } = parsed.data;

    const reqHeaders = await headers();
    const ipAddress = extractIpAddress(reqHeaders);
    const userAgent = extractUserAgent(reqHeaders);

    // ── Step 2: Request reset via Supabase ────────────────────
    // Supabase internally checks if the email is registered.
    // We intentionally ignore any error to prevent enumeration.
    const supabase = await createSupabaseServerClient();
    const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/reset-password`;

    await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    // ── Step 3: Write audit record ────────────────────────────
    // userId is null — we never confirm whether the account exists
    void writeAuditLog({
      userId: null,
      eventType: AuthEventType.PASSWORD_RESET_REQUESTED,
      module: "authentication",
      action: "password_reset_requested",
      description: `Password reset requested for email: ${email}`,
      ipAddress,
      userAgent,
      correlationId,
    });

    // ── Step 4: Always return success ─────────────────────────
    // AUTHENTICATION.md §18: "This message is always displayed
    // regardless of whether the email exists."
    return createActionSuccess<void>(undefined, correlationId);
  });
}
