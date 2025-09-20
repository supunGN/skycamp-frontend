import React, { useState, useEffect } from "react";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import LocationSearchSection from "../components/sections/LocationSearchSection";
import RentalCard from "../components/molecules/RentalCard";
import Button from "../components/atoms/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API } from "../api";

// Camping Gear Sidebar Section (dynamic from database)
const CampingGearSidebar = () => {
  const navigate = useNavigate();
  const [equipmentCategories, setEquipmentCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEquipmentCategories = async () => {
      try {
        setLoading(true);
        const response = await API.equipment.getCategoriesWithEquipment();
        if (response.success) {
          setEquipmentCategories(response.data);
        } else {
          setError("Failed to fetch equipment categories");
        }
      } catch (err) {
        console.error("Error fetching equipment categories:", err);
        setError("Failed to fetch equipment categories");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipmentCategories();
  }, []);

  const handleSearch = () => {
    navigate("/selected_individualrenter");
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <aside className="bg-white rounded-2xl shadow-sm p-4 mb-8 w-full lg:w-72 text-sm">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
          <span className="ml-3 text-gray-600">Loading equipment...</span>
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="bg-white rounded-2xl shadow-sm p-4 mb-8 w-full lg:w-72 text-sm">
        <div className="text-center py-8">
          <div className="text-red-600 mb-2">
            <svg
              className="mx-auto h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </aside>
    );
  }
  return (
    <aside className="bg-white rounded-2xl shadow-sm p-4 mb-8 w-full lg:w-72 text-sm">
      {/* Dynamic Equipment Categories */}
      {equipmentCategories.map((category, index) => (
        <div key={category.categoryId}>
          {/* Show section headers for different types */}
          {index === 0 && category.type === "Camping" && (
            <h3 className="font-bold text-cyan-700 mb-4 text-xl">
              Camping Gears
            </h3>
          )}
          {category.type === "Stargazing" &&
            equipmentCategories.find((c) => c.type === "Stargazing") ===
              category && (
              <h3 className="font-bold text-cyan-700 mb-4 text-xl mt-10">
                Stargazing Gears
              </h3>
            )}

          {/* Category Section */}
          <div className="mb-6">
            <div className="font-semibold mb-2">{category.name}</div>
            <div className="space-y-1">
              {category.equipment.map((equipment) => (
                <label
                  key={equipment.equipmentId}
                  className="flex items-center gap-2"
                >
                  <input type="checkbox" /> {equipment.name}
                </label>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Search Button */}
      <Button
        size="sm"
        variant="primary"
        className="w-full mt-2"
        onClick={handleSearch}
      >
        Search
      </Button>
    </aside>
  );
};

const Rentals = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [renters, setRenters] = useState([]);
  const [loading, setLoading] = useState(true);
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
      // Load all renters if no URL parameters
      fetchRenters();
    }
  }, [searchParams]);

  // Load all renters from API
  const fetchRenters = async () => {
    try {
      setLoading(true);
      const response = await API.renters.list();
      if (response.success) {
        setRenters(response.data);
      } else {
        setError("Failed to fetch renters");
      }
    } catch (err) {
      console.error("Error fetching renters:", err);
      setError("Failed to fetch renters");
    } finally {
      setLoading(false);
    }
  };

  // Handle district filtering from URL parameters
  const handleDistrictFilterFromUrl = async (district) => {
    try {
      setLoading(true);
      const response = await API.renters.getByDistrict(district);

      if (response.success) {
        setRenters(response.data);
        setShowAll(false);
      } else {
        setError("Failed to filter renters by district");
      }
    } catch (err) {
      console.error("Error filtering renters:", err);
      setError("Failed to filter renters by district");
    } finally {
      setLoading(false);
    }
  };

  const handleRentalClick = (renter) => {
    // Navigate to individual renter page
    navigate("/selected_individualrenter", {
      state: { renterId: renter.id },
    });
    window.scrollTo(0, 0);
  };

  const handleShowAll = () => {
    setShowAll(true);
  };

  const handleShowLess = () => {
    setShowAll(false);
    // Scroll back to top of rentals section smoothly
    setTimeout(() => {
      const rentalsSection = document.querySelector(
        ".max-w-7xl.mx-auto.px-4.mt-8"
      );
      if (rentalsSection) {
        rentalsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleDistrictFilter = async () => {
    if (!selectedDistrict) return;

    try {
      setLoading(true);
      const response = await API.renters.getByDistrict(selectedDistrict);

      if (response.success) {
        setRenters(response.data);
        setIsFiltered(true);
        setShowAll(false);
      } else {
        setError("Failed to filter renters");
      }
    } catch (err) {
      console.error("Error filtering renters:", err);
      setError("Failed to filter renters");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      const response = await API.renters.list();

      if (response.success) {
        setRenters(response.data);
        setIsFiltered(false);
        setSelectedDistrict("");
        setShowAll(false);
      }
    } catch (err) {
      console.error("Error resetting renters:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get renters to display based on showAll state
  const displayedRenters = showAll ? renters : renters.slice(0, 15);

  return (
    <>
      {/* Navbar */}
      <Navbar />
      {/* Location Search Section */}
      <LocationSearchSection
        selectedDistrict={selectedDistrict}
        onDistrictChange={setSelectedDistrict}
        onSearch={handleDistrictFilter}
        onReset={handleReset}
        isLoading={loading}
        isFiltered={isFiltered}
        category="gear rentals"
      />
      {/* Add space between search and rental area */}
      <div className="h-10" />
      {/* Main Content: Sidebar + Rental Cards */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Camping Gear Sidebar */}
          <div
            className="flex-shrink-0 w-full lg:w-72 sticky top-28 self-start overflow-y-auto"
            style={{ maxHeight: "80vh" }}
          >
            <CampingGearSidebar />
          </div>
          {/* Rental Cards Section */}
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              {isFiltered
                ? `Gear Rentals in ${selectedDistrict}`
                : "Gear Rentals"}
            </h2>

            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                <span className="ml-3 text-gray-600">Loading renters...</span>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <div className="text-red-600 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Error Loading Renters
                </h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && renters.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Renters Available
                </h3>
                <p className="text-gray-600">
                  There are currently no registered renters on the platform.
                </p>
              </div>
            )}

            {!loading && !error && renters.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedRenters.map((renter) => (
                    <div
                      key={renter.id}
                      onClick={() => handleRentalClick(renter)}
                      style={{ cursor: "pointer" }}
                    >
                      <RentalCard
                        image={
                          renter.image ||
                          "http://localhost/skycamp/skycamp-backend/public/storage/uploads/users/default-profile.png"
                        }
                        location={renter.location}
                        name={renter.name}
                        phone={renter.phone}
                        rating={renter.rating}
                        reviewCount={renter.reviewCount}
                        equipmentId={renter.renter_id || renter.id}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination Buttons */}
                {renters.length > 15 && (
                  <div className="flex justify-center mt-6">
                    {!showAll ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShowAll}
                        className="px-4 py-2"
                      >
                        Show All
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShowLess}
                        className="px-4 py-2"
                      >
                        Show Less
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {/* Divider line above footer */}
      <hr className="mt-16 mb-0 border-gray-200 max-w-7xl mx-auto w-full" />
      {/* Footer */}
      <Footer />
    </>
  );
};

export default Rentals;
