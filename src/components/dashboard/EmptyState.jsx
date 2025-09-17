import React from "react";

export default function EmptyState({
  icon,
  title = "No data available",
  description = "There are no items to display at the moment.",
  action,
  actionLabel = "Add New",
  onAction,
  className = "",
}) {
  const defaultIcon = (
    <svg
      className="mx-auto h-12 w-12 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );

  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="text-gray-400 mb-4">{icon || defaultIcon}</div>

      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>

      <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>

      {action && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          {action}
          {actionLabel && <span className="ml-2">{actionLabel}</span>}
        </button>
      )}
    </div>
  );
}
