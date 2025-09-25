import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { API } from "./api";
import { useSecureSession } from "./hooks/useSecureSession";
import { WishlistProvider } from "./contexts/WishlistContext";
import { CartProvider } from "./contexts/CartContext";
import ScrollToTop from "./components/ScrollToTop";
import TravelBuddyProtectedRoute from "./components/TravelBuddyProtectedRoute";
import { ToastProvider } from "./components/atoms/ToastProvider";
import Home from "./pages/Home";
import Rentals from "./pages/Rentals";
import Guides from "./pages/Guides";
import TravelBuddy from "./pages/travelbuddy/TravelBuddy";
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
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import IndividualRenter from "./pages/IndividualRenter";
import IndividualGuide from "./pages/IndividualGuide";
import FullRenter from "./pages/FullRenter";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import GuideDashboard from "./pages/guide/GuideDashboard";
import RenterDashboard from "./pages/renter/RenterDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAddDestination from "./pages/admin/AddDestinationForm";

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

// Helper function to check if user is admin
const isAdminUser = () => {
  try {
    const admin = localStorage.getItem("admin");
    return admin !== null;
  } catch {
    return false;
  }
};

// Helper function to check if user is regular user (not admin)
const isRegularUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user !== null;
  } catch {
    return false;
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
  const session = useSecureSession();

  // Show loading spinner while checking session
  if (session.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <WishlistProvider>
      <CartProvider>
        <ToastProvider>
          <ScrollToTop />
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route
              path="/travel-buddy"
              element={
                session.isUser ? (
                  <TravelBuddyProtectedRoute>
                    <TravelBuddy />
                  </TravelBuddyProtectedRoute>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/travel-buddy/feed"
              element={
                session.isUser ? (
                  <TravelBuddyProtectedRoute>
                    <TravelBuddy />
                  </TravelBuddyProtectedRoute>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/travel-buddy/chat"
              element={
                session.isUser ? (
                  <TravelBuddyProtectedRoute>
                    <ChatPage />
                  </TravelBuddyProtectedRoute>
                ) : (
                  <Navigate to="/login" replace />
                )
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
                session.authenticated ? (
                  <Navigate to={getDashboardPath(session.user)} replace />
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
            <Route path="/renter/:renterId" element={<IndividualRenter />} />
            <Route path="/guide/:guideId" element={<IndividualGuide />} />
            <Route path="/fullrenter" element={<FullRenter />} />

            {/* Admin Routes - Enhanced Security */}
            <Route
              path="/admin/login"
              element={
                isAdminUser() ? (
                  <Navigate to="/admin" replace />
                ) : isRegularUser() ? (
                  <Navigate to="/" replace />
                ) : (
                  <AdminLogin />
                )
              }
            />
            <Route
              path="/admin"
              element={
                isAdminUser() ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/admin/login" replace />
                )
              }
            />

            {/* Admin Destination Creation */}
            <Route
              path="/admin/destinations/new"
              element={
                isAdminUser() ? (
                  <AdminAddDestination />
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
                session.isUser && session.user?.user_role === "customer" ? (
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
                session.isUser &&
                session.user?.provider_type === "Local Guide" ? (
                  <GuideDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/dashboard/renter/*"
              element={
                session.isUser &&
                session.user?.provider_type === "Equipment Renter" ? (
                  <RenterDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Protected Routes - All Authenticated Users */}
            <Route
              path="/settings"
              element={
                session.isUser ? <Settings /> : <Navigate to="/login" replace />
              }
            />

            <Route
              path="/cart"
              element={
                session.isUser ? <Cart /> : <Navigate to="/login" replace />
              }
            />

            {/* Payment Routes */}
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />

            <Route
              path="/wishlist"
              element={
                session.isUser && session.user?.user_role === "customer" ? (
                  <Wishlist />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/destination/:locationId/:locationName"
              element={<IndividualDestination />}
            />

            {/* Dynamic Dashboard Redirect */}
            <Route
              path="/dashboard"
              element={
                session.isUser ? (
                  <Navigate to={getDashboardPath(session.user)} replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/dashboard/*"
              element={
                session.isUser ? (
                  <Dashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </CartProvider>
    </WishlistProvider>
  );
}

export default App;
