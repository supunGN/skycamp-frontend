import React from "react";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import LocationSearchSection from "../components/sections/LocationSearchSection";
import RentalCard from "../components/molecules/RentalCard";
import Button from "../components/atoms/Button";
import { useNavigate } from "react-router-dom";

// Import rental images
import ThiliniImg from "../assets/rentals/Thilini.png";
import KasunImg from "../assets/rentals/Kasun.png";
import UpulImg from "../assets/rentals/Upul.png";
import MenakaImg from "../assets/rentals/Menaka.png";
import RiznaImg from "../assets/rentals/Rizna.png";
import NadeeshaImg from "../assets/rentals/Nadeesha.png";
import DinithiImg from "../assets/rentals/Dinithi.png";
import AnjanaImg from "../assets/rentals/Anjana.png";
import ChamindaImg from "../assets/rentals/Chaminda.png";
import DewmiImg from "../assets/rentals/Dewmi.png";
import BandaraImg from "../assets/rentals/Bandara.png";
import NandanaImg from "../assets/rentals/Nandana.png";

const rentalData = [
  {
    image: ThiliniImg,
    location: "Nuwara Eliya",
    name: "Thilini Abeykoon",
    phone: "+94 77 235 1198",
    rating: 5.0,
    reviewCount: 22,
  },
  {
    image: KasunImg,
    location: "Ella",
    name: "Kasun Perera",
    phone: "+94 77 235 1128",
    rating: 5.0,
    reviewCount: 22,
  },
  {
    image: UpulImg,
    location: "Bandarawela",
    name: "Upul Fernando",
    phone: "+94 77 235 0002",
    rating: 5.0,
    reviewCount: 22,
  },
  {
    image: MenakaImg,
    location: "Haputale",
    name: "Menaka Silva",
    phone: "+94 77 235 1234",
    rating: 5.0,
    reviewCount: 22,
  },
  {
    image: RiznaImg,
    location: "Badulla",
    name: "Rizna Nazeer",
    phone: "+94 77 235 8767",
    rating: 5.0,
    reviewCount: 22,
  },
  {
    image: NadeeshaImg,
    location: "Badulla",
    name: "Nadeesha Jayasuriya",
    phone: "+94 77 235 7777",
    rating: 5.0,
    reviewCount: 22,
  },
  {
    image: DinithiImg,
    location: "Ohiya",
    name: "Dinithi Madushani",
    phone: "+94 77 235 9809",
    rating: 5.0,
    reviewCount: 22,
  },
  {
    image: AnjanaImg,
    location: "Bandarawela",
    name: "Anjana Weerasinghe",
    phone: "+94 77 235 9999",
    rating: 5.0,
    reviewCount: 22,
  },
  {
    image: ChamindaImg,
    location: "Kalapahana",
    name: "Chaminda Herath",
    phone: "+94 77 235 2233",
    rating: 5.0,
    reviewCount: 22,
  },
  {
    image: DewmiImg,
    location: "Welimada",
    name: "Dewmi Seya",
    phone: "+94 77 235 5656",
    rating: 5.0,
    reviewCount: 22,
  },
  {
    image: BandaraImg,
    location: "Bandarawela",
    name: "Bandara Dissanayake",
    phone: "+94 77 235 7777",
    rating: 5.0,
    reviewCount: 22,
  },
  {
    image: NandanaImg,
    location: "Nawalapitiya",
    name: "Nandana De Silva",
    phone: "+94 77 235 2345",
    rating: 5.0,
    reviewCount: 22,
  },
];

// Camping Gear Sidebar Section (static, matches UI)
const CampingGearSidebar = () => {
  const navigate = useNavigate();
  const handleSearch = () => {
    navigate("/selected_individualrenter");
    window.scrollTo(0, 0);
  };
  return (
    <aside className="bg-white rounded-2xl shadow-sm p-4 mb-8 w-full lg:w-72 text-sm">
      {/* Increased font size for heading */}
      <h3 className="font-bold text-cyan-700 mb-4 text-xl">Camping Gears</h3>
      <div className="mb-6">
        <div className="font-semibold mb-2">Tents</div>
        <div className="space-y-1">
          <label className="flex items-center gap-2">
            <input type="checkbox" /> 1-person tent
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> 2-person tent
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> 3 or more person tent
          </label>
        </div>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">Sleeping Gear</div>
        <div className="space-y-1">
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Sleeping bags
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Air mattress
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Camping pillow
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Emergency blanket
          </label>
        </div>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">Cooking & Kitchen Items</div>
        <div className="space-y-1">
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Single gas stove
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Double gas stove
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Gas BBQ grill
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Cooking pot and pan set
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Kettle for boiling water
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Fork, spoon, knife set
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Chopping board
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Reusable plates and bowls
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Food storage containers
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Cooler box
          </label>
        </div>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">Camping Furniture</div>
        <div className="space-y-1">
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Camping chair
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Folding table
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Hammock
          </label>
        </div>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">Lights</div>
        <div className="space-y-1">
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Camping lanterns
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> torch
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Tent hanging light
          </label>
        </div>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">Navigation & Safety Tools</div>
        <div className="space-y-1">
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Compass & Map
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Emergency whistle
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> First-aid kit
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Walkie-talkies
          </label>
        </div>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">Water & Hydration</div>
        <div className="space-y-1">
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Water bottles
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Water jugs
          </label>
        </div>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">Bags & Storage</div>
        <div className="space-y-1">
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Hiking backpacks
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Dry bags
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Waterproof pouches
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Gear organizer bag
          </label>
        </div>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">Clothing</div>
        <div className="space-y-1">
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Raincoat
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Warm jacket
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Waterproof shoes
          </label>
        </div>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">Fun & Extras</div>
        <div className="space-y-1">
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Card games / Board games
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Travel guitar
          </label>
        </div>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">Power & Charging</div>
        <div className="space-y-1">
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Power bank & Cables
          </label>
        </div>
      </div>
      {/* Stargazing Gears Section */}
      <h3 className="font-bold text-cyan-700 mb-4 text-xl mt-10">
        Stargazing Gears
      </h3>
      <div className="mb-6">
        <div className="font-semibold mb-2">Binoculars</div>
        <div className="space-y-1">
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Small binoculars
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Stargazing binoculars
          </label>
        </div>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">Telescopes</div>
        <div className="space-y-1">
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Beginner telescope
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Big telescope
          </label>
        </div>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">Tripods & Mounts</div>
        <div className="space-y-1">
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Tripod stands for telescope or binoculars
          </label>
        </div>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">Accessories</div>
        <div className="space-y-1">
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Star maps or books
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Power bank for telescope
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Laser pointer for pointing at stars
          </label>
        </div>
      </div>
      {/* Search Button */}
      <Button
        size="sm"
        variant="primary"
        className="w-full mt-2"
        onClick={handleSearch}
      >
        Search
      </Button>
    </aside>
  );
};

const Rentals = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* Navbar */}
      <Navbar />
      {/* Location Search Section */}
      <LocationSearchSection />
      {/* Add space between search and rental area */}
      <div className="h-10" />
      {/* Main Content: Sidebar + Rental Cards */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Camping Gear Sidebar */}
          <div className="flex-shrink-0 w-full lg:w-72">
            <CampingGearSidebar />
          </div>
          {/* Rental Cards Section */}
          <div className="flex-1 sticky top-28 self-start">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Gear Rentals
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rentalData.map((rental, idx) => {
                // Link Upul Fernando to /fullrenter
                if (rental.name === "Upul Fernando") {
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        navigate("/fullrenter");
                        window.scrollTo(0, 0);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <RentalCard {...rental} />
                    </div>
                  );
                }
                return <RentalCard key={idx} {...rental} />;
              })}
            </div>
          </div>
        </div>
      </div>
      {/* Divider line above footer */}
      <hr className="mt-16 mb-0 border-gray-200 max-w-7xl mx-auto w-full" />
      {/* Footer */}
      <Footer />
    </>
  );
};

export default Rentals;
