/**
 * Audit Logger Service
 * ============================================================
 * Provides two fire-and-forget write functions:
 *   - writeAuditLog()     → public.audit_logs
 *   - writeLoginHistory() → public.login_history
 *
 * Both use the SERVICE_ROLE admin client so they can bypass RLS
 * and always succeed regardless of the session user's role.
 *
 * Per AUDIT_LOG.md §6, audit creation MUST be asynchronous and
 * MUST NOT block or affect the originating business transaction.
 * Both functions return void and swallow errors internally,
 * logging to the server console so they never throw to callers.
 *
 * Aligned with:
 *   - docs/functional-specification/AUDIT_LOG.md §6, §12, §24
 *   - docs/functional-specification/ERROR_HANDLING.md §29
 * ============================================================
 */

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type {
  AuditLogPayload,
  LoginHistoryPayload,
} from "@/lib/types/auth.types";

// ---------------------------------------------------------------------------
// writeAuditLog
// ---------------------------------------------------------------------------

/**
 * Writes a structured record to public.audit_logs.
 *
 * Fire-and-forget — call without await or wrap in void.
 * Errors are swallowed and logged server-side only.
 */
export async function writeAuditLog(payload: AuditLogPayload): Promise<void> {
  try {
    const admin = createSupabaseAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (admin.from("audit_logs") as any).insert({
      user_id: payload.userId,
      event_type: payload.eventType,
      module: payload.module,
      action: payload.action,
      description: payload.description ?? null,
      old_values: payload.oldValues ?? null,
      new_values: payload.newValues ?? null,
      ip_address: payload.ipAddress,
      user_agent: payload.userAgent,
      correlation_id: payload.correlationId,
    });

    if (error) {
      console.error("[AuditLogger] writeAuditLog failed:", {
        correlationId: payload.correlationId,
        module: payload.module,
        action: payload.action,
        supabaseError: error.message,
      });
    }
  } catch (err) {
    console.error("[AuditLogger] writeAuditLog unexpected error:", err);
  }
}

// ---------------------------------------------------------------------------
// writeLoginHistory
// ---------------------------------------------------------------------------

/**
 * Writes a structured record to public.login_history.
 *
 * The DB trigger `trg_login_history_sync_profile` automatically
 * updates failed_login_attempts and last_login_at on user_profiles
 * after each insert — no additional UPDATE is needed here.
 *
 * Fire-and-forget — call without await or wrap in void.
 */
export async function writeLoginHistory(
  payload: LoginHistoryPayload,
): Promise<void> {
  try {
    const admin = createSupabaseAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (admin.from("login_history") as any).insert({
      user_id: payload.userId,
      email: payload.email,
      event_type: payload.eventType,
      success: payload.success,
      ip_address: payload.ipAddress,
      user_agent: payload.userAgent,
      failure_reason: payload.failureReason ?? null,
      correlation_id: payload.correlationId,
      device_info: null,
    });

    if (error) {
      console.error("[AuditLogger] writeLoginHistory failed:", {
        correlationId: payload.correlationId,
        email: payload.email,
        eventType: payload.eventType,
        supabaseError: error.message,
      });
    }
  } catch (err) {
    console.error("[AuditLogger] writeLoginHistory unexpected error:", err);
  }
}

// ---------------------------------------------------------------------------
// Helper: extract request context (IP + User-Agent) from headers
// ---------------------------------------------------------------------------

/**
 * Extracts the client IP address from standard forwarding headers.
 * Returns null when running without a real request context (e.g. tests).
 */
export function extractIpAddress(headers: Headers): string | null {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    null
  );
}

/**
 * Extracts the User-Agent string from request headers.
 */
export function extractUserAgent(headers: Headers): string | null {
  return headers.get("user-agent");
}
