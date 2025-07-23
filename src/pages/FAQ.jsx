import React from "react";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import StaticSection from "../components/sections/StaticSection";
import FAQSection from "../components/sections/FAQSection";

const FAQ = () => {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <StaticSection 
          paragraph="We’re here to help"
          heading="FAQ"
        />
        <div className="max-w-7xl mx-auto mt-12 mb-12">
          <p className="text-left text-gray-600 text-base md:text-lg max-w-2xl mx-auto px-4">
            Our FAQ section is here to make your SkyCamp experience easier. It answers common questions about booking, payments, safety, and more—helping you get the support and confidence you need for your adventures.
          </p>
        </div>
        <FAQSection />
        <div className="max-w-2xl mx-auto my-20 bg-cyan-50 rounded-xl py-10 px-6 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-700 mb-2">Contact us via email <a href="mailto:ask@skycamp.com" className="text-cyan-600 underline">ask@skycamp.com</a></p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FAQ; 