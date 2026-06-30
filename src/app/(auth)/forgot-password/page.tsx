"use client";

import React, { useState } from "react";
import Link from "next/link";
import { requestPasswordResetAction } from "@/app/actions/auth/forgot-password.action";
import { AuthLayout } from "@/components/auth/AuthLayout";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);

    try {
      const result = await requestPasswordResetAction(formData);

      if (result.success) {
        setIsSuccess(true);
        toast.success("Password reset instructions sent.");
      } else {
        toast.error(
          result.error?.message || "Failed to request password reset.",
        );
        setIsLoading(false);
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again later.");
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We've sent password reset instructions"
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <p className="text-gray-300">
            If an account exists for the email provided, you will receive an
            email with instructions on how to reset your password.
          </p>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "default" }),
              "w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white h-10",
            )}
          >
            Return to Login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email to receive a reset link"
    >
      <form action={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
              required
              autoComplete="email"
              disabled={isLoading}
            />
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
              Sending Link...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors focus:outline-none focus:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
