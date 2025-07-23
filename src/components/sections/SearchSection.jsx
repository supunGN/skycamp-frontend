"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Button from "../atoms/Button";
import DropdownSelect from "../molecules/DropdownSelect";

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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [internalDistrict, setInternalDistrict] = useState(selectedDistrict);

  const handleDistrictChange = (district) => {
    setInternalDistrict(district);
    if (onDistrictChange) onDistrictChange(district);
  };

  const handleSearch = () => {
    // Only call onDistrictChange if provided
    if (onDistrictChange) onDistrictChange(internalDistrict);
    // Optionally handle category search for other pages
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
          <p className="text-base text-gray-600">
            {subtitle}
          </p>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-center">
            {!hideCategory && (
              <DropdownSelect
                label="Select Category"
                options={categories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
            )}
            <DropdownSelect
              label="Where"
              options={districts}
              selected={internalDistrict}
              onSelect={handleDistrictChange}
            />
            <div className="w-full lg:w-auto">
              <Button onClick={handleSearch} className="w-full lg:w-auto">
                <MagnifyingGlassIcon className="w-5 h-5" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
