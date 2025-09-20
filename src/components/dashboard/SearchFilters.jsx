import React, { useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function SearchFilters({
  searchTerm,
  onSearchChange,
  onReset,
  activeTab,
  loading = false,
}) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleSearch = () => {
    onSearchChange(localSearchTerm);
  };

  const handleReset = () => {
    setLocalSearchTerm("");
    onReset();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getPlaceholderText = () => {
    switch (activeTab) {
      case "customers":
        return "Search customers by name or email...";
      case "renters":
        return "Search renters by name or email...";
      case "guides":
        return "Search guides by name or email...";
      case "suspended":
        return "Search suspended users by name or email...";
      case "deleted":
        return "Search deleted users by name or email...";
      default:
        return "Search users by name or email...";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={getPlaceholderText()}
                className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-base transition-all duration-200"
                disabled={loading}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              disabled={loading || !localSearchTerm.trim()}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-lg text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
              Search
            </button>

            <button
              onClick={handleReset}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 border border-gray-200 text-sm font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              <XMarkIcon className="h-4 w-4 mr-2" />
              Reset
            </button>
          </div>
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600 font-medium">
              Showing results for:{" "}
              <span className="font-semibold text-gray-900">
                "{searchTerm}"
              </span>
            </p>
            <button
              onClick={handleReset}
              className="text-sm text-cyan-600 hover:text-cyan-800 font-semibold transition-colors"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
