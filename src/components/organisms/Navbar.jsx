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
} from "@heroicons/react/24/outline";
import Button from "../atoms/Button";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
              className="text-gray-700 hover:text-cyan-600 font-medium "
            >
              Home
            </Link>
            <Link
              to="/rentals"
              className="text-gray-700 hover:text-cyan-600 font-medium"
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
                  to="/destination"
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

          {/* Right Side Icons and Login */}
          <div className="flex items-center space-x-4">
            <BellIcon className="w-6 h-6 text-gray-600 hover:text-cyan-600 cursor-pointer" />
            <ShoppingCartIcon className="w-6 h-6 text-gray-600 hover:text-cyan-600 cursor-pointer" />
            <HeartIcon className="w-6 h-6 text-gray-600 hover:text-cyan-600 cursor-pointer" />
            <Link to="/login">
              <Button size="md">Log in</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <header className="lg:hidden fixed top-0 left-0 w-full z-50 bg-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-4">
          {/* Mobile Logo */}
          <Link
            to="/"
            className="flex items-center text-xl font-bold text-cyan-600"
          >
            <img src="/logo.svg" alt="SkyCamp" className="h-8 mr-2" />
          </Link>

          {/* Mobile Menu Button */}
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
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setMenuOpen(false)}
        ></div>

        {/* Menu Panel */}
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
              onClick={() => setMenuOpen(false)}
              className="block text-lg font-medium text-gray-900 hover:text-cyan-600"
            >
              Home
            </Link>
            <Link
              to="/rentals"
              onClick={() => setMenuOpen(false)}
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

              {/* Destinations Submenu */}
              {dropdownOpen && (
                <div className="mt-4 ml-4">
                  <Link
                    to="/destinations?type=camping"
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
                    to="/destinations?type=stargazing"
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

          {/* Login Button */}
          <div className="absolute bottom-6 left-6 right-6">
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <Button size="lg" className="w-full">
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
