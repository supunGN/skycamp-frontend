import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Rentals from "./pages/Rentals";
import Guides from "./pages/Guides";
import TravelBuddy from "./pages/TravelBuddy";
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
import ServiceProviderRegistration from "./pages/auth/ServiceProviderRegistration";
import ForgotPassword from "./pages/auth/ForgotPassword";
import CheckEmail from "./pages/auth/CheckEmail";
import SetNewPassword from "./pages/auth/SetNewPassword";
import PasswordResetSuccess from "./pages/auth/PasswordResetSuccess";
import ContactUs from "./pages/ContactUs";
import Cart from "./pages/Cart";
import IndividualDestination from "./pages/IndividualDestination";
import Wishlist from "./pages/Wishlist";
import SelectedIndividualRenter from "./pages/selected_individualrenter";
import FullRenter from "./pages/FullRenter";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import GuideDashboard from "./pages/dashboard/guide/GuideDashboard";
import RenterDashboard from "./pages/dashboard/renter/RenterDashboard";

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

function App() {
  // Always fetch the latest user data from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/rentals" element={<Rentals />} />
      <Route path="/travel-buddy" element={<TravelBuddy />} />
      <Route path="/destinations" element={<Destinations />} />
      <Route path="/stargazing-spots" element={<StargazingSpots />} />
      <Route path="/guides" element={<Guides />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/customer-registration" element={<CustomerRegistration />} />
      <Route
        path="/service-provider-registration"
        element={<ServiceProviderRegistration />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/check-email" element={<CheckEmail />} />
      <Route path="/set-new-password" element={<SetNewPassword />} />
      <Route
        path="/password-reset-success"
        element={<PasswordResetSuccess />}
      />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/individual-destination" element={<IndividualDestination />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/selected_individualrenter" element={<SelectedIndividualRenter />} />
      <Route path="/fullrenter" element={<FullRenter />} />
      <Route
        path="/individual-destination"
        element={<IndividualDestination />}
      />

      {/* Dashboard Routes with Role Protection */}
      <Route
        path="/dashboard/guide/*"
        element={
          <ProtectedRoute allowedRoles={["service_provider"]}>
            {user && user.provider_type === "Local Guide" ? (
              <GuideDashboard />
            ) : (
              <Navigate to="/dashboard/renter/overview" replace />
            )}
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/renter/*"
        element={
          <ProtectedRoute allowedRoles={["service_provider"]}>
            {user && user.provider_type === "Equipment Renter" ? (
              <RenterDashboard />
            ) : (
              <Navigate to="/dashboard/guide/overview" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Dynamic Dashboard Redirect */}
      <Route
        path="/dashboard"
        element={<Navigate to={getDashboardPath(user)} replace />}
      />

      <Route path="/dashboard/*" element={<Dashboard />} />

      {/* Customer Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Settings & Not Found */}
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
