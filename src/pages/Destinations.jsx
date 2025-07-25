import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import LocationSearchSection from "../components/sections/LocationSearchSection";
import wewathennaMountainImg from "../assets/camping_destinations/Wewathenna Mountain.png";
import hortonPlainsImg from "../assets/camping_destinations/Horton Plains.png";
import riverstonPeakImg from "../assets/camping_destinations/Riverston Peak.png";
import diyasaruParkImg from "../assets/camping_destinations/Diyasaru Park.png";
import thudugalaWaterfallImg from "../assets/camping_destinations/Thudugala Waterfall.png";
import muthurajawelaMarshImg from "../assets/camping_destinations/Muthurajawela Marsh.png";
import DestinationCard from "../components/molecules/destination/DestinationCard";
import Button from "../components/atoms/Button";
import { useNavigate } from "react-router-dom";

// Data for all camping destinations
const destinations = [
  {
    name: "Wewathenna Mountain",
    description:
      "Wake up to clouds rolling below your highland campsite with panoramic views.",
    image: wewathennaMountainImg,
    rating: 5.0,
    reviewCount: 22,
  },
  {
    name: "Horton Plains",
    description:
      "Pitch your tent in cool grasslands and explore cloud forests and waterfalls.",
    image: hortonPlainsImg,
    rating: 5.0,
    reviewCount: 22,
  },
  {
    name: "Riverston Peak",
    description:
      "Sleep above the clouds near misty cliffs and sweeping mountain plains.",
    image: riverstonPeakImg,
    rating: 3.5,
    reviewCount: 122,
  },
  {
    name: "Diyasaru Park",
    description:
      "Camp in an urban wetland surrounded by nature trails, birds, and calm lake views",
    image: diyasaruParkImg,
    rating: 5.0,
    reviewCount: 22,
  },
  {
    name: "Thudugala Waterfall",
    description:
      "Camp beside a rainforest waterfall perfect for a refreshing dip and photos.",
    image: thudugalaWaterfallImg,
    rating: 5.0,
    reviewCount: 22,
  },
  {
    name: "Muthurajawela Marsh",
    description:
      "Experience lush mangroves, boat rides, and peaceful nature just outside the city.",
    image: muthurajawelaMarshImg,
    rating: 4.5,
    reviewCount: 12,
  },
];

export default function Destinations() {
  const navigate = useNavigate();
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Search by District Section */}
      <LocationSearchSection />

      {/* Add more space between search and destinations section */}
      <div className="h-8" />

      {/* Camping Destinations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Section Header */}
        <div className="mt-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Camping Destinations
          </h2>
          <p className="text-gray-600 text-base max-w-2xl leading-relaxed">
            Discover breathtaking spots for your next outdoor adventure,
            <br />
            whether you're pitching a tent by waterfalls or watching the stars
            from highland peaks.
          </p>
        </div>
        {/* Add more space between section header and grid */}
        <div className="h-10" />
        {/* Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest, idx) => (
            <DestinationCard
              key={idx}
              image={dest.image}
              name={dest.name}
              description={dest.description}
              rating={dest.rating}
              reviewCount={dest.reviewCount}
              onCardClick={
                dest.name === "Horton Plains"
                  ? () => {
                      navigate("/individual-destination");
                      window.scrollTo(0, 0);
                    }
                  : undefined
              }
            />
          ))}
        </div>
        {/* Show All Destinations Button */}
        <div className="flex justify-center mt-10">
          <Button variant="outline" size="md">
            Show All Destinations
          </Button>
        </div>
      </section>
      <hr className="mb-0 border-gray-200 max-w-7xl mx-auto w-full" />
      {/* Footer */}
      <Footer />
    </>
  );
}
