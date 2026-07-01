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
import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { extractIpAddress, extractUserAgent } from "@/lib/audit/audit-logger";
import { z } from "zod";

const deleteSalespersonSchema = z.object({
  id: z.string().uuid("Invalid Salesperson ID"),
});

export async function deleteSalespersonAction(
  data: z.infer<typeof deleteSalespersonSchema>,
) {
  const correlationId = randomUUID();

  return safeServerAction(correlationId, async () => {
    // 1. Authorize Request
    const { profile: currentUser } =
      await requirePermission("Salesperson.Delete");

    // 2. Validate Input
    const parsed = deleteSalespersonSchema.safeParse(data);
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

    // 3. Update Status to 'inactive' (Archiving)
    const { data: updated, error: dbError } = await adminClient
      .from("salesperson_profiles")
      .update({ status: "inactive" })
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
      eventType: "SalespersonArchived",
      module: "salesperson_management",
      action: "delete",
      description: `Archived salesperson profile for ${existing.first_name} ${existing.last_name}`,
      oldValues: { status: existing.status },
      newValues: { status: "inactive" },
      ipAddress: extractIpAddress(headersList),
      userAgent: extractUserAgent(headersList),
      correlationId,
    });

    return createActionSuccess(updated, correlationId);
  });
}
