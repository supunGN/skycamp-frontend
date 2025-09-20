"use client";

import DestinationCard from "../molecules/destination/DestinationCard";
import Button from "../atoms/Button"; // Import your custom Button component
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API } from "../../api";

const StargazingSpots = () => {
  const navigate = useNavigate();
  const [stargazingSpots, setStargazingSpots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load top 3 stargazing spots from API
  useEffect(() => {
    const loadStargazingSpots = async () => {
      try {
        setIsLoading(true);
        const response = await API.locations.getTopStargazingSpotsWithImages(3);

        if (response.success) {
          // Transform API data to match DestinationCard component expectations
          const transformedSpots = response.data
            .filter((spot) => spot.location_id) // Only include spots with valid IDs
            .map((spot) => {
              return {
                id: spot.location_id,
                name: spot.name,
                description: spot.description,
                image: spot.image_url || "/placeholder-image.jpg", // Fallback image
                rating: 4.5, // Default rating since not in database yet
                reviewCount: Math.floor(Math.random() * 100) + 10, // Random review count
                locationId: spot.location_id,
                district: spot.district,
              };
            });

          setStargazingSpots(transformedSpots);
        } else {
          setError("Failed to load stargazing spots");
        }
      } catch (err) {
        console.error("Error loading stargazing spots:", err);
        setError("Failed to load stargazing spots");
      } finally {
        setIsLoading(false);
      }
    };

    loadStargazingSpots();
  }, []);

  const handleCardClick = (spotName) => {
    const spot = stargazingSpots.find((s) => s.name === spotName);
    if (spot) {
      const urlFriendlyName = spot.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim();
      navigate(`/destination/${spot.locationId}/${urlFriendlyName}`);
    } else {
      // Handle click without spot found
    }
  };

  const handleHeartClick = (spotName, isLiked) => {
    // Add wishlist logic here
  };

  if (isLoading) {
    return (
      <section className="py-8 xs:py-12 sm:py-16 px-3 xs:px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">
              Loading stargazing spots...
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
              Stargazing Spots
            </h2>
            {/* Supporting Text */}
            <p className="text-sm xs:text-base sm:text-lg text-gray-600 max-w-2xl mx-auto sm:mx-0 leading-relaxed">
              Discover peaceful, low-light locations in Sri Lanka ideal for
              stargazing, night photography, and unforgettable skywatching
              experiences.
            </p>
          </div>
        </div>

        {/* Stargazing Spots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
          {stargazingSpots.map((spot) => (
            <DestinationCard
              key={spot.id}
              image={spot.image}
              name={spot.name}
              description={spot.description}
              rating={spot.rating}
              reviewCount={spot.reviewCount}
              onCardClick={handleCardClick}
              locationId={spot.id}
            />
          ))}
        </div>

        {/* Show All Button - Only show if there are spots */}
        {stargazingSpots.length > 0 && (
          <div className="flex justify-left mt-8 xs:mt-10 sm:mt-12">
            <Button
              onClick={() => navigate("/stargazing-spots")}
              size="md"
              variant="primary"
              className="w-full sm:w-auto"
            >
              Show all Spots
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default StargazingSpots;
