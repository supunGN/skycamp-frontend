"use client";

import DestinationCard from "../molecules/destination/DestinationCard";
import Button from "../atoms/Button"; // Import your custom Button component
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API } from "../../api";

const CampingDestinations = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load top 3 camping destinations from API
  useEffect(() => {
    const loadDestinations = async () => {
      try {
        setIsLoading(true);
        const response =
          await API.locations.getTopCampingDestinationsWithImages(3);

        if (response.success) {
          // Transform API data to match DestinationCard component expectations
          const transformedDestinations = response.data.map((destination) => ({
            id: destination.location_id,
            name: destination.name,
            description: destination.description,
            image: destination.image_url || "/placeholder-image.jpg", // Fallback image
            rating: 4.5, // Default rating since not in database yet
            reviewCount: Math.floor(Math.random() * 100) + 10, // Random review count
            locationId: destination.location_id,
            district: destination.district,
          }));
          setDestinations(transformedDestinations);
        } else {
          setError("Failed to load destinations");
        }
      } catch (err) {
        console.error("Error loading destinations:", err);
        setError("Failed to load destinations");
      } finally {
        setIsLoading(false);
      }
    };

    loadDestinations();
  }, []);

  const handleCardClick = (destinationName) => {
    const destination = destinations.find(
      (dest) => dest.name === destinationName
    );
    if (destination) {
      const urlFriendlyName = destination.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim();
      navigate(`/destination/${destination.locationId}/${urlFriendlyName}`);
    } else {
      console.log(`Clicked on ${destinationName}`);
    }
  };

  const handleHeartClick = (destinationName, isLiked) => {
    console.log(
      `${isLiked ? "Added to" : "Removed from"} wishlist: ${destinationName}`
    );
    // Add wishlist logic here
  };

  if (isLoading) {
    return (
      <section className="py-8 xs:py-12 sm:py-16 px-3 xs:px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">
              Loading camping destinations...
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 xs:py-12 sm:py-16 px-3 xs:px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-red-600">{error}</div>
          </div>
        </div>
      </section>
    );
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
              Explore Sri Lanka's top camping spots surrounded by nature.
              Perfect for outdoor adventures, relaxation, and breathtaking
              views.
            </p>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
          {destinations.map((destination) => (
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

        {/* Show All Button - Only show if there are destinations */}
        {destinations.length > 0 && (
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
