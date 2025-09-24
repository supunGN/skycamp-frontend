import React, { useState, useEffect } from "react";
import DashboardStatsCard from "../../components/dashboard/DashboardStatsCard";
import {
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { API } from "../../api";

export default function Overview() {
  const [stats, setStats] = useState({
    finishedTrips: 0,
    pendingBookings: 0,
    receivedReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await API.guideDashboard.getStats();
        if (response.success) {
          setStats(response.data);
        } else {
          setError("Failed to fetch dashboard statistics");
        }
      } catch (err) {
        console.error("Error fetching guide dashboard stats:", err);
        setError(err.message || "Failed to fetch dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Dashboard Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardStatsCard
          title="Finished Trips"
          value={stats.finishedTrips}
          icon={CheckCircleIcon}
        />
        <DashboardStatsCard
          title="Pending Bookings"
          value={stats.pendingBookings}
          icon={ClockIcon}
        />
        <DashboardStatsCard
          title="Received Reviews"
          value={stats.receivedReviews}
          icon={StarIcon}
        />
      </div>
      <div className="bg-white p-4 rounded shadow-sm">
        Recent Activity (Coming Soon)
      </div>
    </div>
  );
}
