import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { API } from "../../api";
import TravelBuddyModal from "./TravelBuddyModal";

// Helper function to get user from localStorage
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

// Travel Buddy Protected Route Component
export default function TravelBuddyProtectedRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const user = getUser();
        
        // Check if user is authenticated
        if (!user) {
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        // Check if user is a customer
        if (user.user_role !== "customer") {
          setError("Travel Buddy is only available for customers");
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        // Check Travel Buddy status
        const response = await API.travelBuddy.getStatus();
        
        if (response.data.enabled) {
          setIsAuthorized(true);
        } else {
          setError("Travel Buddy not enabled");
          setIsAuthorized(false);
          setShowModal(true);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking Travel Buddy access:", error);
        setError("Unable to verify Travel Buddy access. Please try again.");
        setIsAuthorized(false);
        setIsLoading(false);
      }
    };

    checkAccess();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking Travel Buddy access...</p>
        </div>
      </div>
    );
  }

  const handleGoToSettings = () => {
    setShowModal(false);
    navigate("/profile");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/");
  };

  if (!isAuthorized) {
    if (error && showModal) {
      return (
        <>
          <TravelBuddyModal
            isOpen={showModal}
            onClose={handleCloseModal}
            onGoToSettings={handleGoToSettings}
          />
          <Navigate to="/login" replace />
        </>
      );
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}
