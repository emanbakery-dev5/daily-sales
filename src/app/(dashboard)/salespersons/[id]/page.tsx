import { getSalespersonStatementAction } from "@/app/actions/salesperson/get-salesperson-statement.action";
import { EditSalespersonForm } from "@/components/salespersons/edit-salesperson-form";
import { StatusDialog } from "@/components/salespersons/status-dialog";
import { AdjustCreditLimitDialog } from "@/components/salespersons/adjust-credit-limit-dialog";
import { SalespersonStatementCard } from "@/components/salespersons/salesperson-statement-card";
import { SalespersonStatusBadge } from "@/components/salespersons/salesperson-status-badge";
import { AppError } from "@/lib/errors/app-error";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Salesperson Profile | EMA BDMS",
};

export default async function SalespersonProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getSalespersonStatementAction({ id: params.id });

  if (!result.success) {
    const error = result.error as AppError;
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-destructive">
            Profile Not Found
          </h2>
          <p className="mt-2 text-muted-foreground">{error.message}</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/salespersons">Return to Directory</Link>
          </Button>
        </div>
      </div>
    );
  }

  const statement = result.data!;
  const salesperson = statement.profile;

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/salespersons">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            {salesperson.first_name} {salesperson.last_name}
            <SalespersonStatusBadge status={salesperson.status} />
          </h2>
          <p className="text-muted-foreground flex items-center gap-2">
            <span className="font-medium text-foreground">{salesperson.employee_code}</span>
            <span>&bull;</span>
            <span>{salesperson.designation}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 mt-6">
        {/* Left Column - Profile & Edits */}
        <div className="md:col-span-8 space-y-6">
          <SalespersonStatementCard statement={statement} />
          <EditSalespersonForm salesperson={salesperson} />
        </div>

        {/* Right Column - Actions & Status */}
        <div className="md:col-span-4 space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 space-y-4">
              <h3 className="font-semibold leading-none tracking-tight">Administrative Actions</h3>
              <p className="text-sm text-muted-foreground">
                Manage the account limits and system access for this salesperson.
              </p>
              
              <div className="flex flex-col gap-3">
                <AdjustCreditLimitDialog salesperson={salesperson} />
                <StatusDialog salesperson={salesperson} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
