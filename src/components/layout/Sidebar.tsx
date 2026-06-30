"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  Tags,
  DollarSign,
  Truck,
  BookOpen,
  CreditCard,
  BarChart3,
  Settings,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NAVIGATION_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Salespersons", href: "/salespersons", icon: Users },
  { name: "Products", href: "/products", icon: Package },
  { name: "Categories", href: "/categories", icon: Tags },
  { name: "Pricing", href: "/pricing", icon: DollarSign },
  { name: "Dispatch", href: "/dispatch", icon: Truck },
  { name: "Ledger", href: "/ledger", icon: BookOpen },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Administration", href: "/admin", icon: ShieldAlert },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "bg-[#0A0F1E] border-r border-white/10 h-screen sticky top-0 flex flex-col transition-all duration-200 ease-in-out shrink-0",
        isCollapsed ? "w-[80px]" : "w-[260px]",
      )}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
        {!isCollapsed && (
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent truncate">
            EMA Bakery
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
            isCollapsed && "mx-auto",
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-gray-400 hover:text-gray-100 hover:bg-white/5",
              )}
              title={isCollapsed ? item.name : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" />
              )}

              <Icon
                size={20}
                className={cn(
                  "shrink-0",
                  isActive ? "text-blue-400" : "group-hover:text-gray-300",
                )}
              />

              {!isCollapsed && (
                <span className="font-medium text-sm truncate">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
