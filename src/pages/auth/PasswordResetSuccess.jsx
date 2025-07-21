import React from "react";
import { ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/atoms/Button";

export default function PasswordResetSuccess() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/login"); // Navigate to login after clicking Continue
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-sm">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-4 rounded-full">
            <CheckCircleIcon className="w-6 h-6 text-gray-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">
          Password Reset
        </h2>
        <p className="text-center text-sm text-gray-600 mb-8">
          Your password has been successfully reset. Click below to log in
          magically.
        </p>

        {/* Continue Button */}
        <Button onClick={handleContinue} className="w-full mb-4">
          Continue
        </Button>

        {/* Back to login */}
        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-cyan-600 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            back to log in
          </Link>
        </div>
      </div>
    </div>
  );
}
