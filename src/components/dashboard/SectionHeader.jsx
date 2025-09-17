import React from "react";

export default function SectionHeader({
  title,
  subtitle,
  actions,
  className = "",
}) {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>

          {actions && (
            <div className="flex items-center space-x-3">{actions}</div>
          )}
        </div>
      </div>
    </div>
  );
}
