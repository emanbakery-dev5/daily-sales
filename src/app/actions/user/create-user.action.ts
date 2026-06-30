"use server";

import { requirePermission } from "@/lib/permissions/guard";
import { AppError, createActionError, createActionSuccess, safeServerAction } from "@/lib/errors/app-error";
import { AUTH_ERRORS } from "@/lib/errors/error-codes";
import { writeAuditLog } from "@/lib/audit/audit-logger";
import { AuthEventType, UserRole, UserStatus } from "@/lib/types/auth.types";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createUserSchema, type CreateUser } from "@/lib/validation/user.schemas";
import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { extractIpAddress, extractUserAgent } from "@/lib/audit/audit-logger";

export async function createUserAction(data: CreateUser) {
  const correlationId = randomUUID();

  return safeServerAction(correlationId, async () => {
    // 1. Authorize Request
    const { profile: currentUser } = await requirePermission("User.Create");

    // 2. Validate Input
    const parsed = createUserSchema.safeParse(data);
    if (!parsed.success) {
      throw new AppError(AUTH_ERRORS.INVALID_EMAIL, correlationId, parsed.error.message); // Using INVALID_EMAIL as fallback validation error
    }
    const validated = parsed.data;

    // Optional: Business Rule - Only system_administrator can create other system_administrators
    if (validated.role === UserRole.SYSTEM_ADMINISTRATOR && currentUser.role !== UserRole.SYSTEM_ADMINISTRATOR) {
      throw new AppError(AUTH_ERRORS.PERMISSION_DENIED, correlationId);
    }

    const adminClient = createSupabaseAdminClient();

    // 3. Create Supabase Auth User
    // Note: We generate a random temporary password if none provided, but typically the admin
    // provides a temp password or the system emails them. We'll generate a random string for now.
    const tempPassword = randomUUID() + "A1a!"; 
    const fullName = `${validated.firstName} ${validated.lastName}`;

    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email: validated.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        username: validated.username,
      },
    });

    if (authError || !authUser.user) {
      // Check if email taken
      if (authError?.message.includes("already registered")) {
         throw new AppError({
           ...AUTH_ERRORS.INVALID_EMAIL,
           message: "Email address already exists."
         }, correlationId);
      }
      throw new AppError(AUTH_ERRORS.INTERNAL_ERROR, correlationId, authError);
    }

    // 4. Update the user_profiles row (auto-created by DB trigger trg_on_new_auth_user)
    // The trigger creates the profile with default 'read_only_user' and 'active'.
    // We must update it with the requested role and status.
    const { error: profileError } = await adminClient
      .from("user_profiles")
      .update({
        role: validated.role,
        must_change_password: validated.requirePasswordChange,
      })
      .eq("id", authUser.user.id);

    if (profileError) {
      throw new AppError(AUTH_ERRORS.INTERNAL_ERROR, correlationId, profileError);
    }

    // 5. Audit Logging
    const headersList = await headers();
    await writeAuditLog({
      userId: currentUser.id,
      eventType: "UserCreated",
      module: "user_management",
      action: "create",
      description: `Created user account for ${validated.email}`,
      newValues: {
        id: authUser.user.id,
        email: validated.email,
        role: validated.role,
      },
      ipAddress: extractIpAddress(headersList),
      userAgent: extractUserAgent(headersList),
      correlationId,
    });

    return createActionSuccess({
      id: authUser.user.id,
      email: validated.email,
      tempPassword, // To be displayed to admin in UI once
    }, correlationId);
  });
}
