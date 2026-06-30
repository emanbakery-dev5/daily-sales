import React from "react";
import { Clock, Truck, CreditCard, UserPlus, FileEdit } from "lucide-react";

const mockActivities = [
  {
    id: 1,
    type: "dispatch",
    description: "Dispatch #DSP-1029 created for Downtown Bakery",
    user: "Ahmed O.",
    timestamp: "10 mins ago",
    icon: Truck,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    id: 2,
    type: "payment",
    description: "Payment of $1,250 received from Corner Store",
    user: "Fatima S.",
    timestamp: "45 mins ago",
    icon: CreditCard,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    id: 3,
    type: "user",
    description: "New salesperson profile created: Khalid M.",
    user: "System Admin",
    timestamp: "2 hours ago",
    icon: UserPlus,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    id: 4,
    type: "product",
    description: 'Price version v1.4 activated for "Whole Wheat Bread"',
    user: "Pricing Manager",
    timestamp: "Yesterday at 4:30 PM",
    icon: FileEdit,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
];

export function RecentActivity() {
  return (
    <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <button className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-6">
        {mockActivities.map((activity, index) => (
          <div key={activity.id} className="relative flex gap-4">
            {/* Connecting line for timeline effect */}
            {index !== mockActivities.length - 1 && (
              <div className="absolute left-5 top-10 bottom-[-24px] w-px bg-white/5" />
            )}

            <div
              className={`relative z-10 shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${activity.bg} ${activity.color} ring-4 ring-[#0F172A]`}
            >
              <activity.icon size={18} />
            </div>

            <div className="flex-1 pb-1">
              <p className="text-sm text-gray-200 font-medium mb-1 leading-snug">
                {activity.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center text-[8px] text-white">
                    {activity.user.charAt(0)}
                  </span>
                  {activity.user}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {activity.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
