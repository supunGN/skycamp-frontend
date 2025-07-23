import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import HeroSection from "../components/sections/HeroSection";
import SearchSection from "../components/sections/SearchSection";
import TravelBuddyCTA from "../components/sections/TravelBuddyCTA";
import CampingDestinations from "../components/sections/CampingDestinations";
import StargazingSpots from "../components/sections/StargazingSpots";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <SearchSection />
      <CampingDestinations/>
      <hr className="mb-0 border-gray-200 max-w-7xl mx-auto w-full" />
      <StargazingSpots/>
      <TravelBuddyCTA />
      <hr className="mt-20 mb-0 border-gray-200 max-w-7xl mx-auto w-full" />
      <Footer />
    </>
  );
}
