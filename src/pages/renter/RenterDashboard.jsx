import React from "react";
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
} from "@heroicons/react/24/outline";
import Overview from "./Overview";
import MyServices from "./MyServices";
import LocationCoverage from "./LocationCoverage";
import Bookings from "./Bookings";
import Notifications from "./Notifications";

const menuItems = [
  { name: "Overview", icon: BriefcaseIcon, path: "/dashboard/renter/overview" },
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

  const { name: userName, email: userEmail } = getUserInfo();

  const activeMenu =
    menuItems.find((item) => location.pathname.startsWith(item.path))?.name ||
    "Overview";

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
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader userName={userName} subtitle="Your renter dashboard" />
        <DashboardContent>
          <Routes>
            <Route path="overview" element={<Overview />} />
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
  );
}
