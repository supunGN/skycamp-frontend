import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
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
  ClockIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import Overview from "./Overview";
import MyDetails from "./MyDetails";
import Verification from "./Verification";
import Availability from "./Availability";
import ImageGallery from "./ImageGallery";
import LocationCoverage from "./LocationCoverage";
import TripBookings from "./TripBookings";
import Notifications from "./Notifications";
import { API } from "../../api";

const menuItems = [
  { name: "Overview", icon: BriefcaseIcon, path: "/dashboard/guide/overview" },
  { name: "My Details", icon: UserIcon, path: "/dashboard/guide/my-details" },
  {
    name: "Verification",
    icon: CheckCircleIcon,
    path: "/dashboard/guide/verification",
  },
  {
    name: "Availability",
    icon: ClockIcon,
    path: "/dashboard/guide/availability",
  },
  {
    name: "Image Gallery",
    icon: PhotoIcon,
    path: "/dashboard/guide/image-gallery",
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
  const [unreadCount, setUnreadCount] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isLoadingVerification, setIsLoadingVerification] = useState(true);

  const { name: userName, email: userEmail } = getUserInfo();

  const currentItem = menuItems.find((item) =>
    location.pathname.startsWith(item.path)
  );
  const activeMenu = currentItem ? currentItem.name : "Overview";

  // Fetch verification status
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        const response = await API.guideDashboard.getProfile();
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
    // Poll for updates every 30 seconds
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
    "availability",
    "image-gallery",
    "location-coverage",
    "bookings",
    "notifications",
  ];

  // Check if current route is restricted
  const isCurrentRouteRestricted = restrictedRoutes.some((route) =>
    location.pathname.includes(route)
  );

  // Update menu items with unread count
  const updatedMenuItems = menuItems.map((item) => {
    if (item.name === "Notifications") {
      return { ...item, unreadCount };
    }
    return item;
  });

  // Handle navigation with verification check
  const handleNavigation = (name) => {
    const item = updatedMenuItems.find((i) => i.name === name);
    if (item) {
      // Check if the route is restricted and user is not verified
      const isRestricted = restrictedRoutes.some((route) =>
        item.path.includes(route)
      );

      if (isRestricted && !isVerified) {
        // Show verification message and redirect to verification
        navigate("/dashboard/guide/verification");
        return;
      }

      navigate(item.path);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar
          user={{ name: userName, email: userEmail }}
          menuItems={updatedMenuItems}
          activeMenu={activeMenu}
          onMenuSelect={handleNavigation}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader
          userName={userName}
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
                    to access all features like availability scheduling, image
                    gallery, location coverage, and bookings.
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
              path="availability"
              element={
                isVerified ? (
                  <Availability />
                ) : (
                  <Navigate to="/dashboard/guide/verification" replace />
                )
              }
            />
            <Route
              path="image-gallery"
              element={
                isVerified ? (
                  <ImageGallery />
                ) : (
                  <Navigate to="/dashboard/guide/verification" replace />
                )
              }
            />
            <Route
              path="location-coverage"
              element={
                isVerified ? (
                  <LocationCoverage />
                ) : (
                  <Navigate to="/dashboard/guide/verification" replace />
                )
              }
            />
            <Route
              path="bookings"
              element={
                isVerified ? (
                  <TripBookings />
                ) : (
                  <Navigate to="/dashboard/guide/verification" replace />
                )
              }
            />
            <Route
              path="notifications"
              element={
                isVerified ? (
                  <Notifications />
                ) : (
                  <Navigate to="/dashboard/guide/verification" replace />
                )
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
