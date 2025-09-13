import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  UserCircleIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/atoms/Button";
import { Input } from "../../components/molecules/Input";
import MapLocationPicker from "../../components/molecules/MapLocationPicker";
import MultiSelectDropdown from "../../components/molecules/MultiSelectDropdown";
import SearchableDropdown from "../../components/molecules/SearchableDropdown";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API } from "../../api";

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
  onFileSelected,
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

    onFileSelected?.(file);

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
              className="px-4 py-2 text-sm font-medium text-cyan-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-cyan-100 transition-colors"
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
  onFrontFile,
  onBackFile,
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
      onFrontFile?.(file);
      setFrontLoading(true);
      setTimeout(() => {
        setFrontPreview(URL.createObjectURL(file));
        setFrontLoading(false);
      }, 300);
    } else {
      onBackFile?.(file);
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

export default function GuideRegistrationForm() {
  // Get role from navigation state
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role || "guide";

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
    district: "",
    description: "",
    specialNote: "",
    pricePerDay: "",
    currency: "LKR",
    languages: "",
  });

  const [gender, setGender] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [selectedCampingDestinations, setSelectedCampingDestinations] =
    useState([]);
  const [selectedStargazingSpots, setSelectedStargazingSpots] = useState([]);
  const [showDocumentVerification, setShowDocumentVerification] =
    useState(false);

  // Location state for MapLocationPicker
  const [selectedLocation, setSelectedLocation] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  // Image upload state
  const [profilePreview, setProfilePreview] = useState(null);
  const [nicFrontPreview, setNicFrontPreview] = useState(null);
  const [nicBackPreview, setNicBackPreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [nicFrontFile, setNicFrontFile] = useState(null);
  const [nicBackFile, setNicBackFile] = useState(null);
  const profileUploadRef = useRef();
  const nicFrontUploadRef = useRef();
  const nicBackUploadRef = useRef();

  // Form validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [campingDestinations, setCampingDestinations] = useState([]);
  const [stargazingSpots, setStargazingSpots] = useState([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);

  // Load locations from API on component mount
  useEffect(() => {
    const loadLocations = async () => {
      try {
        setIsLoadingLocations(true);

        // Fetch camping destinations and stargazing spots in parallel
        const [campingResponse, stargazingResponse] = await Promise.all([
          API.locations.getCampingDestinations(),
          API.locations.getStargazingSpots(),
        ]);

        if (campingResponse.success) {
          setCampingDestinations(
            campingResponse.data.map((location) => location.name)
          );
        }

        if (stargazingResponse.success) {
          setStargazingSpots(
            stargazingResponse.data.map((location) => location.name)
          );
        }
      } catch (error) {
        console.error("Error loading locations:", error);
        // Fallback to static data if API fails
        setCampingDestinations([
          "Namunukula Range",
          "Ritigala Reserve",
          "Gal Oya Vicinity",
          "Mahiyanganaya Fields",
          "Kallady Beach",
          "Koggala Lake",
          "Udugampola Forest",
          "Yala Buffer Zone",
          "Horton Plains",
          "Knuckles Mountains",
          "Ella Rock",
          "Sigiriya",
          "Adam's Peak",
          "Pidurangala Rock",
          "Diyasaru Park",
        ]);
        setStargazingSpots([
          "Nilgala Reserve",
          "Knuckles Peak",
          "Anuradhapura Plains",
          "Nuwara Eliya Hills",
          "Ella Rock",
          "Sigiriya View Point",
          "Horton Plains",
          "Ritigala Reserve",
          "Yala Buffer Zone",
          "Minneriya Area",
          "Adam's Peak",
          "Pidurangala Rock",
          "Namunukula Range",
        ]);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    loadLocations();
  }, []);

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
    "Batticaloa",
    "Ampara",
    "Polonnaruwa",
    "Ratnapura",
    "Kegalle",
    "Kalutara",
    "Hambantota",
    "Monaragala",
    "Puttalam",
    "Jaffna",
    "Kilinochchi",
    "Mannar",
    "Vavuniya",
    "Mullaitivu",
    "Nuwara Eliya",
    "Matale",
  ];

  const currencies = [
    { value: "LKR", label: "LKR (Sri Lankan Rupee)" },
    { value: "USD", label: "USD (US Dollar)" },
    { value: "EUR", label: "EUR (Euro)" },
  ];

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

    // Guide-specific validation
    if (!formData.district.trim()) newErrors.district = "District is required";
    if (!formData.description.trim())
      newErrors.description = "Guide description is required";
    if (!formData.pricePerDay.trim())
      newErrors.pricePerDay = "Price per day is required";
    if (!formData.languages.trim())
      newErrors.languages = "Languages spoken are required";

    // Service areas validation
    if (
      selectedCampingDestinations.length === 0 &&
      selectedStargazingSpots.length === 0
    )
      newErrors.serviceAreas =
        "Please select at least one camping destination or stargazing spot where you provide guide services";

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

    // Price validation
    if (
      formData.pricePerDay &&
      !/^\d+(\.\d{1,2})?$/.test(formData.pricePerDay)
    ) {
      newErrors.pricePerDay =
        "Please enter a valid price (e.g., 2500 or 2500.50)";
    }

    if (formData.pricePerDay && parseFloat(formData.pricePerDay) <= 0) {
      newErrors.pricePerDay = "Price must be greater than 0";
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
    data.append("userRole", "guide");
    data.append("district", formData.district);
    data.append("description", formData.description);
    data.append("specialNote", formData.specialNote);
    data.append("pricePerDay", formData.pricePerDay);
    data.append("currency", formData.currency);
    data.append("languages", formData.languages);
    data.append("campingDestinations", selectedCampingDestinations.join(","));
    data.append("stargazingSpots", selectedStargazingSpots.join(","));
    data.append("location", selectedLocation);
    if (coordinates.lat && coordinates.lng) {
      data.append("latitude", coordinates.lat);
      data.append("longitude", coordinates.lng);
    }

    // Add image files (prefer state, fallback to refs)
    if (profileFile) data.append("profilePicture", profileFile);
    else if (profileUploadRef.current?.files[0]) {
      data.append("profilePicture", profileUploadRef.current.files[0]);
    }
    if (nicFrontFile) data.append("nicFrontImage", nicFrontFile);
    else if (nicFrontUploadRef.current?.files[0]) {
      data.append("nicFrontImage", nicFrontUploadRef.current.files[0]);
    }
    if (nicBackFile) data.append("nicBackImage", nicBackFile);
    else if (nicBackUploadRef.current?.files[0]) {
      data.append("nicBackImage", nicBackUploadRef.current.files[0]);
    }

    // OPTIONAL: debug log
    console.log("Files in FormData:", {
      profilePicture: profileUploadRef.current?.files[0]?.name,
      nicFrontImage: nicFrontUploadRef.current?.files[0]?.name,
      nicBackImage: nicBackUploadRef.current?.files[0]?.name,
    });

    console.log("Submitting guide registration data:");
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    try {
      const result = await API.auth.register(data);

      console.log("Response from backend:", result);

      if (result.success) {
        if (result.user) {
          localStorage.setItem("user", JSON.stringify(result.user));
        }

        // Show success message and redirect using backend URL
        alert("Welcome to SkyCamp! Your guide registration is complete.");
        const redirectUrl = result.redirect_url || "/";
        window.location.replace(redirectUrl);
      } else {
        alert(result.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);

      // Handle validation errors
      if (error.errors) {
        setErrors(error.errors);
        alert("Please fix the validation errors and try again.");
      } else {
        alert(
          error.message ||
            "An error occurred during registration. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {/* District */}
      <div>
        <SearchableDropdown
          label="Operating District"
          options={districts}
          value={formData.district}
          onChange={(e) =>
            setFormData({ ...formData, district: e.target.value })
          }
          placeholder="Search and select your main operating district"
          required={true}
          error={errors.district}
        />
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

      {/* Guide Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Guide Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          placeholder="Tell potential customers about your guiding experience, specialties, and what makes you unique as a camping and stargazing guide..."
          className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[120px] resize-none transition-all duration-200 ${
            errors.description
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-cyan-500 hover:border-gray-400"
          }`}
          value={formData.description}
          onChange={handleChange}
          maxLength={500}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.description ? (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {errors.description}
            </p>
          ) : (
            <span></span>
          )}
          <span className="text-xs text-gray-500">
            {formData.description.length}/500 characters
          </span>
        </div>
      </div>

      {/* Languages and Price */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="languages"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Languages Spoken <span className="text-red-500">*</span>
          </label>
          <Input
            id="languages"
            placeholder="English, Sinhala, Tamil..."
            value={formData.languages}
            onChange={handleChange}
            className={`${
              errors.languages
                ? "border-red-300 focus:border-red-500"
                : "border-gray-300 focus:border-cyan-500"
            } rounded-xl h-12`}
          />
          {errors.languages && (
            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {errors.languages}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="pricePerDay"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Price Per Day <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <select
              id="currency"
              value={formData.currency}
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-gray-50"
            >
              {currencies.map((curr) => (
                <option key={curr.value} value={curr.value}>
                  {curr.value}
                </option>
              ))}
            </select>
            <Input
              id="pricePerDay"
              placeholder="2500.00"
              value={formData.pricePerDay}
              onChange={handleChange}
              className={`${
                errors.pricePerDay
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-cyan-500"
              } rounded-xl h-12 flex-1`}
            />
          </div>
          {errors.pricePerDay && (
            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {errors.pricePerDay}
            </p>
          )}
        </div>
      </div>

      {/* Special Note */}
      <div>
        <label
          htmlFor="specialNote"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Special Note <span className="text-gray-500">(Optional)</span>
        </label>
        <textarea
          id="specialNote"
          placeholder="Any special requirements, equipment you provide, group size limitations, or additional services..."
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 hover:border-gray-400 min-h-[80px] resize-none transition-all duration-200"
          value={formData.specialNote}
          onChange={handleChange}
          maxLength={200}
        />
        <div className="text-right mt-1">
          <span className="text-xs text-gray-500">
            {formData.specialNote.length}/200 characters
          </span>
        </div>
      </div>

      {/* Service Areas */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-100">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            🗺️ Guide Service Areas
          </h3>
          <p className="text-sm text-gray-600">
            Select the locations where you provide camping and stargazing guide
            services
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <MultiSelectDropdown
            label="Camping Destinations"
            options={campingDestinations}
            selected={selectedCampingDestinations}
            setSelected={setSelectedCampingDestinations}
            placeholder={
              isLoadingLocations
                ? "Loading camping destinations..."
                : "Choose camping destinations..."
            }
            disabled={isLoadingLocations}
          />
          <MultiSelectDropdown
            label="Stargazing Spots"
            options={stargazingSpots}
            selected={selectedStargazingSpots}
            setSelected={setSelectedStargazingSpots}
            placeholder={
              isLoadingLocations
                ? "Loading stargazing spots..."
                : "Choose stargazing spots..."
            }
            disabled={isLoadingLocations}
          />
        </div>

        {errors.serviceAreas && (
          <p className="text-sm text-red-600 mt-3 flex items-center gap-1">
            <ExclamationTriangleIcon className="w-4 h-4" />
            {errors.serviceAreas}
          </p>
        )}

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <InformationCircleIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">Guide Service Tips:</p>
              <ul className="space-y-0.5 text-blue-600">
                <li>
                  • Select areas where you have local knowledge and experience
                </li>
                <li>• Consider accessibility and safety of the locations</li>
                <li>
                  • You can update your service areas later in your profile
                </li>
              </ul>
            </div>
          </div>
        </div>
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
              onClick={() =>
                setShowDocumentVerification(!showDocumentVerification)
              }
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

        <div className="space-y-8">
          {/* Profile Picture */}
          <ProfilePictureUpload
            id="profilePicture"
            label="Profile Picture"
            preview={profilePreview}
            setPreview={setProfilePreview}
            uploadRef={profileUploadRef}
            required={false}
            error={errors.profilePicture}
            onFileSelected={setProfileFile}
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
            onFrontFile={setNicFrontFile}
            onBackFile={setNicBackFile}
          />
        </div>
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
        Password must be at least 8 characters with uppercase, lowercase, and
        number
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
              . I understand my guide services will be listed on the platform
              and I commit to providing professional, safe, and knowledgeable
              guide services.
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
          access your dashboard to manage your availability, view bookings, and
          build your guide profile
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
              Creating Your Guide Account...
            </div>
          ) : (
            "Create My Guide Account"
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
            Local Guide Registration Form
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Selected Role:{" "}
            <span className="text-cyan-600 font-semibold">Local Guide</span>
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"
        >
          {renderRegistrationForm()}
        </form>
      </div>
    </div>
  );
}
