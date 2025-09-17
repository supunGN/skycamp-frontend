import React from "react";
import {
  ExclamationTriangleIcon,
  TrashIcon,
  ArrowPathIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function ActionModal({
  isOpen,
  onClose,
  onConfirm,
  action,
  user,
  userType,
  loading = false,
}) {
  if (!isOpen) return null;

  // Get action details
  const getActionDetails = (action) => {
    switch (action) {
      case "suspend":
        return {
          icon: ExclamationTriangleIcon,
          title: "Suspend User",
          message: `Are you sure you want to suspend ${user?.first_name} ${user?.last_name}?`,
          details:
            "This user will be moved to the suspended users list and will not be able to access their account.",
          confirmText: "Suspend User",
          confirmColor: "bg-orange-600 hover:bg-orange-700",
        };
      case "activate":
        return {
          icon: ArrowPathIcon,
          title: "Activate User",
          message: `Are you sure you want to activate ${user?.first_name} ${user?.last_name}?`,
          details:
            "This user will be moved back to their active users list and will be able to access their account.",
          confirmText: "Activate User",
          confirmColor: "bg-green-600 hover:bg-green-700",
        };
      case "delete":
        return {
          icon: TrashIcon,
          title: "Delete User",
          message: `Are you sure you want to permanently delete ${user?.first_name} ${user?.last_name}?`,
          details:
            "This action cannot be undone. The user will be permanently removed from the system.",
          confirmText: "Delete User",
          confirmColor: "bg-red-600 hover:bg-red-700",
        };
      case "verify":
        return {
          icon: CheckCircleIcon,
          title: "Verify User",
          message: `Are you sure you want to verify ${user?.first_name} ${user?.last_name}?`,
          details:
            "This user will be marked as verified and will have access to verified features.",
          confirmText: "Verify User",
          confirmColor: "bg-blue-600 hover:bg-blue-700",
        };
      default:
        return {
          icon: ExclamationTriangleIcon,
          title: "Confirm Action",
          message: "Are you sure you want to perform this action?",
          details: "Please review your action before confirming.",
          confirmText: "Confirm",
          confirmColor: "bg-gray-600 hover:bg-gray-700",
        };
    }
  };

  const actionDetails = getActionDetails(action);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <actionDetails.icon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">
                {actionDetails.title}
              </h3>
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {user.first_name?.charAt(0)}
                    {user.last_name?.charAt(0)}
                  </span>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">
                    {user.first_name} {user.last_name}
                  </div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  <div className="text-xs text-gray-400">
                    {userType.charAt(0).toUpperCase() + userType.slice(1)} • ID:{" "}
                    {user.user_id || user.id}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Message */}
          <p className="text-sm text-gray-600 mb-2">{actionDetails.message}</p>
          <p className="text-sm text-gray-500 mb-6">{actionDetails.details}</p>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${actionDetails.confirmColor}`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                actionDetails.confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
