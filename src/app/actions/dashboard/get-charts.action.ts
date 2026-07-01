"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/permissions/guard";
import { AppError } from "@/lib/errors/app-error";
import { ErrorCode } from "@/lib/errors/error-codes";

import {
  dashboardFilterSchema,
  DashboardFilter,
} from "@/lib/validation/dashboard.schemas";
import { format, subDays } from "date-fns";

export async function getDashboardChartsAction(filters: DashboardFilter) {
  const { profile } = await requirePermission("Dashboard.View");

  const parsed = dashboardFilterSchema.safeParse(filters);
  if (!parsed.success) {
    throw new AppError(ErrorCode.INTERNAL_SERVER_ERROR, "Invalid date range"); // using internal server error definition mapping since it is safe
  }

  const startDate = parsed.data.startDate
    ? format(new Date(parsed.data.startDate), "yyyy-MM-dd")
    : format(subDays(new Date(), 30), "yyyy-MM-dd");

  const endDate = parsed.data.endDate
    ? format(new Date(parsed.data.endDate), "yyyy-MM-dd")
    : format(new Date(), "yyyy-MM-dd");

  const supabase = (await createSupabaseServerClient()) as any;

  const [revenueRes, dispatchRes] = await Promise.all([
    supabase.rpc("get_dashboard_revenue_trend", {
      start_date: startDate,
      end_date: endDate,
    }),
    supabase.rpc("get_dashboard_dispatch_trend", {
      start_date: startDate,
      end_date: endDate,
    }),
  ]);

  if (revenueRes.error) {
    throw new AppError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      "Failed to load revenue trend",
      revenueRes.error,
    );
  }

  if (dispatchRes.error) {
    throw new AppError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      "Failed to load dispatch trend",
      dispatchRes.error,
    );
  }

  return {
    revenueTrend: revenueRes.data || [],
    dispatchTrend: dispatchRes.data || [],
  };
}
