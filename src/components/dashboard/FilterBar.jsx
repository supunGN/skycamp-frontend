import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function FilterBar({
  filters = [],
  onFilterChange,
  onSearch,
  searchPlaceholder = "Search...",
  showAdvancedFilters = true,
  className = "",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch && onSearch(searchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...activeFilters, [filterKey]: value };
    setActiveFilters(newFilters);
    onFilterChange && onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchTerm("");
    onFilterChange && onFilterChange({});
    onSearch && onSearch("");
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(
      (value) => value !== "" && value !== null && value !== undefined
    ).length;
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
    >
      <div className="p-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={searchPlaceholder}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
              Search
            </button>

            {showAdvancedFilters && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition-colors ${
                  showFilters || getActiveFilterCount() > 0
                    ? "border-blue-300 text-blue-700 bg-blue-50"
                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filters
                {getActiveFilterCount() > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>
            )}

            {(getActiveFilterCount() > 0 || searchTerm) && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <XMarkIcon className="h-4 w-4 mr-2" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filters.map((filter) => (
                <div key={filter.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {filter.label}
                  </label>
                  {filter.type === "select" ? (
                    <select
                      value={activeFilters[filter.key] || ""}
                      onChange={(e) =>
                        handleFilterChange(filter.key, e.target.value)
                      }
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">All {filter.label}</option>
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : filter.type === "date" ? (
                    <input
                      type="date"
                      value={activeFilters[filter.key] || ""}
                      onChange={(e) =>
                        handleFilterChange(filter.key, e.target.value)
                      }
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder={`Filter by ${filter.label.toLowerCase()}...`}
                      value={activeFilters[filter.key] || ""}
                      onChange={(e) =>
                        handleFilterChange(filter.key, e.target.value)
                      }
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
