"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";

interface SalespersonStatementCardProps {
  statement: {
    profile: any;
    balance: number;
    creditLimit: number;
    availableCredit: number;
    transactions: any[];
  };
}

export function SalespersonStatementCard({
  statement,
}: SalespersonStatementCardProps) {
  const { balance, creditLimit, availableCredit, profile } = statement;

  const isOverLimit = balance > creditLimit;
  const utilization =
    creditLimit > 0 ? Math.min((balance / creditLimit) * 100, 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Statement Snapshot</CardTitle>
        <CardDescription>
          Current financial standing as of {format(new Date(), "MMM d, yyyy")}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1 rounded-md border p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Current Balance
            </div>
            <div
              className={`text-2xl font-bold ${isOverLimit ? "text-destructive" : ""}`}
            >
              ${Number(balance).toFixed(2)}
            </div>
          </div>
          <div className="space-y-1 rounded-md border p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Credit Limit
            </div>
            <div className="text-2xl font-bold">
              ${Number(creditLimit).toFixed(2)}
            </div>
          </div>
          <div className="space-y-1 rounded-md border p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Available Credit
            </div>
            <div className="text-2xl font-bold text-emerald-600">
              ${Number(availableCredit).toFixed(2)}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Credit Utilization</span>
            <span className={isOverLimit ? "text-destructive font-medium" : ""}>
              {utilization.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full ${isOverLimit ? "bg-destructive" : "bg-primary"}`}
              style={{ width: `${utilization}%` }}
            />
          </div>
          {isOverLimit && (
            <p className="text-sm text-destructive font-medium">
              Credit limit exceeded.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
