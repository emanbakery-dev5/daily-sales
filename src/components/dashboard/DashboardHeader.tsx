import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { RefreshCwIcon } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
  lastUpdated: Date;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function DashboardHeader({
  userName,
  lastUpdated,
  onRefresh,
  isRefreshing,
}: DashboardHeaderProps) {
  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting}, {userName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here is the latest overview of the daily sales operations.
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-muted-foreground">
          Last updated: {format(lastUpdated, "HH:mm:ss")}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCwIcon
            className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>
    </div>
  );
}
