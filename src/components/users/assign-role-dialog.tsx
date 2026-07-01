"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/lib/types/auth.types";
import { assignRoleAction } from "@/app/actions/user/assign-role.action";
import { UserRoleBadge } from "./user-role-badge";

interface AssignRoleDialogProps {
  userId: string;
  userName: string;
  currentRole: UserRole;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AssignRoleDialog({
  userId,
  userName,
  currentRole,
  open,
  onOpenChange,
  onSuccess,
}: AssignRoleDialogProps) {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const router = useRouter();

  const handleAssignRole = async () => {
    if (selectedRole === currentRole) {
      onOpenChange(false);
      return;
    }

    setLoading(true);
    try {
      const result = await assignRoleAction({ id: userId, role: selectedRole });
      if (result.success) {
        toast.success(`User role updated successfully`);
        onSuccess?.();
        router.refresh();
        onOpenChange(false);
      } else {
        toast.error(result.error?.message || "Failed to assign role");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Role</DialogTitle>
          <DialogDescription>
            Change the primary role for {userName}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4 py-4">
          <div className="flex items-center space-x-4">
            <p className="text-sm font-medium w-24">Current Role:</p>
            <UserRoleBadge role={currentRole} />
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-sm font-medium w-24">New Role:</p>
            <Select
              value={selectedRole}
              onValueChange={(val) => setSelectedRole(val as UserRole)}
              disabled={loading}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.SYSTEM_ADMINISTRATOR}>
                  System Administrator
                </SelectItem>
                <SelectItem value={UserRole.OPERATIONS_MANAGER}>
                  Operations Manager
                </SelectItem>
                <SelectItem value={UserRole.FINANCE_OFFICER}>
                  Finance Officer
                </SelectItem>
                <SelectItem value={UserRole.SALES_COORDINATOR}>
                  Sales Coordinator
                </SelectItem>
                <SelectItem value={UserRole.READ_ONLY_USER}>
                  Read-Only User
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssignRole}
            disabled={loading || selectedRole === currentRole}
          >
            {loading ? "Assigning..." : "Assign Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
