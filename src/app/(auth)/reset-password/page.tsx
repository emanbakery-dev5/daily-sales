"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { confirmPasswordResetAction } from "@/app/actions/auth/reset-password.action";
import { AuthLayout } from "@/components/auth/AuthLayout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Lock, ShieldCheck } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const result = await confirmPasswordResetAction(formData);

      if (result.success) {
        toast.success("Password reset successfully. Redirecting to login...");
        router.push("/login?reset=success");
      } else {
        toast.error(
          result.error?.message ||
            "Failed to reset password. The link might be expired.",
        );
        setIsLoading(false);
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again later.");
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Enter your new password below"
    >
      <form action={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-gray-300">
              New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="••••••••"
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
                required
                autoComplete="new-password"
                disabled={isLoading}
              />
            </div>
            <ul className="text-xs text-gray-400 mt-2 space-y-1 ml-1 list-disc list-inside">
              <li>Minimum 8 characters</li>
              <li>At least one uppercase letter</li>
              <li>At least one lowercase letter</li>
              <li>At least one number</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-300">
              Confirm Password
            </Label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
                required
                autoComplete="new-password"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting Password...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
