import { KPICard } from "./KPICard";
import {
  TruckIcon,
  DollarSignIcon,
  CreditCardIcon,
  WalletIcon,
} from "lucide-react";

interface MetricsData {
  today_dispatches: number;
  yesterday_dispatches: number;
  today_revenue: number;
  yesterday_revenue: number;
  total_outstanding_balance: number;
  payments_received_today: number;
  yesterday_payments: number;
  active_salespersons: number;
  active_products: number;
}

export function KPIGrid({ metrics }: { metrics: MetricsData }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Today's Dispatches"
        value={metrics.today_dispatches}
        previousValue={metrics.yesterday_dispatches}
        icon={<TruckIcon className="h-4 w-4 text-muted-foreground" />}
      />
      <KPICard
        title="Today's Revenue"
        value={metrics.today_revenue}
        previousValue={metrics.yesterday_revenue}
        icon={<DollarSignIcon className="h-4 w-4 text-muted-foreground" />}
        isCurrency
      />
      <KPICard
        title="Payments Received"
        value={metrics.payments_received_today}
        previousValue={metrics.yesterday_payments}
        icon={<WalletIcon className="h-4 w-4 text-muted-foreground" />}
        isCurrency
      />
      <KPICard
        title="Outstanding Balance"
        value={metrics.total_outstanding_balance}
        previousValue={metrics.total_outstanding_balance} // Spec doesn't define yesterday's outstanding easily
        icon={<CreditCardIcon className="h-4 w-4 text-muted-foreground" />}
        isCurrency
      />
    </div>
  );
}
