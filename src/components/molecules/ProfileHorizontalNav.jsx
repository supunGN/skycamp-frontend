import React from "react";
import {
  UserIcon,
  LockClosedIcon,
  IdentificationIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const ProfileHorizontalNav = ({ activeTab, onTabChange }) => {
  const navItems = [
    {
      id: "details",
      label: "Personal Details",
      icon: UserIcon,
    },
    {
      id: "password",
      label: "Security",
      icon: LockClosedIcon,
    },
    {
      id: "verification",
      label: "Verification",
      icon: IdentificationIcon,
    },
    {
      id: "bookings",
      label: "My Bookings",
      icon: CalendarDaysIcon,
    },
    {
      id: "travel-buddy",
      label: "Travel Buddy",
      icon: UserGroupIcon,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Cog6ToothIcon,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
      <nav className="flex justify-center overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-3 px-6 py-4 font-medium text-sm whitespace-nowrap transition-all duration-200 border-b-2 ${
                isActive
                  ? "text-cyan-600 border-cyan-600 bg-cyan-50"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default ProfileHorizontalNav;
