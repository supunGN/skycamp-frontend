import React from "react";

export default function LoadingState({
  message = "Loading...",
  size = "md",
  showMessage = true,
  className = "",
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <div className={`flex justify-center items-center py-12 ${className}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full border-b-2 border-blue-600 mx-auto mb-4"></div>
        {showMessage && (
          <p className={`text-gray-600 ${textSizes[size]}`}>{message}</p>
        )}
      </div>
    </div>
  );
}
