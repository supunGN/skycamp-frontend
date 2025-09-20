import React from "react";
import GuideCard from "../molecules/GuideCard";
import { Link } from "react-router-dom";

export default function GuidesSection({
  guides = [],
  selectedDistrict,
  loading,
  error,
}) {
  const handleGuideClick = (guide) => {
    // Navigate to individual guide page
    console.log("Navigate to guide:", guide.id);
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
          Guide List
        </h2>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
          <span className="ml-3 text-gray-600">Loading guides...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
          Guide List
        </h2>
        <div className="text-center text-red-600 py-12">
          <p>Error: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
        {selectedDistrict ? `Guides in ${selectedDistrict}` : "Guide List"}
      </h2>

      {guides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {guides.map((guide) => (
            <Link
              key={guide.id}
              to={`/guide/${guide.id}`}
              className="block"
              onClick={() => handleGuideClick(guide)}
            >
              <GuideCard
                location={guide.location}
                name={guide.name}
                contact={guide.phone}
                rate={guide.rate}
                rating={guide.rating}
                reviews={guide.reviewCount}
                profileImage={guide.image}
                guideId={guide.id}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="col-span-full text-center text-gray-500 py-12">
          {selectedDistrict
            ? `No guides found in ${selectedDistrict}.`
            : "No guides available at the moment."}
        </div>
      )}
    </section>
  );
}
