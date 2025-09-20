import React, { useState } from "react";
import { EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function NicDocumentViewer({
  frontImage,
  backImage,
  userName,
  nicNumber,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeImage, setActiveImage] = useState("front");

  const handleOpen = () => {
    setIsOpen(true);
    setActiveImage("front");
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const imageUrl = activeImage === "front" ? frontImage : backImage;
  const imageLabel = activeImage === "front" ? "Front" : "Back";

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={handleOpen}
        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
      >
        <EyeIcon className="h-4 w-4 mr-1" />
        View NIC
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleClose}
            ></div>

            {/* Modal panel */}
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle">
              {/* Header */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      NIC Document Verification
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {userName} - {nicNumber}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="bg-gray-50 px-4 py-5 sm:p-6">
                {/* Image Toggle Buttons */}
                <div className="flex justify-center mb-4">
                  <div
                    className="inline-flex rounded-md shadow-sm"
                    role="group"
                  >
                    <button
                      onClick={() => setActiveImage("front")}
                      className={`px-4 py-2 text-sm font-medium border rounded-l-lg ${
                        activeImage === "front"
                          ? "bg-cyan-600 text-white border-cyan-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Front Side
                    </button>
                    <button
                      onClick={() => setActiveImage("back")}
                      className={`px-4 py-2 text-sm font-medium border rounded-r-lg ${
                        activeImage === "back"
                          ? "bg-cyan-600 text-white border-cyan-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Back Side
                    </button>
                  </div>
                </div>

                {/* Image Display */}
                <div className="flex justify-center">
                  <div className="relative max-w-2xl w-full">
                    {imageUrl ? (
                      <img
                        src={`${
                          import.meta.env.VITE_API_URL
                        }/public/storage/uploads/users/${imageUrl}`}
                        alt={`NIC ${imageLabel} - ${userName}`}
                        className="w-full h-auto rounded-lg shadow-lg border border-gray-200"
                        onError={(e) => {
                          e.target.src = "/placeholder-nic.jpg";
                          e.target.alt = "NIC image not available";
                        }}
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">
                          No {imageLabel.toLowerCase()} image available
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Info */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Showing:{" "}
                    <span className="font-medium">{imageLabel} Side</span>
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
