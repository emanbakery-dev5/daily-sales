"use server";

import { randomUUID } from "crypto";
import { safeServerAction, createActionSuccess } from "@/lib/errors/app-error";
import type { ActionResult } from "@/lib/types/auth.types";

export interface DashboardMetrics {
  totalDispatches: number;
  dispatchTrend: "up" | "down" | "neutral";
  dispatchTrendValue: string;

  totalRevenue: number;
  revenueTrend: "up" | "down" | "neutral";
  revenueTrendValue: string;

  outstandingBalance: number;
  balanceTrend: "up" | "down" | "neutral";
  balanceTrendValue: string;

  paymentsReceived: number;
  paymentsTrend: "up" | "down" | "neutral";
  paymentsTrendValue: string;

  activeSalespersons: number;
  activeProducts: number;
}

/**
 * getDashboardMetricsAction
 * Currently returns mock data until the Dispatch, Ledger, and Salesperson
 * modules are fully implemented in the database.
 */
export async function getDashboardMetricsAction(): Promise<
  ActionResult<DashboardMetrics>
> {
  const correlationId = randomUUID();

  return safeServerAction(correlationId, async () => {
    // In the future, this will use createSupabaseServerClient to query real tables:
    // const supabase = await createSupabaseServerClient();
    // const { count: dispatchCount } = await supabase.from('dispatches').select('*', { count: 'exact', head: true });

    // Simulating database latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockMetrics: DashboardMetrics = {
      totalDispatches: 124,
      dispatchTrend: "up",
      dispatchTrendValue: "+12%",

      totalRevenue: 15420,
      revenueTrend: "up",
      revenueTrendValue: "+8.4%",

      outstandingBalance: 42500,
      balanceTrend: "neutral",
      balanceTrendValue: "0%",

      paymentsReceived: 8350,
      paymentsTrend: "down",
      paymentsTrendValue: "-2.1%",

      activeSalespersons: 24,
      activeProducts: 156,
    };

    return createActionSuccess(mockMetrics, correlationId);
  });
}
