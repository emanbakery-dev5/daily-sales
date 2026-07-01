import { getSalespersonsAction } from "@/app/actions/salesperson/get-salespersons.action";
import { SalespersonTable } from "@/components/salespersons/salesperson-table";
import { AppError } from "@/lib/errors/app-error";

export const metadata = {
  title: "Salesperson Directory | EMA BDMS",
};

export default async function SalespersonsPage() {
  const result = await getSalespersonsAction();

  if (!result.success) {
    const error = result.error as AppError;
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-destructive">
            Error Loading Salespersons
          </h2>
          <p className="mt-2 text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  const salespersons = result.data || [];

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Salespersons</h2>
      </div>
      <div className="hidden items-center space-x-2 md:flex">
        <p className="text-muted-foreground">
          Manage your field sales representatives and their profiles.
        </p>
      </div>

      <SalespersonTable salespersons={salespersons} />
    </div>
  );
}
