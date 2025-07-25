import React from "react";
import Button from "../../../components/atoms/Button";
import DestinationCard from "../../../components/molecules/destination/DestinationCard";

const mockServices = [
  {
    id: 1,
    name: "Tent Rental",
    description: "High-quality tents for 2-4 people.",
    image: "/src/assets/cart_images/tent.png",
    rating: 4.7,
    reviewCount: 28,
  },
  {
    id: 2,
    name: "Sleeping Bag",
    description: "Warm sleeping bags for cold nights.",
    image: "/src/assets/cart_images/sleeping_bag.png",
    rating: 4.5,
    reviewCount: 19,
  },
  {
    id: 3,
    name: "Camping Stove",
    description: "Portable stove for outdoor cooking.",
    image: "/src/assets/cart_images/gas.png",
    rating: 4.8,
    reviewCount: 15,
  },
  {
    id: 4,
    name: "Camping Chair",
    description: "Comfortable chairs for your campsite.",
    image: "/src/assets/cart_images/chair.png",
    rating: 4.6,
    reviewCount: 12,
  },
];

export default function MyServices() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Services</h2>
      <Button className="mb-6">Add New Service</Button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockServices.map((service) => (
          <DestinationCard key={service.id} {...service} />
        ))}
      </div>
    </div>
  );
}
