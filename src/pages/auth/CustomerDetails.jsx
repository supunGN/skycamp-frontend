import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  ArrowLeftIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/atoms/Button";
import { Input } from "../../components/molecules/Input";
import MapLocationPicker from "../../components/molecules/MapLocationPicker";
import { Link, useNavigate } from "react-router-dom";
import { http } from "../../api";

// FileUpload Component
function FileUpload({
  id,
  label,
  preview,
  setPreview,
  uploadRef,
  required = false,
  error = null,
}) {
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
          {required && <span className="text-red-500 ml-1">*</span>}
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
          required={required}
        />
        {!preview ? (
          <label
            htmlFor={id}
            className={`flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer transition-colors text-center ${
              error
                ? "border-red-300 bg-red-50 hover:border-red-400"
                : "border-gray-300 hover:border-cyan-400"
            }`}
          >
            <CloudArrowUpIcon
              className={`w-6 h-6 mb-1 ${
                error ? "text-red-400" : "text-gray-400"
              }`}
            />
            <p
              className={`text-xs font-medium ${
                error ? "text-red-600" : "text-cyan-600"
              }`}
            >
              Upload File
            </p>
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
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <ExclamationTriangleIcon className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}

export default function CustomerDetails() {
  const navigate = useNavigate();

  // Get pending user info
  const [pendingUser, setPendingUser] = useState(null);

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    phoneNumber: "",
    homeAddress: "",
    nicNumber: "",
  });

  const [gender, setGender] = useState("");
  const [travelBuddyStatus, setTravelBuddyStatus] = useState("Inactive");
  const [verificationStatus, setVerificationStatus] = useState("No");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [profilePreview, setProfilePreview] = useState(null);
  const [nicImagePreview, setNicImagePreview] = useState(null);

  // Location coordinates from map
  const [coordinates, setCoordinates] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");

  const profileUploadRef = useRef(null);
  const nicImageUploadRef = useRef(null);

  // Form validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check for pending user on component mount
  useEffect(() => {
    const stored = localStorage.getItem("pendingUser");
    if (!stored) {
      // No pending user, redirect back to basic registration
      navigate("/basic-registration");
      return;
    }

    const user = JSON.parse(stored);
    if (user.role !== "customer") {
      // Wrong role for this form
      navigate("/basic-registration");
      return;
    }

    setPendingUser(user);
  }, [navigate]);

  // Step definitions
  const steps = [
    {
      id: 1,
      title: "Personal Information",
      description: "Tell us about yourself",
    },
    { id: 2, title: "Contact Details", description: "How can we reach you?" },
    { id: 3, title: "Location", description: "Where are you based?" },
    {
      id: 4,
      title: "Identity Verification",
      description: "Verify your identity",
    },
    {
      id: 5,
      title: "Preferences & Review",
      description: "Final preferences and review",
    },
  ];

  // Step validation functions
  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1: // Personal Information
        if (!formData.firstName.trim())
          newErrors.firstName = "First name is required";
        if (!formData.lastName.trim())
          newErrors.lastName = "Last name is required";
        if (!formData.dob) newErrors.dob = "Date of birth is required";
        if (!gender) newErrors.gender = "Gender selection is required";
        break;

      case 2: // Contact Details
        if (!formData.phoneNumber.trim())
          newErrors.phoneNumber = "Phone number is required";
        if (!formData.homeAddress.trim())
          newErrors.homeAddress = "Home address is required";

        // Phone validation (Sri Lankan format)
        if (
          formData.phoneNumber &&
          !/^0[1-9][0-9]{8}$/.test(formData.phoneNumber)
        ) {
          newErrors.phoneNumber =
            "Please enter a valid Sri Lankan phone number (0xxxxxxxxx)";
        }
        break;

      case 3: // Location
        if (!coordinates || !selectedLocation.trim()) {
          newErrors.location = "Please select your location on the map";
        }
        break;

      case 4: // Identity Verification
        if (!formData.nicNumber.trim())
          newErrors.nicNumber = "NIC number is required";
        if (!profileUploadRef.current?.files[0]) {
          newErrors.profilePicture = "Profile picture is required";
        }
        if (!nicImageUploadRef.current?.files[0]) {
          newErrors.nicImage = "NIC image is required";
        }

        // NIC validation (Sri Lankan format)
        if (
          formData.nicNumber &&
          !/^[0-9]{9}[vVxX]$/.test(formData.nicNumber)
        ) {
          newErrors.nicNumber =
            "Please enter a valid NIC number (9 digits + V/X)";
        }
        break;

      case 5: // Review & Submit
        if (!agreeTerms) {
          newErrors.terms = "Please agree to the terms and conditions";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    // Validate all steps for final submission
    for (let i = 1; i <= totalSteps; i++) {
      if (!validateStep(i)) {
        return false;
      }
    }
    return true;
  };

  // Navigation functions
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });

    // Clear error when user starts typing
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: null,
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfoStep();
      case 2:
        return renderContactDetailsStep();
      case 3:
        return renderLocationStep();
      case 4:
        return renderVerificationStep();
      case 5:
        return renderReviewStep();
      default:
        return renderPersonalInfoStep();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentStep < totalSteps) {
      nextStep();
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (!agreeTerms) {
      alert("Please agree to the terms and conditions.");
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append("userId", pendingUser.userId);
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("dob", formData.dob);
    data.append("phoneNumber", formData.phoneNumber);
    data.append("homeAddress", formData.homeAddress);
    data.append("nicNumber", formData.nicNumber);
    data.append("gender", gender);
    data.append("travelBuddyStatus", travelBuddyStatus);
    data.append("verificationStatus", verificationStatus);

    // Add coordinates from map
    if (coordinates) {
      data.append("latitude", coordinates.lat);
      data.append("longitude", coordinates.lng);
    }

    if (profileUploadRef.current?.files[0]) {
      data.append("profilePicture", profileUploadRef.current.files[0]);
    }
    if (nicImageUploadRef.current?.files[0]) {
      data.append("nicImage", nicImageUploadRef.current.files[0]);
    }

    console.log("Submitting customer details:");
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    try {
      const response = await http.post(
        "/complete-customer-registration.php",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response from backend:", response.data);

      const result = response.data;
      if (result.success) {
        // Clear pending user data
        localStorage.removeItem("pendingUser");

        // Store completed user data
        if (result.user) {
          localStorage.setItem("user", JSON.stringify(result.user));
        }

        alert(result.message || "Registration completed successfully!");
        navigate("/profile");
      } else {
        alert(result.message || "Failed to complete registration.");
      }
    } catch (error) {
      console.error("Full error details:", error.response?.data || error);
      alert(
        error.response?.data?.message ||
          "An error occurred while completing registration."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 1: Personal Information
  const renderPersonalInfoStep = () => (
    <div className="mt-8 space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                className={`${
                  errors.firstName
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-cyan-500"
                } rounded-lg`}
              />
              {errors.firstName && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.firstName}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Last Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                className={`${
                  errors.lastName
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-cyan-500"
                } rounded-lg`}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="dob"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <Input
              id="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              className={`${
                errors.dob
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-cyan-500"
              } rounded-lg max-w-xs`}
            />
            {errors.dob && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.dob}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-4">
              {["Male", "Female", "Other"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setGender(option)}
                  className={`p-4 border-2 rounded-xl text-center transition-all hover:shadow-sm ${
                    gender === option
                      ? "border-cyan-600 bg-cyan-50 text-cyan-700 shadow-sm"
                      : "border-gray-200 hover:border-cyan-300 text-gray-700"
                  }`}
                >
                  <span className="font-medium">{option}</span>
                </button>
              ))}
            </div>
            {errors.gender && (
              <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.gender}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Step 2: Contact Details
  const renderContactDetailsStep = () => (
    <div className="mt-8 space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input
              id="phoneNumber"
              placeholder="0771234567"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`${
                errors.phoneNumber
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-cyan-500"
              } rounded-lg`}
            />
            <p className="text-xs text-gray-500 mt-1">
              Sri Lankan phone number format (10 digits)
            </p>
            {errors.phoneNumber && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.phoneNumber}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="homeAddress"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Home Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="homeAddress"
              placeholder="Enter your complete postal address"
              className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[120px] resize-none ${
                errors.homeAddress
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-cyan-500"
              }`}
              value={formData.homeAddress}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500 mt-1">
              Your full postal address including city and postal code
            </p>
            {errors.homeAddress && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.homeAddress}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Step 3: Location
  const renderLocationStep = () => (
    <div className="mt-8 space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="space-y-6">
          <MapLocationPicker
            location={selectedLocation}
            setLocation={setSelectedLocation}
            coordinates={coordinates}
            setCoordinates={setCoordinates}
            error={errors.location}
            label="Your Location"
            required={true}
            placeholder="Search for your city or area"
          />
        </div>
      </div>
    </div>
  );

  // Step 4: Identity Verification
  const renderVerificationStep = () => (
    <div className="mt-8 space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="nicNumber"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              NIC Number <span className="text-red-500">*</span>
            </label>
            <Input
              id="nicNumber"
              placeholder="123456789V"
              value={formData.nicNumber}
              onChange={handleChange}
              className={`${
                errors.nicNumber
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-cyan-500"
              } rounded-lg max-w-sm`}
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: 9 digits + V/X (e.g., 123456789V)
            </p>
            {errors.nicNumber && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.nicNumber}
              </p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <FileUpload
                id="profileUpload"
                label="Profile Picture"
                preview={profilePreview}
                setPreview={setProfilePreview}
                uploadRef={profileUploadRef}
                required={true}
                error={errors.profilePicture}
              />
            </div>
            <div>
              <FileUpload
                id="nicImageUpload"
                label="NIC Image"
                preview={nicImagePreview}
                setPreview={setNicImagePreview}
                uploadRef={nicImageUploadRef}
                required={true}
                error={errors.nicImage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 5: Preferences & Review
  const renderReviewStep = () => (
    <div className="mt-8 space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="space-y-6">
          {/* Travel Buddy Preference */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Travel Buddy Preference
            </label>
            <div className="space-y-3">
              {[
                {
                  value: "Active",
                  label: "Yes, I'd like to connect with fellow campers",
                  description:
                    "Find and connect with other outdoor enthusiasts",
                  icon: "👥",
                },
                {
                  value: "Inactive",
                  label: "No, I prefer to camp solo",
                  description: "You can enable this later in your settings",
                  icon: "🏕️",
                },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTravelBuddyStatus(option.value)}
                  className={`w-full text-left p-4 border-2 rounded-xl transition-all hover:shadow-sm ${
                    travelBuddyStatus === option.value
                      ? "border-cyan-600 bg-cyan-50 shadow-sm"
                      : "border-gray-200 hover:border-cyan-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{option.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Verification Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Account Verification Status
            </label>
            <div className="space-y-3">
              {[
                {
                  value: "Yes",
                  label: "Request immediate verification",
                  description: "Get verified quickly for premium features",
                  icon: "⚡",
                },
                {
                  value: "No",
                  label: "Verify later",
                  description:
                    "You can request verification anytime from your profile",
                  icon: "⏰",
                },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setVerificationStatus(option.value)}
                  className={`w-full text-left p-4 border-2 rounded-xl transition-all hover:shadow-sm ${
                    verificationStatus === option.value
                      ? "border-cyan-600 bg-cyan-50 shadow-sm"
                      : "border-gray-200 hover:border-cyan-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{option.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start gap-3 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 mt-1 flex-shrink-0"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the{" "}
              <a
                href="/terms"
                className="text-cyan-600 hover:underline font-medium"
              >
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="text-cyan-600 hover:underline font-medium"
              >
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.terms && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {errors.terms}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (!pendingUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - Fixed Top */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/basic-registration"
              className="inline-flex items-center text-gray-600 hover:text-cyan-600 text-sm font-medium transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back
            </Link>

            {/* Step Counter */}
            <div className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </div>
          </div>

          {/* User Info */}
          <div className="mb-4 p-3 bg-cyan-50 rounded-lg border border-cyan-200">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-cyan-600" />
              <span className="text-sm text-gray-700">
                Account created for <strong>{pendingUser.email}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Title and Description */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {steps[currentStep - 1]?.title}
            </h1>
            <p className="text-gray-600">
              {steps[currentStep - 1]?.description}
            </p>
          </div>
          <div className="bg-white">{renderStepContent()}</div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div
            className="bg-cyan-600 h-1 transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Navigation */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between">
              <div>
                {currentStep > 1 && (
                  <Button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    Back
                  </Button>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg shadow-sm"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Completing...
                  </div>
                ) : currentStep === totalSteps ? (
                  "Complete Profile"
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
