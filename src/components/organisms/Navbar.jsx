"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  HeartIcon,
  BellIcon,
  ShoppingCartIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Button from "../atoms/Button";
import React from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileDropdown, setProfileDropdown] = useState(false);

  // Read user from localStorage on mount
  React.useEffect(() => {
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

  // Logout handler
  const handleLogout = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    localStorage.removeItem("user");
    if (user?.user_role === "service_provider") {
      window.location.href = "/login";
    } else {
      window.location.href = "/";
    }
  };

  const getProfileLink = () => {
    if (!user) return "/profile";
    if (user.user_role === "customer") return "/profile";
    if (user.user_role === "service_provider") return "/dashboard";
    return "/profile";
  };

  return (
    <>
      {/* Desktop Navigation */}
      <header className="hidden lg:flex fixed top-0 left-0 w-full z-50 bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center w-full py-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center text-xl font-bold text-cyan-600"
          >
            <img src="/logo.svg" alt="SkyCamp" className="h-8 mr-2" />
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-cyan-600 font-medium"
              onClick={() => window.scrollTo(0, 0)}
            >
              Home
            </Link>
            <Link
              to="/rentals"
              className="text-gray-700 hover:text-cyan-600 font-medium"
              onClick={() => window.scrollTo(0, 0)}
            >
              Rentals
            </Link>
            <Link
              to="/guides"
              className="text-gray-700 hover:text-cyan-600 font-medium"
            >
              Guides
            </Link>
            <Link
              to="/travel-buddy"
              className="text-gray-700 hover:text-cyan-600 font-medium"
            >
              Travel Buddy
            </Link>

            {/* Destinations Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-cyan-600 font-medium">
                <span>Destinations</span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white border rounded-md shadow-lg w-72 z-50 group-hover:block hidden transition-all duration-150 py-2 px-2">
                <Link
                  to="/destinations"
                  className="block px-4 py-3 hover:bg-gray-50 rounded-md"
                >
                  <div className="font-medium">Camping Destination</div>
                  <div className="text-sm text-gray-500">
                    Top outdoor spots to pitch your tent comfortably
                  </div>
                </Link>
                <Link
                  to="/stargazing-spots"
                  className="block px-4 py-3 hover:bg-gray-50 rounded-md"
                >
                  <div className="font-medium">Stargazing Spots</div>
                  <div className="text-sm text-gray-500">
                    Best dark-sky places for night sky watching
                  </div>
                </Link>
              </div>
            </div>
          </nav>

          {/* Right Side Icons and Login/Profile */}
          <div className="flex items-center space-x-4">
            <BellIcon className="w-6 h-6 text-gray-600 hover:text-cyan-600 cursor-pointer" />
            <Link to="/cart">
              <ShoppingCartIcon className="w-6 h-6 text-gray-600 hover:text-cyan-600 cursor-pointer" />
            </Link>
            <Link to="/wishlist">
              <HeartIcon className="w-6 h-6 text-gray-600 hover:text-cyan-600 cursor-pointer" />
            </Link>
            {/* Conditional rendering for user/profile */}
            {user ? (
              <div className="relative">
                <button
                  className="flex items-center focus:outline-none"
                  onClick={() => setProfileDropdown((v) => !v)}
                >
                  {user.profile_picture ? (
                    <img
                      src={`http://localhost/skycamp/skycamp-backend/uploads/profile_pictures/${user.profile_picture}`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <UserCircleIcon className="w-8 h-8 text-gray-400" />
                  )}
                </button>
                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                    <Link
                      to={getProfileLink()}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdown(false)}
                    >
                      Profile
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Log out
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
          <Link
            to="/"
            className="flex items-center text-xl font-bold text-cyan-600"
          >
            <img src="/logo.svg" alt="SkyCamp" className="h-8 mr-2" />
          </Link>
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
            <Link
              to="/"
              className="flex items-center text-xl font-bold text-cyan-600"
            >
              <img src="/logo.svg" alt="SkyCamp" className="h-8 mr-2" />
            </Link>
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
              to="/"
              onClick={() => {
                setMenuOpen(false);
                window.scrollTo(0, 0);
              }}
              className="block text-lg font-medium text-gray-900 hover:text-cyan-600"
            >
              Home
            </Link>
            <Link
              to="/rentals"
              onClick={() => {
                setMenuOpen(false);
                window.scrollTo(0, 0);
              }}
              className="block text-lg font-medium text-gray-900 hover:text-cyan-600"
            >
              Rentals
            </Link>
            <Link
              to="/guides"
              onClick={() => setMenuOpen(false)}
              className="block text-lg font-medium text-gray-900 hover:text-cyan-600"
            >
              Guides
            </Link>
            <Link
              to="/travel-buddy"
              onClick={() => setMenuOpen(false)}
              className="block text-lg font-medium text-gray-900 hover:text-cyan-600"
            >
              Travel Buddy
            </Link>

            {/* Destinations Section */}
            <div>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-between w-full text-lg font-medium text-gray-900 hover:text-cyan-600"
              >
                <span>Destinations</span>
                {dropdownOpen ? (
                  <ChevronUpIcon className="w-5 h-5" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5" />
                )}
              </button>
              {dropdownOpen && (
                <div className="mt-4 bg-white border rounded-md shadow-lg py-3 px-3">
                  <Link
                    to="/destinations"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-start space-x-3 hover:bg-gray-50 py-3 px-3 rounded-md"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Camping Destination
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Top outdoor spots to pitch your tent comfortably
                      </p>
                    </div>
                  </Link>
                  <Link
                    to="/stargazing-spots"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-start space-x-3 hover:bg-gray-50 py-3 px-3 rounded-md"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Stargazing Spots
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Best dark-sky places for night sky watching.
                      </p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Icons (Notification, Cart, Wishlist) - Above Login/Profile Button */}
          <div className="absolute bottom-24 left-6 right-6 space-y-4">
            <Link
              to="/notifications"
              onClick={() => setMenuOpen(false)}
              className="flex items-center space-x-3 text-lg font-medium text-gray-900 hover:text-cyan-600"
            >
              <BellIcon className="w-6 h-6 text-gray-600" />
              <span>Notification</span>
            </Link>
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="flex items-center space-x-3 text-lg font-medium text-gray-900 hover:text-cyan-600"
            >
              <ShoppingCartIcon className="w-6 h-6 text-gray-600" />
              <span>Cart</span>
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMenuOpen(false)}
              className="flex items-center space-x-3 text-lg font-medium text-gray-900 hover:text-cyan-600"
            >
              <HeartIcon className="w-6 h-6 text-gray-600" />
              <span>Wishlist</span>
            </Link>
          </div>

          {/* Login/Profile Button */}
          <div className="absolute bottom-6 left-6 right-6">
            {user ? (
              <div className="relative">
                <button
                  className="flex items-center w-full justify-start gap-2 px-4 py-2 bg-gray-100 rounded-lg focus:outline-none"
                  onClick={() => setProfileDropdown((v) => !v)}
                >
                  {user.profile_picture ? (
                    <img
                      src={`http://localhost/skycamp-backend/uploads/profile_pictures/${user.profile_picture}`}
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
                  <div className="absolute left-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                    <Link
                      to={getProfileLink()}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setProfileDropdown(false);
                        setMenuOpen(false);
                      }}
                    >
                      Profile
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                    >
                      Log out
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
