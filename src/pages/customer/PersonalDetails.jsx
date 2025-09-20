import React, { useState, useRef } from "react";
import { Input } from "../../components/molecules/Input";
import Button from "../../components/atoms/Button";
import {
  UserCircleIcon,
  PhotoIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { API } from "../../api";
import { getProfilePictureUrl } from "../../utils/cacheBusting";

const PersonalDetails = ({ user, formData, onInputChange, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

  const handleSave = async () => {
    try {
      setErrors({});
      setSuccessMessage("");
      setIsUploading(true);

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("phoneNumber", formData.phone);
      formDataToSend.append("homeAddress", formData.address);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("dob", formData.dob);

      // Add profile picture if selected
      if (fileInputRef.current?.files?.[0]) {
        formDataToSend.append("profilePicture", fileInputRef.current.files[0]);
      }

      const result = await API.auth.updateProfile(formDataToSend);

      if (result.success) {
        setSuccessMessage("Profile updated successfully!");
        setIsEditing(false);
        setProfilePicturePreview(null);

        // Update localStorage with new user data
        localStorage.setItem("user", JSON.stringify(result.user));

        // Call the parent's onSave if provided
        if (onSave) onSave();

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
  };

  return (
    <div className="space-y-8">
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
              ) : user?.profile_picture ? (
                <img
                  src={getProfilePictureUrl(user)}
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
              {user?.first_name} {user?.last_name}
            </h1>
            <p className="text-gray-600 mb-4">{user?.email}</p>

            <div className="flex items-center justify-center lg:justify-start gap-3 text-sm">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user?.verification_status === "Yes"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-amber-100 text-amber-800 border border-amber-200"
                }`}
              >
                {user?.verification_status === "Yes"
                  ? "Verified Account"
                  : "Pending Verification"}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user?.travel_buddy_status === "Active"
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-gray-100 text-gray-800 border border-gray-200"
                }`}
              >
                {user?.travel_buddy_status === "Active"
                  ? "Travel Buddy Active"
                  : "Solo Traveler"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
                value={formData.email}
                onChange={onInputChange}
                disabled={!isEditing}
                className={`h-12 ${!isEditing ? "bg-gray-50" : ""}`}
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <Input
                id="phone"
                placeholder="0771234567"
                value={formData.phone}
                onChange={onInputChange}
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
                onChange={onInputChange}
                disabled={!isEditing}
                className={`h-12 ${!isEditing ? "bg-gray-50" : ""}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              {isEditing ? (
                <div className="flex gap-3">
                  {["Male", "Female", "Other"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        onInputChange({
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
            </div>
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Home Address
            </label>
            <textarea
              id="address"
              placeholder="Enter your complete postal address"
              className={`w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[100px] resize-none transition-colors ${
                !isEditing ? "bg-gray-50" : ""
              }`}
              value={formData.address}
              onChange={onInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
