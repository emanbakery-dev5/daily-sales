"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  updateSalespersonSchema,
  type UpdateSalesperson,
} from "@/lib/validation/salesperson.schemas";
import { updateSalespersonAction } from "@/app/actions/salesperson/update-salesperson.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface EditSalespersonFormProps {
  salesperson: any; // Using any here to simplify, ideally a strict type
}

export function EditSalespersonForm({ salesperson }: EditSalespersonFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<UpdateSalesperson>({
    resolver: zodResolver(updateSalespersonSchema),
    defaultValues: {
      id: salesperson.id,
      firstName: salesperson.first_name,
      lastName: salesperson.last_name,
      designation: salesperson.designation,
      mobileNumber: salesperson.mobile_number,
      emailAddress: salesperson.email_address || "",
      address: salesperson.address || "",
      creditLimit: salesperson.credit_limit,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (data: UpdateSalesperson) => {
    setLoading(true);
    try {
      const result = await updateSalespersonAction(data);

      if (result.success) {
        toast.success("Salesperson updated successfully");
        router.refresh();
      } else {
        toast.error(result.error?.message || "Failed to update salesperson");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Edit Profile Details</CardTitle>
          <CardDescription>
            Update personal and contact information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...register("firstName")}
                className={errors.firstName ? "border-destructive" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...register("lastName")}
                className={errors.lastName ? "border-destructive" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                {...register("designation")}
                className={errors.designation ? "border-destructive" : ""}
              />
              {errors.designation && (
                <p className="text-sm text-destructive">
                  {errors.designation.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input
                id="mobileNumber"
                {...register("mobileNumber")}
                className={errors.mobileNumber ? "border-destructive" : ""}
              />
              {errors.mobileNumber && (
                <p className="text-sm text-destructive">
                  {errors.mobileNumber.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailAddress">Email Address (Optional)</Label>
            <Input
              id="emailAddress"
              type="email"
              {...register("emailAddress")}
              className={errors.emailAddress ? "border-destructive" : ""}
            />
            {errors.emailAddress && (
              <p className="text-sm text-destructive">
                {errors.emailAddress.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address (Optional)</Label>
            <Input
              id="address"
              {...register("address")}
              className={errors.address ? "border-destructive" : ""}
            />
            {errors.address && (
              <p className="text-sm text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t p-4">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
