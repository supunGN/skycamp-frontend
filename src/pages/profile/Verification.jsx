import React, { useState } from "react";
import Button from "../../components/atoms/Button";
import { API } from "../../api";
import {
  PhotoIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const Verification = ({ user }) => {
  const [nicFrontFile, setNicFrontFile] = useState(null);
  const [nicBackFile, setNicBackFile] = useState(null);
  const [nicFrontFileObj, setNicFrontFileObj] = useState(null);
  const [nicBackFileObj, setNicBackFileObj] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileUpload = (event, side) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setMessage({ type: 'error', text: 'Only JPG, PNG, and WebP images are allowed' });
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size must be less than 5MB' });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (side === "front") {
          setNicFrontFile(e.target.result);
          setNicFrontFileObj(file);
        } else {
          setNicBackFile(e.target.result);
          setNicBackFileObj(file);
        }
        setMessage(null); // Clear any previous messages
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitVerification = async () => {
    if (!nicFrontFileObj || !nicBackFileObj) {
      setMessage({ type: 'error', text: 'Both NIC front and back images are required' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('nic_front_image', nicFrontFileObj);
      formData.append('nic_back_image', nicBackFileObj);

      const response = await API.auth.submitVerification(formData);
      
      if (response.success) {
        setMessage({ type: 'success', text: response.message });
        // Clear the files after successful submission
        setNicFrontFile(null);
        setNicBackFile(null);
        setNicFrontFileObj(null);
        setNicBackFileObj(null);
        
        // Update user object in localStorage
        const updatedUser = { ...user, verification_status: 'Pending' };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Trigger a page refresh to show updated status
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to submit verification documents' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to submit verification documents' });
    } finally {
      setSubmitting(false);
    }
  };

  const getVerificationStatus = () => {
    const status = user?.verification_status;

    if (status === "Yes") {
      return {
        icon: CheckCircleIcon,
        text: "Your identity has been verified successfully",
        color: "green",
        bgColor: "green-50",
        borderColor: "green-200",
      };
    } else if (status === "Pending") {
      return {
        icon: ClockIcon,
        text: "Your verification is under review. This usually takes 24-48 hours.",
        color: "amber",
        bgColor: "amber-50",
        borderColor: "amber-200",
      };
    } else {
      return {
        icon: ExclamationTriangleIcon,
        text: "Please upload clear photos of both sides of your NIC to verify your identity",
        color: "red",
        bgColor: "red-50",
        borderColor: "red-200",
      };
    }
  };

  const verificationStatus = getVerificationStatus();
  const StatusIcon = verificationStatus.icon;

  return (
    <div className="space-y-8">
      {/* Verification Status */}
      <div
        className={`bg-${verificationStatus.bgColor} border border-${verificationStatus.borderColor} rounded-xl p-6`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-2 bg-${verificationStatus.color}-100 rounded-lg`}>
            <StatusIcon
              className={`w-6 h-6 text-${verificationStatus.color}-600`}
            />
          </div>
          <div className="flex-1">
            <h2
              className={`text-lg font-semibold text-${verificationStatus.color}-900 mb-2`}
            >
              Identity Verification Status
            </h2>
            <p className={`text-sm text-${verificationStatus.color}-700`}>
              {verificationStatus.text}
            </p>
          </div>
        </div>
      </div>

      {/* NIC Information */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            National Identity Card Information
          </h3>
          <p className="text-sm text-gray-600">
            Your NIC details are used for identity verification and security
            purposes
          </p>
        </div>

        <div className="space-y-6">
          {/* NIC Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NIC Number
            </label>
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-700 font-medium">
              {user?.nic_number || "Not provided"}
            </div>
          </div>

          {/* Verification Documents */}
          {user?.verification_status !== "Yes" && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Upload NIC Documents
                </h4>
                <p className="text-sm text-gray-600 mb-6">
                  Please upload clear, high-quality photos of both sides of your
                  National Identity Card
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Front Side Upload */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    NIC Front Side <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "front")}
                      className="hidden"
                      id="nic-front"
                    />

                    {nicFrontFile ? (
                      <div className="relative aspect-[1.6/1] border-2 border-green-300 rounded-lg overflow-hidden">
                        <img
                          src={nicFrontFile}
                          alt="NIC Front"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                          <label
                            htmlFor="nic-front"
                            className="opacity-0 hover:opacity-100 bg-white bg-opacity-90 text-gray-700 px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-all duration-200"
                          >
                            Change
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="nic-front"
                        className="flex flex-col items-center justify-center aspect-[1.6/1] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-cyan-400 hover:bg-gray-50 transition-colors"
                      >
                        <PhotoIcon className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-600">
                          Upload Front Side
                        </p>
                        <p className="text-xs text-gray-500">
                          Click to browse files
                        </p>
                      </label>
                    )}
                  </div>
                </div>

                {/* Back Side Upload */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    NIC Back Side <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "back")}
                      className="hidden"
                      id="nic-back"
                    />

                    {nicBackFile ? (
                      <div className="relative aspect-[1.6/1] border-2 border-green-300 rounded-lg overflow-hidden">
                        <img
                          src={nicBackFile}
                          alt="NIC Back"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                          <label
                            htmlFor="nic-back"
                            className="opacity-0 hover:opacity-100 bg-white bg-opacity-90 text-gray-700 px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-all duration-200"
                          >
                            Change
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="nic-back"
                        className="flex flex-col items-center justify-center aspect-[1.6/1] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-cyan-400 hover:bg-gray-50 transition-colors"
                      >
                        <PhotoIcon className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-600">
                          Upload Back Side
                        </p>
                        <p className="text-xs text-gray-500">
                          Click to browse files
                        </p>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Message Display */}
              {message && (
                <div className={`p-4 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Upload Button */}
              {nicFrontFile && nicBackFile && (
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSubmitVerification}
                    disabled={submitting}
                    className={`px-6 py-2 rounded-lg ${
                      submitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-cyan-600 hover:bg-cyan-700'
                    } text-white`}
                  >
                    {submitting ? 'Submitting...' : 'Submit for Verification'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Guidelines */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h3 className="font-medium text-amber-900 mb-3">Photo Guidelines</h3>
        <ul className="space-y-2 text-sm text-amber-800">
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-1">•</span>
            Ensure all text and details are clearly visible and legible
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-1">•</span>
            Take photos in good lighting without shadows or glare
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-1">•</span>
            Make sure the entire NIC is within the frame
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-1">•</span>
            Avoid reflections on the card surface
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-1">•</span>
            Use JPG, PNG, or WebP format with maximum file size of 5MB
          </li>
        </ul>
      </div>

      {/* Benefits of Verification */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-medium text-blue-900 mb-3">
          Benefits of Verification
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <CheckCircleIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            Build trust with other community members
          </li>
          <li className="flex items-start gap-2">
            <CheckCircleIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            Access to verified user features and services
          </li>
          <li className="flex items-start gap-2">
            <CheckCircleIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            Higher priority in equipment rentals and bookings
          </li>
          <li className="flex items-start gap-2">
            <CheckCircleIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            Enable Travel Buddy connections and group activities
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Verification;
