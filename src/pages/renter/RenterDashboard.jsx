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
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isLoadingVerification, setIsLoadingVerification] = useState(true);

  const { name: userName, email: userEmail } = getUserInfo();

  const activeMenu =
    menuItems.find((item) => location.pathname.startsWith(item.path))?.name ||
    "Overview";

  // Fetch verification status
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        const response = await API.renterDashboard.getProfile();
        if (response.success) {
          setVerificationStatus(response.data.verification_status);
        }
      } catch (error) {
        console.error("Error fetching verification status:", error);
      } finally {
        setIsLoadingVerification(false);
      }
    };

    fetchVerificationStatus();
  }, []);

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

    // Listen for notification count changes from other components
    const handleNotificationCountChange = (event) => {
      setUnreadCount(event.detail.count);
    };

    window.addEventListener(
      "notificationCountChanged",
      handleNotificationCountChange
    );

    return () => {
      clearInterval(interval);
      window.removeEventListener(
        "notificationCountChanged",
        handleNotificationCountChange
      );
    };
  }, []);

  // Check if user is verified
  const isVerified = verificationStatus === "Yes";

  // Define restricted routes for unverified users
  const restrictedRoutes = [
    "my-services",
    "location-coverage",
    "bookings",
    "notifications",
  ];

  // Add unread count to menu items
  const menuItemsWithCount = menuItems.map((item) => {
    if (item.name === "Notifications") {
      return { ...item, unreadCount };
    }
    return item;
  });

  // Handle navigation with verification check
  const handleMenuSelect = (name) => {
    const item = menuItems.find((i) => i.name === name);
    if (item) {
      // Check if the route is restricted and user is not verified
      const isRestricted = restrictedRoutes.some((route) =>
        item.path.includes(route)
      );

      if (isRestricted && !isVerified) {
        // Show verification message and redirect to verification
        navigate("/dashboard/renter/verification");
        return;
      }

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
            unreadCount={unreadCount}
          />
          <DashboardContent>
            {/* Verification Status Message */}
            {!isLoadingVerification && !isVerified && (
              <div className="mx-6 mt-4 p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-cyan-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-cyan-800">
                      <span className="font-medium">
                        Complete your verification
                      </span>{" "}
                      to access all features like equipment listing, location
                      coverage, bookings, and notifications.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Routes>
              <Route path="overview" element={<Overview />} />
              <Route path="my-details" element={<MyDetails />} />
              <Route path="verification" element={<Verification />} />
              <Route
                path="my-services"
                element={
                  isVerified ? (
                    <MyServices />
                  ) : (
                    <Navigate to="/dashboard/renter/verification" replace />
                  )
                }
              />
              <Route
                path="location-coverage"
                element={
                  isVerified ? (
                    <LocationCoverage />
                  ) : (
                    <Navigate to="/dashboard/renter/verification" replace />
                  )
                }
              />
              <Route
                path="bookings"
                element={
                  isVerified ? (
                    <Bookings />
                  ) : (
                    <Navigate to="/dashboard/renter/verification" replace />
                  )
                }
              />
              <Route
                path="notifications"
                element={
                  isVerified ? (
                    <Notifications />
                  ) : (
                    <Navigate to="/dashboard/renter/verification" replace />
                  )
                }
              />
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
