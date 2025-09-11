import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  ArrowLeftIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  UserCircleIcon,
  PhotoIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/atoms/Button";
import { Input } from "../../components/molecules/Input";
import MapLocationPicker from "../../components/molecules/MapLocationPicker";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../api";

// ---------------------------
// ProfilePictureUpload Component - Modern UX
// ---------------------------
function ProfilePictureUpload({
  id,
  label,
  preview,
  setPreview,
  uploadRef,
  required = false,
  error = null,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return "Please upload a valid image file (JPG, PNG, or WebP)";
    }

    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }

    return null;
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsLoading(true);

    // Simulate loading for better UX
    setTimeout(() => {
      setPreview(URL.createObjectURL(file));
      setIsLoading(false);
    }, 300);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRemove = () => {
    setPreview(null);
    if (uploadRef.current) uploadRef.current.value = "";
  };

  const triggerFileSelect = () => {
    uploadRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {!required && (
            <span className="text-xs text-gray-500 ml-2">(Optional)</span>
          )}
        </label>
      )}

      <div className="flex flex-col items-center space-y-4">
        {/* Profile Picture Display */}
        <div className="relative">
          <div
            className={`w-32 h-32 rounded-full overflow-hidden border-4 transition-all duration-200 ${
              error ? "border-red-300" : "border-gray-200 hover:border-cyan-300"
            }`}
          >
            {preview ? (
              <img
                src={preview}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                <UserCircleIcon className="w-20 h-20 text-gray-300" />
              </div>
            )}
          </div>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Remove Button */}
          {preview && !isLoading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
              title="Remove photo"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Upload Area */}
        <div
          className={`relative w-full max-w-sm transition-all duration-200 ${
            isDragOver ? "scale-105" : ""
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            ref={uploadRef}
            className="hidden"
            id={id}
            required={required}
          />

          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
              isDragOver
                ? "border-cyan-400 bg-cyan-50 scale-105"
                : error
                ? "border-red-300 bg-red-50 hover:border-red-400"
                : "border-gray-300 hover:border-cyan-400 hover:bg-gray-50"
            }`}
            onClick={triggerFileSelect}
          >
            <PhotoIcon
              className={`w-8 h-8 mx-auto mb-3 ${
                isDragOver
                  ? "text-cyan-500"
                  : error
                  ? "text-red-400"
                  : "text-gray-400"
              }`}
            />

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                {isDragOver ? "Drop your photo here" : "Upload Profile Picture"}
              </p>
              <p className="text-xs text-gray-500">
                Drag & drop or click to browse
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, WebP up to 5MB</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {preview && !isLoading && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={triggerFileSelect}
              className="px-4 py-2 text-sm font-medium text-cyan-600 bg-cyan-50 border border-cyan-200 rounded-lg hover:bg-cyan-100 transition-colors"
            >
              Change Photo
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <ExclamationTriangleIcon className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <InformationCircleIcon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-700">
            <p className="font-medium mb-1">
              {required
                ? "Tips for a great profile photo:"
                : "Optional: Add a profile photo to personalize your account"}
            </p>
            <ul className="space-y-0.5 text-blue-600">
              <li>• Use a clear, recent photo of yourself</li>
              <li>• Make sure your face is well-lit and visible</li>
              <li>• Square photos work best for profile pictures</li>
              {!required && (
                <li>• You can always add this later in your settings</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------
// NIC Upload Component - Front and Back
// ---------------------------
function NICUpload({
  frontId,
  backId,
  frontPreview,
  backPreview,
  setFrontPreview,
  setBackPreview,
  frontUploadRef,
  backUploadRef,
  required = false,
  frontError = null,
  backError = null,
}) {
  const [frontLoading, setFrontLoading] = useState(false);
  const [backLoading, setBackLoading] = useState(false);

  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return "Please upload a valid image file (JPG, PNG, or WebP)";
    }

    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }

    return null;
  };

  const handleFileUpload = async (file, side) => {
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    if (side === "front") {
      setFrontLoading(true);
      setTimeout(() => {
        setFrontPreview(URL.createObjectURL(file));
        setFrontLoading(false);
      }, 300);
    } else {
      setBackLoading(true);
      setTimeout(() => {
        setBackPreview(URL.createObjectURL(file));
        setBackLoading(false);
      }, 300);
    }
  };

  const handleInputChange = (e, side) => {
    const file = e.target.files[0];
    handleFileUpload(file, side);
  };

  const handleRemove = (side) => {
    if (side === "front") {
      setFrontPreview(null);
      if (frontUploadRef.current) frontUploadRef.current.value = "";
    } else {
      setBackPreview(null);
      if (backUploadRef.current) backUploadRef.current.value = "";
    }
  };

  const NICCard = ({
    side,
    id,
    preview,
    uploadRef,
    loading,
    error,
    onInputChange,
    onRemove,
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">
          NIC {side === "front" ? "Front" : "Back"} Side
          {required && <span className="text-red-500 ml-1">*</span>}
        </h4>
        {preview && !loading && (
          <button
            type="button"
            onClick={() => onRemove(side)}
            className="text-xs text-red-500 hover:text-red-700 transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onInputChange(e, side)}
          ref={uploadRef}
          className="hidden"
          id={id}
          required={required}
        />

        <div
          className={`relative aspect-[1.6/1] border-2 border-dashed rounded-lg overflow-hidden transition-all duration-200 ${
            error
              ? "border-red-300 bg-red-50"
              : "border-gray-300 hover:border-cyan-400 hover:bg-gray-50"
          }`}
        >
          {preview ? (
            <div className="relative w-full h-full">
              <img
                src={preview}
                alt={`NIC ${side} preview`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => uploadRef.current?.click()}
                  className="opacity-0 hover:opacity-100 bg-white bg-opacity-90 text-gray-700 px-3 py-1 rounded-md text-xs font-medium transition-all duration-200"
                >
                  Change
                </button>
              </div>
            </div>
          ) : (
            <label
              htmlFor={id}
              className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 text-center"
            >
              <div className="space-y-2">
                <div
                  className={`w-12 h-8 border-2 border-dashed rounded-md flex items-center justify-center ${
                    error
                      ? "border-red-400 text-red-400"
                      : "border-gray-400 text-gray-400"
                  }`}
                >
                  <PhotoIcon className="w-4 h-4" />
                </div>
                <p
                  className={`text-xs font-medium ${
                    error ? "text-red-600" : "text-gray-600"
                  }`}
                >
                  Upload {side === "front" ? "Front" : "Back"} Side
                </p>
                <p className="text-xs text-gray-500">Click to browse</p>
              </div>
            </label>
          )}

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
            <ExclamationTriangleIcon className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          National Identity Card (NIC)
          {required && <span className="text-red-500 ml-1">*</span>}
          {!required && (
            <span className="text-xs text-gray-500 ml-2">(Optional)</span>
          )}
        </h3>
        <p className="text-xs text-gray-600">
          {required
            ? "Please upload clear photos of both sides of your NIC"
            : "Upload clear photos of both sides of your NIC to verify your identity faster"}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <NICCard
          side="front"
          id={frontId}
          preview={frontPreview}
          uploadRef={frontUploadRef}
          loading={frontLoading}
          error={frontError}
          onInputChange={handleInputChange}
          onRemove={handleRemove}
        />

        <NICCard
          side="back"
          id={backId}
          preview={backPreview}
          uploadRef={backUploadRef}
          loading={backLoading}
          error={backError}
          onInputChange={handleInputChange}
          onRemove={handleRemove}
        />
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <InformationCircleIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-800">
            <p className="font-medium mb-2">
              {required
                ? "NIC Photo Guidelines:"
                : "NIC Photo Guidelines (Optional):"}
            </p>
            <ul className="space-y-1 text-blue-700">
              <li>• Ensure all text and details are clearly visible</li>
              <li>• Take photos in good lighting without shadows</li>
              <li>• Make sure the entire NIC is within the frame</li>
              <li>• Avoid glare or reflections on the card surface</li>
              <li>
                •{" "}
                {required
                  ? "Both front and back sides are required"
                  : "Upload both sides for faster verification"}
              </li>
              {!required && (
                <li>• NIC photos help verify your identity and build trust</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------
// Simple FileUpload Component (fallback)
// ---------------------------
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

export default function CustomerRegistrationForm() {
  // Get role from navigation state
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role || "customer";

  // Storage key for form data persistence
  const STORAGE_KEY = "skycamp_customer_registration_draft";

  // Simple registration mode (no steps)
  const [isRegistering, setIsRegistering] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    dob: "",
    phoneNumber: "",
    homeAddress: "",
    nicNumber: "",
  });

  const [gender, setGender] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [travelBuddyEnabled, setTravelBuddyEnabled] = useState(false);
  const [showTravelBuddyInfo, setShowTravelBuddyInfo] = useState(false);
  const [showDocumentVerification, setShowDocumentVerification] = useState(false);

  // Location state for MapLocationPicker
  const [selectedLocation, setSelectedLocation] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  // Image upload state
  const [profilePreview, setProfilePreview] = useState(null);
  const [nicFrontPreview, setNicFrontPreview] = useState(null);
  const [nicBackPreview, setNicBackPreview] = useState(null);
  const profileUploadRef = useRef();
  const nicFrontUploadRef = useRef();
  const nicBackUploadRef = useRef();

  // Form validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Basic Information validation
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!gender) newErrors.gender = "Gender selection is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Password confirmation is required";

    // Contact validation
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    if (!formData.homeAddress.trim())
      newErrors.homeAddress = "Home address is required";

    // Identity validation
    if (!formData.nicNumber.trim())
      newErrors.nicNumber = "NIC number is required";

    // Location validation
    if (!selectedLocation.trim())
      newErrors.location = "Please select your location on the map";

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation (Sri Lankan format)
    if (
      formData.phoneNumber &&
      !/^0[1-9][0-9]{8}$/.test(formData.phoneNumber)
    ) {
      newErrors.phoneNumber =
        "Please enter a valid Sri Lankan phone number (0xxxxxxxxx)";
    }

    // NIC validation (Sri Lankan format)
    if (formData.nicNumber && !/^[0-9]{9}[vVxX]$/.test(formData.nicNumber)) {
      newErrors.nicNumber = "Please enter a valid NIC number (9 digits + V/X)";
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (
      formData.password &&
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)
    ) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms validation
    if (!agreeTerms) {
      newErrors.terms = "Please agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Create complete registration data
    const data = new FormData();
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("confirmPassword", formData.confirmPassword);
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("dob", formData.dob);
    data.append("phoneNumber", formData.phoneNumber);
    data.append("homeAddress", formData.homeAddress);
    data.append("nicNumber", formData.nicNumber);
    data.append("gender", gender);
    data.append("userRole", "customer");
    data.append(
      "travelBuddyStatus",
      travelBuddyEnabled ? "Active" : "Inactive"
    );
    data.append("location", selectedLocation);
    if (coordinates.lat && coordinates.lng) {
      data.append("latitude", coordinates.lat);
      data.append("longitude", coordinates.lng);
    }

    // Add image files if uploaded
    if (profileUploadRef.current?.files[0]) {
      data.append("profilePicture", profileUploadRef.current.files[0]);
    }
    if (nicFrontUploadRef.current?.files[0]) {
      data.append("nicFrontImage", nicFrontUploadRef.current.files[0]);
    }
    if (nicBackUploadRef.current?.files[0]) {
      data.append("nicBackImage", nicBackUploadRef.current.files[0]);
    }

    console.log("Submitting complete registration data:");
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.post(API_ENDPOINTS.REGISTER, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      console.log("Response from backend:", response.data);

      const result = response.data;
      if (result.success) {
        if (result.user) {
          localStorage.setItem("user", JSON.stringify(result.user));
        }

        // Show success message and redirect using backend URL
        alert("Welcome to SkyCamp! Your registration is complete.");
        const redirectUrl = result.data?.redirect_url || "/profile";
        navigate(redirectUrl);
      } else {
        alert(result.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data || error);
      alert(
        error.response?.data?.message ||
          "An error occurred during registration. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simple registration form
  const renderRegistrationForm = () => (
    <div className="space-y-6">
          {/* Name Fields */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                } rounded-xl h-12`}
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
                className="block text-sm font-medium text-gray-700 mb-2"
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
                } rounded-xl h-12`}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Date of Birth and Gender */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                } rounded-xl h-12`}
              />
              {errors.dob && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.dob}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                {["Male", "Female", "Other"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setGender(option)}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                      gender === option
                        ? "bg-cyan-600 text-white shadow-md"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {errors.gender && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.gender}
                </p>
              )}
            </div>
          </div>

          {/* Phone Number and NIC Number */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                } rounded-xl h-12`}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.phoneNumber}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="nicNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                } rounded-xl h-12`}
              />
              {errors.nicNumber && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.nicNumber}
                </p>
              )}
            </div>
          </div>

          {/* Home Address */}
          <div>
            <label
              htmlFor="homeAddress"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Home Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="homeAddress"
              placeholder="Enter your complete postal address"
              className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[100px] resize-none transition-all duration-200 ${
                errors.homeAddress
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-cyan-500 hover:border-gray-400"
              }`}
              value={formData.homeAddress}
              onChange={handleChange}
            />
            {errors.homeAddress && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.homeAddress}
              </p>
            )}
          </div>

          {/* Location Selection */}
          <div>
            <MapLocationPicker
              location={selectedLocation}
              setLocation={setSelectedLocation}
              coordinates={coordinates}
              setCoordinates={setCoordinates}
              error={errors.location}
              label="📍 Your Location"
              required={true}
              placeholder="Search for your city or area"
            />
          </div>

          {/* Travel Buddy Section */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-cyan-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Travel Buddy
                  </h3>
                  <p className="text-sm text-gray-600">
                    Connect with fellow campers
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowTravelBuddyInfo(!showTravelBuddyInfo)}
                  className="text-cyan-600 hover:text-cyan-700 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  {showTravelBuddyInfo ? "Hide" : "Learn More"}
                  <svg
                    className={`w-4 h-4 transform transition-transform ${
                      showTravelBuddyInfo ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={travelBuddyEnabled}
                    onChange={(e) => setTravelBuddyEnabled(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>
            </div>

            {/* Expandable Information */}
            {showTravelBuddyInfo && (
              <div className="mt-4 pt-4 border-t border-cyan-200 animate-in slide-in-from-top duration-200">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-cyan-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Travel Buddy – How It Works
                  </h4>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p className="leading-relaxed">
                      Any registered customer can enable the Travel Buddy
                      option. To use it, you must be a verified customer by
                      uploading your NIC images within 3 days. Once verified,
                      you can:
                    </p>
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>
                          Share your upcoming travel plans with the community
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>
                          Set the amount needed for the trip and budget details
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>
                          Allow interested campers to join your adventure
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>
                          Chat together in a group to plan your journey
                        </span>
                      </li>
                    </ul>
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800 text-xs">
                        <strong>Note:</strong> You can enable or disable Travel
                        Buddy anytime from your profile settings. Verification
                        is required to access full features.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Document Verification */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-cyan-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Document Verification
                  </h3>
                  <p className="text-sm text-gray-600">
                    Upload photos to speed up your verification process (you can
                    skip this and add later)
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDocumentVerification(!showDocumentVerification)}
                  className="text-cyan-600 hover:text-cyan-700 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  {showDocumentVerification ? "Hide" : "Show Documents"}
                  <svg
                    className={`w-4 h-4 transform transition-transform ${
                      showDocumentVerification ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Expandable Document Upload */}
            {showDocumentVerification && (
              <div className="mt-6 pt-6 border-t border-cyan-200 animate-in slide-in-from-top duration-200">
                <div className="space-y-8">
                  {/* Profile Picture */}
                  <ProfilePictureUpload
                    id="profileUpload"
                    label="Profile Picture"
                    preview={profilePreview}
                    setPreview={setProfilePreview}
                    uploadRef={profileUploadRef}
                    required={false}
                    error={errors.profilePicture}
                  />

                  {/* NIC Images */}
                  <NICUpload
                    frontId="nicFrontUpload"
                    backId="nicBackUpload"
                    frontPreview={nicFrontPreview}
                    backPreview={nicBackPreview}
                    setFrontPreview={setNicFrontPreview}
                    setBackPreview={setNicBackPreview}
                    frontUploadRef={nicFrontUploadRef}
                    backUploadRef={nicBackUploadRef}
                    required={false}
                    frontError={errors.nicFrontImage}
                    backError={errors.nicBackImage}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              className={`${
                errors.email
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-cyan-500"
              } rounded-xl h-12`}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Fields */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className={`${
                  errors.password
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-cyan-500"
                } rounded-xl h-12`}
              />

              {errors.password && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`${
                  errors.confirmPassword
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-cyan-500"
                } rounded-xl h-12`}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Password Requirements */}
          <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
            Password must be at least 8 characters with uppercase, lowercase,
            and number
          </div>

          {/* Terms and Conditions */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200">
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-5 h-5 text-cyan-600 border-gray-300 rounded-lg focus:ring-cyan-500 mt-1 flex-shrink-0"
              />
              <div className="flex-1">
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-800 leading-relaxed"
                >
                  I agree to SkyCamp's{" "}
                  <a
                    href="/terms"
                    className="text-cyan-600 hover:text-cyan-700 underline font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="text-cyan-600 hover:text-cyan-700 underline font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                  . I understand that my information will be securely stored and
                  used to enhance my SkyCamp experience.
                </label>
                {errors.terms && (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-2">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    {errors.terms}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Next Steps Notice */}
          <div className="text-center bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border border-cyan-200">
            <div className="text-sm text-gray-700">
              <span className="font-medium">Next:</span> After registration, you'll
              complete your profile with contact details and preferences
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-12 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-2xl shadow-lg text-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Your Account...
                </div>
              ) : (
                "Create My SkyCamp Account"
              )}
            </Button>

            <p className="text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-cyan-600 hover:text-cyan-700 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
    </div>
  );

  // Old step functions - no longer needed
  const renderContactDetailsStep = () => (
    <div className="mt-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Contact Information
        </h2>
        <p className="text-gray-600 text-sm">Help us stay connected with you</p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <div className="space-y-8">
          {/* Phone Number */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              📱 Phone Number <span className="text-red-500">*</span>
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
              } rounded-xl h-12 text-lg`}
            />
            <div className="flex items-center gap-2 mt-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <p className="text-xs text-gray-500">
                Sri Lankan phone number format (10 digits starting with 0)
              </p>
            </div>
            {errors.phoneNumber && (
              <p className="text-sm text-red-600 mt-2 flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.phoneNumber}
              </p>
            )}
          </div>

          {/* Home Address */}
          <div>
            <label
              htmlFor="homeAddress"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              🏠 Home Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="homeAddress"
              placeholder="Enter your complete postal address&#10;Example:&#10;123 Main Street&#10;Colombo 03&#10;Western Province&#10;Sri Lanka"
              className={`w-full border rounded-xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[140px] resize-none transition-all duration-200 ${
                errors.homeAddress
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-cyan-500 hover:border-gray-400"
              }`}
              value={formData.homeAddress}
              onChange={handleChange}
            />
            <div className="flex items-start gap-2 mt-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full mt-1.5"></div>
              <p className="text-xs text-gray-500">
                Please include your complete postal address with city and postal
                code
              </p>
            </div>
            {errors.homeAddress && (
              <p className="text-sm text-red-600 mt-2 flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.homeAddress}
              </p>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-start gap-3">
              <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">
                  Privacy & Security
                </p>
                <p className="text-blue-700 text-xs leading-relaxed">
                  Your contact information is securely stored and will only be
                  used to communicate with you about your SkyCamp activities. We
                  never share your personal details with third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 3: Location (Map Location Picker)
  const renderLocationStep = () => (
    <div className="mt-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Where Are You Located?
        </h2>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Help us connect you with nearby camping spots and fellow campers in
          your area
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <MapLocationPicker
          location={selectedLocation}
          setLocation={setSelectedLocation}
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          error={errors.location}
          label="📍 Your Location"
          required={true}
          placeholder="Search for your city or area"
        />

        {/* Info about location usage */}
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-start gap-3">
            <InformationCircleIcon className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-purple-900 mb-1">
                Why do we need your location?
              </p>
              <ul className="text-purple-700 text-xs space-y-1">
                <li>• Find camping destinations near you</li>
                <li>• Connect with local camping communities</li>
                <li>• Suggest relevant gear rentals in your area</li>
                <li>• Personalize your SkyCamp experience</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 4: Identity Verification (NIC Number, NIC Image, Profile Picture)
  const renderVerificationStep = () => (
    <div className="mt-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Identity Verification
        </h2>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Help us verify your identity to build trust in our community
        </p>
      </div>

      {/* NIC Number */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            🆔 National Identity Card
          </h3>
          <p className="text-sm text-gray-600">
            Enter your NIC number for verification
          </p>
        </div>

        <div>
          <label
            htmlFor="nicNumber"
            className="block text-sm font-medium text-gray-700 mb-3"
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
            } rounded-xl h-12 text-lg max-w-sm`}
          />
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <p className="text-xs text-gray-500">
              Format: 9 digits + V/X (e.g., 123456789V)
            </p>
          </div>
          {errors.nicNumber && (
            <p className="text-sm text-red-600 mt-2 flex items-center gap-2 bg-red-50 p-3 rounded-lg">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {errors.nicNumber}
            </p>
          )}
        </div>
      </div>

      {/* Optional Uploads */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            📸 Optional Verification
          </h3>
          <p className="text-sm text-gray-600">
            Upload photos to speed up your verification process (you can skip
            this and add later)
          </p>
        </div>

        <div className="space-y-8">
          {/* NIC Images */}
          <NICUpload
            frontId="nicFrontUpload"
            backId="nicBackUpload"
            frontPreview={nicFrontPreview}
            backPreview={nicBackPreview}
            setFrontPreview={setNicFrontPreview}
            setBackPreview={setNicBackPreview}
            frontUploadRef={nicFrontUploadRef}
            backUploadRef={nicBackUploadRef}
            required={false}
            frontError={errors.nicFrontImage}
            backError={errors.nicBackImage}
          />

          {/* Profile Picture */}
          <ProfilePictureUpload
            id="profileUpload"
            label="Profile Picture"
            preview={profilePreview}
            setPreview={setProfilePreview}
            uploadRef={profileUploadRef}
            required={false}
            error={errors.profilePicture}
          />
        </div>
      </div>

      {/* Verification Benefits */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-amber-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-sm">
            <p className="font-medium text-amber-900 mb-2">
              Benefits of Verification
            </p>
            <ul className="text-amber-800 text-xs space-y-1">
              <li>✅ Build trust with other campers</li>
              <li>✅ Access to verified community features</li>
              <li>✅ Higher priority in gear rentals</li>
              <li>✅ Enable Travel Buddy connections</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 5: Travel Buddy Preferences
  const renderTravelBuddyStep = () => (
    <div className="mt-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Travel Buddy Preferences
        </h2>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Connect with fellow outdoor enthusiasts and plan amazing adventures
          together
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        {/* Travel Buddy Information Section */}
        <div className="mb-8 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-6">
          <button
            type="button"
            onClick={() => setShowTravelBuddyInfo(!showTravelBuddyInfo)}
            className="w-full flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 rounded-lg p-2 -m-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center">
                <InformationCircleIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-semibold text-cyan-900">
                Travel Buddy – How It Works
              </span>
            </div>
            {showTravelBuddyInfo ? (
              <ChevronUpIcon className="w-5 h-5 text-cyan-600" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-cyan-600" />
            )}
          </button>

          {showTravelBuddyInfo && (
            <div className="mt-6 pt-6 border-t border-cyan-200">
              <div className="text-sm text-cyan-800 space-y-4">
                <p className="leading-relaxed font-medium">
                  Any registered customer can enable the Travel Buddy option. To
                  use it, you must be a verified customer by uploading your NIC
                  images within 3 days. Once verified, you can:
                </p>
                <ul className="space-y-3 ml-2">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      Share your upcoming travel plans with the community
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Set the budget amount needed for the trip</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Allow interested campers to join your adventure</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      4
                    </span>
                    <span>Chat together in a group to plan your journey</span>
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-cyan-100 rounded-lg">
                  <p className="text-sm text-cyan-700 font-medium flex items-center gap-2">
                    <span>💡</span>
                    <span>
                      Tip: You can change this setting anytime in your profile
                      after registration.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preference Selection */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-6">
            Choose Your Adventure Style
          </label>
          <div className="space-y-4">
            {[
              {
                value: "Active",
                label: "🌟 Connect with Fellow Campers",
                description:
                  "Join a community of outdoor enthusiasts and discover new camping companions",
                benefits: [
                  "Find travel partners",
                  "Share camping costs",
                  "Learn from experienced campers",
                  "Make lifelong friendships",
                ],
                color: "from-green-50 to-emerald-50 border-green-200",
                activeColor:
                  "from-green-100 to-emerald-100 border-green-400 ring-2 ring-green-500 ring-opacity-20",
              },
              {
                value: "Inactive",
                label: "🏕️ Solo Adventure Mode",
                description:
                  "Prefer to explore nature on your own terms and at your own pace",
                benefits: [
                  "Complete independence",
                  "Flexible schedules",
                  "Personal reflection time",
                  "Enable later when ready",
                ],
                color: "from-gray-50 to-slate-50 border-gray-200",
                activeColor:
                  "from-gray-100 to-slate-100 border-gray-400 ring-2 ring-gray-500 ring-opacity-20",
              },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTravelBuddyStatus(option.value)}
                className={`w-full text-left p-6 border-2 rounded-2xl transition-all duration-300 hover:shadow-md bg-gradient-to-r ${
                  travelBuddyStatus === option.value
                    ? option.activeColor
                    : option.color + " hover:shadow-sm"
                }`}
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {option.label}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {option.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {option.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-xs text-gray-700"
                      >
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Step 6: Review & Submit
  const renderReviewStep = () => (
    <div className="mt-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Almost Done!
        </h2>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Please review your information before completing your registration
        </p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-4">
        {/* Personal Information */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <UserCircleIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Personal & Account
              </h3>
              <p className="text-xs text-gray-500">
                Your basic information and credentials
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">
                  {formData.firstName} {formData.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date of Birth:</span>
                <span className="font-medium">{formData.dob}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gender:</span>
                <span className="font-medium">{gender}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Password:</span>
                <span className="font-medium">••••••••</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Location */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Contact & Location
              </h3>
              <p className="text-xs text-gray-500">How we can reach you</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-start">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">{formData.phoneNumber}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600">Address:</span>
              <span className="font-medium text-right max-w-xs">
                {formData.homeAddress}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium text-right max-w-xs">
                {selectedLocation || "Not selected"}
              </span>
            </div>
          </div>
        </div>

        {/* Verification & Preferences */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Verification & Preferences
              </h3>
              <p className="text-xs text-gray-500">
                Identity verification and travel preferences
              </p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">NIC Number:</span>
              <span className="font-medium">{formData.nicNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Profile Picture:</span>
              <span
                className={`font-medium ${
                  profilePreview ? "text-green-600" : "text-gray-500"
                }`}
              >
                {profilePreview ? "✓ Uploaded" : "Skipped (Optional)"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">NIC Photos:</span>
              <span
                className={`font-medium ${
                  nicFrontPreview || nicBackPreview
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {nicFrontPreview || nicBackPreview
                  ? `✓ ${
                      nicFrontPreview && nicBackPreview
                        ? "Both sides"
                        : "One side"
                    } uploaded`
                  : "Skipped (Optional)"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Travel Buddy:</span>
              <span
                className={`font-medium ${
                  travelBuddyStatus === "Active"
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                {travelBuddyStatus === "Active" ? "✓ Enabled" : "Solo Mode"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200">
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            id="terms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="w-5 h-5 text-cyan-600 border-gray-300 rounded-lg focus:ring-cyan-500 mt-1 flex-shrink-0"
          />
          <div className="flex-1">
            <label
              htmlFor="terms"
              className="text-sm text-gray-800 leading-relaxed"
            >
              I agree to SkyCamp's{" "}
              <a
                href="/terms"
                className="text-cyan-600 hover:text-cyan-700 underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="text-cyan-600 hover:text-cyan-700 underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              . I understand that my information will be securely stored and
              used to enhance my SkyCamp experience.
            </label>
            {errors.terms && (
              <p className="text-sm text-red-600 mt-2 flex items-center gap-2">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.terms}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="text-center bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200">
        <div className="mb-3">🏕️ 🌟 ⛰️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Welcome to the SkyCamp Adventure Community!
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed max-w-md mx-auto">
          You're about to join thousands of outdoor enthusiasts who explore Sri
          Lanka's most beautiful camping destinations together.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          to="/signup-role-selection"
          className="inline-flex items-center text-gray-600 hover:text-cyan-600 text-sm font-medium transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Role Selection
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="space-y-1 sm:space-y-2 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Customer Registration Form
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Selected Role:{" "}
            <span className="text-cyan-600 font-semibold">Customer</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          {renderRegistrationForm()}
        </form>
      </div>
    </div>
  );
}
