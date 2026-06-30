import React from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#050A15] text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto bg-[#050A15] relative custom-scrollbar">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />

          <div className="p-6 md:p-8 max-w-7xl mx-auto w-full z-10 relative">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
