import React from "react";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import StaticSection from "../components/sections/StaticSection";
import AimSection from "../components/sections/AboutUsSection/AimSection";
import CoreValuesSection from "../components/sections/AboutUsSection/CoreValuesSection";

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <StaticSection />
        <WhoWeAreSection />
        <AimSection />
        <CoreValuesSection />
      </main>
      <Footer />
    </>
  );
};

export default AboutUs;
