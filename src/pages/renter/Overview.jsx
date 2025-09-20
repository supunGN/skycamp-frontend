import React, { useState, useEffect } from "react";
import DashboardStatsCard from "../../components/dashboard/DashboardStatsCard";
import SectionHeader from "../../components/dashboard/SectionHeader";
import {
  BriefcaseIcon,
  CalendarDaysIcon,
  StarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { API } from "../../api";

export default function Overview() {
  const [stats, setStats] = useState({
    totalEquipment: 0,
    totalSuccessfulBookings: 0,
    totalPendingBookings: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.renterDashboard.getStats();

      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message || "Failed to fetch dashboard statistics");
      }
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError(err.message || "Failed to fetch dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Dashboard Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-5 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Dashboard Overview
        </h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="text-red-600 font-medium">
              Error loading dashboard statistics
            </div>
          </div>
          <div className="text-red-600 text-sm mt-1">{error}</div>
          <button
            onClick={fetchDashboardStats}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <SectionHeader
        title="Dashboard Overview"
        subtitle="Track your equipment rental business performance"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardStatsCard
          title="Total Equipment Listed"
          value={stats.totalEquipment}
          icon={BriefcaseIcon}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <DashboardStatsCard
          title="Successful Bookings"
          value={stats.totalSuccessfulBookings}
          icon={CalendarDaysIcon}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
        <DashboardStatsCard
          title="Pending Bookings"
          value={stats.totalPendingBookings}
          icon={ClockIcon}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <DashboardStatsCard
          title="Customer Reviews"
          value={stats.totalReviews}
          icon={StarIcon}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Activity
        </h3>
        <div className="text-gray-500 text-center py-8">
          <CalendarDaysIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Recent activity will be displayed here</p>
          <p className="text-sm mt-1">Coming soon!</p>
        </div>
      </div>
    </div>
  );
}
