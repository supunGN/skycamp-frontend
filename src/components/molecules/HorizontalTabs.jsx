import React from "react";

// Tab data can be passed as props in the future for reusability
const TABS = [
  { label: "Camping Destinations", count: 5 },
  { label: "Stargazing Spots", count: 5 },
  { label: "Guides", count: 6 },
  { label: "Renters", count: 7 },
];

const HorizontalTabs = ({ activeTab, setActiveTab }) => {
  // If not controlled, fallback to internal state (for backward compatibility)
  const [internalTab, setInternalTab] = React.useState(0);
  const isControlled = typeof activeTab === "number" && typeof setActiveTab === "function";
  const currentTab = isControlled ? activeTab : internalTab;
  const handleTabClick = (idx) => {
    if (isControlled) {
      setActiveTab(idx);
    } else {
      setInternalTab(idx);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-sm w-full">
      {TABS.map((tab, idx) => (
        <button
          key={tab.label}
          onClick={() => handleTabClick(idx)}
          className={`flex items-center px-4 py-2 rounded-xl border transition-colors font-medium text-base
            ${
              currentTab === idx
                ? "bg-cyan-50 text-cyan-700 border-cyan-500 shadow"
                : "bg-white text-gray-500 border-transparent hover:bg-gray-100"
            }
          `}
        >
          <span>{tab.label}</span>
          <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full border ${currentTab === idx ? "bg-white text-cyan-700 border-cyan-300" : "bg-gray-100 text-gray-500 border-gray-200"}`}>{tab.count}</span>
        </button>
      ))}
    </div>
  );
};

export default HorizontalTabs; 