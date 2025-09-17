import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { API } from "./api";
import ScrollToTop from "./components/ScrollToTop";
import TravelBuddyProtectedRoute from "./components/TravelBuddyProtectedRoute";
import Home from "./pages/Home";
import Rentals from "./pages/Rentals";
import Guides from "./pages/Guides";
import TravelBuddy from "./pages/TravelBuddy";
import ChatPage from "./pages/ChatPage";
import Destinations from "./pages/Destinations";
import StargazingSpots from "./pages/StargazingSpots";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import AboutUs from "./pages/AboutUs";
import TermsAndConditions from "./pages/TermsAndCoditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FAQ from "./pages/FAQ";
import SignUp from "./pages/auth/SignUpRoleSelection";
import CustomerRegistration from "./pages/auth/CustomerRegistration";
import RenterRegistration from "./pages/auth/RenterRegistration";
import GuideRegistration from "./pages/auth/GuideRegistration";
import CustomerDetails from "./pages/auth/CustomerDetails";
import ForgotPassword from "./pages/auth/ForgotPassword";
import CheckEmail from "./pages/auth/CheckEmail";
import OTPVerification from "./pages/auth/OTPVerification";
import SetNewPassword from "./pages/auth/SetNewPassword";
import PasswordResetSuccess from "./pages/auth/PasswordResetSuccess";
import ContactUs from "./pages/ContactUs";
import Guide from "./pages/Guide";
import Cart from "./pages/Cart";
import IndividualDestination from "./pages/IndividualDestination";
import Wishlist from "./pages/Wishlist";
import SelectedIndividualRenter from "./pages/selected_individualrenter";
import FullRenter from "./pages/FullRenter";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import GuideDashboard from "./pages/dashboard/guide/GuideDashboard";
import RenterDashboard from "./pages/dashboard/renter/RenterDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Helper function to determine dashboard path
const getDashboardPath = (user) => {
  if (!user) return "/login";
  if (user.user_role === "service_provider") {
    return user.provider_type === "Equipment Renter"
      ? "/dashboard/renter/overview"
      : "/dashboard/guide/overview";
  }
  if (user.user_role === "customer") return "/profile";
  return "/";
};

// Helper function to get user from localStorage
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

// Helper function to get admin from localStorage
const getAdmin = () => {
  try {
    return JSON.parse(localStorage.getItem("admin"));
  } catch {
    return null;
  }
};

// Helper function to check auth flow state
const checkAuthFlowState = (pathname) => {
  switch (pathname) {
    case "/check-email":
      return (
        sessionStorage.getItem("resetEmail") ||
        localStorage.getItem("resetEmail")
      );
    case "/verify-otp":
      return (
        sessionStorage.getItem("resetEmail") &&
        sessionStorage.getItem("resetToken")
      );
    case "/set-new-password":
      return (
        sessionStorage.getItem("resetToken") &&
        sessionStorage.getItem("otpVerified")
      );
    case "/password-reset-success":
      return localStorage.getItem("user");
    default:
      return false;
  }
};

function App() {
  // Session restore on app mount
  useEffect(() => {
    // Skip auth check on admin pages to avoid conflicts
    const isAdminPage = window.location.pathname.startsWith("/admin");

    if (!isAdminPage) {
      // Always try to refresh session, but don't aggressively clear localStorage
      API.auth
        .me()
        .then((res) => {
          // /auth/me returns: { success, data: { authenticated, user } }
          const auth = res?.data?.authenticated;
          const user = res?.data?.user;
          if (auth && user) {
            localStorage.setItem("user", JSON.stringify(user));
          }
        })
        .catch(() => {
          // Do not clear localStorage here to avoid race after login
        });
    }
  }, []);

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/rentals" element={<Rentals />} />
        <Route
          path="/travel-buddy"
          element={
            <TravelBuddyProtectedRoute>
              <TravelBuddy />
            </TravelBuddyProtectedRoute>
          }
        />
        <Route
          path="/travel-buddy/feed"
          element={
            <TravelBuddyProtectedRoute>
              <TravelBuddy />
            </TravelBuddyProtectedRoute>
          }
        />
        <Route
          path="/travel-buddy/chat"
          element={
            <TravelBuddyProtectedRoute>
              <ChatPage />
            </TravelBuddyProtectedRoute>
          }
        />
        <Route
          path="/travel-buddy/requests"
          element={
            <TravelBuddyProtectedRoute>
              <TravelBuddy />
            </TravelBuddyProtectedRoute>
          }
        />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/stargazing-spots" element={<StargazingSpots />} />
        <Route path="/guides" element={<Guides />} />
        <Route
          path="/login"
          element={
            getUser() ? (
              <Navigate to={getDashboardPath(getUser())} replace />
            ) : getAdmin() ? (
              <Navigate to="/admin" replace />
            ) : (
              <Login />
            )
          }
        />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/faq" element={<FAQ />} />
        <Route
          path="/signup"
          element={
            getUser() ? (
              <Navigate to={getDashboardPath(getUser())} replace />
            ) : getAdmin() ? (
              <Navigate to="/admin" replace />
            ) : (
              <SignUp />
            )
          }
        />
        <Route
          path="/signup-role-selection"
          element={
            getUser() ? (
              <Navigate to={getDashboardPath(getUser())} replace />
            ) : getAdmin() ? (
              <Navigate to="/admin" replace />
            ) : (
              <SignUp />
            )
          }
        />
        <Route
          path="/customer-details"
          element={
            getUser() ? (
              <Navigate to={getDashboardPath(getUser())} replace />
            ) : getAdmin() ? (
              <Navigate to="/admin" replace />
            ) : (
              <CustomerDetails />
            )
          }
        />
        <Route
          path="/customer-registration"
          element={
            getUser() ? (
              <Navigate to={getDashboardPath(getUser())} replace />
            ) : getAdmin() ? (
              <Navigate to="/admin" replace />
            ) : (
              <CustomerRegistration />
            )
          }
        />
        <Route
          path="/renter-registration"
          element={
            getUser() ? (
              <Navigate to={getDashboardPath(getUser())} replace />
            ) : getAdmin() ? (
              <Navigate to="/admin" replace />
            ) : (
              <RenterRegistration />
            )
          }
        />
        <Route
          path="/guide-registration"
          element={
            getUser() ? (
              <Navigate to={getDashboardPath(getUser())} replace />
            ) : getAdmin() ? (
              <Navigate to="/admin" replace />
            ) : (
              <GuideRegistration />
            )
          }
        />
        <Route
          path="/forgot-password"
          element={
            getUser() ? (
              <Navigate to={getDashboardPath(getUser())} replace />
            ) : getAdmin() ? (
              <Navigate to="/admin" replace />
            ) : (
              <ForgotPassword />
            )
          }
        />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route
          path="/selected_individualrenter"
          element={<SelectedIndividualRenter />}
        />
        <Route path="/fullrenter" element={<FullRenter />} />
        <Route path="/guide/:id" element={<Guide />} />

        {/* Admin Routes */}
        <Route
          path="/admin/login"
          element={
            getAdmin() ? (
              <Navigate to="/admin" replace />
            ) : getUser() ? (
              <Navigate to={getDashboardPath(getUser())} replace />
            ) : (
              <AdminLogin />
            )
          }
        />
        <Route
          path="/admin"
          element={
            getAdmin() ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />

        {/* Auth Flow Routes */}
        <Route
          path="/check-email"
          element={
            checkAuthFlowState("/check-email") ? (
              <CheckEmail />
            ) : (
              <Navigate to="/forgot-password" replace />
            )
          }
        />
        <Route
          path="/verify-otp"
          element={
            checkAuthFlowState("/verify-otp") ? (
              <OTPVerification />
            ) : (
              <Navigate to="/forgot-password" replace />
            )
          }
        />
        <Route
          path="/set-new-password"
          element={
            checkAuthFlowState("/set-new-password") ? (
              <SetNewPassword />
            ) : (
              <Navigate to="/forgot-password" replace />
            )
          }
        />
        <Route
          path="/password-reset-success"
          element={
            checkAuthFlowState("/password-reset-success") ? (
              <PasswordResetSuccess />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Protected Routes - Customer Only */}
        <Route
          path="/profile"
          element={
            getUser()?.user_role === "customer" ? (
              <Profile />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Protected Routes - Service Providers Only */}
        <Route
          path="/dashboard/guide/*"
          element={
            getUser()?.provider_type === "Local Guide" ? (
              <GuideDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/dashboard/renter/*"
          element={
            getUser()?.provider_type === "Equipment Renter" ? (
              <RenterDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Protected Routes - All Authenticated Users */}
        <Route
          path="/settings"
          element={getUser() ? <Settings /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/cart"
          element={getUser() ? <Cart /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/wishlist"
          element={getUser() ? <Wishlist /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/destination/:locationId/:locationName"
          element={<IndividualDestination />}
        />

        {/* Dynamic Dashboard Redirect */}
        <Route
          path="/dashboard"
          element={
            getUser() ? (
              <Navigate to={getDashboardPath(getUser())} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/dashboard/*"
          element={getUser() ? <Dashboard /> : <Navigate to="/login" replace />}
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
