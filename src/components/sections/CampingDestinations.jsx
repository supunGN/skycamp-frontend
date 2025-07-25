"use client";

import DestinationCard from "../molecules/destination/DestinationCard";
import Button from "../atoms/Button"; // Import your custom Button component
import { useNavigate } from "react-router-dom";
import wewathennaMountainImg from "../../assets/camping_destinations/Wewathenna Mountain.png";
import hortonPlainsImg from "../../assets/camping_destinations/Horton Plains.png";
import riverstonPeakImg from "../../assets/camping_destinations/Riverston Peak.png";
import { useState } from "react";

const CampingDestinations = () => {
  // Sample data - using all your provided images
  const topDestinations = [
    {
      id: 1,
      name: "Wewathenna Mountain",
      description:
        "Wake up to clouds rolling below your highland campsite with panoramic views.",
      image: wewathennaMountainImg,
      rating: 5.0,
      reviewCount: 22,
    },
    {
      id: 2,
      name: "Horton Plains",
      description:
        "Pitch your tent in cool grasslands and explore cloud forests and waterfalls.",
      image: hortonPlainsImg,
      rating: 5.0,
      reviewCount: 22,
    },
    {
      id: 3,
      name: "Riverston Peak",
      description:
        "Sleep above the clouds near misty cliffs and sweeping mountain plains.",
      image: riverstonPeakImg,
      rating: 3.5,
      reviewCount: 122,
    },
  ];

  // Simulate a longer list for demonstration (replace with real data as needed)
  const allDestinations = [
    ...topDestinations,
    // Example extra destinations (remove or replace with real data)
    {
      id: 4,
      name: "Knuckles Range",
      description: "Camp in the heart of Sri Lanka's misty mountains.",
      image: wewathennaMountainImg,
      rating: 4.5,
      reviewCount: 10,
    },
    {
      id: 5,
      name: "Sinharaja Forest",
      description: "Experience the rainforest wilderness overnight.",
      image: hortonPlainsImg,
      rating: 4.8,
      reviewCount: 15,
    },
  ];

  // Show only 3 by default, or all if showAll is true
  const destinationsToShow = allDestinations.slice(0, 3);

  const navigate = useNavigate();

  const handleCardClick = (destinationName) => {
    if (destinationName === "Horton Plains") {
      navigate("/individual-destination");
    } else {
      console.log(`Clicked on ${destinationName}`);
      // Add navigation logic here
      // For example: navigate(`/destinations/${destinationName.toLowerCase().replace(/\s+/g, '-')}`);
    }
  };

  const handleHeartClick = (destinationName, isLiked) => {
    console.log(
      `${isLiked ? "Added to" : "Removed from"} wishlist: ${destinationName}`
    );
    // Add wishlist logic here
  };

  // Remove navigation from show all button
  // const handleShowAllClick = () => {
  //   setShowAll(true);
  // };

  return (
    <section className="py-8 xs:py-12 sm:py-16 px-3 xs:px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 xs:mb-10 sm:mb-12">
          <div className="text-center sm:text-left">
            {/* Main Title */}
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 mb-3 xs:mb-4">
              Camping Destinations
            </h2>
            {/* Supporting Text */}
            <p className="text-sm xs:text-base sm:text-lg text-gray-600 max-w-2xl mx-auto sm:mx-0 leading-relaxed">
              Explore Sri Lanka's top camping spots surrounded by nature.
              Perfect for outdoor adventures, relaxation, and breathtaking
              views.
            </p>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
          {destinationsToShow.map((destination) => (
            <DestinationCard
              key={destination.id}
              image={destination.image}
              name={destination.name}
              description={destination.description}
              rating={destination.rating}
              reviewCount={destination.reviewCount}
              onCardClick={handleCardClick}
              onHeartClick={handleHeartClick}
            />
          ))}
        </div>

        {/* Show All Button - Only show if there are more than 3 */}
        {allDestinations.length > 3 && (
          <div className="flex justify-left mt-8 xs:mt-10 sm:mt-12">
            <Button
              onClick={() => navigate("/destinations")}
              size="md"
              variant="primary"
              className="w-full sm:w-auto"
            >
              Show all destinations
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CampingDestinations;
