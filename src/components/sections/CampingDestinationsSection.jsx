"use client";

import { useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import CampingCard from "../organisms/CampingCard";
import Button from "../atoms/Button";
import campingDestinations from "../../data/campingDestinations";

export default function CampingDestinationsSection() {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Camping Destinations
          </h2>
          <p className="text-gray-600 max-w-2xl">
            Explore Sri Lanka’s top camping spots surrounded by nature—perfect
            for outdoor adventures, relaxation, and breathtaking views.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          className="bg-cyan-600 hover:bg-cyan-700 whitespace-nowrap"
        >
          Show all Camping Destinations
        </Button>
      </div>

      {/* Carousel */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 scrollbar-hide scroll-smooth pb-2"
        >
          {campingDestinations.map((destination) => (
            <div
              key={destination.id}
              className="flex-shrink-0 w-[calc(100%/1.1)] sm:w-[calc(100%/1.5)] md:w-[calc(100%/2.2)] lg:w-[calc(100%/3.05)]"
            >
              <CampingCard destination={destination} />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={scrollLeft}
            className="p-3 rounded-full border border-gray-300 hover:bg-gray-100"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={scrollRight}
            className="p-3 rounded-full border border-gray-300 hover:bg-gray-100"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
}
