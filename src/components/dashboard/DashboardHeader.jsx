import React from "react";
import { BellIcon, HomeIcon } from "@heroicons/react/24/outline";
import NotificationDropdown from "./NotificationDropdown";

function getDashboardSubtitle(user, subtitle = "") {
  // If a subtitle is already provided, use it
  if (subtitle) return subtitle;

  // Check user role and provider type
  if (user) {
    if (user.user_role === "service_provider") {
      return user.provider_type === "Equipment Renter"
        ? "Your Renter Dashboard"
        : "Your Guide Dashboard";
    } else if (user.user_role === "customer") {
      return "Your Profile Dashboard";
    }
  }

  return ""; // Default empty string if no condition matches
}

export default function DashboardHeader({
  userName,
  subtitle,
  onNotificationClick,
  onUnreadCountChange,
  unreadCount = 0,
}) {
  // Always get user name from localStorage if not provided
  let displayName = userName;
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      if (user.first_name || user.last_name) {
        displayName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
      } else if (user.name) {
        displayName = user.name;
      } else if (user.email) {
        displayName = user.email;
      }
    }
  } catch {}

  const computedSubtitle = getDashboardSubtitle(user, subtitle);

  return (
    <header className="flex items-center justify-between w-full py-6 px-4 sm:px-8 bg-white border-b border-gray-100">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Welcome{displayName ? `, ${displayName}` : ", (User)"}
        </h1>
        {computedSubtitle && (
          <div className="text-gray-500 text-sm">{computedSubtitle}</div>
        )}
      </div>
      <div className="flex items-center gap-3">
        {/* Switch to Website Button */}
        <button
          onClick={() => (window.location.href = "/")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors duration-200"
          title="Switch to Website"
        >
          <HomeIcon className="w-4 h-4" />
          Switch to Website
        </button>

        {/* Notifications Dropdown */}
        <NotificationDropdown
          onUnreadCountChange={onUnreadCountChange}
          initialUnreadCount={unreadCount}
        />
      </div>
    </header>
  );
}
