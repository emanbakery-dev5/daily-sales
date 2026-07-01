"use server";

import { requirePermission } from "@/lib/permissions/guard";
import {
  AppError,
  createActionSuccess,
  safeServerAction,
} from "@/lib/errors/app-error";
import { DATA_ERRORS, AUTH_ERRORS } from "@/lib/errors/error-codes";
import { writeAuditLog } from "@/lib/audit/audit-logger";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  createSalespersonSchema,
  type CreateSalesperson,
} from "@/lib/validation/salesperson.schemas";
import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { extractIpAddress, extractUserAgent } from "@/lib/audit/audit-logger";

export async function createSalespersonAction(data: CreateSalesperson) {
  const correlationId = randomUUID();

  return safeServerAction(correlationId, async () => {
    // 1. Authorize Request
    const { profile: currentUser } =
      await requirePermission("Salesperson.Create");

    // 2. Validate Input
    const parsed = createSalespersonSchema.safeParse(data);
    if (!parsed.success) {
      throw new AppError(
        DATA_ERRORS.VALIDATION_ERROR,
        correlationId,
        parsed.error.message,
      );
    }
    const validated = parsed.data;

    const adminClient = createSupabaseAdminClient();

    // 3. Create Salesperson Profile
    const insertData: any = {
      first_name: validated.firstName,
      last_name: validated.lastName,
      designation: validated.designation,
      mobile_number: validated.mobileNumber,
    };

    if (validated.emailAddress)
      insertData.email_address = validated.emailAddress;
    if (validated.address) insertData.address = validated.address;
    if (validated.dateJoined) insertData.date_joined = validated.dateJoined;
    if (validated.creditLimit !== undefined)
      insertData.credit_limit = validated.creditLimit;
    if (validated.status) insertData.status = validated.status;

    const { data: salesperson, error: dbError } = await adminClient
      .from("salesperson_profiles")
      .insert(insertData)
      .select()
      .single();

    if (dbError) {
      // Check for unique constraint violations (email or mobile if constrained)
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
      eventType: "SalespersonCreated",
      module: "salesperson_management",
      action: "create",
      description: `Created salesperson profile for ${validated.firstName} ${validated.lastName}`,
      newValues: salesperson,
      ipAddress: extractIpAddress(headersList),
      userAgent: extractUserAgent(headersList),
      correlationId,
    });

    return createActionSuccess(salesperson, correlationId);
  });
}
