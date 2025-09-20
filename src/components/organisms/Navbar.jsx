"use client";

import React, { useState } from "react";
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
import { API } from "../../api";
import { useNotifications } from "../../hooks/useNotifications";
import { useWishlistContext } from "../../contexts/WishlistContext";
import NotificationDropdown from "../molecules/NotificationDropdown";
import { getProfilePictureUrl } from "../../utils/cacheBusting";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);

  // Get notifications for logged-in users only
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications(user ? 1 : 0);

  // Get wishlist count from context (only for customers)
  const { itemCount: wishlistCount, isAuthenticated: isCustomer } =
    useWishlistContext();

  // Read user and admin from localStorage on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAdmin = localStorage.getItem("admin");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }

    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch {
        setAdmin(null);
      }
    } else {
      setAdmin(null);
    }
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await API.auth.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("user");
      // Force full reload to clear any in-memory state
      window.location.replace("/login");
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
          {/* Logo and Navigation Links - Left Grouped */}
          <div className="flex items-center space-x-12">
            <Link
              to="/"
              className="flex items-center text-xl font-bold text-cyan-600"
            >
              <img src="/logo.svg" alt="SkyCamp" className="h-8 mr-2" />
            </Link>

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
          </div>

          {/* Right Side Icons and Login/Profile */}
          <div className="flex items-center space-x-4">
            {/* Travel Buddy Switch Button - Only for customers */}
            {user && user.user_role === "customer" && (
              <Link to="/travel-buddy">
                <Button variant="secondary" size="sm">
                  Switch to Travel Buddy
                </Button>
              </Link>
            )}

            {/* Admin Dashboard Switch Button */}
            {admin && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => (window.location.href = "/admin")}
              >
                Switch to Admin Dashboard
              </Button>
            )}

            {/* Guide Dashboard Switch Button */}
            {user &&
              user.user_role === "service_provider" &&
              user.provider_type === "Local Guide" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    (window.location.href = "/dashboard/guide/overview")
                  }
                >
                  Switch to Guide Dashboard
                </Button>
              )}

            {/* Renter Dashboard Switch Button */}
            {user &&
              user.user_role === "service_provider" &&
              user.provider_type === "Equipment Renter" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    (window.location.href = "/dashboard/renter/overview")
                  }
                >
                  Switch to Renter Dashboard
                </Button>
              )}

            {/* Only show cart and wishlist for non-admin users */}
            {!admin && (
              <>
                <Link to="/cart">
                  <div className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                    <ShoppingCartIcon className="w-6 h-6" />
                  </div>
                </Link>
                <Link to="/wishlist" className="relative">
                  <div className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                    <HeartIcon className="w-6 h-6" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                        {wishlistCount > 99 ? "99+" : wishlistCount}
                      </span>
                    )}
                  </div>
                </Link>
              </>
            )}

            {/* Conditional rendering for user/profile/admin */}
            {user ? (
              <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setNotificationDropdownOpen(!notificationDropdownOpen)
                    }
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
                  >
                    <BellIcon className="w-6 h-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </button>
                </div>
                {/* User Profile */}
                <div className="relative">
                  <button
                    className="flex items-center focus:outline-none"
                    onClick={() => setProfileDropdown((v) => !v)}
                  >
                    {user?.profile_picture ? (
                      <img
                        src={getProfilePictureUrl(user)}
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
              </div>
            ) : admin ? (
              <div className="relative">
                <button
                  className="flex items-center focus:outline-none"
                  onClick={() => setProfileDropdown((v) => !v)}
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      A
                    </span>
                  </div>
                </button>
                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                    <div className="px-4 py-2 text-gray-500 text-sm border-b">
                      Admin User
                    </div>
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={async () => {
                        try {
                          await API.admin.logout();
                        } catch (error) {
                          console.error("Admin logout error:", error);
                        } finally {
                          localStorage.removeItem("admin");
                          window.location.replace("/");
                        }
                      }}
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

          {/* Mobile Icons and Switch Buttons - Above Login/Profile Button */}
          <div className="absolute bottom-24 left-6 right-6 space-y-4">
            {/* Travel Buddy Switch Button - Mobile - Only for customers */}
            {user && user.user_role === "customer" && (
              <Link to="/travel-buddy" onClick={() => setMenuOpen(false)}>
                <Button variant="secondary" size="lg" className="w-full">
                  Switch to Travel Buddy
                </Button>
              </Link>
            )}

            {/* Admin Dashboard Switch Button - Mobile */}
            {admin && (
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={() => {
                  setMenuOpen(false);
                  window.location.href = "/admin";
                }}
              >
                Switch to Admin Dashboard
              </Button>
            )}

            {/* Guide Dashboard Switch Button - Mobile */}
            {user &&
              user.user_role === "service_provider" &&
              user.provider_type === "Local Guide" && (
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    setMenuOpen(false);
                    window.location.href = "/dashboard/guide/overview";
                  }}
                >
                  Switch to Guide Dashboard
                </Button>
              )}

            {/* Renter Dashboard Switch Button - Mobile */}
            {user &&
              user.user_role === "service_provider" &&
              user.provider_type === "Equipment Renter" && (
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    setMenuOpen(false);
                    window.location.href = "/dashboard/renter/overview";
                  }}
                >
                  Switch to Renter Dashboard
                </Button>
              )}

            {/* Only show cart and wishlist for non-admin users */}
            {!admin && (
              <>
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
              </>
            )}
            <Link
              to="/notifications"
              onClick={() => setMenuOpen(false)}
              className="flex items-center space-x-3 text-lg font-medium text-gray-900 hover:text-cyan-600"
            >
              <BellIcon className="w-6 h-6 text-gray-600" />
              <span>Notification</span>
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
                  {user?.profile_picture ? (
                    <img
                      src={getProfilePictureUrl(user)}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <UserCircleIcon className="w-8 h-8 text-gray-400" />
                  )}
                  <span className="text-gray-900 font-medium">
                    {user?.first_name || "Profile"}
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
            ) : admin ? (
              <div className="relative">
                <button
                  className="flex items-center w-full justify-start gap-2 px-4 py-2 bg-gray-100 rounded-lg focus:outline-none"
                  onClick={() => setProfileDropdown((v) => !v)}
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      A
                    </span>
                  </div>
                  <span className="text-gray-900 font-medium">Admin User</span>
                </button>
                {profileDropdown && (
                  <div className="absolute left-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                    <div className="px-4 py-2 text-gray-500 text-sm border-b">
                      Admin User
                    </div>
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={async () => {
                        try {
                          await API.admin.logout();
                        } catch (error) {
                          console.error("Admin logout error:", error);
                        } finally {
                          localStorage.removeItem("admin");
                          window.location.replace("/");
                        }
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

      {/* Notification Dropdown */}
      {user && (
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          isOpen={notificationDropdownOpen}
          onClose={() => setNotificationDropdownOpen(false)}
        />
      )}
    </>
  );
}
