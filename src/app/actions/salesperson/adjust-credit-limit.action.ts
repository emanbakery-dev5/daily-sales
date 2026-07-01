"use server";

import { requirePermission } from "@/lib/permissions/guard";
import {
  AppError,
  createActionSuccess,
  safeServerAction,
} from "@/lib/errors/app-error";
import { DATA_ERRORS, NOT_FOUND_ERROR } from "@/lib/errors/error-codes";
import { writeAuditLog } from "@/lib/audit/audit-logger";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  adjustCreditLimitSchema,
  type AdjustCreditLimit,
} from "@/lib/validation/salesperson.schemas";
import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { extractIpAddress, extractUserAgent } from "@/lib/audit/audit-logger";

export async function adjustCreditLimitAction(data: AdjustCreditLimit) {
  const correlationId = randomUUID();

  return safeServerAction(correlationId, async () => {
    // 1. Authorize Request
    const { profile: currentUser } =
      await requirePermission("Salesperson.Update");

    // 2. Validate Input
    const parsed = adjustCreditLimitSchema.safeParse(data);
    if (!parsed.success) {
      throw new AppError(
        DATA_ERRORS.VALIDATION_ERROR,
        correlationId,
        parsed.error.message,
      );
    }
    const validated = parsed.data;

    const adminClient = createSupabaseAdminClient();

    // Fetch existing
    const { data: existing, error: fetchError } = await adminClient
      .from("salesperson_profiles")
      .select("*")
      .eq("id", validated.id)
      .single();

    if (fetchError || !existing) {
      throw new AppError(NOT_FOUND_ERROR, correlationId, fetchError);
    }

    // 3. Update Credit Limit
    const { data: updated, error: dbError } = await adminClient
      .from("salesperson_profiles")
      .update({ credit_limit: validated.newCreditLimit })
      .eq("id", validated.id)
      .select()
      .single();

    if (dbError) {
      throw new AppError(DATA_ERRORS.DATABASE_ERROR, correlationId, dbError);
    }

    // 4. Audit Logging
    const headersList = await headers();
    await writeAuditLog({
      userId: currentUser.id,
      eventType: "CreditLimitChanged",
      module: "salesperson_management",
      action: "update",
      description: `Adjusted credit limit for ${existing.first_name} ${existing.last_name}: ${validated.reason}`,
      oldValues: { credit_limit: existing.credit_limit },
      newValues: {
        credit_limit: updated.credit_limit,
        reason: validated.reason,
      },
      ipAddress: extractIpAddress(headersList),
      userAgent: extractUserAgent(headersList),
      correlationId,
    });

    return createActionSuccess(updated, correlationId);
  });
}
