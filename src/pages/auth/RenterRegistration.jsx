import React, { useState } from "react";
import axios from "axios";
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/atoms/Button";
import { Input } from "../../components/molecules/Input";
import MultiSelectDropdown from "../../components/molecules/MultiSelectDropdown";
import SearchableDropdown from "../../components/molecules/SearchableDropdown";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../api";

export default function RenterRegistrationForm() {
  // Get role from navigation state
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role || "renter";

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
  });

  const [gender, setGender] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [selectedCampingDestinations, setSelectedCampingDestinations] =
    useState([]);
  const [selectedStargazingSpots, setSelectedStargazingSpots] = useState([]);

  // Form validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Options for multi-select dropdowns
  const campingDestinations = [
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
  ];

  const stargazingSpots = [
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

    // Service areas validation
    if (!formData.district.trim()) newErrors.district = "District is required";
    if (
      selectedCampingDestinations.length === 0 &&
      selectedStargazingSpots.length === 0
    )
      newErrors.serviceAreas =
        "Please select at least one camping destination or stargazing spot where you provide equipment rental services";

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
    data.append("userRole", "renter");
    data.append("district", formData.district);
    data.append("campingDestinations", selectedCampingDestinations.join(","));
    data.append("stargazingSpots", selectedStargazingSpots.join(","));

    console.log("Submitting renter registration data:");
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
        alert("Welcome to SkyCamp! Your renter registration is complete.");
        const redirectUrl =
          result.data?.redirect_url || "/dashboard/renter/overview";
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

  const renderRegistrationForm = () => (
    <div className="space-y-8">
      {/* Registration Form */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
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

          {/* Phone Number */}
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

          {/* NIC Number and District */}
          <div className="grid sm:grid-cols-2 gap-6">
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
          </div>

          {/* Service Areas */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-100">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🏕️ Service Areas
              </h3>
              <p className="text-sm text-gray-600">
                Select the locations where you provide camping and stargazing
                equipment rental services
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <MultiSelectDropdown
                label="Camping Destinations"
                options={campingDestinations}
                selected={selectedCampingDestinations}
                setSelected={setSelectedCampingDestinations}
                placeholder="Choose camping destinations..."
              />
              <MultiSelectDropdown
                label="Stargazing Spots"
                options={stargazingSpots}
                selected={selectedStargazingSpots}
                setSelected={setSelectedStargazingSpots}
                placeholder="Choose stargazing spots..."
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
                  <p className="font-medium mb-1">Equipment Rental Tips:</p>
                  <ul className="space-y-0.5 text-blue-600">
                    <li>
                      • Select areas where you can reliably provide equipment
                    </li>
                    <li>
                      • Consider transportation and logistics to these locations
                    </li>
                    <li>
                      • You can update your service areas later in your profile
                    </li>
                  </ul>
                </div>
              </div>
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
            Password must be at least 8 characters with uppercase, lowercase,
            and number
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
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
              . I understand my equipment rental services will be listed on the
              platform and I commit to providing quality equipment and reliable
              service.
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
      <div className="text-center bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-200">
        <div className="text-sm text-gray-700">
          <span className="font-medium">Next:</span> After registration, you'll
          access your dashboard to add your equipment inventory and manage
          bookings
        </div>
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
            Equipment Renter Registration Form
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Selected Role:{" "}
            <span className="text-cyan-600 font-semibold">
              Equipment Renter
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {renderRegistrationForm()}

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-12 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-2xl shadow-lg text-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Your Renter Account...
                </div>
              ) : (
                "Start My Equipment Rental Business"
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
        </form>
      </div>
    </div>
  );
}
