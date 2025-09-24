import React, { useState, useRef, useEffect } from "react";
import { Input } from "../../components/molecules/Input";
import Button from "../../components/atoms/Button";
import SectionHeader from "../../components/dashboard/SectionHeader";
import {
  UserCircleIcon,
  PhotoIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { API } from "../../api";
import { getProfilePictureUrl } from "../../utils/cacheBusting";
import MapLocationPicker from "../../components/molecules/MapLocationPicker";

const MyDetails = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    homeAddress: "",
    gender: "",
    dob: "",
    description: "",
    specialNote: "",
    languages: "",
    pricePerDay: "",
    district: "",
  });

  // Location state
  const [selectedLocation, setSelectedLocation] = useState("");
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await API.guideDashboard.getProfile();

      if (response.success) {
        const profileData = response.data;
        setProfile(profileData);
        const newFormData = {
          firstName: profileData.first_name || "",
          lastName: profileData.last_name || "",
          phoneNumber: profileData.phone_number || "",
          homeAddress: profileData.home_address || "",
          gender: profileData.gender || "",
          dob: profileData.dob || "",
          description: profileData.description || "",
          specialNote: profileData.special_note || "",
          languages: profileData.languages || "",
          pricePerDay: profileData.price_per_day || "",
          district: profileData.district || "",
        };
        setFormData(newFormData);

        // Set location data
        if (profileData.latitude && profileData.longitude) {
          setCoordinates({
            lat: parseFloat(profileData.latitude),
            lng: parseFloat(profileData.longitude),
          });
          // Set a default location text if no specific location is stored
          setSelectedLocation(profileData.home_address || "Location set");
        }
      } else {
        setErrors({ general: response.message || "Failed to fetch profile" });
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      setErrors({ general: "Failed to fetch profile. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setErrors({});
      setSuccessMessage("");
      setIsUploading(true);

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("homeAddress", formData.homeAddress);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("dob", formData.dob);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("specialNote", formData.specialNote);
      formDataToSend.append("languages", formData.languages);
      formDataToSend.append("pricePerDay", formData.pricePerDay);
      formDataToSend.append("district", formData.district);

      // Add location data if available
      if (coordinates) {
        formDataToSend.append("latitude", coordinates.lat.toString());
        formDataToSend.append("longitude", coordinates.lng.toString());
      }

      // Add profile picture if selected
      if (fileInputRef.current?.files?.[0]) {
        formDataToSend.append("profilePicture", fileInputRef.current.files[0]);
      }

      const result = await API.guideDashboard.updateProfile(formDataToSend);

      if (result.success) {
        setSuccessMessage("Profile updated successfully!");
        setIsEditing(false);
        setProfilePicturePreview(null);
        setProfile(result.data);

        // Clear file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Show success message for 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setErrors({ general: result.message || "Failed to update profile" });
        }
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setErrors({ general: "Failed to update profile. Please try again." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors({
          profilePicture:
            "Please select a valid image file (JPEG, PNG, or WebP)",
        });
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ profilePicture: "File size must be less than 5MB" });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicturePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear any previous errors
      setErrors((prev) => ({ ...prev, profilePicture: undefined }));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    setSuccessMessage("");
    setProfilePicturePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Reset form data to original profile data
    if (profile) {
      setFormData({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        phoneNumber: profile.phone_number || "",
        homeAddress: profile.home_address || "",
        gender: profile.gender || "",
        dob: profile.dob || "",
        description: profile.description || "",
        specialNote: profile.special_note || "",
        languages: profile.languages || "",
        pricePerDay: profile.price_per_day || "",
        district: profile.district || "",
      });

      // Reset location data
      if (profile.latitude && profile.longitude) {
        setCoordinates({
          lat: parseFloat(profile.latitude),
          lng: parseFloat(profile.longitude),
        });
        setSelectedLocation(profile.home_address || "Location set");
      } else {
        setCoordinates(null);
        setSelectedLocation("");
      }
    }
  };

  const handleInputChange = (e) => {
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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
          <p className="text-red-800 font-medium">
            {errors.general || "Profile not found"}
          </p>
        </div>
      </div>
    );
  }

  const profilePictureUrl = profile?.profile_picture
    ? getProfilePictureUrl(profile)
    : null;

  return (
    <div className="space-y-8">
      <SectionHeader
        title="My Details"
        subtitle="Manage your personal information and profile settings"
      />

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-gray-200 p-8">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
              {profilePicturePreview ? (
                <img
                  src={profilePicturePreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : profile?.profile_picture ? (
                <img
                  src={profilePictureUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserCircleIcon className="w-20 h-20 text-gray-400" />
                </div>
              )}

              {/* Upload overlay when editing */}
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <PhotoIcon className="w-8 h-8 text-white" />
                </div>
              )}
            </div>

            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition-colors shadow-lg"
                title="Change profile picture"
              >
                <PhotoIcon className="w-4 h-4" />
              </button>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Profile picture error message */}
          {errors.profilePicture && (
            <div className="text-red-500 text-sm mt-2 text-center">
              {errors.profilePicture}
            </div>
          )}

          <div className="text-center lg:text-left flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {profile.first_name} {profile.last_name}
            </h1>
            <p className="text-gray-600 mb-4">{profile.email}</p>

            <div className="flex items-center justify-center lg:justify-start gap-3 text-sm">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  profile.verification_status === "Yes"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : profile.verification_status === "Pending"
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    : "bg-gray-100 text-gray-800 border border-gray-200"
                }`}
              >
                {profile.verification_status === "Yes"
                  ? "Verified Guide"
                  : profile.verification_status === "Pending"
                  ? "Verification Pending"
                  : "Not Verified"}
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                Tour Guide
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {!isEditing ? (
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <PencilIcon className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isUploading}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <CheckIcon className="w-4 h-4" />
                  )}
                  {isUploading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckIcon className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XMarkIcon className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800 font-medium">{errors.general}</p>
          </div>
        </div>
      )}

      {/* Personal Information Form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Personal Information
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your personal details and contact information
            </p>
          </div>
        </div>

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
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`h-12 ${!isEditing ? "bg-gray-50" : ""} ${
                  errors.firstName
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
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
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`h-12 ${!isEditing ? "bg-gray-50" : ""} ${
                  errors.lastName
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email and Phone */}
          <div className="grid sm:grid-cols-2 gap-6">
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
                placeholder="Enter your email"
                value={profile.email}
                disabled={true}
                className="h-12 bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>
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
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`h-12 ${!isEditing ? "bg-gray-50" : ""} ${
                  errors.phoneNumber
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phoneNumber}
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
                Date of Birth
              </label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`h-12 ${!isEditing ? "bg-gray-50" : ""}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              {isEditing ? (
                <div className="flex gap-3">
                  {["Male", "Female", "Other"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        handleInputChange({
                          target: { id: "gender", value: option },
                        })
                      }
                      className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                        formData.gender === option
                          ? "bg-cyan-600 text-white shadow-md"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="h-12 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
                  {formData.gender || "Not specified"}
                </div>
              )}
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
              )}
            </div>
          </div>

          {/* Address */}
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
              className={`w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[100px] resize-none transition-colors ${
                !isEditing ? "bg-gray-50" : ""
              } ${
                errors.homeAddress
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
              value={formData.homeAddress}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            {errors.homeAddress && (
              <p className="mt-1 text-sm text-red-600">{errors.homeAddress}</p>
            )}
          </div>

          {/* Location Management */}
          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location on Map <span className="text-red-500">*</span>
              </label>
              <MapLocationPicker
                location={selectedLocation}
                setLocation={setSelectedLocation}
                coordinates={coordinates}
                setCoordinates={setCoordinates}
                error={errors.location}
                label=""
                required={true}
                placeholder="Search for your location or use the map"
              />
              <p className="text-xs text-gray-500 mt-1">
                Update your location on the map when you change your home
                address. This helps customers find your services.
              </p>
            </div>
          )}

          {/* Location Display (Read-only) */}
          {!isEditing && coordinates && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Location
              </label>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      Location Coordinates
                    </p>
                    <p className="text-sm text-gray-600">
                      Latitude: {coordinates.lat.toFixed(6)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Longitude: {coordinates.lng.toFixed(6)}
                    </p>
                    {selectedLocation && (
                      <p className="text-sm text-gray-600 mt-1">
                        Address: {selectedLocation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Click "Edit Profile" to update your location on the map.
              </p>
            </div>
          )}

          {/* Guide Professional Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Professional Information
            </h3>

            {/* Description */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Guide Description
              </label>
              <textarea
                id="description"
                placeholder="Describe your guiding experience and specialties..."
                className={`w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[120px] resize-none transition-colors ${
                  !isEditing ? "bg-gray-50" : ""
                } ${
                  errors.description
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
                value={formData.description}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Special Note */}
            <div className="mb-6">
              <label
                htmlFor="specialNote"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Special Notes
              </label>
              <textarea
                id="specialNote"
                placeholder="Any special instructions or notes for customers..."
                className={`w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[100px] resize-none transition-colors ${
                  !isEditing ? "bg-gray-50" : ""
                } ${
                  errors.specialNote
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
                value={formData.specialNote}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              {errors.specialNote && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.specialNote}
                </p>
              )}
            </div>

            {/* Languages and Price */}
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="languages"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Languages Spoken
                </label>
                <Input
                  id="languages"
                  placeholder="e.g., Sinhala, English, Tamil"
                  value={formData.languages}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`h-12 ${!isEditing ? "bg-gray-50" : ""} ${
                    errors.languages
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                />
                {errors.languages && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.languages}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="pricePerDay"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Price Per Day (LKR)
                </label>
                <Input
                  id="pricePerDay"
                  type="number"
                  placeholder="7000"
                  value={formData.pricePerDay}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`h-12 ${!isEditing ? "bg-gray-50" : ""} ${
                    errors.pricePerDay
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                />
                {errors.pricePerDay && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.pricePerDay}
                  </p>
                )}
              </div>
            </div>

            {/* District */}
            <div>
              <label
                htmlFor="district"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                District
              </label>
              <Input
                id="district"
                placeholder="Colombo"
                value={formData.district}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`h-12 ${!isEditing ? "bg-gray-50" : ""} ${
                  errors.district
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
              />
              {errors.district && (
                <p className="mt-1 text-sm text-red-600">{errors.district}</p>
              )}
            </div>
          </div>

          {/* Additional Guide Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Guide Information
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NIC Number
              </label>
              <div className="h-12 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
                {profile.nic_number || "Not provided"}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                NIC number cannot be changed after registration
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDetails;
