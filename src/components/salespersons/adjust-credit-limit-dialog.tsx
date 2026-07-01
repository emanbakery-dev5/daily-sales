"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  adjustCreditLimitSchema,
  type AdjustCreditLimit,
} from "@/lib/validation/salesperson.schemas";
import { adjustCreditLimitAction } from "@/app/actions/salesperson/adjust-credit-limit.action";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface AdjustCreditLimitDialogProps {
  salesperson: any;
}

export function AdjustCreditLimitDialog({
  salesperson,
}: AdjustCreditLimitDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<AdjustCreditLimit>({
    resolver: zodResolver(adjustCreditLimitSchema),
    defaultValues: {
      id: salesperson.id,
      newCreditLimit: salesperson.credit_limit || 0,
      reason: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset({
        id: salesperson.id,
        newCreditLimit: salesperson.credit_limit || 0,
        reason: "",
      });
    }
  };

  const onSubmit = async (data: AdjustCreditLimit) => {
    setLoading(true);
    try {
      const result = await adjustCreditLimitAction(data);

      if (result.success) {
        toast.success("Credit limit adjusted successfully");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error?.message || "Failed to adjust credit limit");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Adjust Credit Limit</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Adjust Credit Limit</DialogTitle>
            <DialogDescription>
              Modify the financial credit limit for {salesperson.first_name}{" "}
              {salesperson.last_name}. This action requires a reason for audit
              logging.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Credit Limit</Label>
              <div className="text-sm text-muted-foreground">
                ${Number(salesperson.credit_limit || 0).toFixed(2)}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newCreditLimit">New Credit Limit</Label>
              <Input
                id="newCreditLimit"
                type="number"
                step="0.01"
                min="0"
                {...register("newCreditLimit", { valueAsNumber: true })}
                className={errors.newCreditLimit ? "border-destructive" : ""}
              />
              {errors.newCreditLimit && (
                <p className="text-sm text-destructive">
                  {errors.newCreditLimit.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Adjustment</Label>
              <Input
                id="reason"
                placeholder="e.g., Authorized temporary increase for peak season"
                {...register("reason")}
                className={errors.reason ? "border-destructive" : ""}
              />
              {errors.reason && (
                <p className="text-sm text-destructive">
                  {errors.reason.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Apply Adjustment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
