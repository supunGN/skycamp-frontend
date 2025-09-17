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

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(reason);
  };

  const handleClose = () => {
    setReason("");
    onClose();
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
                      className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-${actionColor}-100 sm:mx-0 sm:h-10 sm:w-10`}
                    >
                      <ActionIcon
                        className={`h-6 w-6 text-${actionColor}-600`}
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
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-${actionColor}-600 text-base font-medium text-white hover:bg-${actionColor}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${actionColor}-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
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
