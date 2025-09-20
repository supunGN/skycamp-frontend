import React, { useState, useEffect } from "react";
import {
  MapPinIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "../../components/atoms/ToastProvider";
import { API } from "../../api";
import Modal from "../../components/molecules/Modal";
import SectionHeader from "../../components/dashboard/SectionHeader";

export default function LocationCoverage() {
  const [currentLocations, setCurrentLocations] = useState({
    camping_destinations: [],
    stargazing_spots: [],
  });
  const [availableLocations, setAvailableLocations] = useState({
    camping_destinations: [],
    stargazing_spots: [],
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState("camping");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [removingLocation, setRemovingLocation] = useState(null);

  // Confirmation modal state
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const { showSuccess, showError } = useToast();

  // Confirmation modal helpers
  const showConfirmationModal = (title, message, onConfirm) => {
    setConfirmationModal({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  };

  const hideConfirmationModal = () => {
    setConfirmationModal({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: null,
    });
  };

  const handleConfirmAction = async () => {
    if (confirmationModal.onConfirm) {
      await confirmationModal.onConfirm();
      hideConfirmationModal();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [currentResponse, availableResponse] = await Promise.all([
        API.renterDashboard.getRenterLocations(),
        API.renterDashboard.getAvailableLocations(),
      ]);

      if (currentResponse.success) {
        setCurrentLocations(currentResponse.data);
      }

      if (availableResponse.success) {
        setAvailableLocations(availableResponse.data);
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
      showError("Failed to load location data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = () => {
    setSelectedType("camping");
    setSelectedLocations([]);
    setSearchTerm(""); // Reset search when opening modal
    setShowAddModal(true);
  };

  const handleLocationSelect = (locationId, checked) => {
    if (checked) {
      setSelectedLocations([...selectedLocations, locationId]);
    } else {
      setSelectedLocations(selectedLocations.filter((id) => id !== locationId));
    }
  };

  const handleAddLocations = async () => {
    if (selectedLocations.length === 0) {
      showError("Please select at least one location");
      return;
    }

    try {
      setSubmitting(true);

      const locationsToAdd =
        selectedType === "camping"
          ? availableLocations.camping_destinations.filter((loc) =>
              selectedLocations.includes(loc.location_id)
            )
          : availableLocations.stargazing_spots.filter((loc) =>
              selectedLocations.includes(loc.location_id)
            );

      const newLocationNames = locationsToAdd.map((loc) => loc.name);

      const currentNames =
        selectedType === "camping"
          ? currentLocations.camping_destinations.map((loc) => loc.name)
          : currentLocations.stargazing_spots.map((loc) => loc.name);

      const updatedNames = [...currentNames, ...newLocationNames];

      const updateData = {
        camping_destinations:
          selectedType === "camping"
            ? updatedNames
            : currentLocations.camping_destinations.map((loc) => loc.name),
        stargazing_spots:
          selectedType === "stargazing"
            ? updatedNames
            : currentLocations.stargazing_spots.map((loc) => loc.name),
      };

      const response = await API.renterDashboard.updateRenterLocations(
        updateData
      );

      if (response.success) {
        showSuccess("Locations added successfully!");
        setShowAddModal(false);
        fetchData();
      } else {
        showError(response.message || "Failed to add locations");
      }
    } catch (error) {
      console.error("Error adding locations:", error);
      showError("Failed to add locations");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveLocation = async (location, type) => {
    setRemovingLocation({ location, type });

    try {
      const response = await API.renterDashboard.checkLocationRemoval(
        location.name
      );
      const removalCheck = response.data;

      if (removalCheck.can_remove) {
        showConfirmationModal(
          "Remove Location",
          `Are you sure you want to remove "${location.name}" from your ${
            type === "camping" ? "camping destinations" : "stargazing spots"
          }? This action cannot be undone.`,
          async () => {
            await confirmRemoveLocation();
          }
        );
      } else {
        showConfirmationModal(
          "Cannot Remove Location",
          removalCheck.message ||
            "This location cannot be removed due to active bookings.",
          null
        );
      }
    } catch (error) {
      console.error("Error checking location removal:", error);
      showConfirmationModal(
        "Error",
        "Unable to check if this location can be removed. Please try again.",
        null
      );
    }
  };

  const confirmRemoveLocation = async () => {
    if (!removingLocation) return;

    try {
      setSubmitting(true);

      const { location, type } = removingLocation;
      const currentTypeLocations =
        type === "camping"
          ? currentLocations.camping_destinations
          : currentLocations.stargazing_spots;

      const updatedNames = currentTypeLocations
        .filter((loc) => loc.name !== location.name)
        .map((loc) => loc.name);

      const updateData = {
        camping_destinations:
          type === "camping"
            ? updatedNames
            : currentLocations.camping_destinations.map((loc) => loc.name),
        stargazing_spots:
          type === "stargazing"
            ? updatedNames
            : currentLocations.stargazing_spots.map((loc) => loc.name),
      };

      const response = await API.renterDashboard.updateRenterLocations(
        updateData
      );

      if (response.success) {
        showSuccess("Location removed successfully!");
        fetchData();
      } else {
        showError(response.message || "Failed to remove location");
      }
    } catch (error) {
      console.error("Error removing location:", error);
      showError("Failed to remove location");
    } finally {
      setSubmitting(false);
    }
  };

  const getLocationTypeIcon = (type) => {
    return type === "Camping" ? "🏕️" : "⭐";
  };

  // Helper functions for filtering and counting
  const getFilteredLocations = (locations) => {
    if (!searchTerm) return locations;
    return locations.filter(
      (location) =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getAvailableLocationsForType = (type) => {
    const currentLocationsForType =
      type === "camping"
        ? currentLocations.camping_destinations
        : currentLocations.stargazing_spots;

    const availableLocationsForType =
      type === "camping"
        ? availableLocations.camping_destinations
        : availableLocations.stargazing_spots;

    // Filter out already added locations
    const currentLocationNames = currentLocationsForType.map((loc) => loc.name);
    const filteredAvailableLocations = availableLocationsForType.filter(
      (location) => !currentLocationNames.includes(location.name)
    );

    return getFilteredLocations(filteredAvailableLocations);
  };

  const getTotalCountForType = (type) => {
    const availableLocationsForType =
      type === "camping"
        ? availableLocations.camping_destinations
        : availableLocations.stargazing_spots;

    return availableLocationsForType.length;
  };

  const getLocationTypeColor = (type) => {
    return type === "Camping"
      ? "bg-green-100 text-green-800"
      : "bg-purple-100 text-purple-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Location & Coverage"
        subtitle="Manage the locations where you provide your equipment rental services"
        actions={
          <button
            onClick={handleAddLocation}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Locations
          </button>
        }
      />

      {/* Current Coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camping Destinations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🏕️</span>
            <h2 className="text-lg font-semibold text-gray-900">
              Camping Destinations
            </h2>
          </div>

          {currentLocations.camping_destinations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPinIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No camping destinations added yet</p>
              <p className="text-sm">Click "Add Locations" to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentLocations.camping_destinations.map((location) => (
                <div
                  key={location.location_id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {location.name}
                    </h3>
                    <p className="text-sm text-gray-600">{location.district}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {location.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveLocation(location, "camping")}
                    className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove location"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stargazing Spots */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">⭐</span>
            <h2 className="text-lg font-semibold text-gray-900">
              Stargazing Spots
            </h2>
          </div>

          {currentLocations.stargazing_spots.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPinIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No stargazing spots added yet</p>
              <p className="text-sm">Click "Add Locations" to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentLocations.stargazing_spots.map((location) => (
                <div
                  key={location.location_id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {location.name}
                    </h3>
                    <p className="text-sm text-gray-600">{location.district}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {location.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveLocation(location, "stargazing")}
                    className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove location"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Locations Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Locations</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Location Type Tabs */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => {
                  setSelectedType("camping");
                  setSearchTerm(""); // Clear search when switching tabs
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedType === "camping"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                🏕️ Camping Destinations ({getTotalCountForType("camping")})
              </button>
              <button
                onClick={() => {
                  setSelectedType("stargazing");
                  setSearchTerm(""); // Clear search when switching tabs
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedType === "stargazing"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                ⭐ Stargazing Spots ({getTotalCountForType("stargazing")})
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Search ${
                    selectedType === "camping"
                      ? "camping destinations"
                      : "stargazing spots"
                  }...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Available Locations */}
            <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
              {(() => {
                const filteredLocations =
                  getAvailableLocationsForType(selectedType);
                const totalAvailable =
                  getAvailableLocationsForType(selectedType).length;

                if (filteredLocations.length === 0) {
                  return (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm ? (
                        <>
                          <p>No locations found matching "{searchTerm}"</p>
                          <p className="text-sm">
                            Try adjusting your search terms
                          </p>
                        </>
                      ) : (
                        <>
                          <p>No new locations available to add</p>
                          <p className="text-sm">
                            You have already added all available{" "}
                            {selectedType === "camping"
                              ? "camping destinations"
                              : "stargazing spots"}
                          </p>
                        </>
                      )}
                    </div>
                  );
                }

                return (
                  <>
                    {/* Results count */}
                    <div className="text-sm text-gray-600 mb-3 px-1">
                      {searchTerm ? (
                        <>
                          Showing {filteredLocations.length} of {totalAvailable}{" "}
                          locations
                        </>
                      ) : (
                        <>{filteredLocations.length} locations available</>
                      )}
                    </div>

                    {/* Locations list */}
                    {filteredLocations.map((location) => {
                      return (
                        <label
                          key={location.location_id}
                          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedLocations.includes(location.location_id)
                              ? "bg-blue-50 border-blue-200"
                              : "bg-white border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedLocations.includes(
                              location.location_id
                            )}
                            onChange={(e) =>
                              handleLocationSelect(
                                location.location_id,
                                e.target.checked
                              )
                            }
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900">
                                {location.name}
                              </h4>
                            </div>
                            <p className="text-sm text-gray-600">
                              {location.district}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {location.description}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </>
                );
              })()}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLocations}
                disabled={selectedLocations.length === 0 || submitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                Add Selected ({selectedLocations.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmationModal.isOpen}
        onClose={hideConfirmationModal}
        onConfirm={handleConfirmAction}
        title={confirmationModal.title}
        message={confirmationModal.message}
      />
    </div>
  );
}
