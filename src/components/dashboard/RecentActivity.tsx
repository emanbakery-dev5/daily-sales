import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import {
  ActivityIcon,
  PackageIcon,
  DollarSignIcon,
  TruckIcon,
} from "lucide-react";

interface Activity {
  id: string;
  action: string;
  description: string;
  user_name: string;
  created_at: string;
}

export function RecentActivity({ activities }: { activities: Activity[] }) {
  const getIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case "dispatch_created":
        return <TruckIcon className="h-4 w-4 text-blue-500" />;
      case "payment_posted":
        return <DollarSignIcon className="h-4 w-4 text-green-500" />;
      case "product_added":
        return <PackageIcon className="h-4 w-4 text-orange-500" />;
      default:
        return <ActivityIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent activity.
            </p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className="mt-0.5 p-2 bg-muted rounded-full">
                  {getIcon(activity.action)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.user_name} •{" "}
                    {formatDistanceToNow(new Date(activity.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
