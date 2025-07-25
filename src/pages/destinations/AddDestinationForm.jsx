import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeftIcon,
  CloudArrowUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Button from "../../components/atoms/Button";
import { Input } from "../../components/molecules/Input";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

export default function AddDestinationForm() {
  const [formData, setFormData] = useState({
    name: "",
    type: "camping",
    district: "",
    location: "",
    shortDescription: "",
    fullDescription: "",
    latitude: "",
    longitude: "",
  });

  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const imageUploadRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Handle text inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // File upload preview
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleCancelUpload = () => {
    setImagePreview(null);
    if (imageUploadRef.current) imageUploadRef.current.value = "";
  };

  // Initialize Leaflet map
  useEffect(() => {
    const leafletMap = L.map("destination-map").setView([7.8731, 80.7718], 7); // Center on Sri Lanka
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    }).addTo(leafletMap);

    leafletMap.on("click", (e) => {
      const lat = e.latlng.lat.toFixed(6);
      const lng = e.latlng.lng.toFixed(6);
      setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));

      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        const newMarker = L.marker([lat, lng]).addTo(leafletMap);
        setMarker(newMarker);
      }
    });

    setMap(leafletMap);
    return () => leafletMap.remove();
  }, []);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("type", formData.type);
    data.append("district", formData.district);
    data.append("location", formData.location);
    data.append("shortDescription", formData.shortDescription);
    data.append("fullDescription", formData.fullDescription);
    data.append("latitude", formData.latitude);
    data.append("longitude", formData.longitude);
    if (imageUploadRef.current?.files[0]) {
      data.append("image", imageUploadRef.current.files[0]);
    }

    try {
      const response = await axios.post(
        "http://localhost/skycamp-backend/api/add_destination.php",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const result = response.data;
      if (result.success) {
        alert("Destination added successfully!");
      } else {
        alert(result.message || "Failed to add destination.");
      }
    } catch (error) {
      console.error(error);
      alert("Error while adding destination.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Back Navigation */}
        <Link
          to="/destinations"
          className="inline-flex items-center text-gray-600 hover:text-cyan-600 mb-6 text-sm font-semibold transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Destinations
        </Link>

        {/* Header */}
        <div className="space-y-1 sm:space-y-2 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Add New Destination
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Fill in destination details below
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 rounded-lg p-6 sm:p-8 space-y-6 shadow-sm"
        >
          {/* Destination Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Destination Name
            </label>
            <Input
              id="name"
              placeholder="Enter destination name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Type and District */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="camping">Camping</option>
                <option value="stargazing">Stargazing</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                District
              </label>
              <Input
                id="district"
                placeholder="e.g., Kandy"
                required
                value={formData.district}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <Input
              id="location"
              placeholder="e.g., Horton Plains"
              required
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Short Description
            </label>
            <textarea
              id="shortDescription"
              rows="3"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Enter a short description"
            />
          </div>

          {/* Full Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Full Description
            </label>
            <textarea
              id="fullDescription"
              rows="5"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={formData.fullDescription}
              onChange={handleChange}
              placeholder="Enter full details"
            />
          </div>

          {/* Map Picker */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Pick Location on Map
            </label>
            <div
              id="destination-map"
              className="h-64 w-full rounded-lg border border-gray-300"
            ></div>
            <div className="grid sm:grid-cols-2 gap-4 mt-2">
              <Input
                id="latitude"
                placeholder="Latitude"
                readOnly
                value={formData.latitude}
              />
              <Input
                id="longitude"
                placeholder="Longitude"
                readOnly
                value={formData.longitude}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Destination Image
            </label>
            <div className="relative w-40 h-40">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                ref={imageUploadRef}
                className="hidden"
                id="imageUpload"
              />
              {!imagePreview ? (
                <label
                  htmlFor="imageUpload"
                  className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-cyan-400 transition-colors text-center"
                >
                  <CloudArrowUpIcon className="w-6 h-6 text-gray-400 mb-1" />
                  <p className="text-cyan-600 text-xs font-medium">
                    Upload Image
                  </p>
                  <p className="text-[10px] text-gray-500 p-2">
                    PNG, JPG up to 5MB
                  </p>
                </label>
              ) : (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg border border-gray-200 p-2"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
                    onClick={handleCancelUpload}
                  >
                    <XMarkIcon className="w-4 h-4 text-gray-500" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full mt-6" size="lg">
            Add Destination
          </Button>
        </form>
      </div>
    </div>
  );
}
