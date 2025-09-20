import React, { useState, useEffect } from "react";
import Button from "../../components/atoms/Button";
import SectionHeader from "../../components/dashboard/SectionHeader";
import { API } from "../../api";
import {
  PhotoIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const Verification = () => {
  const [nicFrontFile, setNicFrontFile] = useState(null);
  const [nicBackFile, setNicBackFile] = useState(null);
  const [nicFrontFileObj, setNicFrontFileObj] = useState(null);
  const [nicBackFileObj, setNicBackFileObj] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Existing NIC image URLs (from profile data)
  const [existingFrontUrl, setExistingFrontUrl] = useState(null);
  const [existingBackUrl, setExistingBackUrl] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState("No");

  // Rejection information
  const [rejectionReason, setRejectionReason] = useState(null);
  const [rejectionDate, setRejectionDate] = useState(null);
  const [canResubmit, setCanResubmit] = useState(false);

  // Build a public URL from whatever is stored (absolute/relative) with cache-busting
  const buildPublicUrl = (p) => {
    if (!p) return null;
    // Normalize slashes
    const normalized = String(p).replace(/\\/g, "/");
    // If already an http(s) URL, return as-is
    if (/^https?:\/\//i.test(normalized)) return normalized;
    // If it already includes storage/uploads, trim before it
    const idx = normalized.indexOf("storage/uploads/");
    let relative = normalized;
    if (idx >= 0) {
      relative = normalized.substring(idx + "storage/uploads/".length);
    }
    // If looks like an absolute local path with storage/uploads earlier in path
    const idx2 = normalized.indexOf("/uploads/");
    if (relative === normalized && idx2 >= 0) {
      // keep original normalized
      relative = normalized.substring(idx2 + 1); // remove leading slash
    }
    // If path begins with users/ or verification/, treat as relative under storage/uploads
    if (
      !relative.startsWith("users/") &&
      !relative.startsWith("verification/")
    ) {
      // Assume already relative under storage/uploads
    }

    // Add cache-busting parameter using current timestamp
    const timestamp = Date.now();
    return `http://localhost/skycamp/skycamp-backend/storage/uploads/${relative}?ts=${timestamp}`;
  };

  // Load verification data on mount
  useEffect(() => {
    const loadVerificationData = async () => {
      try {
        setLoading(true);
        const response = await API.renterDashboard.getVerificationDocs();

        if (response.success) {
          const data = response.data;
          setExistingFrontUrl(data.nic_front_image_url || null);
          setExistingBackUrl(data.nic_back_image_url || null);
          setVerificationStatus(data.verification_status || "No");
          setRejectionReason(data.rejection_reason || null);
          setRejectionDate(data.rejection_date || null);
          setCanResubmit(data.can_resubmit || false);
        }
      } catch (error) {
        console.error("Failed to load verification docs:", error);
        setMessage({
          type: "error",
          text: "Failed to load verification documents",
        });
      } finally {
        setLoading(false);
      }
    };

    loadVerificationData();
  }, []);

  const handleFileUpload = (event, side) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setMessage({
          type: "error",
          text: "Only JPG, PNG, and WebP images are allowed",
        });
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "File size must be less than 5MB" });
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
      setMessage({
        type: "error",
        text: "Both NIC front and back images are required",
      });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("nic_front_image", nicFrontFileObj);
      formData.append("nic_back_image", nicBackFileObj);

      const response = await API.renterDashboard.submitVerification(formData);

      if (response.success) {
        setMessage({ type: "success", text: response.message });
        // Clear the files after successful submission
        setNicFrontFile(null);
        setNicBackFile(null);
        setNicFrontFileObj(null);
        setNicBackFileObj(null);
        setVerificationStatus("Pending");

        // Trigger a page refresh to show updated status
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: response.message || "Failed to submit verification documents",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to submit verification documents",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitExistingVerification = async () => {
    setSubmitting(true);
    setMessage(null);

    try {
      // Submit existing NIC images for verification
      const response = await API.renterDashboard.submitVerification(
        new FormData()
      );

      if (response.success) {
        setMessage({ type: "success", text: response.message });
        setVerificationStatus("Pending");

        // Trigger a page refresh to show updated status
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: response.message || "Failed to submit verification documents",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to submit verification documents",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getVerificationStatusInfo = () => {
    const status = verificationStatus;
    const hasExistingNIC = existingFrontUrl || existingBackUrl;

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
        color: "cyan",
        bgColor: "cyan-50",
        borderColor: "cyan-200",
      };
    } else if (rejectionReason && rejectionReason.trim()) {
      // User was rejected - show rejection information
      return {
        icon: XCircleIcon,
        text: `Your verification was rejected. ${rejectionReason}`,
        color: "red",
        bgColor: "red-50",
        borderColor: "red-200",
        showRejectionDetails: true,
      };
    } else if (hasExistingNIC) {
      // User has uploaded NIC but hasn't submitted for verification yet
      return {
        icon: InformationCircleIcon,
        text: "You have uploaded your NIC documents. Click 'Submit for Verification' to send them for admin review.",
        color: "amber",
        bgColor: "amber-50",
        borderColor: "amber-200",
      };
    } else {
      // No NIC uploaded yet
      return {
        icon: InformationCircleIcon,
        text: "Upload both sides of your NIC to verify your identity and unlock community features",
        color: "cyan",
        bgColor: "cyan-50",
        borderColor: "cyan-200",
      };
    }
  };

  const verificationStatusInfo = getVerificationStatusInfo();
  const StatusIcon = verificationStatusInfo.icon;

  // Chip for simple status indicator near document previews
  const renderStatusChip = () => {
    const status = verificationStatus.toLowerCase();
    if (status === "yes") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
          Verified
        </span>
      );
    }
    if (status === "pending") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-700 border border-cyan-200">
          Pending Review
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
        Not Submitted
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="NIC Verification"
        subtitle="Upload your NIC documents for identity verification"
      />

      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
            <CheckCircleIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Identity Verification
            </h2>
            <p className="text-sm text-gray-600">
              Verify your identity to unlock premium features
            </p>
          </div>
        </div>

        {/* Status Display */}
        <div
          className={`p-4 rounded-lg border ${verificationStatusInfo.bgColor} ${verificationStatusInfo.borderColor}`}
        >
          <div className="flex items-start gap-3">
            <StatusIcon
              className={`w-5 h-5 text-${verificationStatusInfo.color}-600 mt-0.5 flex-shrink-0`}
            />
            <div className="flex-1">
              <p
                className={`text-sm font-medium text-${verificationStatusInfo.color}-800`}
              >
                {verificationStatusInfo.text}
              </p>
              {verificationStatusInfo.showRejectionDetails && rejectionDate && (
                <p className="text-xs text-red-600 mt-1">
                  Rejected on: {new Date(rejectionDate).toLocaleDateString()}
                </p>
              )}
            </div>
            {renderStatusChip()}
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`p-4 rounded-lg border ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircleIcon className="w-5 h-5" />
            ) : (
              <ExclamationTriangleIcon className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        </div>
      )}

      {/* NIC Upload Section */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            National Identity Card (NIC)
          </h3>
          <p className="text-sm text-gray-600">
            Upload clear photos of both sides of your NIC for verification
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* NIC Front */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">
                NIC Front Side
              </h4>
              {renderStatusChip()}
            </div>

            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "front")}
                className="hidden"
                id="nic-front-upload"
              />

              <div className="aspect-[1.6/1] border-2 border-dashed rounded-lg overflow-hidden transition-all duration-200 border-gray-300 hover:border-cyan-400 hover:bg-gray-50">
                {nicFrontFile || existingFrontUrl ? (
                  <div className="relative w-full h-full">
                    <img
                      src={nicFrontFile || existingFrontUrl}
                      alt="NIC Front preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                      <label
                        htmlFor="nic-front-upload"
                        className="opacity-0 hover:opacity-100 bg-white bg-opacity-90 text-gray-700 px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer"
                      >
                        Change
                      </label>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="nic-front-upload"
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 text-center"
                  >
                    <div className="space-y-2">
                      <div className="w-12 h-8 border-2 border-dashed rounded-md flex items-center justify-center border-gray-400 text-gray-400">
                        <PhotoIcon className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-medium text-gray-600">
                        Upload Front Side
                      </p>
                      <p className="text-xs text-gray-500">Click to browse</p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* NIC Back */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">
                NIC Back Side
              </h4>
              {renderStatusChip()}
            </div>

            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "back")}
                className="hidden"
                id="nic-back-upload"
              />

              <div className="aspect-[1.6/1] border-2 border-dashed rounded-lg overflow-hidden transition-all duration-200 border-gray-300 hover:border-cyan-400 hover:bg-gray-50">
                {nicBackFile || existingBackUrl ? (
                  <div className="relative w-full h-full">
                    <img
                      src={nicBackFile || existingBackUrl}
                      alt="NIC Back preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                      <label
                        htmlFor="nic-back-upload"
                        className="opacity-0 hover:opacity-100 bg-white bg-opacity-90 text-gray-700 px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer"
                      >
                        Change
                      </label>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="nic-back-upload"
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 text-center"
                  >
                    <div className="space-y-2">
                      <div className="w-12 h-8 border-2 border-dashed rounded-md flex items-center justify-center border-gray-400 text-gray-400">
                        <PhotoIcon className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-medium text-gray-600">
                        Upload Back Side
                      </p>
                      <p className="text-xs text-gray-500">Click to browse</p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <InformationCircleIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-800">
              <p className="font-medium mb-2">NIC Photo Guidelines:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Ensure all text and details are clearly visible</li>
                <li>• Take photos in good lighting without shadows</li>
                <li>• Make sure the entire NIC is within the frame</li>
                <li>• Avoid glare or reflections on the card surface</li>
                <li>• Both front and back sides are required</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          {(nicFrontFileObj && nicBackFileObj) ||
          (existingFrontUrl && existingBackUrl) ? (
            <Button
              onClick={
                nicFrontFileObj && nicBackFileObj
                  ? handleSubmitVerification
                  : handleSubmitExistingVerification
              }
              disabled={
                submitting ||
                verificationStatus === "Pending" ||
                verificationStatus === "Yes"
              }
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : verificationStatus === "Pending" ? (
                "Under Review"
              ) : verificationStatus === "Yes" ? (
                "Verified"
              ) : (
                "Submit for Verification"
              )}
            </Button>
          ) : (
            <p className="text-sm text-gray-500">
              Upload both NIC images to enable verification submission
            </p>
          )}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Benefits of Verification
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">
                Build trust with customers
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">
                Access to verified community features
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">
                Higher priority in equipment listings
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">
                Enable premium renter features
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
