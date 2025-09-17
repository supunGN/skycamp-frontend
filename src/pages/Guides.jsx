import React, { useState, useEffect } from "react";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import LocationSearchSection from "../components/sections/LocationSearchSection";
import GuidesSection from "../components/sections/GuidesSection";
import Button from "../components/atoms/Button";
import { API } from "../api";
import { useSearchParams } from "react-router-dom";

export default function Guides() {
  const [searchParams] = useSearchParams();
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [guides, setGuides] = useState([]);
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      // Load all guides if no URL parameters
      fetchGuides();
    }
  }, [searchParams]);

  useEffect(() => {
    // Only update filtered guides when guides data changes, not when district changes
    // But only if we're not currently filtered (to avoid overriding URL-based filtering)
    if (!selectedDistrict && !isFiltered) {
      setFilteredGuides(guides);
    }
  }, [guides, selectedDistrict, isFiltered]);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const response = await API.guides.list();
      if (response.success) {
        setGuides(response.data);
        setFilteredGuides(response.data);
      } else {
        setError("Failed to fetch guides");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch guides");
    } finally {
      setLoading(false);
    }
  };

  // Handle district filtering from URL parameters
  const handleDistrictFilterFromUrl = async (district) => {
    try {
      setLoading(true);
      const response = await API.guides.getByDistrict(district);
      if (response.success) {
        setFilteredGuides(response.data);
        setShowAll(false);
      } else {
        setError("Failed to filter guides by district");
      }
    } catch (err) {
      setError(err.message || "Failed to filter guides by district");
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictFilter = async () => {
    if (!selectedDistrict) return;

    try {
      setLoading(true);
      const response = await API.guides.getByDistrict(selectedDistrict);
      if (response.success) {
        setFilteredGuides(response.data);
        setIsFiltered(true);
        setShowAll(false);
      } else {
        setError("Failed to filter guides by district");
      }
    } catch (err) {
      setError(err.message || "Failed to filter guides by district");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      const response = await API.guides.list();

      if (response.success) {
        setGuides(response.data);
        setFilteredGuides(response.data);
        setIsFiltered(false);
        setSelectedDistrict("");
        setShowAll(false);
      }
    } catch (err) {
      console.error("Error resetting guides:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowAll = () => {
    setShowAll(true);
  };

  const handleShowLess = () => {
    setShowAll(false);
    // Scroll to top of guides section
    setTimeout(() => {
      const guidesSection = document.querySelector("#guides-section");
      if (guidesSection) {
        guidesSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Determine which guides to display
  const displayedGuides = showAll
    ? filteredGuides
    : filteredGuides.slice(0, 16);

  return (
    <>
      <Navbar />
      <LocationSearchSection
        selectedDistrict={selectedDistrict}
        onDistrictChange={setSelectedDistrict}
        onSearch={handleDistrictFilter}
        onReset={handleReset}
        isLoading={loading}
        isFiltered={isFiltered}
        category="guides"
      />

      <div id="guides-section">
        <GuidesSection
          guides={displayedGuides}
          selectedDistrict={selectedDistrict}
          loading={loading}
          error={error}
        />

        {/* Pagination Controls */}
        {!loading && !error && filteredGuides.length > 16 && (
          <div className="flex justify-center mt-6">
            {!showAll ? (
              <Button
                onClick={handleShowAll}
                variant="primary"
                size="sm"
                className="px-4 py-2"
              >
                Show All ({filteredGuides.length} guides)
              </Button>
            ) : (
              <Button
                onClick={handleShowLess}
                variant="secondary"
                size="sm"
                className="px-4 py-2"
              >
                Show Less (16 guides)
              </Button>
            )}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
