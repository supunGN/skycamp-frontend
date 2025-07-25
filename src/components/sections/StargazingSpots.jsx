"use client"

import DestinationCard from "../molecules/destination/DestinationCard"
import Button from "../atoms/Button" // Import your custom Button component
import hortonPlainsImg from "../../assets/stargazing_spots/horton_plains.png";
import namunukulaRangeImg from "../../assets/stargazing_spots/namunukula_range.png";
import ritigalaReserveImg from "../../assets/stargazing_spots/ritigala_reserve.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const StargazingSpots = () => {
  const navigate = useNavigate();
  // Sample data - stargazing locations with real images
  const topStargazingSpots = [
    {
      id: 1,
      name: "Horton Plains",
      description: "Clear, high-altitude skies perfect for deep-sky views above cloud forests.",
      image: hortonPlainsImg,
      rating: 5.0,
      reviewCount: 22,
    },
    {
      id: 2,
      name: "Namunukula Range",
      description: "360° dark skies for both sunrise and Milky Way in one night.",
      image: namunukulaRangeImg,
      rating: 3.0,
      reviewCount: 12,
    },
    {
      id: 3,
      name: "Ritigala Reserve",
      description: "Starlit skies above ancient ruins for mystical night photography.",
      image: ritigalaReserveImg,
      rating: 5.0,
      reviewCount: 22,
    },
  ]

  // State to control how many spots are shown
  const [showAll, setShowAll] = useState(false);

  // Simulate a longer list for demonstration (replace with real data as needed)
  const allStargazingSpots = [
    ...topStargazingSpots,
    // Example extra spots (remove or replace with real data)
    {
      id: 4,
      name: "Knuckles Mountains",
      description: "Remote peaks with crystal-clear night skies.",
      image: hortonPlainsImg,
      rating: 4.2,
      reviewCount: 8,
    },
    {
      id: 5,
      name: "Yala Buffer Zone",
      description: "Wildlife and stars in Sri Lanka's southern wilderness.",
      image: namunukulaRangeImg,
      rating: 4.7,
      reviewCount: 14,
    },
  ];

  // Show only 3 by default, or all if showAll is true
  const spotsToShow = showAll ? allStargazingSpots : allStargazingSpots.slice(0, 3);

  const handleCardClick = (spotName) => {
    if (spotName === "Horton Plains") {
      navigate("/individual-destination");
    } else {
      console.log(`Clicked on ${spotName}`);
      // Add navigation logic here
      // For example: navigate(`/stargazing/${spotName.toLowerCase().replace(/\s+/g, '-')}`);
    }
  }

  const handleHeartClick = (spotName, isLiked) => {
    console.log(`${isLiked ? "Added to" : "Removed from"} wishlist: ${spotName}`)
    // Add wishlist logic here
  }

  // Remove navigation from show all button
  const handleShowAllClick = () => {
    setShowAll(true);
  };

  return (
    <section className="py-8 xs:py-12 sm:py-16 px-3 xs:px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 xs:mb-10 sm:mb-12">
          <div className="text-center sm:text-left">
            {/* Main Title */}
            <h2
              className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 mb-3 xs:mb-4"
            >
              Stargazing Spots
            </h2>
            {/* Supporting Text */}
            <p className="text-sm xs:text-base sm:text-lg text-gray-600 max-w-2xl mx-auto sm:mx-0 leading-relaxed">
              Discover peaceful, low-light locations in Sri Lanka ideal for stargazing, night photography, and
              unforgettable skywatching experiences.
            </p>
          </div>
        </div>

        {/* Stargazing Spots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
          {spotsToShow.map((spot) => (
            <DestinationCard
              key={spot.id}
              image={spot.image}
              name={spot.name}
              description={spot.description}
              rating={spot.rating}
              reviewCount={spot.reviewCount}
              onCardClick={handleCardClick}
              onHeartClick={handleHeartClick}
            />
          ))}
        </div>

        {/* Show All Button - Only show if there are more than 3 and not already showing all */}
        {allStargazingSpots.length > 3 && !showAll && (
          <div className="flex justify-left mt-8 xs:mt-10 sm:mt-12">
            <Button onClick={handleShowAllClick} size="md" variant="primary" className="w-full sm:w-auto">
              Show all Spots
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

export default StargazingSpots
