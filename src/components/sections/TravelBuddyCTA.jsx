"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../atoms/Button";
import TravelBuddyModal from "../molecules/TravelBuddyModal";
import { API } from "../../api";
import buddyImage from "../../assets/travelbuddy/travel-buddy-cta.png";

export default function TravelBuddyCTA() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Helper function to get user from localStorage
  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  };

  const handleConnectClick = async (e) => {
    e.preventDefault();

    const user = getUser();

    // Check if user is authenticated
    if (!user) {
      navigate("/login");
      return;
    }

    // Check if user is a customer
    if (user.user_role !== "customer") {
      // Non-customers can't access Travel Buddy
      return;
    }

    try {
      // Check Travel Buddy status
      const response = await API.travelBuddy.getStatus();

      if (response.data.enabled) {
        // Travel Buddy is enabled, navigate to Travel Buddy page
        navigate("/travel-buddy");
      } else {
        // Travel Buddy is not enabled, show modal
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error checking Travel Buddy status:", error);
      // On error, show modal as fallback
      setShowModal(true);
    }
  };

  const handleGoToSettings = () => {
    setShowModal(false);
    navigate("/profile");
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <section className="bg-white pt-20">
        <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-10 px-4 sm:px-6 lg:px-8">
          {/* Left Text Section */}
          <div className="flex-1 w-full text-center lg:text-left">
            <h2 className="text-3xl sm:text-5xl font-semibold leading-tight text-gray-900 mb-4">
              Is your backpack ready?
              <br />
              But your <span className="text-cyan-700">Buddy</span> missing?
            </h2>
            <p className="text-base text-gray-600 mb-6">
              Click here to meet your travel buddy
            </p>

            <div className="w-full flex justify-center lg:justify-start">
              <Button
                size="lg"
                variant="primary"
                className="w-full lg:w-auto"
                onClick={handleConnectClick}
              >
                Connect
              </Button>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="flex-1 w-full flex justify-center">
            <img
              src={buddyImage}
              alt="Lonely backpacker thinking of group"
              className="rounded-xl w-full max-w-md h-auto"
            />
          </div>
        </div>
      </section>

      {/* Travel Buddy Modal */}
      <TravelBuddyModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onGoToSettings={handleGoToSettings}
      />
    </>
  );
}
