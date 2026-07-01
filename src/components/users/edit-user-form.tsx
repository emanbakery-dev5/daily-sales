"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  updateUserSchema,
  type UpdateUser,
} from "@/lib/validation/user.schemas";
import { updateUserAction } from "@/app/actions/user/update-user.action";
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

interface EditUserFormProps {
  initialData: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
}

export function EditUserForm({ initialData }: EditUserFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<UpdateUser>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id: initialData.id,
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      phone: initialData.phone || "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (data: UpdateUser) => {
    setLoading(true);
    try {
      const result = await updateUserAction(data);
      if (result.success) {
        toast.success("User profile updated successfully");
        router.push(`/users/${initialData.id}`);
        router.refresh();
      } else {
        toast.error(result.error?.message || "Failed to update user");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit User Profile</CardTitle>
          <CardDescription>
            Update the personal details for this user.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              {...register("firstName")}
              disabled={loading}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input id="lastName" {...register("lastName")} disabled={loading} />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2 max-w-md">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" {...register("phone")} disabled={loading} />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button
            variant="ghost"
            type="button"
            onClick={() => router.push(`/users/${initialData.id}`)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving Changes..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
