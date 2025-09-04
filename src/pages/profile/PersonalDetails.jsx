import React, { useState } from "react";
import { Input } from "../../components/molecules/Input";
import Button from "../../components/atoms/Button";
import {
  UserCircleIcon,
  PhotoIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

const PersonalDetails = ({ user, formData, onInputChange, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave();
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-gray-200 p-8">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
              {user?.profile_picture ? (
                <img
                  src={`http://localhost/skycamp/skycamp-backend/uploads/profile_pictures/${user.profile_picture}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserCircleIcon className="w-20 h-20 text-gray-400" />
                </div>
              )}
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition-colors shadow-lg">
              <PhotoIcon className="w-4 h-4" />
            </button>
          </div>

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

          <div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </button>
          </div>
        </div>
      </div>

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
                className={`h-12 ${!isEditing ? "bg-gray-50" : ""}`}
              />
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
                className={`h-12 ${!isEditing ? "bg-gray-50" : ""}`}
              />
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
                className={`h-12 ${!isEditing ? "bg-gray-50" : ""}`}
              />
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

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <Button
                onClick={handleSave}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg"
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
