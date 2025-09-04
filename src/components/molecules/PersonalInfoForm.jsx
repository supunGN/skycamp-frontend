import React, { useEffect, useState, useRef } from "react";
import Button from "../atoms/Button";
import { Input } from "./Input";
import Modal from "./Modal";
import Notification from "./Notification";

const defaultUser = {
  id: "",
  firstName: "",
  lastName: "",
  dob: "",
  phone: "",
  gender: "",
  email: "",
  name: "",
  profilePic: null,
};

const API_URL =
  "http://localhost/skycamp/skycamp-backend/api/customer/update-profile.php";
const FETCH_URL =
  "http://localhost/skycamp/skycamp-backend/api/customer/profile.php";

export default function PersonalInfoForm() {
  const [userData, setUserData] = useState(defaultUser); // Displayed data
  const [formData, setFormData] = useState(defaultUser); // Input fields
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const fileInputRef = useRef();

  // Fetch user data from backend on mount
  useEffect(() => {
    setLoading(true);
    setError("");
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const userId = parsed.id || parsed.user_id;
        if (userId) {
          fetch(`${FETCH_URL}?id=${userId}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.success && data.user) {
                const loaded = {
                  ...defaultUser,
                  ...data.user,
                  id: data.user.id,
                  firstName: data.user.first_name || "",
                  lastName: data.user.last_name || "",
                  dob: data.user.date_of_birth || "",
                  phone: data.user.phone || "",
                  gender: data.user.gender || "",
                  email: data.user.email || "",
                };
                setUserData(loaded);
                setFormData(loaded);
                localStorage.setItem("user", JSON.stringify(data.user));
                setLoading(false);
              } else {
                setError("User not found.");
                setLoading(false);
              }
            })
            .catch(() => {
              setError("Failed to fetch user data from backend.");
              setLoading(false);
            });
        } else {
          setError("No user ID found in localStorage.");
          setLoading(false);
        }
      } catch {
        setError("Invalid user data in localStorage.");
        setLoading(false);
      }
    } else {
      setError("No user found in localStorage.");
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (e) => {
    setFormData((prev) => ({ ...prev, gender: e.target.value }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  // Cancel: reset formData to userData
  const handleCancel = () => {
    setFormData(userData);
    setProfilePic(null);
  };

  // Show modal instead of saving immediately
  const handleSave = (e) => {
    e.preventDefault();
    setModalOpen(true);
  };

  // Called when user confirms in modal
  const confirmSave = async () => {
    setModalOpen(false);
    setLoading(true);
    setError("");
    try {
      const payload = {
        id: formData.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        date_of_birth: formData.dob,
        gender: formData.gender,
      };
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.user) {
        // Re-fetch the latest data from backend to ensure sync
        fetch(`${FETCH_URL}?id=${formData.id}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.user) {
              const loaded = {
                ...defaultUser,
                ...data.user,
                id: data.user.id,
                firstName: data.user.first_name || "",
                lastName: data.user.last_name || "",
                dob: data.user.date_of_birth || "",
                phone: data.user.phone || "",
                gender: data.user.gender || "",
                email: data.user.email || "",
              };
              setUserData(loaded); // Update displayed data
              setFormData(loaded); // Reset form to new data
              localStorage.setItem("user", JSON.stringify(data.user));
              setNotification({
                type: "success",
                message: "Profile updated successfully!",
              });
              setLoading(false);
            } else {
              setError("Failed to fetch updated user data.");
              setNotification({
                type: "error",
                message: "Failed to update profile. Please try again.",
              });
              setLoading(false);
            }
          })
          .catch(() => {
            setError("Failed to fetch updated user data.");
            setNotification({
              type: "error",
              message: "Failed to update profile. Please try again.",
            });
            setLoading(false);
          });
      } else {
        setError("Failed to update user data.");
        setNotification({
          type: "error",
          message: "Failed to update profile. Please try again.",
        });
        setLoading(false);
      }
    } catch {
      setError("Failed to update user data.");
      setNotification({
        type: "error",
        message: "Failed to update profile. Please try again.",
      });
      setLoading(false);
    }
  };

  // Hide notification after it disappears
  const handleNotificationClose = () =>
    setNotification({ type: "", message: "" });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-600 mb-4"></div>
        <div className="text-cyan-700 font-medium">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] w-full">
        <div className="text-red-600 font-semibold mb-2">{error}</div>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        onConfirm={confirmSave}
        title="Confirm Save"
        message="Are you sure you want to save these changes?"
      />
      <Notification
        type={notification.type}
        message={notification.message}
        onClose={handleNotificationClose}
      />
      <div className="flex flex-col w-full pb-16 Lg:pt-32">
        {/* Profile image and name/email */}
        <div className="flex flex-row items-center mb-12 gap-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-5xl overflow-hidden">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-20 h-20"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118A7.5 7.5 0 0112 15.75a7.5 7.5 0 017.5 4.368"
                  />
                </svg>
              )}
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 text-xs border border-gray-300 shadow"
              onClick={() => fileInputRef.current.click()}
            >
              + Add
            </Button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleProfilePicChange}
            />
          </div>
          <div className="flex flex-col">
            <div className="font-semibold text-4xl">
              {userData.firstName} {userData.lastName}
            </div>
            <div className="text-gray-500 text-base mt-2">{userData.email}</div>
          </div>
        </div>
        {/* Card */}
        <div className="mb-6">
          <div className="font-semibold text-lg mb-1">Personal info</div>
          <div className="text-gray-500 text-sm">
            Update your photo and personal details here.
          </div>
        </div>
        <div className="w-full max-w-2xl bg-gray-50 rounded-xl shadow border border-gray-200 px-10 py-10 mb-12">
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  First name
                </label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Last name
                </label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Last name"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Date of Birth
                </label>
                <Input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <Input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Phone Number"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Gender</label>
              <div className="flex gap-8 mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={handleGenderChange}
                    className="form-radio text-cyan-600"
                  />
                  <span className="ml-2">Male</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={handleGenderChange}
                    className="form-radio text-cyan-600"
                  />
                  <span className="ml-2">Female</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Other"
                    checked={formData.gender === "Other"}
                    onChange={handleGenderChange}
                    className="form-radio text-cyan-600"
                  />
                  <span className="ml-2">Other</span>
                </label>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div className="w-full flex justify-end gap-4">
              <Button variant="secondary" type="button" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
