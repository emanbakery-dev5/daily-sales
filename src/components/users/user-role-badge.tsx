import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/lib/types/auth.types";
import { cn } from "@/lib/utils";

interface UserRoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  const roleLabels: Record<UserRole, string> = {
    [UserRole.SYSTEM_ADMINISTRATOR]: "System Administrator",
    [UserRole.OPERATIONS_MANAGER]: "Operations Manager",
    [UserRole.FINANCE_OFFICER]: "Finance Officer",
    [UserRole.SALES_COORDINATOR]: "Sales Coordinator",
    [UserRole.READ_ONLY_USER]: "Read-Only User",
  };

  return (
    <Badge variant="secondary" className={cn("font-medium", className)}>
      {roleLabels[role] || role}
    </Badge>
  );
}
