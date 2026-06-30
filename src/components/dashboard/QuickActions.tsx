import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { FileTextIcon, UsersIcon, PackageIcon, TruckIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface QuickActionsProps {
  role: string;
}

export function QuickActions({ role }: QuickActionsProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {(role === "system_administrator" ||
            role === "operations_manager") && (
            <Link
              href="/dispatches/new"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-20 flex flex-col justify-center items-center space-y-2 text-foreground",
              )}
            >
              <TruckIcon className="h-6 w-6 text-blue-500" />
              <span className="text-xs">New Dispatch</span>
            </Link>
          )}
          {(role === "system_administrator" || role === "finance_officer") && (
            <Link
              href="/payments/new"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-20 flex flex-col justify-center items-center space-y-2 text-foreground",
              )}
            >
              <FileTextIcon className="h-6 w-6 text-green-500" />
              <span className="text-xs">Record Payment</span>
            </Link>
          )}
          <Link
            href="/reports"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-20 flex flex-col justify-center items-center space-y-2 text-foreground",
            )}
          >
            <PackageIcon className="h-6 w-6 text-orange-500" />
            <span className="text-xs">View Reports</span>
          </Link>
          <Link
            href="/salespersons"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-20 flex flex-col justify-center items-center space-y-2 text-foreground",
            )}
          >
            <UsersIcon className="h-6 w-6 text-purple-500" />
            <span className="text-xs">Salespersons</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
