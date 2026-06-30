import React from "react";
import { getDashboardMetricsAction } from "@/app/actions/dashboard/get-metrics.action";
import { KPICard } from "@/components/dashboard/KPICard";
import {
  DispatchTrendChart,
  RevenueTrendChart,
  PaymentCollectionChart,
} from "@/components/dashboard/Charts";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import {
  Truck,
  DollarSign,
  Wallet,
  CreditCard,
  Users,
  Package,
} from "lucide-react";

export default async function DashboardPage() {
  // Fetch metrics data from the server action
  const result = await getDashboardMetricsAction();

  if (!result.success) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Unable to load dashboard data
        </h2>
        <p className="text-gray-400 mb-6">{result.error?.message}</p>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          Retry
        </button>
      </div>
    );
  }

  const metrics = result.data!;

  // Create a greeting based on time of day
  const hour = new Date().getHours();
  let greeting = "Good Evening";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            {greeting}, User
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="text-sm text-gray-500 bg-[#0F172A] px-3 py-1.5 rounded-lg border border-white/5 shadow-sm">
          Last Updated: {formattedDate}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <KPICard
          title="Today's Dispatches"
          value={metrics.totalDispatches}
          icon={Truck}
          trend={metrics.dispatchTrend}
          trendValue={metrics.dispatchTrendValue}
        />
        <KPICard
          title="Today's Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={metrics.revenueTrend}
          trendValue={metrics.revenueTrendValue}
        />
        <KPICard
          title="Outstanding Balance"
          value={`$${metrics.outstandingBalance.toLocaleString()}`}
          icon={Wallet}
          trend={metrics.balanceTrend}
          trendValue={metrics.balanceTrendValue}
        />
        <KPICard
          title="Payments Received Today"
          value={`$${metrics.paymentsReceived.toLocaleString()}`}
          icon={CreditCard}
          trend={metrics.paymentsTrend}
          trendValue={metrics.paymentsTrendValue}
        />

        {/* These two can be hidden on smaller screens or flow naturally */}
        <div className="hidden xl:block">
          <KPICard
            title="Active Salespersons"
            value={metrics.activeSalespersons}
            icon={Users}
          />
        </div>
        <div className="hidden xl:block">
          <KPICard
            title="Active Products"
            value={metrics.activeProducts}
            icon={Package}
          />
        </div>
      </div>

      {/* Charts & Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DispatchTrendChart />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RevenueTrendChart />
          <PaymentCollectionChart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
