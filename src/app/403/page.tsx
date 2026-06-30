"use client";

import React from "react";
import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0A0F1E] text-[#F8FAFC]">
      <div className="flex flex-col items-center text-center max-w-md px-6">
        <div className="text-[#6366F1] font-mono text-8xl font-bold mb-4 tracking-tighter">
          403
        </div>
        <h1 className="text-2xl font-bold mb-3">Access Denied</h1>
        <p className="mt-4 text-muted-foreground text-center">
          You don&apos;t have permission to access this page or resource. Please
          contact your system administrator if you believe this is an error.
        </p>
        <Link
          href="/dashboard"
          className="py-2.5 px-6 rounded-lg font-medium text-white bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
