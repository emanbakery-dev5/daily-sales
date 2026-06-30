"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KPIGrid } from "@/components/dashboard/KPIGrid";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { OutstandingBalances } from "@/components/dashboard/OutstandingBalances";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { toast } from "sonner";
import { getDashboardMetricsAction } from "@/app/actions/dashboard/get-metrics.action";
import { getDashboardChartsAction } from "@/app/actions/dashboard/get-charts.action";
import { getDashboardActivityAction } from "@/app/actions/dashboard/get-activity.action";
import { getDashboardBalancesAction } from "@/app/actions/dashboard/get-balances.action";

export function DashboardClient({
  initialMetrics,
  initialCharts,
  initialActivities,
  initialBalances,
  userRole,
  userName,
}: {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  initialMetrics: any;
  initialCharts: any;
  initialActivities: any[];
  initialBalances: any[];
  /* eslint-enable @typescript-eslint/no-explicit-any */
  userRole: string;
  userName: string;
}) {
  const [metrics, setMetrics] = useState(initialMetrics);
  const [charts, setCharts] = useState(initialCharts);
  const [activities, setActivities] = useState(initialActivities);
  const [balances, setBalances] = useState(initialBalances);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [m, c, a, b] = await Promise.all([
        getDashboardMetricsAction(),
        getDashboardChartsAction({}),
        getDashboardActivityAction(),
        getDashboardBalancesAction(),
      ]);
      setMetrics(m);
      setCharts(c);
      setActivities(a);
      setBalances(b);
      setLastUpdated(new Date());
    } catch (error) {
      toast.error("Failed to refresh dashboard");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        refreshData();
      },
      5 * 60 * 1000,
    );
    return () => clearInterval(interval);
  }, [refreshData]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <DashboardHeader
        userName={userName}
        lastUpdated={lastUpdated}
        onRefresh={() => {
          refreshData().then(() => toast.success("Dashboard updated"));
        }}
        isRefreshing={isRefreshing}
      />

      <KPIGrid metrics={metrics} />

      <DashboardCharts data={charts} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-1 lg:col-span-3">
          <OutstandingBalances balances={balances} />
        </div>
        <div className="col-span-1 lg:col-span-4">
          <RecentActivity activities={activities} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <QuickActions role={userRole} />
      </div>
    </div>
  );
}
