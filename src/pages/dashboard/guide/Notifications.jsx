import React from "react";
import DashboardNotificationPanel from "../../../components/dashboard/DashboardNotificationPanel";

const mockNotifications = [
  {
    id: 1,
    title: "New Booking",
    description: "John Doe booked a trip for July 20.",
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
    title: "System Update",
    description: "New policy for guide cancellations.",
    timestamp: "3 days ago",
  },
  {
    id: 4,
    title: "Reminder",
    description: "Upcoming trip with Alex Lee.",
    timestamp: "1 hour ago",
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
