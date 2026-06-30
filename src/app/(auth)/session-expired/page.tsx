"use client";

import React from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { buttonVariants } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SessionExpiredPage() {
  return (
    <AuthLayout
      title="Session Expired"
      subtitle="For your security, you have been signed out."
    >
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center">
          <Clock className="w-8 h-8 text-yellow-500" />
        </div>
        <p className="text-gray-300">
          Your session has timed out due to inactivity or the login token has
          expired. Please sign in again to continue working.
        </p>
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full bg-blue-600 hover:bg-blue-700 text-white h-10",
          )}
        >
          Sign In
        </Link>
      </div>
    </AuthLayout>
  );
}
