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
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-base text-gray-600 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex items-center space-x-4">{actions}</div>
          )}
        </div>
      </div>
    </div>
  );
}
