import React from "react";
import { ArrowLeftIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/atoms/Button";

export default function CheckEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "your email address";

  const handleOpenEmail = () => {
    // Open the default mail client
    window.location.href = "mailto:" + email;
  };

  const handleResend = () => {
    // Navigate back to ForgotPassword page
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-sm">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 p-3 rounded-full">
            <EnvelopeIcon className="w-6 h-6 text-gray-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">
          Check Your Email
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          We sent a password reset link to <br />
          <span className="font-semibold text-cyan-600">{email}</span>
        </p>

        {/* Open Email Button */}
        <Button onClick={handleOpenEmail} className="w-full mb-4">
          Open Email
        </Button>

        {/* Resend Link */}
        <p className="text-center text-sm text-gray-600">
          Didn’t receive the email?{" "}
          <button
            onClick={handleResend}
            className="text-cyan-600 hover:underline"
          >
            click to resend
          </button>
        </p>

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

        {/* cheking create new password */}
        <div className="mt-6 text-center">
          <Link
            to="/set-new-password"
            className="inline-flex items-center text-sm text-gray-600 hover:text-cyan-600"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            check create new password
          </Link>
        </div>
      </div>
    </div>
  );
}
