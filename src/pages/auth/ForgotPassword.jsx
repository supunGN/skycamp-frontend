import React, { useState } from "react";
import { ArrowLeftIcon, KeyIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/atoms/Button";
import { Input } from "../../components/molecules/Input";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    // Simulate sending reset link and navigate to CheckEmail page with email
    navigate("/check-email", { state: { email } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-sm">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 p-3 rounded-full">
            <KeyIcon className="w-6 h-6 text-gray-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">
          Forgot Password?
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Enter your email, and we’ll send you a reset link.
        </p>

        {/* Email Input */}
        <form onSubmit={handleResetPassword}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full mt-4">
            Reset Password
          </Button>
        </form>

        {/* Back to login */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-cyan-600"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            back to log in
          </Link>
        </div>
      </div>
    </div>
  );
}
