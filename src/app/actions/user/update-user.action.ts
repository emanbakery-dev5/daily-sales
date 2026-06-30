"use server";

import { requirePermission } from "@/lib/permissions/guard";
import { AppError, createActionSuccess, safeServerAction } from "@/lib/errors/app-error";
import { AUTH_ERRORS } from "@/lib/errors/error-codes";
import { writeAuditLog } from "@/lib/audit/audit-logger";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { updateUserSchema, type UpdateUser } from "@/lib/validation/user.schemas";
import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { extractIpAddress, extractUserAgent } from "@/lib/audit/audit-logger";

export async function updateUserAction(data: UpdateUser) {
  const correlationId = randomUUID();

  return safeServerAction(correlationId, async () => {
    // 1. Authorize Request
    const { profile: currentUser } = await requirePermission("User.Update");

    // 2. Validate Input
    const parsed = updateUserSchema.safeParse(data);
    if (!parsed.success) {
      throw new AppError(AUTH_ERRORS.INVALID_EMAIL, correlationId, parsed.error.message);
    }
    const validated = parsed.data;

    const adminClient = createSupabaseAdminClient();

    // 3. Update the user profile
    const { error: profileError } = await adminClient
      .from("user_profiles")
      .update({
        first_name: validated.firstName,
        last_name: validated.lastName,
        phone_number: validated.phone,
      })
      .eq("id", validated.id);

    if (profileError) {
      throw new AppError(AUTH_ERRORS.INTERNAL_ERROR, correlationId, profileError);
    }

    // 4. Update the user metadata in auth.users to keep them in sync
    const fullName = `${validated.firstName} ${validated.lastName}`;
    const { error: authError } = await adminClient.auth.admin.updateUserById(validated.id, {
      user_metadata: {
        full_name: fullName,
      }
    });

    if (authError) {
      console.warn("[updateUserAction] Failed to sync metadata to auth.users:", authError.message);
      // Not throwing because the core business update succeeded in user_profiles
    }

    // 5. Audit Logging
    const headersList = await headers();
    await writeAuditLog({
      userId: currentUser.id,
      eventType: "UserUpdated",
      module: "user_management",
      action: "update",
      description: `Updated profile details for user ${validated.id}`,
      newValues: {
        id: validated.id,
        firstName: validated.firstName,
        lastName: validated.lastName,
      },
      ipAddress: extractIpAddress(headersList),
      userAgent: extractUserAgent(headersList),
      correlationId,
    });

    return createActionSuccess({ success: true }, correlationId);
  });
}
