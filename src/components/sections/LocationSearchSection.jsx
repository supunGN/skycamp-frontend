"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Button from "../atoms/Button";
import DropdownSelect from "../molecules/DropdownSelect";

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

export default function LocationSearchSection({ selectedDistrict: externalSelectedDistrict, onDistrictChange }) {
  const [internalSelectedDistrict, setInternalSelectedDistrict] = useState("");
  const selectedDistrict = externalSelectedDistrict !== undefined ? externalSelectedDistrict : internalSelectedDistrict;
  const setSelectedDistrict = onDistrictChange || setInternalSelectedDistrict;

  const handleSearch = () => {
    // Optionally, trigger search logic here
    if (selectedDistrict) {
      // Could call onDistrictChange(selectedDistrict) if needed
    }
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
            <DropdownSelect
              label="Where"
              options={districts}
              selected={selectedDistrict}
              onSelect={setSelectedDistrict}
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
