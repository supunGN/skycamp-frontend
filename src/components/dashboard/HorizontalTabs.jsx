import React from "react";

export default function HorizontalTabs({
  tabs = [],
  activeTab,
  onTabChange,
  className = "",
}) {
  return (
    <div className={`mb-6 ${className}`}>
      {/* Professional Horizontal Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`group relative flex items-center py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? `${tab.color} border-current`
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Icon */}
                {Icon && (
                  <Icon
                    className={`w-5 h-5 mr-3 transition-colors ${
                      isActive
                        ? tab.color
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                )}

                {/* Label */}
                <span className="mr-3 font-medium">{tab.label}</span>

                {/* Count Badge */}
                {tab.count !== undefined && (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      isActive
                        ? `${tab.activeBg} ${tab.activeText}`
                        : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}

                {/* Active indicator */}
                {isActive && (
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${tab.bgColor} rounded-full`}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
