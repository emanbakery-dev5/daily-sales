"use client";

import React from "react";
import Link from "next/link";
import {
  Truck,
  CreditCard,
  UserPlus,
  PackagePlus,
  FileText,
} from "lucide-react";

const actions = [
  {
    name: "New Dispatch",
    href: "/dispatch/new",
    icon: Truck,
    color: "text-blue-400",
    hoverBg: "hover:bg-blue-500/10",
  },
  {
    name: "Record Payment",
    href: "/payments/new",
    icon: CreditCard,
    color: "text-emerald-400",
    hoverBg: "hover:bg-emerald-500/10",
  },
  {
    name: "Add Salesperson",
    href: "/salespersons/new",
    icon: UserPlus,
    color: "text-purple-400",
    hoverBg: "hover:bg-purple-500/10",
  },
  {
    name: "Add Product",
    href: "/products/new",
    icon: PackagePlus,
    color: "text-amber-400",
    hoverBg: "hover:bg-amber-500/10",
  },
  {
    name: "View Reports",
    href: "/reports",
    icon: FileText,
    color: "text-indigo-400",
    hoverBg: "hover:bg-indigo-500/10",
  },
];

export function QuickActions() {
  return (
    <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-6 h-full">
      <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
      <div className="flex flex-col gap-3">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className={`flex items-center gap-4 p-3 rounded-xl border border-white/5 bg-white/5 transition-all duration-200 group ${action.hoverBg} hover:border-white/10`}
          >
            <div
              className={`p-2 rounded-lg bg-[#0A0F1E] ${action.color} group-hover:scale-110 transition-transform duration-200`}
            >
              <action.icon size={20} />
            </div>
            <span className="font-medium text-gray-200 group-hover:text-white">
              {action.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
