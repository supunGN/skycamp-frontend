import React from "react";
import {
  ClockIcon,
  UserIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  ArrowPathIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function AdminActivityLog({ activityLog }) {
  // Get action icon and color
  const getActionIcon = (action) => {
    switch (action.toLowerCase()) {
      case "suspend":
        return {
          icon: ExclamationTriangleIcon,
          color: "text-orange-600",
          bgColor: "bg-orange-100",
        };
      case "activate":
        return {
          icon: ArrowPathIcon,
          color: "text-green-600",
          bgColor: "bg-green-100",
        };
      case "delete":
        return {
          icon: TrashIcon,
          color: "text-red-600",
          bgColor: "bg-red-100",
        };
      case "verify":
        return {
          icon: CheckCircleIcon,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        };
      default:
        return {
          icon: UserIcon,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
        };
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
    };
  };

  if (activityLog.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Admin Activity Log
        </h2>
        <div className="text-center py-12">
          <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No activity recorded
          </h3>
          <p className="text-gray-500">
            Admin actions will be logged here for auditing purposes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Admin Activity Log
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Track all administrative actions for auditing purposes
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activityLog.map((log) => {
              const actionIcon = getActionIcon(log.action);
              const timestamp = formatTimestamp(log.timestamp);

              return (
                <tr key={log.id} className="hover:bg-gray-50">
                  {/* Action */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 h-8 w-8 rounded-full ${actionIcon.bgColor} flex items-center justify-center`}
                      >
                        <actionIcon.icon
                          className={`h-4 w-4 ${actionIcon.color}`}
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {log.action}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Target User */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {log.targetUser}
                    </div>
                  </td>

                  {/* Admin */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {log.adminEmail}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>{timestamp.date}</div>
                      <div className="text-gray-500">{timestamp.time}</div>
                    </div>
                  </td>

                  {/* Details */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {log.details || "No additional details"}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination could be added here if needed */}
      {activityLog.length > 10 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {activityLog.length} of {activityLog.length} activities
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                Previous
              </button>
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
