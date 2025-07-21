import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Rentals from "./pages/Rentals";
import Guides from "./pages/Guides";
import TravelBuddy from "./pages/TravelBuddy";
import Destinations from "./pages/Destinations";
import StargazingSpots from "./pages/StargazingSpots";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUpRoleSelection";
import CustomerRegistration from "./pages/auth/CustomerRegistration";
import ServiceProviderRegistration from "./pages/auth/ServiceProviderRegistration";
import ForgotPassword from "./pages/auth/ForgotPassword";
import CheckEmail from "./pages/auth/CheckEmail";
import SetNewPassword from "./pages/auth/SetNewPassword";
import PasswordResetSuccess from "./pages/auth/PasswordResetSuccess";
import AboutUs from "./pages/AboutUs";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/rentals" element={<Rentals />} />
      <Route path="/guides" element={<Guides />} />
      <Route path="/travel-buddy" element={<TravelBuddy />} />
      <Route path="/destinations" element={<Destinations />} />
      <Route path="/stargazing-spots" element={<StargazingSpots />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/login" element={<Login />} />
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
      <Route path="/about" element={<AboutUs />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default App;
