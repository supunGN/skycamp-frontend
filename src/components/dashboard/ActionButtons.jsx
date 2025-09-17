import React from "react";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";

export default function ActionButtons({
  actions = [],
  onAction,
  loading = false,
  size = "sm",
  className = "",
}) {
  const getActionIcon = (action) => {
    const iconMap = {
      edit: PencilIcon,
      delete: TrashIcon,
      view: EyeIcon,
      approve: CheckIcon,
      reject: XMarkIcon,
      suspend: ExclamationTriangleIcon,
      activate: ArrowPathIcon,
      duplicate: DocumentDuplicateIcon,
      share: ShareIcon,
    };

    return iconMap[action] || PencilIcon;
  };

  const getActionColor = (action) => {
    const colorMap = {
      edit: "text-blue-600 hover:text-blue-800 hover:bg-blue-50",
      delete: "text-red-600 hover:text-red-800 hover:bg-red-50",
      view: "text-gray-600 hover:text-gray-800 hover:bg-gray-50",
      approve: "text-green-600 hover:text-green-800 hover:bg-green-50",
      reject: "text-red-600 hover:text-red-800 hover:bg-red-50",
      suspend: "text-orange-600 hover:text-orange-800 hover:bg-orange-50",
      activate: "text-green-600 hover:text-green-800 hover:bg-green-50",
      duplicate: "text-purple-600 hover:text-purple-800 hover:bg-purple-50",
      share: "text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50",
    };

    return (
      colorMap[action] || "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
    );
  };

  const getActionLabel = (action) => {
    const labelMap = {
      edit: "Edit",
      delete: "Delete",
      view: "View",
      approve: "Approve",
      reject: "Reject",
      suspend: "Suspend",
      activate: "Activate",
      duplicate: "Duplicate",
      share: "Share",
    };

    return labelMap[action] || action;
  };

  const sizeClasses = {
    xs: "p-1",
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5",
  };

  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  if (actions.length === 0) return null;

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {actions.map((action, index) => {
        const Icon = getActionIcon(action);
        const colorClass = getActionColor(action);
        const label = getActionLabel(action);

        return (
          <button
            key={`${action}-${index}`}
            onClick={() => onAction && onAction(action)}
            disabled={loading}
            className={`${
              sizeClasses[size]
            } rounded-md transition-colors ${colorClass} ${
              loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            title={label}
          >
            <Icon className={iconSizes[size]} />
          </button>
        );
      })}
    </div>
  );
}
