// Wishlist.jsx
import React, { useState } from "react";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import StaticSection from "../components/sections/StaticSection";
import CampingDestinations from "../components/sections/CampingDestinations";
import StargazingSpots from "../components/sections/StargazingSpots";
import HorizontalTabs from "../components/molecules/HorizontalTabs";

const Wishlist = () => {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Static Section for Wishlist Title and Subtitle */}
      <StaticSection
        paragraph="Ready When You Are"
        heading="Wishlist"
      />

      {/* Horizontal Tabs (Camping Destinations, Stargazing Spots, Guides, Renters) */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <HorizontalTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Conditional Section Rendering */}
      <div className="max-w-7xl mx-auto px-4">
        {activeTab === 0 && <CampingDestinations />}
        {activeTab === 1 && <StargazingSpots />}
        {/* Add more sections for Guides and Renters as needed */}
      </div>
      
      <hr className="mt-20 mb-0 border-gray-200 max-w-7xl mx-auto w-full" />

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Wishlist; 