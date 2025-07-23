import React, { useEffect, useState } from "react";
import GuideCard from "../molecules/GuideCard";

// Mock data for demonstration
const mockGuides = [
  {
    id: 1,
    location: "Ella",
    name: "Samantha Pradeep",
    contact: "+94 76 542 3871",
    rate: 1200,
    rating: 5.0,
    reviews: 22,
    profileImage: null,
  },
  {
    id: 2,
    location: "Nuwara Eliya",
    name: "Anjana Weerasinghe",
    contact: "+94 77 235 1199",
    rate: 1200,
    rating: 5.0,
    reviews: 22,
    profileImage: null,
  },
  {
    id: 3,
    location: "Haputale",
    name: "Nirosha De Alwis",
    contact: "+94 76 901 2231",
    rate: 1200,
    rating: 5.0,
    reviews: 22,
    profileImage: null,
  },
  {
    id: 4,
    location: "Ella",
    name: "Samantha Pradeep",
    contact: "+94 76 542 3871",
    rate: 1200,
    rating: 5.0,
    reviews: 22,
    profileImage: null,
  },
  {
    id: 5,
    location: "Bandarawela",
    name: "Ravindu Senarath",
    contact: "+94 71 889 4433",
    rate: 1200,
    rating: 5.0,
    reviews: 22,
    profileImage: null,
  },
  {
    id: 6,
    location: "Ohiya",
    name: "Dilshan Jayasinghe",
    contact: "+94 78 112 5600",
    rate: 1200,
    rating: 5.0,
    reviews: 22,
    profileImage: null,
  },
];

export default function GuidesSection({ selectedDistrict }) {
  const [guides, setGuides] = useState([]);

  useEffect(() => {
    // In a real app, fetch from API with selectedDistrict as a filter
    if (selectedDistrict) {
      setGuides(
        mockGuides.filter(
          (guide) => guide.location.toLowerCase() === selectedDistrict.toLowerCase()
        )
      );
    } else {
      setGuides(mockGuides);
    }
  }, [selectedDistrict]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Guide List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {guides.length > 0 ? (
          guides.map((guide) => (
            <GuideCard key={guide.id} {...guide} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-12">No guides found for this district.</div>
        )}
      </div>
    </section>
  );
} 