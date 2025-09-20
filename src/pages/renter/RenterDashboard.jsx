import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import DashboardContent from "../../components/dashboard/DashboardContent";
import {
  BriefcaseIcon,
  CalendarDaysIcon,
  MapPinIcon,
  BellIcon,
  UserIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Overview from "./Overview";
import MyServices from "./MyServices";
import LocationCoverage from "./LocationCoverage";
import Bookings from "./Bookings";
import Notifications from "./Notifications";
import MyDetails from "./MyDetails";
import Verification from "./Verification";
import { API } from "../../api";

const menuItems = [
  { name: "Overview", icon: BriefcaseIcon, path: "/dashboard/renter/overview" },
  { name: "My Details", icon: UserIcon, path: "/dashboard/renter/my-details" },
  {
    name: "Verification",
    icon: CheckCircleIcon,
    path: "/dashboard/renter/verification",
  },
  {
    name: "My Services",
    icon: CalendarDaysIcon,
    path: "/dashboard/renter/my-services",
  },
  {
    name: "Location & Coverage",
    icon: MapPinIcon,
    path: "/dashboard/renter/location-coverage",
  },
  {
    name: "Bookings",
    icon: CalendarDaysIcon,
    path: "/dashboard/renter/bookings",
  },
  {
    name: "Notifications",
    icon: BellIcon,
    path: "/dashboard/renter/notifications",
  },
];

function getUserInfo() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const name =
        [user.first_name, user.last_name].filter(Boolean).join(" ") ||
        user.name ||
        user.email ||
        "Renter";
      return {
        name,
        email: user.email || "",
        user_role: user.user_role,
        provider_type: user.provider_type,
      };
    }
  } catch (err) {
    console.error("Error parsing user data:", err);
  }
  return { name: "Renter", email: "", user_role: "", provider_type: "" };
}

export default function RenterDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const { name: userName, email: userEmail } = getUserInfo();

  const activeMenu =
    menuItems.find((item) => location.pathname.startsWith(item.path))?.name ||
    "Overview";

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await API.notifications.getUnreadCount();
        if (response.success) {
          setUnreadCount(response.data?.count || 0);
        }
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchUnreadCount();

    // Refresh count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Add unread count to menu items
  const menuItemsWithCount = menuItems.map((item) => {
    if (item.name === "Notifications") {
      return { ...item, unreadCount };
    }
    return item;
  });

  // Refresh unread count when navigating to notifications
  const handleMenuSelect = (name) => {
    const item = menuItems.find((i) => i.name === name);
    if (item) {
      navigate(item.path);
      // Refresh unread count when going to notifications
      if (name === "Notifications") {
        const refreshCount = async () => {
          try {
            const response = await API.notifications.getUnreadCount();
            if (response.success) {
              setUnreadCount(response.data?.count || 0);
            }
          } catch (error) {
            console.error("Error refreshing unread count:", error);
          }
        };
        refreshCount();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Fixed */}
      <div className="fixed top-0 left-0 h-screen w-72 bg-white border-r border-gray-200 z-40 shadow-sm hidden lg:block">
        <DashboardSidebar
          user={{ name: userName, email: userEmail }}
          menuItems={menuItemsWithCount}
          activeMenu={activeMenu}
          onMenuSelect={handleMenuSelect}
        />
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 ml-0 lg:ml-72 min-h-screen bg-gray-50">
        <div className="flex flex-col h-full">
          <DashboardHeader
            userName={userName}
            subtitle="Your renter dashboard"
            onUnreadCountChange={setUnreadCount}
          />
          <DashboardContent>
            <Routes>
              <Route path="overview" element={<Overview />} />
              <Route path="my-details" element={<MyDetails />} />
              <Route path="verification" element={<Verification />} />
              <Route path="my-services" element={<MyServices />} />
              <Route path="location-coverage" element={<LocationCoverage />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="notifications" element={<Notifications />} />
              {/* Default: redirect to overview */}
              <Route path="" element={<Navigate to="overview" replace />} />
              <Route path="*" element={<Navigate to="overview" replace />} />
            </Routes>
          </DashboardContent>
        </div>
      </div>
    </div>
  );
}
