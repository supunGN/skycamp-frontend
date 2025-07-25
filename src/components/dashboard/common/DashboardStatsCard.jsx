import React from "react";

export default function DashboardStatsCard({
  title,
  value,
  icon: Icon,
  iconBg = "bg-cyan-100",
  iconColor = "text-cyan-600",
}) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-lg shadow-sm p-5 min-w-[180px]">
      {Icon && (
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-full ${iconBg}`}
        >
          <Icon className={`w-7 h-7 ${iconColor}`} />
        </div>
      )}
      <div>
        <div className="text-sm text-gray-500 font-medium mb-1">{title}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
    </div>
  );
}
