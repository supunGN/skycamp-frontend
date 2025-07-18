import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import HeroSection from "../components/sections/HeroSection";
import SearchSection from "../components/sections/SearchSection";
import TravelBuddyCTA from "../components/sections/TravelBuddyCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <SearchSection />
      <TravelBuddyCTA />
      <Footer />
    </>
  );
}
