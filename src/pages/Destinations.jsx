import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import LocationSearchSection from "../components/sections/LocationSearchSection";
import DestinationCard from "../components/molecules/destination/DestinationCard";
import Button from "../components/atoms/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { API } from "../api";

export default function Destinations() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
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
      // Load all destinations if no URL parameters
      loadDestinations();
    }
  }, [searchParams]);

  // Load destinations from API
  const loadDestinations = async () => {
    try {
      setIsLoading(true);
      const response = await API.locations.getCampingDestinationsWithImages();

      if (response.success) {
        // Transform API data to match DestinationCard component expectations
        const transformedDestinations = response.data
          .filter((destination) => destination.location_id) // Only include destinations with valid IDs
          .map((destination) => {
            return {
              name: destination.name,
              description: destination.description,
              image: destination.image_url || "/placeholder-image.jpg", // Fallback image
              rating: 4.5, // Default rating since not in database
              reviewCount: Math.floor(Math.random() * 100) + 10, // Random review count
              locationId: destination.location_id,
              district: destination.district,
            };
          });

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

  // Handle district filtering from URL parameters
  const handleDistrictFilterFromUrl = async (district) => {
    try {
      setIsLoading(true);
      const response = await API.locations.getCampingDestinationsByDistrict(
        district
      );

      if (response.success) {
        const transformedDestinations = response.data
          .filter((destination) => destination.location_id)
          .map((destination) => ({
            name: destination.name,
            description: destination.description,
            image: destination.image_url || "/placeholder-image.jpg",
            rating: 4.5,
            reviewCount: Math.floor(Math.random() * 100) + 10,
            locationId: destination.location_id,
            district: destination.district,
          }));

        setDestinations(transformedDestinations);
        setShowAll(false);
      } else {
        setError("Failed to filter destinations by district");
      }
    } catch (err) {
      console.error("Error filtering destinations:", err);
      setError("Failed to filter destinations by district");
    } finally {
      setIsLoading(false);
    }
  };

  // Get destinations to display (first 9 or all)
  const destinationsToShow = showAll ? destinations : destinations.slice(0, 9);
  const hasMoreDestinations = destinations.length > 9;

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
      const response = await API.locations.getCampingDestinationsByDistrict(
        selectedDistrict
      );

      if (response.success) {
        const transformedDestinations = response.data.map((destination) => ({
          name: destination.name,
          description: destination.description,
          image: destination.image_url || "/placeholder-image.jpg",
          rating: 4.5,
          reviewCount: Math.floor(Math.random() * 100) + 10,
          locationId: destination.location_id,
          district: destination.district,
        }));
        setDestinations(transformedDestinations);
        setIsFiltered(true);
        setShowAll(false);
      } else {
        setError("Failed to filter destinations");
      }
    } catch (err) {
      console.error("Error filtering destinations:", err);
      setError("Failed to filter destinations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsLoading(true);
      const response = await API.locations.getCampingDestinationsWithImages();

      if (response.success) {
        const transformedDestinations = response.data.map((destination) => ({
          name: destination.name,
          description: destination.description,
          image: destination.image_url || "/placeholder-image.jpg",
          rating: 4.5,
          reviewCount: Math.floor(Math.random() * 100) + 10,
          locationId: destination.location_id,
          district: destination.district,
        }));
        setDestinations(transformedDestinations);
        setIsFiltered(false);
        setSelectedDistrict("");
        setShowAll(false);
      }
    } catch (err) {
      console.error("Error resetting destinations:", err);
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
            <div className="text-lg text-gray-600">Loading destinations...</div>
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
        category="camping destinations"
      />

      {/* Camping Destinations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Section Header */}
        <div className="mt-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isFiltered
              ? `Camping Destinations in ${selectedDistrict}`
              : "Camping Destinations"}
          </h2>
          <p className="text-gray-600 text-base max-w-2xl leading-relaxed">
            {isFiltered
              ? `Discover camping spots in ${selectedDistrict} for your next outdoor adventure.`
              : `Discover breathtaking spots for your next outdoor adventure,
                whether you're pitching a tent by waterfalls or watching the stars
                from highland peaks.`}
          </p>
        </div>
        {/* Add more space between section header and grid */}
        <div className="h-10" />
        {/* Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinationsToShow.map((dest, idx) => (
            <DestinationCard
              key={dest.locationId || idx}
              image={dest.image}
              name={dest.name}
              description={dest.description}
              rating={dest.rating}
              reviewCount={dest.reviewCount}
              locationId={dest.locationId}
              onCardClick={() => {
                const urlFriendlyName = dest.name
                  .toLowerCase()
                  .replace(/[^a-z0-9\s-]/g, "")
                  .replace(/\s+/g, "-")
                  .trim();
                navigate(`/destination/${dest.locationId}/${urlFriendlyName}`);
                window.scrollTo(0, 0);
              }}
            />
          ))}
        </div>
        {/* Show All Destinations Button */}
        <div className="flex justify-center mt-10">
          {hasMoreDestinations && !showAll ? (
            <Button variant="outline" size="md" onClick={handleShowAll}>
              Show All Destinations ({destinations.length})
            </Button>
          ) : showAll ? (
            <div className="flex flex-col items-center gap-3">
              <div className="text-gray-500 text-sm">
                Showing all {destinations.length} destinations
              </div>
              <Button variant="outline" size="sm" onClick={handleShowLess}>
                Show Less
              </Button>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              Showing {destinations.length} destinations
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
