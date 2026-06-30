import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Balance {
  salesperson_id: string;
  salesperson_name: string;
  outstanding_balance: number;
}

export function OutstandingBalances({ balances }: { balances: Balance[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Top Outstanding Balances</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {balances.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No outstanding balances.
            </p>
          ) : (
            balances.map((balance) => (
              <div key={balance.salesperson_id} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {balance.salesperson_name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {balance.salesperson_name}
                  </p>
                </div>
                <div className="ml-auto font-medium text-destructive">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(balance.outstanding_balance)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
