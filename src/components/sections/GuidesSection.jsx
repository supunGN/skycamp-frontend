import React, { useEffect, useState } from "react";
import GuideCard from "../molecules/GuideCard";
import Button from "../atoms/Button";

import SamanthaPradeepImg from "../../assets/guides/SamanthaPradeep.png";
import AnjanaWeerasingheImg from "../../assets/guides/AnjanaWeerasinghe.png";
import NiroshaDeAlwisImg from "../../assets/guides/Nirosha De Alwis.png";
import RavinduSenarathImg from "../../assets/guides/RavinduSenarath.png";
import DilshanJayasingheImg from "../../assets/guides/DilshanJayasinghe.png";

import { Link } from "react-router-dom";

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
    profileImage: SamanthaPradeepImg,
  },
  {
    id: 2,
    location: "Nuwara Eliya",
    name: "Anjana Weerasinghe",
    contact: "+94 77 235 1199",
    rate: 1200,
    rating: 5.0,
    reviews: 22,
    profileImage: AnjanaWeerasingheImg,
  },
  {
    id: 3,
    location: "Haputale",
    name: "Nirosha De Alwis",
    contact: "+94 76 901 2231",
    rate: 1200,
    rating: 5.0,
    reviews: 22,
    profileImage: NiroshaDeAlwisImg,
  },
  {
    id: 4,
    location: "Ella",
    name: "Samantha Pradeep",
    contact: "+94 76 542 3871",
    rate: 1200,
    rating: 5.0,
    reviews: 22,
    profileImage: SamanthaPradeepImg,
  },
  {
    id: 5,
    location: "Bandarawela",
    name: "Ravindu Senarath",
    contact: "+94 71 889 4433",
    rate: 1200,
    rating: 5.0,
    reviews: 22,
    profileImage: RavinduSenarathImg,
  },
  {
    id: 6,
    location: "Ohiya",
    name: "Dilshan Jayasinghe",
    contact: "+94 78 112 5600",
    rate: 1200,
    rating: 5.0,
    reviews: 22,
    profileImage: DilshanJayasingheImg,
  },
];

export default function GuidesSection({ selectedDistrict }) {
  const [guides, setGuides] = useState([]);

  useEffect(() => {
    // In a real app, fetch from API with selectedDistrict as a filter
    if (selectedDistrict) {
      setGuides(
        mockGuides.filter(
          (guide) =>
            guide.location.toLowerCase() === selectedDistrict.toLowerCase()
        )
      );
    } else {
      setGuides(mockGuides);
    }
  }, [selectedDistrict]);

  // Show only first 6 guides
  const displayedGuides = guides.slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
        Guide List
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {guides.length > 0 ? (
          guides.map((guide) => (
            <Link key={guide.id} to={`/guide/${guide.id}`} className="block">
              <GuideCard {...guide} />
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-12">
            No guides found for this district.
          </div>
        )}
      </div>
      {displayedGuides.length > 0 && (
        <div className="flex justify-center mt-10">
          <Button>Show All Guides</Button>
        </div>
      )}
    </section>
  );
}
