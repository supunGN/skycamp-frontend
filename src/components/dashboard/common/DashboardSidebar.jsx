import React, { useState } from "react";
import {
  HomeIcon,
  BookOpenIcon,
  MapPinIcon,
  ShoppingCartIcon,
  BellIcon,
  CogIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import Modal from "../../molecules/Modal";
import { useNavigate } from "react-router-dom";
import { API } from "../../../api";

export default function DashboardSidebar({
  user: _user, // ignore this prop for user info card
  menuItems,
  activeMenu,
  onMenuSelect,
  onLogout,
}) {
  const [open, setOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  // Get user info from localStorage
  let userName = "First name Last name";
  let userEmail = "email@email.com";
  let avatarUrl = null;
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      if (user.first_name || user.last_name) {
        userName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
      } else if (user.name) {
        userName = user.name;
      } else if (user.email) {
        userName = user.email;
      }
      if (user.email) userEmail = user.email;
      if (user.avatarUrl) avatarUrl = user.avatarUrl;
    }
  } catch {}

  // Default menu items if not provided
  const defaultMenuItems = [
    { name: "Overview", icon: HomeIcon },
    { name: "My Services", icon: BookOpenIcon },
    { name: "Location & Coverage", icon: MapPinIcon },
    { name: "Bookings", icon: ShoppingCartIcon },
    { name: "Notifications", icon: BellIcon },
  ];

  const items = menuItems || defaultMenuItems;

  return (
    <>
      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={async () => {
          setLogoutModalOpen(false);

          try {
            // Call logout API
            await API.auth.logout();
          } catch (error) {
            console.error("Logout error:", error);
          } finally {
            // Clear user session regardless of API call result
            localStorage.removeItem("user");
            if (onLogout) onLogout();
            // Force a full reload to clear any in-memory app state
            window.location.replace("/login");
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
            </div>
          </div>

          {/* Menu Section */}
          <div className="flex-1 px-6">
            {/* Section Label */}
            <div className="text-xs font-semibold text-gray-500 uppercase mb-4 tracking-wider">
              GENERAL
            </div>

            {/* Menu Items */}
            <nav className="space-y-1">
              {items.map((item) => (
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
          </div>

          {/* Bottom Section */}
          <div className="flex-shrink-0 px-6 py-6 border-t border-gray-200 bg-white">
            {/* Settings Button */}
            <button
              className="flex items-center w-full px-4 py-3 rounded-lg text-left font-medium transition-colors group hover:bg-gray-50 text-gray-600 hover:text-slate-800 mb-4"
              onClick={() => {
                onMenuSelect && onMenuSelect("Settings");
                setOpen(false);
              }}
            >
              <CogIcon className="w-5 h-5 mr-4 text-gray-500 group-hover:text-slate-600" />
              <span className="text-base">Settings</span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="w-8 h-8 text-gray-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-800 text-sm truncate">
                  {userName}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {userEmail}
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
