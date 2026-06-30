import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#050A15] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations for premium feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-500">
        {/* Logo area */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 mb-4 ring-1 ring-white/10">
            {/* SVG Logo Placeholder */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            EMA-BDMS
          </h1>
          <p className="text-sm font-medium text-blue-400 mt-1 uppercase tracking-widest">
            Enterprise Edition
          </p>
        </div>

        <Card className="bg-[#0A0F1E]/80 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden rounded-2xl">
          <CardHeader className="space-y-1 pb-6 border-b border-white/5 bg-white/[0.02]">
            <CardTitle className="text-2xl font-bold text-center text-white">
              {title}
            </CardTitle>
            {subtitle && (
              <CardDescription className="text-center text-gray-400">
                {subtitle}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="pt-6">{children}</CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} EMA Systems. All rights reserved.
        </div>
      </div>
    </div>
  );
}
