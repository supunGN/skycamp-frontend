import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import { API } from "../api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import RatingReviewSection from "../components/sections/RatingReviewSection";
import WishlistButton from "../components/atoms/WishlistButton";
import { useToast } from "../components/atoms/ToastProvider";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const IndividualGuide = () => {
  const { guideId } = useParams();
  const navigate = useNavigate();
  const { showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guideData, setGuideData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (guideId) {
      fetchGuideData();
    }
    checkAuthentication();
  }, [guideId]);

  const checkAuthentication = () => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        setIsAuthenticated(userData.user_role === "customer");
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const fetchGuideData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Clean the guideId to ensure it's numeric
      const cleanGuideId = guideId.replace(/[^0-9]/g, "");

      console.log("Fetching guide data for ID:", cleanGuideId);
      const response = await API.guides.show(cleanGuideId);
      console.log("Guide data response:", response);

      if (response.success) {
        setGuideData(response.data);
      } else {
        setError(response.message || "Failed to fetch guide data");
      }
    } catch (err) {
      console.error("Error fetching guide data:", err);
      setError("Failed to fetch guide data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="max-w-7xl mx-auto w-full px-4 pt-32 pb-16">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading guide information...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="max-w-7xl mx-auto w-full px-4 pt-32 pb-16">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Error Loading Guide
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => navigate("/guides")}
                className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
              >
                Back to Guides
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!guideData) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="max-w-7xl mx-auto w-full px-4 pt-32 pb-16">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Guide Not Found
              </h2>
              <p className="text-gray-600 mb-4">
                The guide you're looking for doesn't exist.
              </p>
              <button
                onClick={() => navigate("/guides")}
                className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
              >
                Back to Guides
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto w-full px-4 pt-32 pb-16">
        {/* Guide Profile Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-10 relative">
          <div className="mt-8" />
          {/* Left: Profile Info */}
          <div className="flex-1 relative z-20">
            {/* Profile Header */}
            <div className="flex items-center gap-8 mb-8">
              <img
                src={guideData.image || "/default-avatar.png"}
                alt={guideData.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-cyan-100"
              />
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-1">
                  {guideData.name}
                </h2>
                <div className="flex gap-6 mb-2">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-gray-900">
                      {guideData.reviewCount}
                    </span>
                    <span className="text-xs text-gray-500">Reviews</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-gray-900">
                      {guideData.rating} ★
                    </span>
                    <span className="text-xs text-gray-500">Rating</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-cyan-700 font-semibold text-sm flex items-center gap-1">
                      <svg
                        className="w-4 h-4 inline-block"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 2C6.13 2 3 5.13 3 9c0 5.25 7 9 7 9s7-3.75 7-9c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 10 6a2.5 2.5 0 0 1 0 5.5z" />
                      </svg>
                      {guideData.location}
                    </span>
                  </div>
                </div>
                <div className="text-gray-600 text-base mt-2">
                  {guideData.verificationStatus === "Yes" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                      ✓ Verified
                    </span>
                  )}
                  Member since {new Date(guideData.createdAt).getFullYear()}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button className="bg-cyan-600 text-white px-8 py-2 rounded-lg hover:bg-cyan-700 transition-colors font-semibold">
                Book Now
              </button>
              <WishlistButton
                itemType="guide"
                itemId={guideData.id}
                itemData={{
                  name: guideData.name,
                  description: guideData.description,
                  image_url: guideData.image,
                  price: guideData.rate,
                }}
                isAuthenticated={isAuthenticated}
                className="border border-gray-300 text-gray-700 px-8 py-2 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center gap-2 w-auto h-auto"
                showText={true}
              />
            </div>

            {/* Guide Bio */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                About {guideData.name}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {guideData.description}
              </p>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">
                    {guideData.details.homeAddress}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="text-gray-700">{guideData.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-gray-700">{guideData.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">
                    {guideData.languages.join(", ")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Accepted Currency: {guideData.currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Special Note */}
            {guideData.specialNote && (
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-cyan-900 mb-2">
                  Special Note
                </h3>
                <p className="text-cyan-800">{guideData.specialNote}</p>
              </div>
            )}

            {/* Price */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Pricing</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Rate per day
                  </span>
                  <span className="text-2xl font-bold text-cyan-600">
                    {guideData.rate} {guideData.currency}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Map */}
          <div className="w-full lg:w-96 h-96 lg:h-[600px] bg-gray-100 rounded-2xl shadow-lg overflow-hidden relative z-10 lg:sticky lg:top-32">
            {guideData.details.latitude && guideData.details.longitude ? (
              <MapContainer
                center={[
                  parseFloat(guideData.details.latitude),
                  parseFloat(guideData.details.longitude),
                ]}
                zoom={15}
                style={{
                  height: "100%",
                  width: "100%",
                  position: "relative",
                  zIndex: 1,
                  isolation: "isolate",
                }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[
                    parseFloat(guideData.details.latitude),
                    parseFloat(guideData.details.longitude),
                  ]}
                >
                  <Popup>
                    <strong>{guideData.name}</strong>
                    <br />
                    {guideData.location}
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 mx-auto mb-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>Location not available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Availability and Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Availability */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-900">
              Availability
            </h3>
            <div className="space-y-3">
              {guideData.availability.map((day, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                >
                  <span className="font-medium text-gray-900">{day.day}</span>
                  <span
                    className={`text-sm ${
                      day.available ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {day.available ? day.time : "Not available"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-900">
              Image Gallery
            </h3>
            {guideData.galleryImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {guideData.galleryImages.slice(0, 3).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`${guideData.name} gallery ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
                {guideData.galleryImages.length > 3 && (
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500 font-medium">
                      +{guideData.galleryImages.length - 3} more
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>No gallery images available</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {guideData.reviews && guideData.reviews.length > 0 && (
          <RatingReviewSection
            averageRating={guideData.rating}
            reviewText={`Customer reviews for ${guideData.name}'s guide services and experience`}
            reviews={guideData.reviews}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default IndividualGuide;
