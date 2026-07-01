"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/permissions/guard";
import { AppError } from "@/lib/errors/app-error";
import { ErrorCode } from "@/lib/errors/error-codes";

export async function getDashboardBalancesAction() {
  const { profile } = await requirePermission("Dashboard.View");

  const supabase = (await createSupabaseServerClient()) as any;
  const { data, error } = await supabase
    .from("dashboard_outstanding_balances")
    .select("*")
    .order("outstanding_balance", { ascending: false })
    .limit(10);

  if (error) {
    throw new AppError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      "Failed to load outstanding balances",
      error,
    );
  }

  return data || [];
}
