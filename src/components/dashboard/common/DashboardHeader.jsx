import React from "react";
import { BellIcon } from "@heroicons/react/24/outline";

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
      <button
        className="relative p-2 rounded-full hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        onClick={onNotificationClick}
        aria-label="Notifications"
      >
        <BellIcon className="w-6 h-6 text-cyan-700" />
        {/* Optionally add a notification dot */}
        {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
      </button>
    </header>
  );
}
