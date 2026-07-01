import { getDashboardMetricsAction } from "@/app/actions/dashboard/get-metrics.action";
import { getDashboardChartsAction } from "@/app/actions/dashboard/get-charts.action";
import { getDashboardActivityAction } from "@/app/actions/dashboard/get-activity.action";
import { getDashboardBalancesAction } from "@/app/actions/dashboard/get-balances.action";
import { DashboardClient } from "./DashboardClient";
import { getUserProfile } from "@/app/actions/auth/get-session.action";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/login");
  }

  let metrics: any = null;
  let charts: any = null;
  let activities: any[] = [];
  let balances: any[] = [];
  let hasError = false;

  try {
    [metrics, charts, activities, balances] = await Promise.all([
      getDashboardMetricsAction(),
      getDashboardChartsAction({}),
      getDashboardActivityAction(),
      getDashboardBalancesAction(),
    ]);
  } catch (error) {
    hasError = true;
  }

  if (hasError) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-red-500">
          Could not load dashboard data. Ensure the database is initialized and
          migrations have been applied.
        </p>
      </div>
    );
  }

  return (
    <DashboardClient
      initialMetrics={metrics}
      initialCharts={charts}
      initialActivities={activities}
      initialBalances={balances}
      userRole={profile.role}
      userName={profile.fullName}
    />
  );
}
