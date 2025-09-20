import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import Button from "../components/atoms/Button";
import DestinationCard from "../components/molecules/destination/DestinationCard";
import LocationSearchSection from "../components/sections/LocationSearchSection";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { API } from "../api";

export default function StargazingSpots() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [stargazingSpots, setStargazingSpots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);

  // Handle URL parameters for initial filtering
  useEffect(() => {
    const districtFromUrl = searchParams.get("district");
    if (districtFromUrl) {
      setSelectedDistrict(districtFromUrl);
      setIsFiltered(true);
      // Automatically apply the filter when coming from home page search
      handleDistrictFilterFromUrl(districtFromUrl);
    } else {
      // Load all stargazing spots if no URL parameters
      loadStargazingSpots();
    }
  }, [searchParams]);

  // Load stargazing spots from API
  const loadStargazingSpots = async () => {
    try {
      setIsLoading(true);
      const response = await API.locations.getStargazingSpotsWithImages();

      if (response.success) {
        // Transform API data to match DestinationCard component expectations
        const transformedSpots = response.data
          .filter((spot) => spot.location_id) // Only include spots with valid IDs
          .map((spot) => ({
            name: spot.name,
            description: spot.description,
            image: spot.image_url || "/placeholder-image.jpg", // Fallback image
            rating: 4.5, // Default rating since not in database
            reviewCount: Math.floor(Math.random() * 100) + 10, // Random review count
            locationId: spot.location_id,
            district: spot.district,
          }));
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

  // Handle district filtering from URL parameters
  const handleDistrictFilterFromUrl = async (district) => {
    try {
      setIsLoading(true);
      const response = await API.locations.getStargazingSpotsByDistrict(
        district
      );

      if (response.success) {
        const transformedSpots = response.data.map((spot) => ({
          name: spot.name,
          description: spot.description,
          image: spot.image_url || "/placeholder-image.jpg",
          rating: 4.5,
          reviewCount: Math.floor(Math.random() * 100) + 10,
          locationId: spot.location_id,
          district: spot.district,
        }));
        setStargazingSpots(transformedSpots);
        setShowAll(false);
      } else {
        setError("Failed to filter stargazing spots by district");
      }
    } catch (err) {
      console.error("Error filtering stargazing spots:", err);
      setError("Failed to filter stargazing spots by district");
    } finally {
      setIsLoading(false);
    }
  };

  // Get spots to display (first 9 or all)
  const spotsToShow = showAll ? stargazingSpots : stargazingSpots.slice(0, 9);
  const hasMoreSpots = stargazingSpots.length > 9;

  const handleShowAll = () => {
    setShowAll(true);
  };

  const handleShowLess = () => {
    setShowAll(false);
  };

  const handleDistrictFilter = async () => {
    if (!selectedDistrict) return;

    try {
      setIsLoading(true);
      const response = await API.locations.getStargazingSpotsByDistrict(
        selectedDistrict
      );

      if (response.success) {
        const transformedSpots = response.data.map((spot) => ({
          name: spot.name,
          description: spot.description,
          image: spot.image_url || "/placeholder-image.jpg",
          rating: 4.5,
          reviewCount: Math.floor(Math.random() * 100) + 10,
          locationId: spot.location_id,
          district: spot.district,
        }));
        setStargazingSpots(transformedSpots);
        setIsFiltered(true);
        setShowAll(false);
      } else {
        setError("Failed to filter stargazing spots");
      }
    } catch (err) {
      console.error("Error filtering stargazing spots:", err);
      setError("Failed to filter stargazing spots");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsLoading(true);
      const response = await API.locations.getStargazingSpotsWithImages();

      if (response.success) {
        const transformedSpots = response.data.map((spot) => ({
          name: spot.name,
          description: spot.description,
          image: spot.image_url || "/placeholder-image.jpg",
          rating: 4.5,
          reviewCount: Math.floor(Math.random() * 100) + 10,
          locationId: spot.location_id,
          district: spot.district,
        }));
        setStargazingSpots(transformedSpots);
        setIsFiltered(false);
        setSelectedDistrict("");
        setShowAll(false);
      }
    } catch (err) {
      console.error("Error resetting stargazing spots:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <LocationSearchSection />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">
              Loading stargazing spots...
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <LocationSearchSection />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-red-600">{error}</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Search by District Section */}
      <LocationSearchSection
        selectedDistrict={selectedDistrict}
        onDistrictChange={setSelectedDistrict}
        onSearch={handleDistrictFilter}
        onReset={handleReset}
        isLoading={isLoading}
        isFiltered={isFiltered}
        category="stargazing spots"
      />

      {/* Stargazing Spots Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Section Header */}
        <div className="mt-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isFiltered
              ? `Stargazing Spots in ${selectedDistrict}`
              : "Stargazing Spots"}
          </h2>
          <p className="text-gray-600 text-base max-w-2xl leading-relaxed">
            {isFiltered
              ? `Discover stargazing spots in ${selectedDistrict} for your next outdoor adventure.`
              : `Discover breathtaking spots for your next outdoor adventure,
                whether you're pitching a tent by waterfalls or watching the stars
                from highland peaks.`}
          </p>
        </div>
        {/* Add more space between section header and grid */}
        <div className="h-10" />
        {/* Stargazing Spots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spotsToShow.map((spot, idx) => (
            <DestinationCard
              key={spot.locationId || idx}
              image={spot.image}
              name={spot.name}
              description={spot.description}
              rating={spot.rating}
              reviewCount={spot.reviewCount}
              locationId={spot.locationId}
              onCardClick={() => {
                const urlFriendlyName = spot.name
                  .toLowerCase()
                  .replace(/[^a-z0-9\s-]/g, "")
                  .replace(/\s+/g, "-")
                  .trim();
                navigate(`/destination/${spot.locationId}/${urlFriendlyName}`);
                window.scrollTo(0, 0);
              }}
            />
          ))}
        </div>
        {/* Show All Destinations Button */}
        <div className="flex justify-center mt-10">
          {hasMoreSpots && !showAll ? (
            <Button variant="outline" size="md" onClick={handleShowAll}>
              Show All Spots ({stargazingSpots.length})
            </Button>
          ) : showAll ? (
            <div className="flex flex-col items-center gap-3">
              <div className="text-gray-500 text-sm">
                Showing all {stargazingSpots.length} stargazing spots
              </div>
              <Button variant="outline" size="sm" onClick={handleShowLess}>
                Show Less
              </Button>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              Showing {stargazingSpots.length} stargazing spots
            </div>
          )}
        </div>
      </section>
      <hr className="mb-0 border-gray-200 max-w-7xl mx-auto w-full" />
      {/* Footer */}
      <Footer />
    </>
  );
}
