"use server";

import { requirePermission } from "@/lib/permissions/guard";
import { AppError, createActionSuccess, safeServerAction } from "@/lib/errors/app-error";
import { AUTH_ERRORS } from "@/lib/errors/error-codes";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

export async function getUserAction(userId: string) {
  const correlationId = randomUUID();

  return safeServerAction(correlationId, async () => {
    // 1. Authorize Request
    await requirePermission("User.View");

    const supabase = await createSupabaseServerClient();
    
    // 2. Fetch User Profile
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();
      
    if (error) {
      if (error.code === "PGRST116") { // Not found
        throw new AppError(AUTH_ERRORS.PROFILE_NOT_FOUND, correlationId, error);
      }
      throw new AppError(AUTH_ERRORS.INTERNAL_ERROR, correlationId, error);
    }
    
    return createActionSuccess(data, correlationId);
  });
}
