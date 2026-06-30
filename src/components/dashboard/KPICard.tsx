import React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  onClick?: () => void;
}

export function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  onClick,
}: KPICardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-[#0F172A] border border-white/5 p-5 transition-all duration-300",
        onClick &&
          "cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 hover:border-white/10",
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {value}
          </h3>
        </div>
        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
          <Icon size={24} />
        </div>
      </div>

      {trend && trendValue && (
        <div className="mt-4 flex items-center gap-1.5 text-sm">
          <div
            className={cn(
              "flex items-center gap-0.5 font-medium",
              trend === "up" && "text-emerald-400",
              trend === "down" && "text-rose-400",
              trend === "neutral" && "text-gray-400",
            )}
          >
            {trend === "up" && <ArrowUpRight size={16} />}
            {trend === "down" && <ArrowDownRight size={16} />}
            {trend === "neutral" && <Minus size={16} />}
            <span>{trendValue}</span>
          </div>
          <span className="text-gray-500 text-xs">vs last period</span>
        </div>
      )}

      {/* Subtle bottom gradient glow on hover */}
      <div className="absolute -bottom-px inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}
