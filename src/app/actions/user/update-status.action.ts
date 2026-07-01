"use server";

import { requirePermission } from "@/lib/permissions/guard";
import {
  AppError,
  createActionSuccess,
  safeServerAction,
} from "@/lib/errors/app-error";
import { AUTH_ERRORS } from "@/lib/errors/error-codes";
import { writeAuditLog } from "@/lib/audit/audit-logger";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  updateUserStatusSchema,
  type UpdateUserStatus,
} from "@/lib/validation/user.schemas";
import { UserStatus } from "@/lib/types/auth.types";
import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { extractIpAddress, extractUserAgent } from "@/lib/audit/audit-logger";

export async function updateUserStatusAction(data: UpdateUserStatus) {
  const correlationId = randomUUID();

  return safeServerAction(correlationId, async () => {
    // 1. Authorize Request
    // Depending on the status, it could be Activate or Deactivate permission
    // But since it's a generic status update, we check either based on the value
    const permissionRequired =
      data.status === UserStatus.ACTIVE ? "User.Activate" : "User.Deactivate";
    const { profile: currentUser } =
      await requirePermission(permissionRequired);

    // 2. Validate Input
    const parsed = updateUserStatusSchema.safeParse(data);
    if (!parsed.success) {
      throw new AppError(
        AUTH_ERRORS.INVALID_EMAIL,
        correlationId,
        parsed.error.message,
      );
    }
    const validated = parsed.data;

    const adminClient = createSupabaseAdminClient();

    // 3. Update the user profile status
    const { error: profileError } = await adminClient
      .from("user_profiles")
      .update({
        status: validated.status,
      })
      .eq("id", validated.id);

    if (profileError) {
      throw new AppError(
        AUTH_ERRORS.INTERNAL_ERROR,
        correlationId,
        profileError,
      );
    }

    // 5. Audit Logging
    const headersList = await headers();
    await writeAuditLog({
      userId: currentUser.id,
      eventType: "UserStatusChanged",
      module: "user_management",
      action: "update_status",
      description: `Updated status to ${validated.status} for user ${validated.id}`,
      newValues: {
        id: validated.id,
        status: validated.status,
      },
      ipAddress: extractIpAddress(headersList),
      userAgent: extractUserAgent(headersList),
      correlationId,
    });

    return createActionSuccess({ success: true }, correlationId);
  });
}
