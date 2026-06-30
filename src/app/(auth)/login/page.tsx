"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signInAction } from "@/app/actions/auth/login.action";
import { AuthLayout } from "@/components/auth/AuthLayout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mail, Lock } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Fallback for Next.js 15 async searchParams
  const redirectTo = searchParams?.get("redirectTo") ?? "/dashboard";

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);

    try {
      const result = await signInAction(formData);

      if (result.success) {
        toast.success("Login successful! Redirecting...");
        // Force a hard navigation to apply the middleware correctly
        window.location.href = redirectTo;
      } else {
        toast.error(
          result.error?.message || "Authentication failed. Please try again.",
        );
        setIsLoading(false);
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again later.");
      setIsLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5">
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

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-gray-300">
            Password
          </Label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors focus:outline-none focus:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
            required
            autoComplete="current-password"
            disabled={isLoading}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
