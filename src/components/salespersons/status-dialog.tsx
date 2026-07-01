"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteSalespersonAction } from "@/app/actions/salesperson/delete-salesperson.action";
import { updateSalespersonAction } from "@/app/actions/salesperson/update-salesperson.action"; // For reactivating
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";

interface StatusDialogProps {
  salesperson: any;
}

export function StatusDialog({ salesperson }: StatusDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const isActive = salesperson.status === "active";

  const handleToggleStatus = async () => {
    setLoading(true);
    try {
      if (isActive) {
        // Archive
        const result = await deleteSalespersonAction({ id: salesperson.id });
        if (result.success) {
          toast.success("Salesperson archived successfully");
          setOpen(false);
          router.refresh();
        } else {
          toast.error(result.error?.message || "Failed to archive salesperson");
        }
      } else {
        // Reactivate
        const result = await updateSalespersonAction({
          id: salesperson.id,
          firstName: salesperson.first_name,
          lastName: salesperson.last_name,
          designation: salesperson.designation,
          mobileNumber: salesperson.mobile_number,
          status: "active",
        });
        if (result.success) {
          toast.success("Salesperson reactivated successfully");
          setOpen(false);
          router.refresh();
        } else {
          toast.error(
            result.error?.message || "Failed to reactivate salesperson",
          );
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={isActive ? "destructive" : "default"}>
          {isActive ? "Archive Account" : "Reactivate Account"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isActive ? "Archive Salesperson" : "Reactivate Salesperson"}
          </DialogTitle>
          <DialogDescription>
            {isActive
              ? "Are you sure you want to archive this salesperson? They will no longer be able to access the system or be assigned new dispatches."
              : "Are you sure you want to reactivate this salesperson? They will regain access and can be assigned dispatches."}
          </DialogDescription>
        </DialogHeader>

        {isActive && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <p>This action is logged for audit purposes.</p>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant={isActive ? "destructive" : "default"}
            onClick={handleToggleStatus}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isActive ? "Archive" : "Reactivate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
