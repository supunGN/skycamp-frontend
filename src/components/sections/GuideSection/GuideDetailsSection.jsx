import React from "react";
import Button from "../../atoms/Button";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";

const GuideDetailsSection = ({ guide }) => (
  <section className="rounded-2xl px-6 py-6 md:py-8 md:px-10 w-full max-w-5xl mx-auto mb-8 mt-8 md:mt-20">
    <div className="flex flex-col md:flex-row md:items-start w-full gap-4 md:gap-8">
      {/* Profile Image */}
      <img
        src={guide?.image || ""}
        alt={guide?.name || "Guide"}
        className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover flex-shrink-0"
      />
      {/* Name, Details, and Buttons */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-2 md:gap-0">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight mb-2 md:mb-0">
            {guide?.name || "Guide Name"}
          </h1>
          <div className="flex flex-row gap-2 mt-2 md:mt-0 md:ml-8 items-center">
            <Button className="px-5 py-2 text-sm font-semibold">Book Now</Button>
            <Button variant="secondary" className="px-5 py-2 text-sm font-semibold flex items-center gap-2">
              Add to Wishlist
              <HeartIconOutline className="w-5 h-5 text-gray-700" />
            </Button>
          </div>
        </div>
        <div className="flex flex-row items-center gap-6 mb-1 mt-1">
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold text-gray-900">{guide?.reviews || 0}</span>
            <span className="text-xs text-gray-500 font-light">Reviews</span>
          </div>
          <span className="w-px h-6 bg-gray-200"></span>
          <div className="flex flex-col items-center">
            <span className="flex items-center text-lg font-semibold text-gray-900">
              {guide?.rating || 0} <svg className="w-4 h-4 text-gray-700 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
            </span>
            <span className="text-xs text-gray-500 font-light">Reviews</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7-7.5 11-7.5 11s-7.5-4-7.5-11a7.5 7.5 0 1115 0z" /></svg>
          <span className="text-base text-gray-700 font-medium">{guide?.location || "Location"}</span>
        </div>
      </div>
    </div>
  </section>
);

export default GuideDetailsSection; 