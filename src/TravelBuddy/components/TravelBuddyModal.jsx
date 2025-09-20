import { useEffect } from "react";
import Button from "../../components/atoms/Button";

export default function TravelBuddyModal({ isOpen, onClose, onGoToSettings }) {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-6 py-8 px-12">
        {/* Message */}
        <div className="text-center mb-6">
          <p className="text-gray-800 text-xl leading-relaxed">
            You haven't enabled the Travel Buddy feature yet. Please turn it on from your{" "}
            <button
              onClick={onGoToSettings}
              className="text-cyan-600 underline hover:text-cyan-700 font-medium"
            >
              Profile Settings
            </button>{" "}
            to access this section.
          </p>
        </div>
        
        {/* Button */}
        <div className="flex justify-center">
          <Button
            onClick={onClose}
            size="lg"
            variant="primary"
            className="px-12 py-3 text-lg"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
