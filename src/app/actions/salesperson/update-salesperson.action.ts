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
  updateSalespersonSchema,
  type UpdateSalesperson,
} from "@/lib/validation/salesperson.schemas";
import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { extractIpAddress, extractUserAgent } from "@/lib/audit/audit-logger";

export async function updateSalespersonAction(data: UpdateSalesperson) {
  const correlationId = randomUUID();

  return safeServerAction(correlationId, async () => {
    // 1. Authorize Request
    const { profile: currentUser } =
      await requirePermission("Salesperson.Update");

    // 2. Validate Input
    const parsed = updateSalespersonSchema.safeParse(data);
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

    // 3. Update Salesperson Profile
    const updateData: any = {
      first_name: validated.firstName,
      last_name: validated.lastName,
      designation: validated.designation,
      mobile_number: validated.mobileNumber,
    };

    if (validated.emailAddress !== undefined)
      updateData.email_address = validated.emailAddress;
    if (validated.address !== undefined) updateData.address = validated.address;
    if (validated.dateJoined !== undefined)
      updateData.date_joined = validated.dateJoined;
    if (validated.creditLimit !== undefined)
      updateData.credit_limit = validated.creditLimit;
    if (validated.status !== undefined) updateData.status = validated.status;

    const { data: updated, error: dbError } = await adminClient
      .from("salesperson_profiles")
      .update(updateData)
      .eq("id", validated.id)
      .select()
      .single();

    if (dbError) {
      if (dbError.code === "23505") {
        throw new AppError(
          {
            ...DATA_ERRORS.VALIDATION_ERROR,
            message: "A salesperson with this email already exists.",
          },
          correlationId,
        );
      }
      throw new AppError(DATA_ERRORS.DATABASE_ERROR, correlationId, dbError);
    }

    // 4. Audit Logging
    const headersList = await headers();
    await writeAuditLog({
      userId: currentUser.id,
      eventType: "SalespersonUpdated",
      module: "salesperson_management",
      action: "update",
      description: `Updated salesperson profile for ${validated.firstName} ${validated.lastName}`,
      oldValues: existing,
      newValues: updated,
      ipAddress: extractIpAddress(headersList),
      userAgent: extractUserAgent(headersList),
      correlationId,
    });

    return createActionSuccess(updated, correlationId);
  });
}
