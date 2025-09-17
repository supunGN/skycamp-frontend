import React, { useState, useEffect } from "react";
import { API } from "../../api";
import AdminSidebar from "../../components/dashboard/AdminSidebar";
import DashboardStatsCard from "../../components/dashboard/DashboardStatsCard";
import UserManagement from "./UserManagement";
import UserVerification from "./UserVerification";
import {
  HomeIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  CubeIcon,
  BellIcon,
  EnvelopeIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("Home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check admin authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await API.admin.me();
        if (result.success && result.authenticated) {
          setIsAuthenticated(true);
        } else {
          // Redirect to login if not authenticated
          window.location.replace("/admin/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        window.location.replace("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Admin menu items based on wireframe
  const adminMenuItems = [
    { name: "Home", icon: HomeIcon },
    { name: "User Management", icon: UserGroupIcon },
    { name: "User Verification", icon: CheckBadgeIcon },
    { name: "Admin Management", icon: ShieldCheckIcon },
    { name: "Content Management", icon: DocumentTextIcon },
    { name: "Booking Overview", icon: CalendarDaysIcon },
    { name: "Location Management", icon: MapPinIcon },
    { name: "Feedback Management", icon: ChatBubbleLeftRightIcon },
    { name: "Equipment Management", icon: CubeIcon },
    { name: "Notification Management", icon: BellIcon },
    { name: "Contact Messages", icon: EnvelopeIcon },
    { name: "Travel Buddy Management", icon: UsersIcon },
  ];

  // Admin stats data based on wireframe
  const adminStats = [
    // Row 1: Customer Status
    {
      title: "Active Customers",
      value: "1,234",
      icon: UserGroupIcon,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Inactive Customers",
      value: "89",
      icon: UserGroupIcon,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
    },
    {
      title: "Suspended Customers",
      value: "12",
      icon: UserGroupIcon,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },

    // Row 2: Renter Status
    {
      title: "Active Renters",
      value: "456",
      icon: CubeIcon,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Inactive Renters",
      value: "34",
      icon: CubeIcon,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
    },
    {
      title: "Suspended Renters",
      value: "5",
      icon: CubeIcon,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },

    // Row 3: Guide Status
    {
      title: "Active Guides",
      value: "234",
      icon: CheckBadgeIcon,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Inactive Guides",
      value: "18",
      icon: CheckBadgeIcon,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
    },
    {
      title: "Suspended Guides",
      value: "3",
      icon: CheckBadgeIcon,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },

    // Row 4: Destination/Review Metrics
    {
      title: "Camping Destinations",
      value: "45",
      icon: MapPinIcon,
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
    {
      title: "Stargazing Spots",
      value: "23",
      icon: MapPinIcon,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      title: "Total Reviews",
      value: "2,847",
      icon: ChatBubbleLeftRightIcon,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },

    // Row 5: Booking/Item Metrics
    {
      title: "Total Bookings",
      value: "3,456",
      icon: CalendarDaysIcon,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Canceled Bookings",
      value: "123",
      icon: CalendarDaysIcon,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Total Items",
      value: "1,789",
      icon: CubeIcon,
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
    },
  ];

  const handleLogout = async () => {
    await API.admin.logout();
    localStorage.removeItem("admin");
    window.location.replace("/admin/login");
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Admin Sidebar - Fixed */}
      <div className="fixed top-0 left-0 h-screen w-72 bg-gray-50 border-r border-gray-200 z-40">
        <AdminSidebar
          menuItems={adminMenuItems}
          activeMenu={activeMenu}
          onMenuSelect={setActiveMenu}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 ml-72 min-h-screen">
        <div className="p-6">
          {/* Header - Only show on Home page */}
          {activeMenu === "Home" && (
            <div className="mb-8 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  Welcome back! Here's what's happening with SkyCamp.
                </p>
              </div>
              <button
                onClick={() => (window.location.href = "/")}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Switch to Website
              </button>
            </div>
          )}

          {/* Content based on active menu */}
          {activeMenu === "Home" ? (
            /* Stats Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminStats.map((stat, index) => (
                <DashboardStatsCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  iconBg={stat.iconBg}
                  iconColor={stat.iconColor}
                />
              ))}
            </div>
          ) : activeMenu === "User Management" ? (
            /* User Management Component */
            <UserManagement />
          ) : activeMenu === "User Verification" ? (
            /* User Verification Component */
            <UserVerification />
          ) : (
            /* Placeholder for other menu items */
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {activeMenu}
              </h2>
              <p className="text-gray-600">
                This section is under development. Coming soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
