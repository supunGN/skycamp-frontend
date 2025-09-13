import React, { useState, useEffect } from "react";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import DestinationSlide from "../components/molecules/DestinationSlide";
import Button from "../components/atoms/Button";
import ReviewCard from "../components/molecules/ReviewCard";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { API } from "../api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Helper function to check if user is logged in
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

function DestinationSlider({ slides }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);
  const goToSlide = (idx) => setCurrent(idx);
  const goToPrevious = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const goToNext = () => setCurrent((prev) => (prev + 1) % slides.length);
  return (
    <div className="relative w-full max-w-full aspect-video mt-6 mb-4 rounded-xl overflow-hidden">
      {slides.map((img, idx) => (
        <DestinationSlide
          key={idx}
          src={img}
          alt={`slide ${idx + 1}`}
          isActive={idx === current}
        />
      ))}
      {/* Navigation Row: Arrows + Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        <button
          onClick={goToPrevious}
          className="bg-white hover:bg-cyan-100 text-gray-700 p-2 w-8 h-8 flex items-center justify-center rounded-full shadow transition"
          aria-label="Previous"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-2.5 h-2.5 rounded-full transition ${
                current === i ? "bg-white" : "bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={goToNext}
          className="bg-white hover:bg-cyan-100 text-gray-700 p-2 w-8 h-8 flex items-center justify-center rounded-full shadow transition"
          aria-label="Next"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20 z-10">
        <div
          className="h-full bg-cyan-600 transition-all duration-500"
          style={{ width: `${((current + 1) / slides.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function IndividualDestination() {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { locationId, locationName } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (locationId) {
      fetchLocationData(locationId);
    } else {
      setError("Location ID not provided");
      setIsLoading(false);
    }
  }, [locationId]);

  const fetchLocationData = async (locationId) => {
    try {
      setIsLoading(true);
      const response = await API.locations.getLocationWithImages(locationId);

      if (response.success) {
        setLocation(response.data);
      } else {
        setError(response.message || "Failed to fetch location data");
      }
    } catch (err) {
      console.error("Error fetching location:", err);
      setError("Failed to fetch location data");
    } finally {
      setIsLoading(false);
    }
  };

  // Removed Google Maps API loader - using OpenStreetMap instead

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading destination details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Location Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              {error || "The requested location could not be found."}
            </p>
            <Button variant="outline" size="md" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Prepare slides from location images
  const slides =
    location.images && location.images.length > 0
      ? location.images.map((img) => img.image_url)
      : ["/placeholder-image.jpg"]; // Fallback image

  // Parse important details if it's a JSON string
  let importantDetails = [];
  if (location.important_details) {
    try {
      importantDetails = JSON.parse(location.important_details);
    } catch {
      // If not JSON, treat as plain text
      importantDetails = [location.important_details];
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto w-full">
        <main className="min-h-screen w-full lg:grid lg:grid-cols-2">
          {/* Left: Main Content (scrollable) - Takes 1/2 on desktop */}
          <div className="flex flex-col min-w-0 overflow-y-auto px-6 sm:px-12 pt-32 pb-16 lg:h-screen">
            <h1 className="text-3xl font-bold mb-2 mt-8">
              {location.name} – {location.district}
            </h1>
            <p className="text-gray-600 text-lg max-w-xl leading-relaxed break-words mb-4 mt-4">
              {location.description}
            </p>
            {getUser() && (
              <Button
                variant="outline"
                size="md"
                className="mb-6 w-max font-semibold mt-4"
              >
                Add to Wishlist
              </Button>
            )}

            <div className="w-full mb-8">
              <DestinationSlider slides={slides} />
            </div>
            {/* Features */}
            <div className="mt-12 grid grid-cols-1 gap-10">
              {location.climate && (
                <div className="flex items-start gap-4">
                  <span className="text-2xl">🌦️</span>
                  <div>
                    <h3 className="font-semibold">Climate</h3>
                    <p className="text-gray-600 text-base max-w-xl leading-relaxed break-words">
                      {location.climate}
                    </p>
                  </div>
                </div>
              )}
              {location.wildlife && (
                <div className="flex items-start gap-4">
                  <span className="text-2xl">🦌</span>
                  <div>
                    <h3 className="font-semibold">Wildlife</h3>
                    <p className="text-gray-600 text-base max-w-xl leading-relaxed break-words">
                      {location.wildlife}
                    </p>
                  </div>
                </div>
              )}
              {location.water_resources && (
                <div className="flex items-start gap-4">
                  <span className="text-2xl">💧</span>
                  <div>
                    <h3 className="font-semibold">Water Resources</h3>
                    <p className="text-gray-600 text-base max-w-xl leading-relaxed break-words">
                      {location.water_resources}
                    </p>
                  </div>
                </div>
              )}
              {location.safety_tips && (
                <div className="flex items-start gap-4">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h3 className="font-semibold">Safety Tips</h3>
                    <p className="text-gray-600 text-base max-w-xl leading-relaxed break-words">
                      {location.safety_tips}
                    </p>
                  </div>
                </div>
              )}
            </div>
            {/* Important Section */}
            {importantDetails.length > 0 && (
              <div className="bg-gray-100 rounded-2xl shadow p-6 md:p-8 mt-8 mb-8">
                <h2 className="font-bold text-xl mb-3 text-gray-900">
                  Important
                </h2>
                <ul className="text-gray-700 text-base space-y-2">
                  {importantDetails.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Service Selection Section */}
            <div className="mb-12 mt-16">
              <h2 className="text-2xl font-bold mb-6">
                Which service are you looking for?
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div
                  className="block cursor-pointer"
                  onClick={() => {
                    if (getUser()) {
                      navigate("/guides");
                    } else {
                      navigate("/login");
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-pressed="false"
                >
                  <div className="flex items-center border-2 peer-checked:border-cyan-400 bg-cyan-50 peer-checked:bg-cyan-100 rounded-xl px-4 py-3 transition">
                    {/* Removed radio input */}
                    <div>
                      <span className="font-bold text-base text-gray-900">
                        Hire a Guide
                      </span>
                      <div className="text-sm text-cyan-700">
                        Get assistance from experienced local guides for a safer
                        and richer trip.
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="block cursor-pointer"
                  onClick={() => {
                    if (getUser()) {
                      navigate("/rentals");
                    } else {
                      navigate("/login");
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-pressed="false"
                >
                  <div className="flex items-center border-2 peer-checked:border-cyan-400 bg-white peer-checked:bg-cyan-100 rounded-xl px-4 py-3 transition">
                    {/* Removed radio input */}
                    <div>
                      <span className="font-bold text-base text-gray-900">
                        Find Equipment
                      </span>
                      <div className="text-sm text-gray-600">
                        Rent quality camping gear without carrying everything
                        yourself.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Map - Only visible on mobile, after radio buttons */}
            <div className="lg:hidden w-full mb-8">
              <h2 className="text-xl font-bold mb-4">Location</h2>
              <div className="h-64 w-full rounded-xl overflow-hidden">
                <MapContainer
                  center={[
                    parseFloat(location.latitude),
                    parseFloat(location.longitude),
                  ]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[
                      parseFloat(location.latitude),
                      parseFloat(location.longitude),
                    ]}
                  >
                    <Popup>
                      <strong>{location.name}</strong>
                      <br />
                      {location.district}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
          {/* Right: Sticky Map (desktop) - Takes 1/2 on desktop */}
          <div className="hidden lg:block h-full w-full">
            <div className="sticky top-0 h-full w-full">
              <MapContainer
                center={[
                  parseFloat(location.latitude),
                  parseFloat(location.longitude),
                ]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[
                    parseFloat(location.latitude),
                    parseFloat(location.longitude),
                  ]}
                >
                  <Popup>
                    <strong>{location.name}</strong>
                    <br />
                    {location.district}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </main>
      </div>
      {/* Ratings & Reviews (full width, below map and main content) */}

      <div
        className="mt-16 border-t pt-12 max-w-7xl mx-auto w-full px-6"
        id="reviews"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="text-4xl font-bold mb-2">4.5</div>
          <div className="flex gap-1 mb-2">
            {/* 4.5 stars: 4 full, 1 half */}
            {[...Array(4)].map((_, i) => (
              <svg
                key={i}
                className="w-6 h-6 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
              </svg>
            ))}
            {/* Half star */}
            <svg
              className="w-6 h-6 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <defs>
                <linearGradient id="half">
                  <stop offset="50%" stopColor="#facc15" />
                  <stop offset="50%" stopColor="#e5e7eb" />
                </linearGradient>
              </defs>
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"
                fill="url(#half)"
              />
            </svg>
          </div>
          <div className="text-gray-600 text-center text-base max-w-xl leading-relaxed">
            This average rating reflects the overall experience of campers who
            have visited the destination based on their reviews of the
            location's beauty, safety, and camping convenience.
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example reviews */}
          {[
            {
              text: "First camping trip near Horton Plains! Nearby sites are clean and safe. Bring blankets, it gets really cold",
              name: "Isini Gunathilake",
              date: "12 May 2025",
              rating: 4,
            },
            {
              text: "Great views but slippery after rain. Baker's Falls was beautiful. Bring water!",
              name: "Supun Nandana",
              date: "19 May 2025",
              rating: 3.5,
            },
            {
              text: "No phone signal or food spots, plan ahead. Still, the scenery is stunning",
              name: "Kaveesha Rathnayake",
              date: "26 May 2025",
              rating: 4.5,
            },
            {
              text: "Peaceful and full of wildlife. Perfect for birdwatching and relaxing in nature.",
              name: "Chamandi Sanjula",
              date: "2 Jun 2025",
              rating: 5,
            },
            {
              text: "Easy trails and beginner-friendly. Very cold, take warm clothes!",
              name: "Banuka Piayarathe",
              date: "6 May 2025",
              rating: 3.5,
            },
            {
              text: "It was foggy during our visit, but camping in the area was still great. Don't forget a raincoat and hot drinks!",
              name: "Sameesha Pasanya",
              date: "1 May 2025",
              rating: 4,
            },
          ].map((review, idx) => (
            <ReviewCard key={idx} {...review} />
          ))}
        </div>
        <div className="flex justify-center mt-12 mb-12 gap-4">
          <Button variant="outline" size="md">
            View all Reviews
          </Button>
          <Button variant="outline" size="md">
            Add your Review
          </Button>
        </div>
      </div>
      <hr className="mt-4 mb-0 border-gray-200 max-w-7xl mx-auto w-full" />
      <Footer />
    </div>
  );
}
