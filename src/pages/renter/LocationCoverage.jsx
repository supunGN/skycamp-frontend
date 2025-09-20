import React from "react";
import Button from "../../components/atoms/Button";

const mockLocations = ["Colombo", "Kandy", "Galle"];

export default function LocationCoverage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Location & Coverage
      </h2>
      <Button className="mb-4">Add Coverage Area</Button>
      <div className="h-64 bg-gray-100 flex items-center justify-center rounded mb-6">
        <span className="text-gray-400 text-lg">Map Placeholder</span>
      </div>
      <div className="space-y-2 bg-white p-4 rounded shadow-sm">
        {mockLocations.map((loc, idx) => (
          <div key={idx} className="text-gray-700 font-medium">
            {loc}
          </div>
        ))}
      </div>
    </div>
  );
}
