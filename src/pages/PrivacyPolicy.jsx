import React from "react";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import StaticSection from "../components/sections/StaticSection";
import PrivacyPolicySection from "../components/sections/PrivacyPolicySection";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <StaticSection 
          paragraph="Current as of 01 August, 2025"
          heading="Privacy Policy"  
        />
        <PrivacyPolicySection />
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy; 