import React, { useState, useRef } from "react";
import {
  ArrowLeftIcon,
  CloudArrowUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Button from "../../components/atoms/Button";
import { Input } from "../../components/molecules/Input";
import MultiSelectDropdown from "../../components/molecules/MultiSelectDropdown";
import axios from "axios";

export default function ServiceProviderRegistration() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [profilePreview, setProfilePreview] = useState(null);
  const [nicFrontPreview, setNicFrontPreview] = useState(null);
  const [nicBackPreview, setNicBackPreview] = useState(null);

  const profileUploadRef = useRef(null);
  const nicFrontUploadRef = useRef(null);
  const nicBackUploadRef = useRef(null);

  const [selectedCamping, setSelectedCamping] = useState([]);
  const [selectedStargazing, setSelectedStargazing] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);

  const campingLocations = [
    "Namunukula Range",
    "Ritigala Reserve",
    "Gal Oya Vicinity",
    "Mahiyanganaya Fields",
    "Kallady Beach",
    "Koggala Lake",
    "Udugampola Forest",
    "Yala Buffer Zone",
  ];

  const stargazingLocations = [
    "Nilgala Reserve",
    "Knuckles Peak",
    "Anuradhapura Plains",
    "Nuwara Eliya Hills",
    "Ella Rock",
    "Sigiriya View Point",
  ];

  const districts = [
    "Colombo",
    "Gampaha",
    "Kandy",
    "Galle",
    "Matara",
    "Kurunegala",
    "Badulla",
    "Anuradhapura",
    "Trincomalee",
  ];

  // Handle text input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Handle file uploads
  const handleFileUpload = (e, setPreview) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleCancelUpload = (setPreview, ref) => {
    setPreview(null);
    if (ref.current) ref.current.value = "";
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreeTerms) {
      alert("Please agree to the terms and conditions.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    console.log("Selected Camping:", selectedCamping);
    console.log("Selected Stargazing:", selectedStargazing);
    console.log("Selected Districts:", selectedDistricts);

    // Prepare FormData
    const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("dateOfBirth", formData.dob); // Ensure this matches backend key
    data.append("phone", formData.phone);
    data.append("email", formData.email);
    data.append("address", formData.address);
    data.append("gender", gender);
    data.append("password", formData.password);
    data.append("userRole", "service_provider");
    data.append("serviceRole", role || "");

    // Convert arrays to comma-separated strings or empty string
    data.append("campingLocations", selectedCamping.join(","));
    data.append("stargazingLocations", selectedStargazing.join(","));
    data.append("districts", selectedDistricts.join(","));

    // File uploads
    if (profileUploadRef.current?.files[0]) {
      data.append("profilePicture", profileUploadRef.current.files[0]);
    }
    if (nicFrontUploadRef.current?.files[0]) {
      data.append("nicFront", nicFrontUploadRef.current.files[0]);
    }
    if (nicBackUploadRef.current?.files[0]) {
      data.append("nicBack", nicBackUploadRef.current.files[0]);
    }

    // Debug log
    console.log("Submitting form data:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await axios.post(
        "http://localhost/skycamp-backend/api/register.php",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const result = response.data;
      if (result.success) {
        alert("Registration successful!");
        if (result.redirect_url) {
          window.location.href = result.redirect_url;
        }
      } else {
        alert(result.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred during registration."
      );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Back Navigation */}
        <Link
          to="/signup"
          className="inline-flex items-center text-gray-600 hover:text-cyan-600 mb-6 text-sm font-semibold transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Role Selection
        </Link>

        {/* Header */}
        <div className="space-y-1 sm:space-y-2 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Service Provider Registration Form
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Selected Role:{" "}
            <span className="text-cyan-600 font-semibold">
              Service Provider
            </span>
          </p>
        </div>

        {/* Profile Info Title */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
          <p className="text-sm text-gray-600">
            Please fill in all required information
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-gray-50 rounded-lg p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Name Fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <Input
                id="firstName"
                placeholder="Enter your first name"
                required
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <Input
                id="lastName"
                placeholder="Enter your last name"
                required
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Date of Birth and Phone */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <Input
                id="dob"
                type="date"
                required
                value={formData.dob}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <Input
                id="phone"
                placeholder="0xxxxxxxxx"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Home Address
            </label>
            <textarea
              id="address"
              placeholder="Enter your postal address"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 min-h-[80px] resize-none"
              required
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* Gender */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <div className="flex gap-6">
              {["Male", "Female", "Other"].map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={gender === option}
                    onChange={() => setGender(option)}
                    className="w-4 h-4 text-cyan-600 border-gray-300 focus:ring-cyan-500"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Profile Picture Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <div className="relative w-32 h-32">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, setProfilePreview)}
                ref={profileUploadRef}
                className="hidden"
                id="profileUpload"
              />
              {!profilePreview ? (
                <label
                  htmlFor="profileUpload"
                  className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-cyan-400 transition-colors text-center"
                >
                  <CloudArrowUpIcon className="w-6 h-6 text-gray-400 mb-1" />
                  <p className="text-cyan-600 text-xs font-medium">
                    Upload Photo
                  </p>
                  <p className="text-[10px] text-gray-500 p-2">
                    PNG, JPG up to 5MB with 1:1 ratio
                  </p>
                </label>
              ) : (
                <>
                  <img
                    src={profilePreview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover rounded-lg border border-gray-200 p-2"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
                    onClick={() =>
                      handleCancelUpload(setProfilePreview, profileUploadRef)
                    }
                  >
                    <XMarkIcon className="w-4 h-4 text-gray-500" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* NIC Front & Back Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Upload Your NIC
            </label>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* NIC Front */}
              <div className="relative w-full h-32">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, setNicFrontPreview)}
                  ref={nicFrontUploadRef}
                  className="hidden"
                  id="nicFrontUpload"
                />
                {!nicFrontPreview ? (
                  <label
                    htmlFor="nicFrontUpload"
                    className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-cyan-400 transition-colors text-center"
                  >
                    <CloudArrowUpIcon className="w-6 h-6 text-gray-400 mb-1" />
                    <p className="text-cyan-600 text-xs font-medium">
                      Upload NIC Front
                    </p>
                    <p className="text-[10px] text-gray-500 p-2">
                      PNG, JPG up to 5MB
                    </p>
                  </label>
                ) : (
                  <>
                    <img
                      src={nicFrontPreview}
                      alt="NIC Front Preview"
                      className="w-full h-full object-cover rounded-lg border border-gray-200 p-2"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
                      onClick={() =>
                        handleCancelUpload(
                          setNicFrontPreview,
                          nicFrontUploadRef
                        )
                      }
                    >
                      <XMarkIcon className="w-4 h-4 text-gray-500" />
                    </button>
                  </>
                )}
              </div>

              {/* NIC Back */}
              <div className="relative w-full h-32">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, setNicBackPreview)}
                  ref={nicBackUploadRef}
                  className="hidden"
                  id="nicBackUpload"
                />
                {!nicBackPreview ? (
                  <label
                    htmlFor="nicBackUpload"
                    className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-cyan-400 transition-colors text-center"
                  >
                    <CloudArrowUpIcon className="w-6 h-6 text-gray-400 mb-1" />
                    <p className="text-cyan-600 text-xs font-medium">
                      Upload NIC Back
                    </p>
                    <p className="text-[10px] text-gray-500 p-2">
                      PNG, JPG up to 5MB
                    </p>
                  </label>
                ) : (
                  <>
                    <img
                      src={nicBackPreview}
                      alt="NIC Back Preview"
                      className="w-full h-full object-cover rounded-lg border border-gray-200 p-2"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
                      onClick={() =>
                        handleCancelUpload(setNicBackPreview, nicBackUploadRef)
                      }
                    >
                      <XMarkIcon className="w-4 h-4 text-gray-500" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Role Selection */}
        <div className="mt-8 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Role</h2>
          <p className="text-sm text-gray-600">
            Select whether you are an Equipment Renter or a Local Guide
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-6 sm:p-8 space-y-4 shadow-sm">
          {["Equipment Renter", "Local Guide"].map((roleOption) => (
            <label
              key={roleOption}
              className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${
                role === roleOption
                  ? "border-cyan-500 bg-cyan-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={roleOption}
                checked={role === roleOption}
                onChange={() => setRole(roleOption)}
                className="w-4 h-4 text-cyan-600 border-gray-300 focus:ring-cyan-500 mt-0.5 mr-3"
              />
              <div>
                <span className="font-medium text-gray-900">{roleOption}</span>
              </div>
            </label>
          ))}
        </div>

        {/* Services You Offer */}
        <div className="mt-8 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Select the Services You Offer
          </h2>
          <p className="text-sm text-gray-600">
            Choose where you provide camping or stargazing services
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="grid sm:grid-cols-2 gap-6">
            <MultiSelectDropdown
              label="Camping Locations"
              options={campingLocations}
              selected={selectedCamping}
              setSelected={setSelectedCamping}
            />
            <MultiSelectDropdown
              label="Stargazing Locations"
              options={stargazingLocations}
              selected={selectedStargazing}
              setSelected={setSelectedStargazing}
            />
          </div>
        </div>

        {/* Districts */}
        <div className="mt-8 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Available Districts
          </h2>
          <p className="text-sm text-gray-600">
            Select all districts where you can provide your services
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-6 sm:p-8 space-y-6 shadow-sm">
          <MultiSelectDropdown
            label="Select Districts"
            options={districts}
            selected={selectedDistricts}
            setSelected={setSelectedDistricts}
          />
        </div>

        {/* authentication */}
        <div className="mt-8 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Set Up Your Account Access
          </h2>
          <p className="text-sm text-gray-600">
            Secure your profile and define your service availability
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500">
              At least 8 characters with uppercase, lowercase, and number
            </p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3 mt-8">
          <input
            type="checkbox"
            id="terms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 mt-1"
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to all statements in{" "}
            <a href="/terms" className="text-cyan-600 hover:underline">
              Terms and Conditions
            </a>
          </label>
        </div>

        {/* Submit */}
        <Button onClick={handleSubmit} className="w-full mt-6" size="lg">
          Register
        </Button>
      </div>
    </div>
  );
}
