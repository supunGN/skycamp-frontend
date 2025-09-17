import React from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import DashboardSidebar from "../../../components/dashboard/DashboardSidebar";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import DashboardContent from "../../../components/dashboard/DashboardContent";
import {
  BriefcaseIcon,
  CalendarDaysIcon,
  MapPinIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import Overview from "./Overview";
import MyDestinations from "./MyDestinations";
import TripBookings from "./TripBookings";
import Notifications from "./Notifications";

const menuItems = [
  { name: "Overview", icon: BriefcaseIcon, path: "/dashboard/guide/overview" },
  {
    name: "My Services",
    icon: CalendarDaysIcon,
    path: "/dashboard/guide/my-destinations",
  },
  {
    name: "Location & Coverage",
    icon: MapPinIcon,
    path: "/dashboard/guide/location-coverage",
  },
  {
    name: "Bookings",
    icon: CalendarDaysIcon,
    path: "/dashboard/guide/bookings",
  },
  {
    name: "Notifications",
    icon: BellIcon,
    path: "/dashboard/guide/notifications",
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
        "Guest";
      return { name, email: user.email || "" };
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
  return { name: "Guest", email: "" };
}

export default function GuideDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const { name: userName, email: userEmail } = getUserInfo();

  const currentItem = menuItems.find((item) =>
    location.pathname.startsWith(item.path)
  );
  const activeMenu = currentItem ? currentItem.name : "Overview";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar
          user={{ name: userName, email: userEmail }}
          menuItems={menuItems}
          activeMenu={activeMenu}
          onMenuSelect={(name) => {
            const item = menuItems.find((i) => i.name === name);
            if (item) navigate(item.path);
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader userName={userName} />
        <DashboardContent>
          <Routes>
            <Route path="overview" element={<Overview />} />
            <Route path="my-destinations" element={<MyDestinations />} />
            <Route path="bookings" element={<TripBookings />} />
            <Route path="notifications" element={<Notifications />} />
            <Route
              path="location-coverage"
              element={
                <div className="p-6 text-gray-600">
                  Location & Coverage (Coming Soon)
                </div>
              }
            />
            <Route path="" element={<Navigate to="overview" replace />} />
            <Route path="*" element={<Navigate to="overview" replace />} />
          </Routes>
        </DashboardContent>
      </div>
    </div>
  );
}
