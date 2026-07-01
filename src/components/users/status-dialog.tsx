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
import { UserStatus } from "@/lib/types/auth.types";
import { updateUserStatusAction } from "@/app/actions/user/update-status.action";
import { UserStatusBadge } from "./user-status-badge";

interface StatusDialogProps {
  userId: string;
  userName: string;
  currentStatus: UserStatus;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function StatusDialog({
  userId,
  userName,
  currentStatus,
  open,
  onOpenChange,
  onSuccess,
}: StatusDialogProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (newStatus: UserStatus) => {
    setLoading(true);
    try {
      const result = await updateUserStatusAction({
        id: userId,
        status: newStatus,
      });
      if (result.success) {
        toast.success(`User status updated to ${newStatus}`);
        onSuccess?.();
        router.refresh();
        onOpenChange(false);
      } else {
        toast.error(result.error?.message || "Failed to update status");
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
          <DialogTitle>Change Account Status</DialogTitle>
          <DialogDescription>
            Are you sure you want to change the status for {userName}?
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-4 py-4">
          <p className="text-sm font-medium">Current Status:</p>
          <UserStatusBadge status={currentStatus} />
        </div>

        <DialogFooter className="flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between sm:space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <div className="flex space-x-2">
            {currentStatus !== UserStatus.ACTIVE && (
              <Button
                onClick={() => handleStatusChange(UserStatus.ACTIVE)}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Activate Account
              </Button>
            )}
            {currentStatus !== UserStatus.DISABLED && (
              <Button
                variant="destructive"
                onClick={() => handleStatusChange(UserStatus.DISABLED)}
                disabled={loading}
              >
                Disable Account
              </Button>
            )}
            {currentStatus !== UserStatus.LOCKED && (
              <Button
                variant="secondary"
                onClick={() => handleStatusChange(UserStatus.LOCKED)}
                disabled={loading}
              >
                Lock Account
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
