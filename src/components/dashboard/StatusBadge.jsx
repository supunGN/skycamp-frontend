import React from "react";

export default function StatusBadge({
  status,
  variant = "default",
  size = "sm",
  className = "",
}) {
  const getStatusConfig = (status, variant) => {
    const configs = {
      // User Status
      active: {
        bg: "bg-green-100",
        text: "text-green-800",
        dot: "bg-green-400",
        label: "Active",
      },
      inactive: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        dot: "bg-gray-400",
        label: "Inactive",
      },
      suspended: {
        bg: "bg-orange-100",
        text: "text-orange-800",
        dot: "bg-orange-400",
        label: "Suspended",
      },
      deleted: {
        bg: "bg-red-100",
        text: "text-red-800",
        dot: "bg-red-400",
        label: "Deleted",
      },

      // Verification Status
      verified: {
        bg: "bg-green-100",
        text: "text-green-800",
        dot: "bg-green-400",
        label: "Verified",
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        dot: "bg-yellow-400",
        label: "Pending",
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-800",
        dot: "bg-red-400",
        label: "Rejected",
      },

      // Booking Status
      confirmed: {
        bg: "bg-green-100",
        text: "text-green-800",
        dot: "bg-green-400",
        label: "Confirmed",
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-800",
        dot: "bg-red-400",
        label: "Cancelled",
      },
      completed: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        dot: "bg-blue-400",
        label: "Completed",
      },

      // Equipment Status
      available: {
        bg: "bg-green-100",
        text: "text-green-800",
        dot: "bg-green-400",
        label: "Available",
      },
      rented: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        dot: "bg-blue-400",
        label: "Rented",
      },
      maintenance: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        dot: "bg-yellow-400",
        label: "Maintenance",
      },

      // Content Status
      published: {
        bg: "bg-green-100",
        text: "text-green-800",
        dot: "bg-green-400",
        label: "Published",
      },
      draft: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        dot: "bg-gray-400",
        label: "Draft",
      },
      archived: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        dot: "bg-gray-400",
        label: "Archived",
      },
    };

    return (
      configs[status] || {
        bg: "bg-gray-100",
        text: "text-gray-800",
        dot: "bg-gray-400",
        label: status || "Unknown",
      }
    );
  };

  const config = getStatusConfig(status, variant);

  const sizeClasses = {
    xs: "px-2 py-1 text-xs",
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const dotSizes = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
  };

  return (
    <span
      className={`inline-flex items-center ${sizeClasses[size]} rounded-full font-medium ${config.bg} ${config.text} ${className}`}
    >
      <span
        className={`${config.dot} ${dotSizes[size]} rounded-full mr-1.5`}
      ></span>
      {config.label}
    </span>
  );
}
