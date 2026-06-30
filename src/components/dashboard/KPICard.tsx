import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  previousValue: string | number;
  icon: React.ReactNode;
  isCurrency?: boolean;
}

export function KPICard({
  title,
  value,
  previousValue,
  icon,
  isCurrency = false,
}: KPICardProps) {
  const numValue =
    typeof value === "string"
      ? parseFloat(value.replace(/[^0-9.-]+/g, ""))
      : value;
  const numPrev =
    typeof previousValue === "string"
      ? parseFloat(previousValue.replace(/[^0-9.-]+/g, ""))
      : previousValue;

  let percentChange = 0;
  if (numPrev > 0) {
    percentChange = ((numValue - numPrev) / numPrev) * 100;
  } else if (numValue > 0) {
    percentChange = 100; // From 0 to something
  }

  const isPositive = percentChange > 0;
  const isNegative = percentChange < 0;
  const isNeutral = percentChange === 0;

  const displayValue = isCurrency
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(numValue)
    : new Intl.NumberFormat("en-US").format(numValue);

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{displayValue}</div>
        <p className="text-xs text-muted-foreground mt-1 flex items-center">
          {isPositive && (
            <ArrowUpIcon className="mr-1 h-3 w-3 text-green-500" />
          )}
          {isNegative && (
            <ArrowDownIcon className="mr-1 h-3 w-3 text-red-500" />
          )}
          {isNeutral && <MinusIcon className="mr-1 h-3 w-3 text-gray-500" />}
          <span
            className={
              isPositive
                ? "text-green-500 font-medium"
                : isNegative
                  ? "text-red-500 font-medium"
                  : "text-gray-500 font-medium"
            }
          >
            {Math.abs(percentChange).toFixed(1)}%
          </span>
          <span className="ml-1">from yesterday</span>
        </p>
      </CardContent>
    </Card>
  );
}
