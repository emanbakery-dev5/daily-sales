import { Badge } from "@/components/ui/badge";
import { UserStatus } from "@/lib/types/auth.types";
import { cn } from "@/lib/utils";

interface UserStatusBadgeProps {
  status: UserStatus;
  className?: string;
}

export function UserStatusBadge({ status, className }: UserStatusBadgeProps) {
  switch (status) {
    case UserStatus.ACTIVE:
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-emerald-50 text-emerald-700 border-emerald-200",
            className,
          )}
        >
          Active
        </Badge>
      );
    case UserStatus.DISABLED:
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-slate-50 text-slate-700 border-slate-200",
            className,
          )}
        >
          Disabled
        </Badge>
      );
    case UserStatus.LOCKED:
      return (
        <Badge
          variant="outline"
          className={cn("bg-rose-50 text-rose-700 border-rose-200", className)}
        >
          Locked
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className={className}>
          {status}
        </Badge>
      );
  }
}
