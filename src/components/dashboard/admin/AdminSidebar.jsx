import React, { useState } from "react";
import {
  Bars3Icon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import Modal from "../../molecules/Modal";
import { API } from "../../../api";

export default function AdminSidebar({
  menuItems,
  activeMenu,
  onMenuSelect,
  onLogout,
}) {
  const [open, setOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    users: true,
    content: false,
    operations: false,
  });

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
            window.location.replace("/admin/login");
          }
        }}
        title="Log out"
        message="Are you sure you want to log out?"
      />

      {/* Mobile Hamburger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded shadow"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open sidebar"
      >
        <Bars3Icon className="w-6 h-6 text-slate-700" />
      </button>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-gray-50 border-r border-gray-200 flex flex-col z-50 transition-transform duration-200 overflow-hidden
          ${
            open ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:relative lg:block`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="px-6 py-6">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="SkyCamp" className="h-8" />
              <span className="text-lg font-semibold text-gray-800">Admin</span>
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
                  setOpen(false);
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
                            setOpen(false);
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
                          <span className="text-base">{item.name}</span>
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
