import React, { useState, useEffect } from "react";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import ProfileHorizontalNav from "../components/molecules/ProfileHorizontalNav";
import PersonalDetails from "./profile/PersonalDetails";
import Security from "./profile/Security";
import Verification from "./profile/Verification";
import MyBookings from "./profile/MyBookings";
import TravelBuddy from "./profile/TravelBuddy";
import Settings from "./profile/Settings";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("details");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData({
        firstName: userData.first_name || "",
        lastName: userData.last_name || "",
        email: userData.email || "",
        phone: userData.phone_number || "",
        dob: userData.dob || "",
        gender: userData.gender || "",
        address: userData.home_address || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSave = () => {
    // Refresh user data from localStorage after profile update
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData({
        firstName: userData.first_name || "",
        lastName: userData.last_name || "",
        email: userData.email || "",
        phone: userData.phone_number || "",
        dob: userData.dob || "",
        gender: userData.gender || "",
        address: userData.home_address || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "details":
        return (
          <PersonalDetails
            user={user}
            formData={formData}
            onInputChange={handleInputChange}
            onSave={handleSave}
          />
        );
      case "password":
        return (
          <Security formData={formData} onInputChange={handleInputChange} />
        );
      case "verification":
        return <Verification user={user} />;
      case "bookings":
        return <MyBookings />;
      case "travel-buddy":
        return <TravelBuddy user={user} />;
      case "settings":
        return <Settings user={user} />;
      default:
        return (
          <PersonalDetails
            user={user}
            formData={formData}
            onInputChange={handleInputChange}
            onSave={handleSave}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 mt-16"></div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Horizontal Navigation */}
          <ProfileHorizontalNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Page Content - Centered */}
          <div className="max-w-4xl mx-auto">{renderContent()}</div>
        </div>
      </div>
      <Footer />
    </>
  );
}
