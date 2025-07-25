import React from "react";

const menuItems = [
  { label: "My details", active: true },
  { label: "Password" },
  { label: "NIC" },
  { label: "My Bookings" },
  { label: "Travel Buddy" },
  { label: "Settings" },
];

export default function ProfileSidebar() {
  return (
    <aside className="w-64 h-full mr-8 p-6 h-fit">
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                className={`w-full text-left px-4 py-2 rounded-md font-medium transition-colors
                  ${
                    item.active
                      ? "bg-cyan-50 text-cyan-700 border border-cyan-600"
                      : "hover:bg-gray-100 text-gray-700"
                  }
                `}
                disabled={item.active}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
