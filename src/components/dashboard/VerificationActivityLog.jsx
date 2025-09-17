import React from "react";
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export default function VerificationActivityLog({ activityLog }) {
  const getActionIcon = (action) => {
    switch (action) {
      case "Approved":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "Rejected":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case "Approved":
        return "bg-green-50 border-green-200";
      case "Rejected":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getActionTextColor = (action) => {
    switch (action) {
      case "Approved":
        return "text-green-800";
      case "Rejected":
        return "text-red-800";
      default:
        return "text-gray-800";
    }
  };

  if (!activityLog || activityLog.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Verification Activity Log
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Track all verification actions taken by admins
          </p>
        </div>
        <div className="px-6 py-8 text-center">
          <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No verification activity
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Verification actions will appear here once admins start reviewing
            users.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Verification Activity Log
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Track all verification actions taken by admins
        </p>
      </div>
      <div className="overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {activityLog.map((log, index) => (
            <li key={log.verification_id || index} className="px-6 py-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">{getActionIcon(log.action)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(
                          log.action
                        )} ${getActionTextColor(log.action)}`}
                      >
                        {log.action}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {log.user_first_name} {log.user_last_name}
                      </span>
                      <span className="text-sm text-gray-500">
                        (
                        {log.user_type?.charAt(0).toUpperCase() +
                          log.user_type?.slice(1)}
                        )
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(log.created_at).toLocaleDateString()} at{" "}
                      {new Date(log.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="mt-1">
                    <p className="text-sm text-gray-600">
                      <strong>Reason:</strong> {log.reason}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Admin:</strong> {log.admin_email || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
