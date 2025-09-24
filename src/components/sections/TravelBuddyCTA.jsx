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

    // Log when the Connect button is clicked
    console.log("🚀 TravelBuddyCTA: Connect button clicked!");
    console.log("🚀 TravelBuddyCTA: Event details:", {
      type: e.type,
      target: e.target,
      timestamp: new Date().toISOString(),
    });

    const user = getUser();
    console.log("TravelBuddyCTA: User from localStorage:", user);

    // Check if user is authenticated
    if (!user) {
      console.log("TravelBuddyCTA: No user found, navigating to login");
      navigate("/login");
      return;
    }

    // Check if user is a customer
    if (user.user_role !== "customer") {
      console.log(
        "TravelBuddyCTA: User is not a customer, role:",
        user.user_role
      );
      console.log(
        "TravelBuddyCTA: Travel Buddy is only available for customers"
      );
      // Non-customers can't access Travel Buddy
      return;
    }

    console.log(
      "TravelBuddyCTA: User is authenticated customer, checking travel buddy status"
    );
    console.log("TravelBuddyCTA: Expected behavior:");
    console.log(
      "  - If travel_buddy_status = 'Active': Navigate to /travel-buddy"
    );
    console.log(
      "  - If travel_buddy_status = 'Inactive': Show modal to enable"
    );
    console.log("  - If verification_status != 'Yes': May need verification");

    try {
      // Debug session first
      console.log("TravelBuddyCTA: Calling debug endpoint first...");
      try {
        const debugResponse = await API.travelBuddy.debug();
        console.log("TravelBuddyCTA: Debug response:", debugResponse);

        // Log key debug information
        if (debugResponse?.debug) {
          console.log("TravelBuddyCTA: Debug info summary:", {
            session_id: debugResponse.debug.session_id,
            authenticated: debugResponse.debug.authenticated,
            user_role: debugResponse.debug.user_role,
            user_id: debugResponse.debug.user_id_from_session,
            customer_info: debugResponse.debug.customer_info,
          });

          if (
            debugResponse.debug.customer_info &&
            typeof debugResponse.debug.customer_info === "object"
          ) {
            console.log(
              "TravelBuddyCTA: Customer travel buddy status from debug:",
              debugResponse.debug.customer_info.travel_buddy_status
            );
            console.log(
              "TravelBuddyCTA: Customer verification status from debug:",
              debugResponse.debug.customer_info.verification_status
            );
          }
        }
      } catch (debugError) {
        console.error("TravelBuddyCTA: Debug endpoint failed:", debugError);
      }

      // Check Travel Buddy status
      console.log("TravelBuddyCTA: Calling API.travelBuddy.getStatus()");
      const response = await API.travelBuddy.getStatus();
      console.log("TravelBuddyCTA: API response data:", response);
      console.log("TravelBuddyCTA: Response type:", typeof response);
      console.log(
        "TravelBuddyCTA: Response keys:",
        Object.keys(response || {})
      );

      // Debug the response structure
      console.log("TravelBuddyCTA: Response structure debug:", {
        available: response?.available,
        enabled: response?.enabled,
        status: response?.status,
        reason: response?.reason,
        success: response?.success,
      });

      // Check if travel buddy is available and enabled
      // Note: The API is returning the full response object, not just the data
      const data = response?.data || response;
      console.log("TravelBuddyCTA: Extracted data:", data);

      if (data && data.available === true && data.enabled === true) {
        console.log("✅ TravelBuddyCTA: Travel Buddy is ENABLED!");
        console.log("✅ TravelBuddyCTA: User's travel_buddy_status = 'Active'");
        console.log("✅ TravelBuddyCTA: Status:", data.status);
        console.log("✅ TravelBuddyCTA: Navigating to /travel-buddy page");
        // Travel Buddy is enabled, navigate to Travel Buddy page
        navigate("/travel-buddy");
      } else {
        console.log("❌ TravelBuddyCTA: Travel Buddy is NOT enabled");
        console.log("❌ TravelBuddyCTA: Debug info:", {
          available: data?.available,
          enabled: data?.enabled,
          status: data?.status,
          reason: data?.reason,
        });

        if (data?.available === false) {
          console.log(
            "❌ TravelBuddyCTA: Travel Buddy not available:",
            data?.reason
          );
        } else if (data?.enabled === false) {
          console.log(
            "❌ TravelBuddyCTA: Travel Buddy not enabled, status:",
            data?.status
          );
        }

        console.log("❌ TravelBuddyCTA: Showing modal to enable travel buddy");
        // Travel Buddy is not enabled, show modal
        setShowModal(true);
      }
    } catch (error) {
      console.error(
        "TravelBuddyCTA: Error checking Travel Buddy status:",
        error
      );
      console.error("TravelBuddyCTA: Error details:", {
        message: error.message,
        stack: error.stack,
        response: error.response,
      });
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
