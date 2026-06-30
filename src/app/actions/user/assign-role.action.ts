"use server";

import { requirePermission } from "@/lib/permissions/guard";
import { AppError, createActionSuccess, safeServerAction } from "@/lib/errors/app-error";
import { AUTH_ERRORS } from "@/lib/errors/error-codes";
import { writeAuditLog } from "@/lib/audit/audit-logger";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { assignUserRoleSchema, type AssignUserRole } from "@/lib/validation/user.schemas";
import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { extractIpAddress, extractUserAgent } from "@/lib/audit/audit-logger";
import { UserRole } from "@/lib/types/auth.types";

export async function assignRoleAction(data: AssignUserRole) {
  const correlationId = randomUUID();

  return safeServerAction(correlationId, async () => {
    // 1. Authorize Request
    const { profile: currentUser } = await requirePermission("User.AssignRole");

    // 2. Validate Input
    const parsed = assignUserRoleSchema.safeParse(data);
    if (!parsed.success) {
      throw new AppError(AUTH_ERRORS.INVALID_EMAIL, correlationId, parsed.error.message);
    }
    const validated = parsed.data;

    // Optional: Business Rule - Only system_administrator can assign the system_administrator role
    if (validated.role === UserRole.SYSTEM_ADMINISTRATOR && currentUser.role !== UserRole.SYSTEM_ADMINISTRATOR) {
      throw new AppError(AUTH_ERRORS.PERMISSION_DENIED, correlationId);
    }

    const adminClient = createSupabaseAdminClient();

    // 3. Update the user profile role
    const { error: profileError } = await adminClient
      .from("user_profiles")
      .update({
        role: validated.role,
      })
      .eq("id", validated.id);

    if (profileError) {
      throw new AppError(AUTH_ERRORS.INTERNAL_ERROR, correlationId, profileError);
    }

    // 5. Audit Logging
    const headersList = await headers();
    await writeAuditLog({
      userId: currentUser.id,
      eventType: "UserRoleAssigned",
      module: "user_management",
      action: "assign_role",
      description: `Assigned role ${validated.role} to user ${validated.id}`,
      newValues: {
        id: validated.id,
        role: validated.role,
      },
      ipAddress: extractIpAddress(headersList),
      userAgent: extractUserAgent(headersList),
      correlationId,
    });

    return createActionSuccess({ success: true }, correlationId);
  });
}
