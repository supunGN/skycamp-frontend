import React, { useState } from "react";
import {
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import Modal from "../molecules/Modal";
import { API } from "../../api";
import { usePendingVerificationCount } from "../../hooks/usePendingVerificationCount";

export default function AdminSidebar({
  menuItems,
  activeMenu,
  onMenuSelect,
  onLogout,
  refreshKey,
}) {
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    users: true,
    content: false,
    operations: false,
  });

  // Get pending verification count
  const { count: pendingCount } = usePendingVerificationCount(refreshKey);

  // Get admin info from localStorage
  let adminEmail = "admin@skycamp.com";
  try {
    const admin = JSON.parse(localStorage.getItem("admin"));
    if (admin && admin.email) {
      adminEmail = admin.email;
    }
  } catch {}

  // Organize menu items into sections
  const menuSections = {
    users: {
      title: "User Management",
      items: menuItems.filter((item) =>
        ["User Management", "User Verification", "Admin Management"].includes(
          item.name
        )
      ),
    },
    content: {
      title: "Content & Locations",
      items: menuItems.filter((item) =>
        [
          "Content Management",
          "Location Management",
          "Feedback Management",
        ].includes(item.name)
      ),
    },
    operations: {
      title: "Operations",
      items: menuItems.filter((item) =>
        [
          "Booking Overview",
          "Equipment Management",
          "Notification Management",
          "Contact Messages",
          "Travel Buddy Management",
        ].includes(item.name)
      ),
    },
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <>
      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={async () => {
          setLogoutModalOpen(false);

          try {
            // Call admin logout API
            await API.admin.logout();
          } catch (error) {
            console.error("Admin logout error:", error);
          } finally {
            // Clear admin session regardless of API call result
            localStorage.removeItem("admin");
            if (onLogout) onLogout();
            // Force a full reload to clear any in-memory app state
            window.location.replace("/login");
          }
        }}
        title="Log out"
        message="Are you sure you want to log out?"
      />

      {/* Sidebar */}
      <aside className="flex flex-col h-full w-full bg-gray-50 border-r border-gray-200 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="px-6 py-6">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="SkyCamp" className="h-8" />
            </div>
          </div>

          {/* Menu Section */}
          <div className="flex-1 px-6 overflow-y-auto">
            {/* Home Button */}
            <nav className="space-y-1 mb-6">
              <button
                className={`flex items-center w-full px-4 py-3 rounded-lg text-left font-medium transition-colors group
                  ${
                    activeMenu === "Home"
                      ? "bg-white text-slate-800 shadow-sm border border-gray-200"
                      : "hover:bg-white hover:shadow-sm text-gray-600 hover:text-slate-800"
                  }`}
                onClick={() => {
                  onMenuSelect && onMenuSelect("Home");
                }}
              >
                <HomeIcon
                  className={`w-5 h-5 mr-4 ${
                    activeMenu === "Home"
                      ? "text-slate-700"
                      : "text-gray-500 group-hover:text-slate-600"
                  }`}
                />
                <span className="text-base">Home</span>
              </button>
            </nav>

            {/* Collapsible Sections */}
            <div className="space-y-4">
              {Object.entries(menuSections).map(([sectionKey, section]) => (
                <div key={sectionKey}>
                  {/* Section Header */}
                  <button
                    className="flex items-center w-full px-2 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
                    onClick={() => toggleSection(sectionKey)}
                  >
                    {expandedSections[sectionKey] ? (
                      <ChevronDownIcon className="w-4 h-4 mr-2" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4 mr-2" />
                    )}
                    {section.title}
                  </button>

                  {/* Section Items */}
                  {expandedSections[sectionKey] && (
                    <nav className="space-y-1 ml-4">
                      {section.items.map((item) => (
                        <button
                          key={item.name}
                          className={`flex items-center w-full px-4 py-3 rounded-lg text-left font-medium transition-colors group
                            ${
                              activeMenu === item.name
                                ? "bg-white text-slate-800 shadow-sm border border-gray-200"
                                : "hover:bg-white hover:shadow-sm text-gray-600 hover:text-slate-800"
                            }`}
                          onClick={() => {
                            onMenuSelect && onMenuSelect(item.name);
                          }}
                        >
                          {item.icon && (
                            <item.icon
                              className={`w-5 h-5 mr-4 ${
                                activeMenu === item.name
                                  ? "text-slate-700"
                                  : "text-gray-500 group-hover:text-slate-600"
                              }`}
                            />
                          )}
                          <span className="text-base flex-1">{item.name}</span>
                          {item.name === "User Verification" &&
                            pendingCount > 0 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                                {pendingCount}
                              </span>
                            )}
                        </button>
                      ))}
                    </nav>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex-shrink-0 px-6 py-6 border-t border-gray-200 bg-white">
            {/* Admin Profile */}
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-800 text-sm truncate">
                  Admin User
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {adminEmail}
                </div>
              </div>
              <button
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                onClick={() => setLogoutModalOpen(true)}
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
