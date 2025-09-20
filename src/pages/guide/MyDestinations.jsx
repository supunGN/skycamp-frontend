import React from "react";
import DestinationCard from "../../components/molecules/destination/DestinationCard";
import Button from "../../components/atoms/Button";

const mockDestinations = [
  {
    id: 1,
    name: "Horton Plains",
    description: "A beautiful highland plateau with unique wildlife.",
    image: "/src/assets/camping_destinations/Horton Plains.png",
    rating: 4.8,
    reviewCount: 34,
  },
  {
    id: 2,
    name: "Riverston Peak",
    description: "Stunning views and cool mountain air.",
    image: "/src/assets/camping_destinations/Riverston Peak.png",
    rating: 4.6,
    reviewCount: 21,
  },
  {
    id: 3,
    name: "Wewathenna Mountain",
    description: "A remote mountain destination for true adventurers.",
    image: "/src/assets/camping_destinations/Wewathenna Mountain.png",
    rating: 4.9,
    reviewCount: 18,
  },
];

export default function MyDestinations() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        My Destinations
      </h2>
      <Button className="mb-6">Add New Destination</Button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDestinations.map((dest) => (
          <DestinationCard key={dest.id} {...dest} locationId={dest.id} />
        ))}
      </div>
    </div>
  );
}
