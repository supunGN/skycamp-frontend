import React, { useState } from "react";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import LocationSearchSection from "../components/sections/LocationSearchSection";
import GuidesSection from "../components/sections/GuidesSection";

export default function Guides() {
  const [selectedDistrict, setSelectedDistrict] = useState("");

  return (
    <>
      <Navbar />
      <LocationSearchSection selectedDistrict={selectedDistrict} onDistrictChange={setSelectedDistrict} />
      <GuidesSection selectedDistrict={selectedDistrict} />
      <Footer />
    </>
  );
}
