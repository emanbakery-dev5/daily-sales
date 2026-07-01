"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  createUserSchema,
  type CreateUser,
} from "@/lib/validation/user.schemas";
import { createUserAction } from "@/app/actions/user/create-user.action";
import { UserRole } from "@/lib/types/auth.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

export function CreateUserForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateUser>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      phone: "",
      role: UserRole.READ_ONLY_USER,
      requirePasswordChange: true,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const onSubmit = async (data: CreateUser) => {
    setLoading(true);
    try {
      const result = await createUserAction(data);
      if (result.success) {
        toast.success(`User ${data.email} created successfully`);
        // Assuming there is a detail view
        router.push(`/users/${result.data.id}`);
      } else {
        toast.error(result.error?.message || "Failed to create user");
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
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Enter the personal details for the new user.
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
              placeholder="John"
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              {...register("lastName")}
              disabled={loading}
              placeholder="Smith"
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              disabled={loading}
              placeholder="john.smith@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">
              Username <span className="text-red-500">*</span>
            </Label>
            <Input
              id="username"
              {...register("username")}
              disabled={loading}
              placeholder="john.smith"
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              {...register("phone")}
              disabled={loading}
              placeholder="+1234567890"
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Configure the role and access requirements.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 max-w-sm">
            <Label htmlFor="role">
              Role <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch("role")}
              onValueChange={(val) =>
                setValue("role", val as UserRole, { shouldValidate: true })
              }
              disabled={loading}
            >
              <SelectTrigger>
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
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="requirePasswordChange"
              checked={watch("requirePasswordChange")}
              onCheckedChange={(checked) =>
                setValue("requirePasswordChange", checked as boolean)
              }
              disabled={loading}
            />
            <Label
              htmlFor="requirePasswordChange"
              className="font-normal cursor-pointer"
            >
              Require Password Change on first login
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button
            variant="ghost"
            type="button"
            onClick={() => router.push("/users")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating User..." : "Create User"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
