"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Button from "../atoms/Button";
import DropdownSelect from "../molecules/DropdownSelect";
import { API } from "../../api";

const categories = [
  "Camping Destinations",
  "Stargazing Spots",
  "Rentals",
  "Guides",
];

const districts = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
];

export default function SearchSection({
  selectedDistrict = "",
  onDistrictChange,
  hideCategory = false,
  title = "Search by Category & District",
  subtitle = "Search for destinations or services by category and district.",
}) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [internalDistrict, setInternalDistrict] = useState(selectedDistrict);
  const [error, setError] = useState("");
  const [districts, setDistricts] = useState([]);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Filter districts based on search term
  const filteredDistricts = searchTerm
    ? districts.filter((district) =>
        district.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : districts; // Show all districts when searchTerm is empty

  // Load districts from API
  useEffect(() => {
    const loadDistricts = async () => {
      try {
        setIsLoadingDistricts(true);
        const response = await API.locations.getAllDistricts();
        if (response.success) {
          setDistricts(response.data);
        }
      } catch (err) {
        console.error("Error loading districts:", err);
      } finally {
        setIsLoadingDistricts(false);
      }
    };

    loadDistricts();
  }, []);

  // Update searchTerm when internalDistrict changes
  useEffect(() => {
    if (internalDistrict) {
      setSearchTerm(internalDistrict);
    }
  }, [internalDistrict]);

  // Category to route mapping
  const categoryRoutes = {
    "Camping Destinations": "/destinations",
    "Stargazing Spots": "/stargazing-spots",
    Rentals: "/rentals",
    Guides: "/guides",
  };

  const handleDistrictChange = (district) => {
    setInternalDistrict(district);
    setSearchTerm(district);
    setError(""); // Clear error when district changes
    if (onDistrictChange) onDistrictChange(district);
  };

  const handleInputChange = (value) => {
    setSearchTerm(value);
    setShowDropdown(true);

    // If user types a district name that matches exactly, select it
    const exactMatch = districts.find(
      (district) => district.toLowerCase() === value.toLowerCase()
    );
    if (exactMatch) {
      setInternalDistrict(exactMatch);
      if (onDistrictChange) onDistrictChange(exactMatch);
    } else {
      setInternalDistrict("");
      if (onDistrictChange) onDistrictChange("");
    }
  };

  const handleDistrictSelect = (district) => {
    setInternalDistrict(district);
    setSearchTerm(district);
    setShowDropdown(false);
    setError(""); // Clear error when district is selected
    if (onDistrictChange) onDistrictChange(district);
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleInputBlur = () => {
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => setShowDropdown(false), 200);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setError(""); // Clear error when category changes
  };

  const handleSearch = () => {
    // Validation
    if (!selectedCategory && !hideCategory) {
      setError("Please select a category");
      return;
    }

    if (!internalDistrict) {
      setError("Please select a district");
      return;
    }

    // Clear any existing error
    setError("");

    // If onDistrictChange is provided, this is likely used on result pages
    if (onDistrictChange) {
      onDistrictChange(internalDistrict);
      return;
    }

    // For home page search, navigate to appropriate result page
    const route = categoryRoutes[selectedCategory];
    if (route) {
      const searchParams = new URLSearchParams({
        district: internalDistrict,
        category: selectedCategory,
      });
      navigate(`${route}?${searchParams.toString()}`);
      window.scrollTo(0, 0); // Scroll to top after navigation
    }
  };

  return (
    <section className=" bg-gray-100 px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            {title.includes("District") ? (
              <>
                Search by <span className="text-cyan-700">District</span>
              </>
            ) : (
              title
            )}
          </h2>
          <p className="text-base text-gray-600">{subtitle}</p>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-center">
            {!hideCategory && (
              <DropdownSelect
                label="Select Category"
                options={categories}
                selected={selectedCategory}
                onSelect={handleCategoryChange}
              />
            )}
            {/* Smart District Input */}
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Select District"
                  value={searchTerm}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-200"
                  disabled={isLoadingDistricts}
                />
                {isLoadingDistricts && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-600"></div>
                  </div>
                )}
                {!isLoadingDistricts && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                )}

                {/* Dropdown */}
                {showDropdown &&
                  !isLoadingDistricts &&
                  filteredDistricts.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredDistricts.map((district) => (
                        <button
                          key={district}
                          type="button"
                          onClick={() => handleDistrictSelect(district)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors duration-150"
                        >
                          {district}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            </div>
            <div className="w-full lg:w-auto">
              <Button onClick={handleSearch} className="w-full lg:w-auto">
                <MagnifyingGlassIcon className="w-5 h-5" />
                Search
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 text-center">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
