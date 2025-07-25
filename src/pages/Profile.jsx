import React, { useState } from "react";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import ProfileSidebar from "../components/molecules/ProfileSidebar";
import PersonalInfoForm from "../components/molecules/PersonalInfoForm";
import DropdownSelect from "../components/molecules/DropdownSelect";

const menuItems = [
  "My details",
  "Password",
  "NIC",
  "My Bookings",
  "Travel Buddy",
  "Settings",
];

export default function Profile() {
  const [activeMenu, setActiveMenu] = useState(menuItems[0]);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto relative block lg:flex lg:gap-8 min-h-[80vh]">
        {/* Sidebar for desktop */}
        <div className="sticky top-32 h-full rounded-2xl overflow-hidden shadow">
          <aside className="hidden lg:block w-64 h-fit">
            <ProfileSidebar />
          </aside>
        </div>
        {/* Main content area */}
        <section className="flex-1 flex flex-col items-center w-full px-0 sm:px-4 pt-24">
          {/* DropdownSelect for mobile/tablet below navbar, above profile info */}
          <div className="block lg:hidden w-full max-w-sm  z-40 relative">
            <DropdownSelect
              label="Select section"
              options={menuItems}
              selected={activeMenu}
              onSelect={setActiveMenu}
              itemClassName="block px-4 py-2 hover:bg-gray-100"
              buttonClassName="border bg-white"
            />
          </div>
          {/* Profile image, name, and form stacked below dropdown on mobile */}
          <div className="w-full max-w-2xl p-6 mb-8">
            <PersonalInfoForm formGridClass="grid grid-cols-1 lg:grid-cols-2 gap-4" />
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
