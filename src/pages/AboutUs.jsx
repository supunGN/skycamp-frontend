import React, { useEffect } from "react";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import StaticSection from "../components/sections/StaticSection";
import AimSection from "../components/sections/AboutUsSection/AimSection";
import CoreValuesSection from "../components/sections/AboutUsSection/CoreValuesSection";
import WhoWeAreSection from "../components/sections/AboutUsSection/WhoWeAreSection";

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <StaticSection 
        paragraph="About SkyCamp"
        heading="About Us"
  />
        <WhoWeAreSection />
        <AimSection />
        <CoreValuesSection />
      </main>
      <Footer />
    </>
  );
}; 

export default AboutUs;
