"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Button from "../atoms/Button";

export default function TravelBuddyNavbar({ onChatToggle, onRefresh }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    const existing = JSON.parse(localStorage.getItem("user"));
    localStorage.removeItem("user");
    if (existing?.user_role === "service_provider") {
      window.location.href = "/login";
    } else {
      window.location.href = "/";
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <header className="hidden lg:flex fixed top-0 left-0 w-full z-50 bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center w-full py-4">
          {/* Logo + Title */}
          <div className="flex items-center">
            <button
              onClick={onRefresh}
              className="flex items-center text-xl font-bold text-cyan-600 hover:text-cyan-700 transition-colors"
            >
              <img
                src="/src/assets/travelbuddy/TravelBuddy Logo.svg"
                alt="Travel Buddy"
                className="h-8"
              />
            </button>
          </div>

          {/* Center Links */}
          <nav className="flex items-center space-x-8">
            <Link
              to="/travel-buddy/feed"
              className="text-gray-700 hover:text-cyan-600 font-medium"
            >
              Feed
            </Link>

            <button 
              onClick={() => navigate('/travel-buddy/chat')}

            <button
              onClick={onChatToggle}

              className="text-gray-700 hover:text-cyan-600 font-medium"
            >
              Messages
            </button>
            <Link
              to="/travel-buddy/requests"
              className="text-gray-700 hover:text-cyan-600 font-medium"
            >
              Travel Requests
            </Link>
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button
                variant="outline"
                size="md"
                className="hidden xl:inline-flex"
              >
                Switch to Home Site
              </Button>
            </Link>
            <Cog6ToothIcon className="w-6 h-6 text-gray-600 hover:text-cyan-600 cursor-pointer" />
            <BellIcon className="w-6 h-6 text-gray-600 hover:text-cyan-600 cursor-pointer" />
            {user ? (
              <div className="relative">
                <button
                  className="flex items-center focus:outline-none"
                  onClick={() => setProfileDropdown((v) => !v)}
                >
                  {user.profile_picture ? (
                    <img
                      src={`http://localhost/skycamp/skycamp-backend/storage/uploads/${user.profile_picture}`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <UserCircleIcon className="w-8 h-8 text-gray-400" />
                  )}
                </button>
                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdown(false)}
                    >
                      Profile
                    </Link>
                    <button
                      className="flex w-full items-center gap-2 text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" /> Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button size="md">Log in</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <header className="lg:hidden fixed top-0 left-0 w-full z-50 bg-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={onRefresh}
            className="flex items-center text-xl font-bold text-cyan-600 hover:text-cyan-700 transition-colors"
          >
            <img
              src="/src/assets/travelbuddy/TravelBuddy Logo.svg"
              alt="Travel Buddy"
              className="h-8"
            />
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-gray-600 hover:text-cyan-600"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setMenuOpen(false)}
        ></div>
        <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl">
          {/* Menu Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <button
              onClick={() => {
                onRefresh();
                setMenuOpen(false);
              }}
              className="flex items-center text-xl font-bold text-cyan-600 hover:text-cyan-700 transition-colors"
            >
              <img
                src="/src/assets/travelbuddy/TravelBuddy Logo.svg"
                alt="Travel Buddy"
                className="h-8"
              />
            </button>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 text-gray-600 hover:text-cyan-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="px-6 py-6 space-y-6">
            <Link
              to="/travel-buddy/feed"
              onClick={() => setMenuOpen(false)}
              className="block text-lg font-medium text-gray-900 hover:text-cyan-600"
            >
              Feed
            </Link>
            <button
              onClick={() => {
                navigate('/travel-buddy/chat');
                setMenuOpen(false);
              }}
              className="block text-lg font-medium text-gray-900 hover:text-cyan-600"
            >
              Messages
            </button>
            <Link
              to="/travel-buddy/requests"
              onClick={() => setMenuOpen(false)}
              className="block text-lg font-medium text-gray-900 hover:text-cyan-600"
            >
              Travel Requests
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="absolute bottom-6 left-6 right-6 space-y-4">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              <Button variant="outline" size="lg" className="w-full">
                Switch to Home Site
              </Button>
            </Link>
            <div className="flex items-center justify-between px-1">
              <Cog6ToothIcon className="w-6 h-6 text-gray-600" />
              <BellIcon className="w-6 h-6 text-gray-600" />
            </div>
            {user ? (
              <div className="relative">
                <button
                  className="flex items-center w-full justify-start gap-2 px-4 py-2 bg-gray-100 rounded-lg focus:outline-none"
                  onClick={() => setProfileDropdown((v) => !v)}
                >
                  {user.profile_picture ? (
                    <img
                      src={`http://localhost/skycamp/skycamp-backend/storage/uploads/${user.profile_picture}`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <UserCircleIcon className="w-8 h-8 text-gray-400" />
                  )}
                  <span className="text-gray-900 font-medium">
                    {user.first_name || "Profile"}
                  </span>
                </button>
                {profileDropdown && (
                  <div className="absolute left-0 mt-2 w-44 bg-white border rounded shadow-lg z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setProfileDropdown(false);
                        setMenuOpen(false);
                      }}
                    >
                      Profile
                    </Link>
                    <button
                      className="flex w-full items-center gap-2 text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" /> Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <Button size="lg" className="w-full">
                  Log in
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
