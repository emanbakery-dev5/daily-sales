"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/permissions/guard";
import { AppError } from "@/lib/errors/app-error";
import { ErrorCode } from "@/lib/errors/error-codes";

export async function getDashboardMetricsAction() {
  const { profile } = await requirePermission("Dashboard.View");

  const supabase = (await createSupabaseServerClient()) as any;
  const { data, error } = await supabase
    .from("dashboard_kpi_metrics")
    .select("*")
    .single();

  if (error) {
    // If table is empty (e.g., initial state without views properly seeded), handle gracefully
    if (error.code === "PGRST116") {
      return {
        today_dispatches: 0,
        yesterday_dispatches: 0,
        today_revenue: 0,
        yesterday_revenue: 0,
        total_outstanding_balance: 0,
        payments_received_today: 0,
        yesterday_payments: 0,
        active_salespersons: 0,
        active_products: 0,
      };
    }
    throw new AppError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      "Failed to load dashboard metrics",
      error,
    );
  }

  return data;
}
