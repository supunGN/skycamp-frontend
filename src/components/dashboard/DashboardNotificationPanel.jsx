import React from "react";

export default function DashboardNotificationPanel({ notifications = [] }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-h-96 w-full min-w-[260px] overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <div className="text-gray-500 text-sm text-center py-8">
          No notifications
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {notifications.map((n, idx) => (
            <li key={idx} className="py-4 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">{n.title}</span>
                <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                  {n.timestamp}
                </span>
              </div>
              <div className="text-gray-600 text-sm">{n.description}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
