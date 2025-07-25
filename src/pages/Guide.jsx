import React from "react";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import GuideDetailsSection from "../components/sections/GuideSection/GuideDetailsSection";
import GuideAvailabilitySection from "../components/sections/GuideSection/GuideAvailabilitySection";
import GuideBioSection from "../components/sections/GuideSection/GuideBioSection";
import GuideImagesSection from "../components/sections/GuideSection/GuideImagesSection";
import SpecialNote from "../components/sections/GuideSection/SpecialNote";

import profileImg from "../assets/individual_guide/image.png";
import img1 from "../assets/individual_guide/img1.png";
import img2 from "../assets/individual_guide/img2.png";
import img3 from "../assets/individual_guide/img3.png";

const guide = {
  name: "Samantha Pradeep",
  image: profileImg,
  reviews: 12,
  rating: 4.8,
  location: "Badulla",
  bio: "I love being a guide because it allows me to share the beauty of Sri Lanka with others. I'm passionate about creating safe, fun, and unforgettable outdoor experiences for every traveler. Whether you're a solo camper or with a group, I'll do my best to make your journey smooth, informative, and memorable!",
  address: "No. 45, Kalupahana Road, Belihuloya",
  phone: "+94 76 542 3871",
  email: "samantha.guide@gmail.com",
  languages: ["Sinhala", "English"],
  currency: "LKR",
  specialNote: "Hi campers! I'm available from Wednesday to Friday this week for trips around Horton Plains and Belihuloya. Saturday and Tuesday I'm off, but feel free to message me in advance to plan your adventure!",
  availability: [
    { day: "Monday", available: true, time: "8:00 AM - 12:00 PM" },
    { day: "Tuesday", available: false, time: "" },
    { day: "Wednesday", available: true, time: "8:00 AM - 12:00 PM" },
    { day: "Thursday", available: true, time: "8:00 AM - 12:00 PM" },
    { day: "Friday", available: true, time: "8:00 AM - 12:00 PM" },
    { day: "Saturday", available: false, time: "" },
    { day: "Sunday", available: true, time: "8:00 AM - 12:00 PM" },
  ],
  images: [
    img1,
    img2,
    img3,
  ],
};

const Guide = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Navbar />
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
      <GuideDetailsSection guide={guide} />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-8">
        <div className="md:col-span-4">
          <GuideAvailabilitySection availability={guide.availability} />
        </div>
        <div className="hidden md:block w-px bg-gray-200 mx-2 rounded-full md:col-span-1" style={{ minHeight: '100%' }}></div>
        <div className="md:col-span-7 flex flex-col gap-8">
          <GuideBioSection guide={guide} />
          <SpecialNote note={guide.specialNote} />
        </div>
      </div>
      <hr className="my-16 border-gray-200" />
      <GuideImagesSection images={guide.images} />
    </main>
    <Footer />
  </div>
);

export default Guide; 