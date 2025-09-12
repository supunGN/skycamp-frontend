import { API } from "../../api";
import React, { useState } from "react";
import { ArrowLeftIcon, KeyIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/atoms/Button";
import { Input } from "../../components/molecules/Input";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await API.auth.forgotPassword(email);

      if (data?.success) {
        // Store email for the auth flow
        sessionStorage.setItem("resetEmail", email);

        // Navigate to OTP verification with token
        navigate("/verify-otp", {
          state: {
            email: email,
            token: data.token,
          },
        });
      } else {
        // Handle specific error cases
        if (data?.message) {
          setError(data.message);
        } else {
          setError("Failed to send reset code. Please try again.");
        }
      }
    } catch (error) {
      console.error("Reset request error:", error);
      setError(error?.message || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
          Enter your email, and we'll send you a verification code.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Email Input */}
        <form onSubmit={handleResetPassword}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            disabled={isLoading}
            required
          />
          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Verification Code"}
          </Button>
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
