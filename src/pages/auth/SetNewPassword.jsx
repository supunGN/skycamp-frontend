import React, { useState } from "react";
import { ArrowLeftIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/atoms/Button";
import { Input } from "../../components/molecules/Input";

export default function SetNewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    console.log("Password successfully reset:", password);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-sm">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-4 rounded-full">
            <LockClosedIcon className="w-6 h-6 text-gray-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">
          Set New Password
        </h2>
        <p className="text-center text-sm text-gray-600 mb-8">
          Your new password must be different from previously used passwords.
        </p>

        {/* Form */}
        <form onSubmit={handleResetPassword} className="space-y-5">
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <Input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              Must be at least 8 characters
            </p>
          </div>

          {/* Reset Button */}
          <Link to="/password-reset-success">
            <Button type="submit" className="w-full mt-4">
              Reset Password
            </Button>
          </Link>
        </form>

        {/* Back to login */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-cyan-600 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to log in
          </Link>
        </div>
      </div>
    </div>
  );
}
