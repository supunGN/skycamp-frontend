import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import Button from "../components/atoms/Button";
import DestinationCard from "../components/molecules/destination/DestinationCard";
import LocationSearchSection from "../components/sections/LocationSearchSection";
import hortonPlainsImg from "../assets/stargazing_spots/horton_plains.png";
import namunukulaRangeImg from "../assets/stargazing_spots/namunukula_range.png";
import ritigalaReserveImg from "../assets/stargazing_spots/ritigala_reserve.png";
import yalaBufferZoneImg from "../assets/stargazing_spots/Yala Buffer Zone.png";
import knucklesMountainsImg from "../assets/stargazing_spots/Knuckles Mountains.png";
import minneriyaAreaImg from "../assets/stargazing_spots/Minneriya Area.png";
import { useNavigate } from "react-router-dom";

const stargazingSpots = [
  {
    name: "Horton Plains",
    description:
      "Clear, high-altitude skies perfect for deep-sky views above cloud forests.",
    image: hortonPlainsImg,
    rating: 5.0,
    reviewCount: 22,
  },
  {
    name: "Namunukula Range",
    description: "360° dark skies for both sunrise and Milky Way in one night.",
    image: namunukulaRangeImg,
    rating: 3.0,
    reviewCount: 12,
  },
  {
    name: "Ritigala Reserve",
    description:
      "Starlit skies above ancient ruins for mystical night photography.",
    image: ritigalaReserveImg,
    rating: 5.0,
    reviewCount: 22,
  },
  {
    name: "Yala Buffer Zone",
    description:
      "Primal stargazing experience with wildlife sounds under dark skies.",
    image: yalaBufferZoneImg,
    rating: 5.0,
    reviewCount: 22,
  },
  {
    name: "Knuckles Mountains",
    description:
      "Panoramic views with minimal light pollution and magical cloud inversions.",
    image: knucklesMountainsImg,
    rating: 3.5,
    reviewCount: 122,
  },
  {
    name: "Minneriya Area",
    description:
      "Starry reflections over tank waters and nearby elephant gatherings.",
    image: minneriyaAreaImg,
    rating: 5.0,
    reviewCount: 22,
  },
];

export default function StargazingSpots() {
  const navigate = useNavigate();
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Search by District Section */}
      <LocationSearchSection />
      <div className="h-8" />

      {/* Stargazing Spots Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Section Header */}
        <div className="mt-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Stargazing Spots
          </h2>
          <p className="text-gray-600 text-base max-w-2xl leading-relaxed">
            Discover breathtaking spots for your next outdoor adventure ,
            whether you're pitching a tent by waterfalls or watching the stars
            from highland peaks
          </p>
        </div>
        {/* Add more space between section header and grid */}
        <div className="h-10" />
        {/* Stargazing Spots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stargazingSpots.map((spot, idx) => (
            <DestinationCard
              key={idx}
              image={spot.image}
              name={spot.name}
              description={spot.description}
              rating={spot.rating}
              reviewCount={spot.reviewCount}
              onCardClick={
                spot.name === "Horton Plains"
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
