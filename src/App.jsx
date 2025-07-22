import { Routes, Route } from "react-router-dom";
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
      <Route path="/about" element={<AboutUs />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default App;
