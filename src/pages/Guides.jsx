import React, { useState } from "react";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import SearchSection from "../components/sections/SearchSection";
import GuidesSection from "../components/sections/GuidesSection";

export default function Guides() {
  const [selectedDistrict, setSelectedDistrict] = useState("");

  return (
    <>
      <Navbar />
      <SearchSection
        selectedDistrict={selectedDistrict}
        onDistrictChange={setSelectedDistrict}
        hideCategory
        title="Search by District"
        subtitle="Kickstart your adventure by finding a trusted guide in your preferred district"
      />
      <GuidesSection selectedDistrict={selectedDistrict} />
      <Footer />
    </>
  );
}
