import React, { useState } from "react";
import Button from "../../components/atoms/Button";
import {
  Cog6ToothIcon,
  BellIcon,
  GlobeAltIcon,
  EyeIcon,
  ShieldCheckIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const Settings = ({ user }) => {
  const [notifications, setNotifications] = useState({
    email: true,
    bookingUpdates: true,
    travelBuddyRequests: true,
    promotions: false,
    systemUpdates: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowTravelBuddyRequests: true,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    console.log("Delete account requested");
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Cog6ToothIcon className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Account Settings
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your preferences and account settings
            </p>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <BellIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Notification Preferences
          </h3>
        </div>

        <div className="space-y-4">
          {[
            {
              key: "email",
              label: "Email Notifications",
              description: "Receive important updates via email",
            },
            {
              key: "bookingUpdates",
              label: "Booking Updates",
              description:
                "Get notified about booking confirmations and changes",
            },
            {
              key: "travelBuddyRequests",
              label: "Travel Buddy Requests",
              description:
                "Receive notifications for travel companion requests",
            },
            {
              key: "promotions",
              label: "Promotional Offers",
              description: "Get notified about special deals and promotions",
            },
            {
              key: "systemUpdates",
              label: "System Updates",
              description:
                "Important system maintenance and feature announcements",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.label}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications[item.key]}
                  onChange={() => handleNotificationChange(item.key)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <EyeIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Privacy Settings
          </h3>
        </div>

        <div className="space-y-6">
          {/* Profile Visibility */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Profile Visibility
            </h4>
            <div className="space-y-2">
              {[
                {
                  value: "public",
                  label: "Public",
                  description: "Visible to all SkyCamp users",
                },
                {
                  value: "verified",
                  label: "Verified Users Only",
                  description: "Only visible to verified members",
                },
                {
                  value: "private",
                  label: "Private",
                  description: "Only visible to accepted travel buddies",
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="profileVisibility"
                    value={option.value}
                    checked={privacy.profileVisibility === option.value}
                    onChange={(e) =>
                      handlePrivacyChange("profileVisibility", e.target.value)
                    }
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{option.label}</p>
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Contact Information Visibility
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Show Email Address
                  </p>
                  <p className="text-sm text-gray-600">
                    Allow other users to see your email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={privacy.showEmail}
                    onChange={(e) =>
                      handlePrivacyChange("showEmail", e.target.checked)
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Show Phone Number</p>
                  <p className="text-sm text-gray-600">
                    Allow other users to see your phone number
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={privacy.showPhone}
                    onChange={(e) =>
                      handlePrivacyChange("showPhone", e.target.checked)
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Allow Travel Buddy Requests
                  </p>
                  <p className="text-sm text-gray-600">
                    Let other users send you travel companion requests
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={privacy.allowTravelBuddyRequests}
                    onChange={(e) =>
                      handlePrivacyChange(
                        "allowTravelBuddyRequests",
                        e.target.checked
                      )
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Language & Region */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <GlobeAltIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Language & Region
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option value="en">English</option>
              <option value="si">Sinhala</option>
              <option value="ta">Tamil</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option value="lkr">Sri Lankan Rupee (LKR)</option>
              <option value="usd">US Dollar (USD)</option>
              <option value="eur">Euro (EUR)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheckIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Data & Privacy
          </h3>
        </div>

        <div className="space-y-4">
          <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h4 className="font-medium text-gray-900">Download My Data</h4>
            <p className="text-sm text-gray-600 mt-1">
              Get a copy of all your SkyCamp data
            </p>
          </button>

          <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h4 className="font-medium text-gray-900">Data Usage Policy</h4>
            <p className="text-sm text-gray-600 mt-1">
              Learn how we use and protect your data
            </p>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-red-900">Delete Account</h4>
              <p className="text-sm text-red-700 mt-1">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
            </div>
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Account
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This will
              permanently remove all your data, bookings, and travel buddy
              connections. This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Save Settings */}
      <div className="flex justify-end">
        <Button className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
