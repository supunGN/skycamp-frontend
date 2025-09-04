import React, { useState } from "react";
import { Input } from "../../components/molecules/Input";
import Button from "../../components/atoms/Button";
import {
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const Security = ({ formData, onInputChange }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    };
    return requirements;
  };

  const handlePasswordChange = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else {
      const requirements = validatePassword(formData.newPassword);
      if (!Object.values(requirements).every(Boolean)) {
        newErrors.newPassword = "Password must meet all requirements";
      }
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Handle password update
      console.log("Password update logic here");
    }
  };

  const passwordRequirements = formData.newPassword
    ? validatePassword(formData.newPassword)
    : {};

  return (
    <div className="space-y-8">
      {/* Security Header */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <ShieldCheckIcon className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Account Security
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Keep your account secure with a strong password
            </p>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="max-w-md space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Change Password
            </h3>
            <p className="text-sm text-gray-600">
              Ensure your account stays secure by updating your password
              regularly
            </p>
          </div>

          <div className="space-y-4">
            {/* Current Password */}
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Current Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter your current password"
                  value={formData.currentPassword}
                  onChange={onInputChange}
                  className={`h-12 pr-12 ${
                    errors.currentPassword ? "border-red-300" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={formData.newPassword}
                  onChange={onInputChange}
                  className={`h-12 pr-12 ${
                    errors.newPassword ? "border-red-300" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={onInputChange}
                  className={`h-12 pr-12 ${
                    errors.confirmPassword ? "border-red-300" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Password Requirements */}
          {formData.newPassword && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-3">
                Password Requirements
              </h4>
              <div className="space-y-2">
                {[
                  { key: "length", text: "At least 8 characters long" },
                  { key: "uppercase", text: "Contains uppercase letter" },
                  { key: "lowercase", text: "Contains lowercase letter" },
                  { key: "number", text: "Contains at least one number" },
                ].map(({ key, text }) => (
                  <div key={key} className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        passwordRequirements[key]
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {passwordRequirements[key] ? "✓" : "○"}
                    </div>
                    <span
                      className={`text-xs ${
                        passwordRequirements[key]
                          ? "text-green-700"
                          : "text-gray-600"
                      }`}
                    >
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handlePasswordChange}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
          >
            Update Password
          </Button>
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h3 className="font-medium text-gray-900 mb-3">Security Tips</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-gray-400 mt-1">•</span>
            Use a unique password that you don't use elsewhere
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400 mt-1">•</span>
            Change your password regularly, especially if you suspect it's been
            compromised
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400 mt-1">•</span>
            Never share your password with anyone
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400 mt-1">•</span>
            Log out of your account when using shared or public devices
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Security;
