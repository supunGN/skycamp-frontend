import React from "react";
import DashboardStatsCard from "../../../components/dashboard/common/DashboardStatsCard";
import {
  BriefcaseIcon,
  CalendarDaysIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

export default function Overview() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardStatsCard
          title="Total Rentals"
          value={10}
          icon={BriefcaseIcon}
        />
        <DashboardStatsCard
          title="Upcoming Bookings"
          value={7}
          icon={CalendarDaysIcon}
        />
        <DashboardStatsCard
          title="Customer Reviews"
          value={15}
          icon={StarIcon}
        />
      </div>
      <div className="bg-white p-4 rounded shadow-sm">
        Recent Activity (Coming Soon)
      </div>
    </div>
  );
}
