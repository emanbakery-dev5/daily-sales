import { Badge } from "@/components/ui/badge";

interface SalespersonStatusBadgeProps {
  status: "active" | "inactive";
}

export function SalespersonStatusBadge({
  status,
}: SalespersonStatusBadgeProps) {
  if (status === "active") {
    return (
      <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-500/20">
        Active
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className="bg-slate-100 text-slate-600 hover:bg-slate-200"
    >
      Inactive
    </Badge>
  );
}
