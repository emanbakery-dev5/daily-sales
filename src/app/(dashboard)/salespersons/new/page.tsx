import { CreateSalespersonForm } from "@/components/salespersons/create-salesperson-form";

export const metadata = {
  title: "Create Salesperson | EMA BDMS",
};

export default function NewSalespersonPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Add Salesperson</h2>
      </div>
      <div className="hidden items-center space-x-2 md:flex">
        <p className="text-muted-foreground">
          Fill in the details to add a new salesperson to the system.
        </p>
      </div>

      <div className="mt-6">
        <CreateSalespersonForm />
      </div>
    </div>
  );
}
