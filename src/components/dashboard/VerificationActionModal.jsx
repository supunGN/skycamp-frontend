import React, { useState } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export default function VerificationActionModal({
  isOpen,
  onClose,
  onConfirm,
  action,
  user,
  userType,
  loading,
}) {
  const [reason, setReason] = useState("");

  // Predefined messages for quick selection
  const predefinedMessages = {
    approve: [
      "NIC documents are clear and valid. Identity verified successfully.",
      "All required documents submitted correctly. User identity confirmed.",
      "NIC images are legible and match the provided information.",
      "Document verification completed. User meets verification requirements.",
      "Identity documents are authentic and properly submitted.",
      "NIC verification successful. User is eligible for platform services.",
      "All verification criteria met. Documents are valid and clear.",
      "User identity confirmed through NIC verification process.",
    ],
    reject: [
      "NIC documents are unclear or illegible. Please resubmit with better quality images.",
      "NIC images do not match the provided personal information.",
      "Incomplete document submission. Both front and back NIC images required.",
      "NIC documents appear to be altered or tampered with.",
      "Document quality is insufficient for verification purposes.",
      "NIC information does not match user profile details.",
      "Documents submitted are not valid identification.",
      "Verification failed due to document authenticity concerns.",
    ],
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(reason);
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  const handlePredefinedMessage = (message) => {
    setReason(message);
  };

  const isApprove = action === "approve";
  const actionColor = isApprove ? "green" : "red";
  const actionIcon = isApprove ? CheckCircleIcon : XCircleIcon;
  const ActionIcon = actionIcon;

  const actionText = isApprove ? "Approve" : "Reject";
  const actionDescription = isApprove
    ? "This will mark the user as verified and update their verification status to 'Yes'."
    : "This will reject the user's verification request and move them to the rejected users list.";

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleClose}
            ></div>

            {/* Modal panel */}
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div
                      className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                        isApprove ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      <ActionIcon
                        className={`h-6 w-6 ${
                          isApprove ? "text-green-600" : "text-red-600"
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg font-medium text-gray-900">
                        {actionText} User Verification
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          {actionDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="bg-gray-50 px-4 py-3 sm:px-6">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      User Details:
                    </div>
                    <div className="mt-1 text-gray-600">
                      <p>
                        <strong>Name:</strong> {user?.first_name}{" "}
                        {user?.last_name}
                      </p>
                      <p>
                        <strong>Email:</strong> {user?.email}
                      </p>
                      <p>
                        <strong>NIC:</strong> {user?.nic_number}
                      </p>
                      <p>
                        <strong>Role:</strong>{" "}
                        {userType?.charAt(0).toUpperCase() + userType?.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reason Input */}
                <div className="bg-white px-4 py-5 sm:p-6">
                  <div>
                    <label
                      htmlFor="reason"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Reason for {actionText.toLowerCase()}ing
                    </label>

                    {/* Predefined Messages */}
                    <div className="mt-2 mb-3">
                      <p className="text-xs text-gray-500 mb-2">
                        Quick select a predefined message:
                      </p>
                      <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                        {predefinedMessages[action]?.map((message, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handlePredefinedMessage(message)}
                            className={`text-left p-2 text-xs rounded border transition-colors ${
                              reason === message
                                ? isApprove
                                  ? "bg-green-50 border-green-300 text-green-700"
                                  : "bg-red-50 border-red-300 text-red-700"
                                : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300"
                            }`}
                          >
                            {message}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-1">
                      <textarea
                        id="reason"
                        name="reason"
                        rows={3}
                        className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder={`Enter reason for ${actionText.toLowerCase()}ing this verification...`}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      This reason will be logged for audit purposes.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                      isApprove
                        ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                        : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {actionText}ing...
                      </div>
                    ) : (
                      `${actionText} Verification`
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
