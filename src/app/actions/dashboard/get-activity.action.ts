"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/permissions/guard";
import { AppError } from "@/lib/errors/app-error";
import { ErrorCode } from "@/lib/errors/error-codes";

export async function getDashboardActivityAction() {
  const { profile } = await requirePermission("Dashboard.View");

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("dashboard_recent_activity")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    throw new AppError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      "Failed to load recent activity",
      error,
    );
  }

  return data || [];
}
