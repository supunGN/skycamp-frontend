import React, { useState, useEffect } from "react";
import Button from "../../components/atoms/Button";
import { API } from "../../api";
import {
  PhotoIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { getVerificationImageUrls } from "../../utils/cacheBusting";

const Verification = ({ user }) => {
  const [nicFrontFile, setNicFrontFile] = useState(null);
  const [nicBackFile, setNicBackFile] = useState(null);
  const [nicFrontFileObj, setNicFrontFileObj] = useState(null);
  const [nicBackFileObj, setNicBackFileObj] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Existing NIC image URLs (from profile data)
  const [existingFrontUrl, setExistingFrontUrl] = useState(null);
  const [existingBackUrl, setExistingBackUrl] = useState(null);
  // Toggle to avoid showing duplicates: either show existing previews or the upload UI
  const [replaceMode, setReplaceMode] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

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

    // Add cache-busting parameter using user's updated_at timestamp
    const timestamp = user?.updated_at
      ? new Date(user.updated_at).getTime()
      : Date.now();
    return `http://localhost/skycamp/skycamp-backend/storage/uploads/${relative}?ts=${timestamp}`;
  };

  // On mount, load from API (authoritative), fallback to user object
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await API.auth.getVerificationDocs();
        const data = res?.data;
        if (!cancelled && data) {
          setExistingFrontUrl(data.nic_front_image_url || null);
          setExistingBackUrl(data.nic_back_image_url || null);
          setRejectionReason(data.rejection_reason || null);
          setRejectionDate(data.rejection_date || null);
          setCanResubmit(data.can_resubmit || false);
        }
      } catch (e) {
        // Fallback to user object if API not available
        const front = user?.nic_front_image || user?.nic_front || null;
        const back = user?.nic_back_image || user?.nic_back || null;
        if (!cancelled) {
          setExistingFrontUrl(buildPublicUrl(front));
          setExistingBackUrl(buildPublicUrl(back));
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

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

      const response = await API.auth.submitVerification(formData);

      if (response.success) {
        setMessage({ type: "success", text: response.message });
        // Clear the files after successful submission
        setNicFrontFile(null);
        setNicBackFile(null);
        setNicFrontFileObj(null);
        setNicBackFileObj(null);

        // Update user object in localStorage
        const updatedUser = { ...user, verification_status: "Pending" };
        localStorage.setItem("user", JSON.stringify(updatedUser));

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
      const response = await API.auth.submitVerification(new FormData());

      if (response.success) {
        setMessage({ type: "success", text: response.message });

        // Update user object in localStorage
        const updatedUser = { ...user, verification_status: "Pending" };
        localStorage.setItem("user", JSON.stringify(updatedUser));

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

  const getVerificationStatus = () => {
    const status = user?.verification_status;
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
    } else if (rejectionReason) {
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

  const verificationStatus = getVerificationStatus();
  const StatusIcon = verificationStatus.icon;

  // Chip for simple status indicator near document previews
  const renderStatusChip = () => {
    const status = (user?.verification_status || "No").toLowerCase();
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

  return (
    <div className="space-y-8">
      {/* Header with Info Toggle */}
      <div className="bg-gradient-to-r from-cyan-50 to-indigo-50 rounded-xl border border-cyan-100 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-100 rounded-lg">
            <InformationCircleIcon className="w-6 h-6 text-cyan-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              Identity Verification
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Upload both sides of your NIC to verify your identity and unlock
              community features
            </p>
          </div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 text-cyan-700 hover:bg-cyan-100 rounded-lg transition-colors"
            aria-label="Verification info"
          >
            <InformationCircleIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showInfo && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Photo Guidelines */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">
                Photo Guidelines
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600 mt-0.5">•</span> Ensure all
                  text and details are clearly visible and legible
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600 mt-0.5">•</span> Take photos in
                  good lighting without shadows or glare
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600 mt-0.5">•</span> Make sure the
                  entire NIC is within the frame
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600 mt-0.5">•</span> Avoid
                  reflections on the card surface
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600 mt-0.5">•</span> Use JPG, PNG,
                  or WebP format with maximum file size of 5MB
                </li>
              </ul>
            </div>

            {/* Benefits of Verification */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">
                Benefits of Verification
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600 mt-0.5" />{" "}
                  Build trust with other community members
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600 mt-0.5" />{" "}
                  Access to verified user features and services
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600 mt-0.5" />{" "}
                  Higher priority in equipment rentals and bookings
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600 mt-0.5" />{" "}
                  Enable Travel Buddy connections and group activities
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Status Banner */}
      <div
        className={`rounded-xl border p-4 ${
          verificationStatus.color === "green"
            ? "bg-green-50 border-green-200"
            : verificationStatus.color === "red"
            ? "bg-red-50 border-red-200"
            : verificationStatus.color === "cyan"
            ? "bg-cyan-50 border-cyan-200"
            : "bg-amber-50 border-amber-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <StatusIcon
            className={`w-6 h-6 ${
              verificationStatus.color === "green"
                ? "text-green-600"
                : verificationStatus.color === "red"
                ? "text-red-600"
                : verificationStatus.color === "cyan"
                ? "text-cyan-600"
                : "text-amber-600"
            }`}
          />
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                verificationStatus.color === "green"
                  ? "text-green-800"
                  : verificationStatus.color === "red"
                  ? "text-red-800"
                  : verificationStatus.color === "cyan"
                  ? "text-cyan-800"
                  : "text-amber-800"
              }`}
            >
              {verificationStatus.text}
            </p>
            {verificationStatus.showRejectionDetails && rejectionDate && (
              <p className="text-xs text-gray-600 mt-1">
                Rejected on {new Date(rejectionDate).toLocaleDateString()}
              </p>
            )}
          </div>
          {rejectionReason && canResubmit && (
            <Button
              onClick={() => setReplaceMode(true)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm"
            >
              Resubmit Documents
            </Button>
          )}
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

          {/* Existing NIC Documents Preview with Status */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-800">
                Your Submitted NIC Documents
              </h4>
              <div className="flex items-center gap-3">
                {renderStatusChip()}
                {user?.verification_status !== "Yes" &&
                  (existingFrontUrl || existingBackUrl) && (
                    <button
                      type="button"
                      onClick={() => setReplaceMode((v) => !v)}
                      className="text-sm font-semibold text-cyan-700 hover:text-cyan-800"
                    >
                      {replaceMode ? "Cancel" : "Replace Documents"}
                    </button>
                  )}
              </div>
            </div>
            {(existingFrontUrl || existingBackUrl) && !replaceMode ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Front Side</div>
                    <div className="aspect-[1.6/1] bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                      {existingFrontUrl ? (
                        <img
                          src={existingFrontUrl}
                          alt="NIC Front"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 text-sm">No image</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Back Side</div>
                    <div className="aspect-[1.6/1] bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                      {existingBackUrl ? (
                        <img
                          src={existingBackUrl}
                          alt="NIC Back"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 text-sm">No image</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit for Verification Button - only show if user has both images and status is not Pending */}
                {existingFrontUrl &&
                  existingBackUrl &&
                  user?.verification_status !== "Pending" &&
                  user?.verification_status !== "Yes" && (
                    <div className="flex justify-center pt-4">
                      <Button
                        onClick={handleSubmitExistingVerification}
                        disabled={submitting}
                        className={`px-6 py-3 rounded-lg ${
                          submitting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-cyan-600 hover:bg-cyan-700"
                        } text-white`}
                      >
                        {submitting
                          ? "Submitting..."
                          : "Submit for Verification"}
                      </Button>
                    </div>
                  )}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                You haven't submitted NIC images yet.
              </div>
            )}
          </div>

          {/* Upload New Verification Documents (hidden unless replaceMode or nothing uploaded) */}
          {user?.verification_status !== "Yes" &&
            (replaceMode || (!existingFrontUrl && !existingBackUrl)) && (
              <div className="space-y-6 bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      Update NIC Documents
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Upload clear photos of both sides of your NIC. These will
                      replace your current documents.
                    </p>
                  </div>
                  {replaceMode && (
                    <button
                      type="button"
                      onClick={() => setReplaceMode(false)}
                      className="text-sm font-semibold text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  )}
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
                  <div
                    className={`p-4 rounded-lg ${
                      message.type === "success"
                        ? "bg-green-50 border border-green-200 text-green-800"
                        : "bg-red-50 border border-red-200 text-red-800"
                    }`}
                  >
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
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-cyan-600 hover:bg-cyan-700"
                      } text-white`}
                    >
                      {submitting ? "Submitting..." : "Submit for Verification"}
                    </Button>
                  </div>
                )}
              </div>
            )}
        </div>
      </div>

      {/* Info sections moved to the top header toggle to avoid duplication */}
    </div>
  );
};

export default Verification;
