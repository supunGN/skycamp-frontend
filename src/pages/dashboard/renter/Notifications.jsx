import React from "react";
import DashboardNotificationPanel from "../../../components/dashboard/common/DashboardNotificationPanel";

const mockNotifications = [
  {
    id: 1,
    title: "New Booking",
    description: "John Doe booked your tent rental.",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    title: "Review Received",
    description: "Jane left you a 5-star review.",
    timestamp: "Yesterday",
  },
  {
    id: 3,
    title: "Booking Cancelled",
    description: "Mark cancelled his stove rental.",
    timestamp: "2 days ago",
  },
];

export default function Notifications() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Notifications
      </h2>
      <DashboardNotificationPanel notifications={mockNotifications} />
    </div>
  );
}
