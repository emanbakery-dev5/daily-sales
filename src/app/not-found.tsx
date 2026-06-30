"use client";

import React from "react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0A0F1E] text-[#F8FAFC]">
      <div className="flex flex-col items-center text-center max-w-md px-6">
        <div className="text-[#6366F1] font-mono text-8xl font-bold mb-4 tracking-tighter">
          404
        </div>
        <h1 className="text-2xl font-bold mb-3">Page Not Found</h1>
        <p className="text-slate-400 mb-8">
          The page you are looking for doesn&apos;t exist, has been removed, or
          is temporarily unavailable.
        </p>
        <Link
          href="/dashboard"
          className="py-2.5 px-6 rounded-lg font-medium text-white bg-gradient-to-r from-[#6366F1] to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 transition-colors shadow-lg shadow-[#6366F1]/20"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
