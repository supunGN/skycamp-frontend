import React, { useState, useRef } from "react";
import axios from "axios";
import {
  ArrowLeftIcon,
  CloudArrowUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/atoms/Button";
import { Input } from "../../components/molecules/Input";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../api";

// ---------------------------
// FileUpload Component
// ---------------------------
function FileUpload({ id, label, preview, setPreview, uploadRef }) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleCancelUpload = () => {
    setPreview(null);
    if (uploadRef.current) uploadRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative w-full h-32">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          ref={uploadRef}
          className="hidden"
          id={id}
        />
        {!preview ? (
          <label
            htmlFor={id}
            className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-cyan-400 transition-colors text-center"
          >
            <CloudArrowUpIcon className="w-6 h-6 text-gray-400 mb-1" />
            <p className="text-cyan-600 text-xs font-medium">Upload File</p>
            <p className="text-[10px] text-gray-500 p-2">PNG, JPG up to 5MB</p>
          </label>
        ) : (
          <>
            <img
              src={preview}
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
  );
}

export default function CustomerRegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "", // Ensure correct key
    phone: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [gender, setGender] = useState("");
  const [travelBuddy, setTravelBuddy] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [profilePreview, setProfilePreview] = useState(null);
  const [nicFrontPreview, setNicFrontPreview] = useState(null);
  const [nicBackPreview, setNicBackPreview] = useState(null);

  const profileUploadRef = useRef(null);
  const nicFrontUploadRef = useRef(null);
  const nicBackUploadRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

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

    const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("dateOfBirth", formData.dateOfBirth);
    data.append("phone", formData.phone);
    data.append("email", formData.email);
    data.append("address", formData.address);
    data.append("gender", gender);
    data.append("password", formData.password);
    data.append("userRole", "customer");
    data.append("travelBuddyOption", travelBuddy);

    if (profileUploadRef.current?.files[0]) {
      data.append("profilePicture", profileUploadRef.current.files[0]);
    }
    if (nicFrontUploadRef.current?.files[0]) {
      data.append("nicFront", nicFrontUploadRef.current.files[0]);
    }
    if (nicBackUploadRef.current?.files[0]) {
      data.append("nicBack", nicBackUploadRef.current.files[0]);
    }

    console.log("Submitting the following data:");
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.post(`${API_BASE_URL}register.php`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response from backend:", response.data);

      const result = response.data;
      if (result.success) {
        if (result.user) {
          localStorage.setItem("user", JSON.stringify(result.user));
          if (result.user.user_role === "customer") {
            window.location.href = "/profile";
          } else if (result.user.user_role === "service_provider") {
            window.location.href = "/dashboard";
          } else {
            window.location.href = "/";
          }
        }
        alert(result.message || "Registration successful!");
        if (result.redirect_url) {
          window.location.href = result.redirect_url;
        }
      } else {
        alert(result.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Full error details:", error.response?.data || error);
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
            Customer Registration Form
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Selected Role:{" "}
            <span className="text-cyan-600 font-semibold">Customer</span>
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
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
                autoComplete="given-name"
                required
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
                autoComplete="family-name"
                required
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Date of Birth and Phone */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                autoComplete="bday"
                required
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                placeholder="0xxxxxxxxx"
                autoComplete="tel"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              placeholder="Enter your email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Home Address */}
          <div className="space-y-2">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Home Address
            </label>
            <textarea
              id="address"
              name="address"
              placeholder="Enter your postal address"
              autoComplete="street-address"
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
          <FileUpload
            id="profileUpload"
            label="Profile Picture"
            preview={profilePreview}
            setPreview={setProfilePreview}
            uploadRef={profileUploadRef}
          />

          {/* NIC Front & Back Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Upload Your NIC
            </label>
            <div className="grid sm:grid-cols-2 gap-4">
              <FileUpload
                id="nicFrontUpload"
                preview={nicFrontPreview}
                setPreview={setNicFrontPreview}
                uploadRef={nicFrontUploadRef}
              />
              <FileUpload
                id="nicBackUpload"
                preview={nicBackPreview}
                setPreview={setNicBackPreview}
                uploadRef={nicBackUploadRef}
              />
            </div>
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

        {/* Travel Buddy Section */}
        <div className="mt-8 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Travel Buddy Option
          </h2>
          <p className="text-sm text-gray-600">
            Would you like to connect with other campers?
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Do you wish to use the Travel Buddy option?
            </label>
            <div className="space-y-3">
              {["yes", "no"].map((option) => (
                <label
                  key={option}
                  className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${
                    travelBuddy === option
                      ? "border-cyan-500 bg-cyan-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="travelBuddy"
                    value={option}
                    checked={travelBuddy === option}
                    onChange={() => setTravelBuddy(option)}
                    className="w-4 h-4 text-cyan-600 border-gray-300 focus:ring-cyan-500 mt-0.5 mr-3"
                  />
                  <div>
                    <span className="font-medium text-gray-900">
                      {option === "yes" ? "Yes" : "No"}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      {option === "yes"
                        ? "Find and connect with fellow campers"
                        : "Continue solo. You can enable it later."}
                    </p>
                  </div>
                </label>
              ))}
            </div>
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
