"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Button from "../atoms/Button";
import DropdownSelect from "../molecules/DropdownSelect";
import { API } from "../../api";

export default function LocationSearchSection({
  selectedDistrict: externalSelectedDistrict,
  onDistrictChange,
  onSearch,
  onReset,
  isLoading = false,
  isFiltered = false,
  category = "locations",
}) {
  const [internalSelectedDistrict, setInternalSelectedDistrict] = useState("");
  const [districts, setDistricts] = useState([]);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedDistrict =
    externalSelectedDistrict !== undefined
      ? externalSelectedDistrict
      : internalSelectedDistrict;
  const setSelectedDistrict = onDistrictChange || setInternalSelectedDistrict;

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

  // Update searchTerm when selectedDistrict changes externally
  useEffect(() => {
    if (externalSelectedDistrict !== undefined) {
      setSearchTerm(externalSelectedDistrict);
    }
  }, [externalSelectedDistrict]);

  const handleSearch = () => {
    if (selectedDistrict && onSearch) {
      onSearch(selectedDistrict);
    }
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
    setInternalSelectedDistrict("");
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleInputChange = (value) => {
    setSearchTerm(value);
    setShowDropdown(true);

    // If user types a district name that matches exactly, select it
    const exactMatch = districts.find(
      (district) => district.toLowerCase() === value.toLowerCase()
    );
    if (exactMatch) {
      setSelectedDistrict(exactMatch);
    } else {
      setSelectedDistrict("");
    }
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setSearchTerm(district);
    setShowDropdown(false);
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleInputBlur = () => {
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => setShowDropdown(false), 200);
  };

  return (
    <section className=" bg-gray-100 px-4 sm:px-6 lg:px-8 pt-40 pb-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Search by
            <span className="text-cyan-700"> District</span>
          </h2>
          <p className="text-base text-gray-600">
            Kickstart your adventure by finding a trusted guide in your
            preferred district
          </p>
        </div>

        {/* Form */}
        <div className="max-w-xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-center">
            {/* Custom Searchable District Input */}
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder={
                    isLoadingDistricts
                      ? "Loading districts..."
                      : "Type or select a district..."
                  }
                  disabled={isLoadingDistricts}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
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

                {/* Dropdown */}
                {showDropdown && !isLoadingDistricts && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredDistricts.length > 0 ? (
                      filteredDistricts.map((district) => (
                        <div
                          key={district}
                          onClick={() => handleDistrictSelect(district)}
                          className="px-3 py-2 hover:bg-cyan-50 cursor-pointer text-sm"
                        >
                          {district}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        No districts found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <Button
                onClick={handleSearch}
                disabled={!selectedDistrict || isLoading || isLoadingDistricts}
                className="flex-1 lg:flex-none"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
                {isLoading ? "Searching..." : "Search"}
              </Button>
              {isFiltered && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  disabled={isLoading}
                  className="flex-1 lg:flex-none"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
          {isFiltered && (
            <div className="mt-4 p-3 bg-cyan-50 border border-cyan-200 rounded-md">
              <p className="text-sm text-cyan-800 text-center">
                Showing {category} in <strong>{selectedDistrict}</strong>{" "}
                district
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
