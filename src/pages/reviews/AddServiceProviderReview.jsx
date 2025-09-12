import React, { useState, useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Button from "../../components/atoms/Button";
import { Input } from "../../components/molecules/Input";
import { API } from "../../api";

export default function AddServiceProviderReview() {
  const [formData, setFormData] = useState({
    serviceProviderId: "",
    userId: "", // This should be set from logged-in user context or session
    rating: 5,
    reviewText: "",
  });

  const [serviceProviders, setServiceProviders] = useState([]);

  // Fetch service providers from API
  useEffect(() => {
    async function fetchServiceProviders() {
      try {
        const res = await API.serviceProviders.list();
        setServiceProviders(res.providers || []);
      } catch (err) {
        console.error("Error fetching service providers", err);
      }
    }
    fetchServiceProviders();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Submit review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.serviceProviderId) {
      alert("Please select a service provider.");
      return;
    }
    try {
      const response = await API.reviews.addServiceProviderReview(formData);
      if (response.success) {
        alert("Review added successfully!");
        setFormData({ ...formData, rating: 5, reviewText: "" });
      } else {
        alert(response.message || "Failed to add review.");
      }
    } catch (error) {
      console.error(error);
      alert("Error while adding review.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Back Navigation */}
        <Link
          to="/reviews"
          className="inline-flex items-center text-gray-600 hover:text-cyan-600 mb-6 text-sm font-semibold transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Reviews
        </Link>

        {/* Header */}
        <div className="space-y-1 sm:space-y-2 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Add a Review for Service Provider
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Select a guide or equipment renter and submit your review
          </p>
        </div>

        {/* Review Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 rounded-lg p-6 sm:p-8 space-y-6 shadow-sm"
        >
          {/* Service Provider Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Service Provider
            </label>
            <select
              id="serviceProviderId"
              value={formData.serviceProviderId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            >
              <option value="">-- Select Service Provider --</option>
              {serviceProviders.map((sp) => (
                <option key={sp.id} value={sp.id}>
                  {sp.provider_name} ({sp.provider_type})
                </option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Rating (1 to 5)
            </label>
            <Input
              id="rating"
              type="number"
              min="1"
              max="5"
              value={formData.rating}
              onChange={handleChange}
              required
            />
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Review
            </label>
            <textarea
              id="reviewText"
              rows="4"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={formData.reviewText}
              onChange={handleChange}
              placeholder="Write your experience..."
              required
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full mt-6" size="lg">
            Submit Review
          </Button>
        </form>
      </div>
    </div>
  );
}
