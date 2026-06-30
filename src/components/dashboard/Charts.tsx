"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// Mock Data for Charts
// ---------------------------------------------------------------------------
const dispatchData = [
  { date: "Mon", value: 45 },
  { date: "Tue", value: 52 },
  { date: "Wed", value: 38 },
  { date: "Thu", value: 65 },
  { date: "Fri", value: 48 },
  { date: "Sat", value: 30 },
  { date: "Sun", value: 42 },
];

const revenueData = [
  { name: "Week 1", value: 4000 },
  { name: "Week 2", value: 3000 },
  { name: "Week 3", value: 2000 },
  { name: "Week 4", value: 2780 },
];

const paymentData = [
  { date: "1st", value: 1200 },
  { date: "5th", value: 2100 },
  { date: "10th", value: 800 },
  { date: "15th", value: 1600 },
  { date: "20th", value: 900 },
  { date: "25th", value: 1700 },
  { date: "30th", value: 2400 },
];

// ---------------------------------------------------------------------------
// Shared Chart Container styling
// ---------------------------------------------------------------------------
function ChartContainer({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-[#0F172A] border border-white/5 rounded-2xl p-6",
        className,
      )}
    >
      <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>
      <div className="h-[300px] w-full">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Individual Charts
// ---------------------------------------------------------------------------

export function DispatchTrendChart() {
  return (
    <ChartContainer title="Daily Dispatch Trend">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={dispatchData}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#ffffff10"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dx={-10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
            }}
            itemStyle={{ color: "#fff" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#60a5fa" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export function RevenueTrendChart() {
  return (
    <ChartContainer title="Revenue Trend">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={revenueData}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#ffffff10"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dx={-10}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
            }}
            itemStyle={{ color: "#fff" }}
          />
          <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export function PaymentCollectionChart() {
  return (
    <ChartContainer title="Payment Collection Trend" className="md:col-span-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={paymentData}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#ffffff10"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dx={-10}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
            }}
            itemStyle={{ color: "#fff" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#10b981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
