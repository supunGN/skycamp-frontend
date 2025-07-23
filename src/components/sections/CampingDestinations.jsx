"use client"

import DestinationCard from "../molecules/destination/DestinationCard"
import Button from "../atoms/Button" // Import your custom Button component
import { useNavigate } from "react-router-dom";
import wewathennaMountainImg from "../../assets/camping_destinations/Wewathenna Mountain.png";
import hortonPlainsImg from "../../assets/camping_destinations/Horton Plains.png";
import riverstonPeakImg from "../../assets/camping_destinations/Riverston Peak.png";

const CampingDestinations = () => {
  // Sample data - using all your provided images
  const topDestinations = [
    {
      id: 1,
      name: "Wewathenna Mountain",
      description: "Wake up to clouds rolling below your highland campsite with panoramic views.",
      image: wewathennaMountainImg,
      rating: 5.0,
      reviewCount: 22,
    },
    {
      id: 2,
      name: "Horton Plains",
      description: "Pitch your tent in cool grasslands and explore cloud forests and waterfalls.",
      image: hortonPlainsImg,
      rating: 5.0,
      reviewCount: 22,
    },
    {
      id: 3,
      name: "Riverston Peak",
      description: "Sleep above the clouds near misty cliffs and sweeping mountain plains.",
      image: riverstonPeakImg,
      rating: 3.5,
      reviewCount: 122,
    },
  ]

  const navigate = useNavigate();

  const handleCardClick = (destinationName) => {
    if (destinationName === "Horton Plains") {
      navigate("/individual-destination");
    } else {
      console.log(`Clicked on ${destinationName}`)
      // Add navigation logic here
      // For example: navigate(`/destinations/${destinationName.toLowerCase().replace(/\s+/g, '-')}`);
    }
  }

  const handleHeartClick = (destinationName, isLiked) => {
    console.log(`${isLiked ? "Added to" : "Removed from"} wishlist: ${destinationName}`)
    // Add wishlist logic here
  }

  const handleShowAllClick = () => {
    navigate('/destinations');
    window.scrollTo(0, 0);
  }

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
              Explore Sri Lanka's top camping spots surrounded by nature. Perfect for outdoor adventures, relaxation,
              and breathtaking views.
            </p>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
          {topDestinations.map((destination) => (
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

        {/* Show All Button - Moved below the destinations */}
        <div className="flex justify-left mt-8 xs:mt-10 sm:mt-12">
          <Button onClick={handleShowAllClick} size="md" variant="primary" className="w-full sm:w-auto">
            Show all destinations
          </Button>
        </div>
      </div>
    </section>
  )
}

export default CampingDestinations
