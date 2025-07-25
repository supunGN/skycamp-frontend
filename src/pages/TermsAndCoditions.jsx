import React, { useEffect } from "react";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import StaticSection from "../components/sections/StaticSection";
import TermsSection from "../components/sections/TermsSection";

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <StaticSection 
          paragraph="Current as of 01 August, 2025"
          heading="Terms and Conditions"  
        />
        <TermsSection />
      </main>
      <Footer />
    </>
  );
}; 

export default TermsAndConditions;
