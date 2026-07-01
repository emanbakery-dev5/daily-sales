"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  createSalespersonSchema,
  type CreateSalesperson,
} from "@/lib/validation/salesperson.schemas";
import { createSalespersonAction } from "@/app/actions/salesperson/create-salesperson.action";
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

export function CreateSalespersonForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateSalesperson>({
    resolver: zodResolver(createSalespersonSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      designation: "",
      mobileNumber: "",
      emailAddress: "",
      address: "",
      creditLimit: 0,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (data: CreateSalesperson) => {
    setLoading(true);
    try {
      const result = await createSalespersonAction(data);

      if (result.success) {
        toast.success("Salesperson created successfully");
        router.push("/salespersons");
        router.refresh();
      } else {
        toast.error(result.error?.message || "Failed to create salesperson");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Create Salesperson</CardTitle>
          <CardDescription>
            Add a new salesperson to the distribution network.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
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
                placeholder="Doe"
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
                placeholder="Sales Representative"
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
                placeholder="+1 234 567 8900"
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="emailAddress">Email Address (Optional)</Label>
              <Input
                id="emailAddress"
                type="email"
                placeholder="john.doe@example.com"
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
              <Label htmlFor="creditLimit">Initial Credit Limit</Label>
              <Input
                id="creditLimit"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register("creditLimit", { valueAsNumber: true })}
                className={errors.creditLimit ? "border-destructive" : ""}
              />
              {errors.creditLimit && (
                <p className="text-sm text-destructive">
                  {errors.creditLimit.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address (Optional)</Label>
            <Input
              id="address"
              placeholder="123 Main St, City, Country"
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
        <CardFooter className="flex justify-between border-t p-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/salespersons")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Salesperson
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
