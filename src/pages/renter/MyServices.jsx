import React, { useState, useEffect, useRef } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CloudArrowUpIcon,
  PhotoIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";
import { API } from "../../api";
import Button from "../../components/atoms/Button";
import { useToast } from "../../components/atoms/ToastProvider";
import { Input } from "../../components/molecules/Input";
import Modal from "../../components/molecules/Modal";
import SectionHeader from "../../components/dashboard/SectionHeader";

export default function MyServices() {
  const [equipmentCatalog, setEquipmentCatalog] = useState([]);
  const [renterEquipment, setRenterEquipment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);

  // Form state
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [itemCondition, setItemCondition] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [stockQuantity, setStockQuantity] = useState("1");
  const [conditionPhotos, setConditionPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [currentPhotos, setCurrentPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const fileInputRef = useRef(null);
  const { showSuccess, showError } = useToast();

  // Confirmation modal state
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // Loading state helpers
  const setLoadingState = (key, loading) => {
    setLoadingStates((prev) => ({ ...prev, [key]: loading }));
  };

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

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catalogRes, equipmentRes] = await Promise.all([
        API.renterDashboard.getEquipmentCatalog(),
        API.renterDashboard.getRenterEquipment(),
      ]);

      if (catalogRes.success) {
        setEquipmentCatalog(catalogRes.data);
      }

      if (equipmentRes.success) {
        setRenterEquipment(equipmentRes.data);
      }
    } catch (err) {
      setError("Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEquipment = () => {
    setShowAddForm(true);
    setEditingEquipment(null);
    resetForm();
  };

  const resetForm = () => {
    setSelectedEquipment("");
    setItemCondition("");
    setPricePerDay("");
    setStockQuantity("1");
    setConditionPhotos([]);
    setNewPhotos([]);
    setCurrentPhotos([]);
    setError(null);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      return allowedTypes.includes(file.type) && file.size <= maxSize;
    });

    setConditionPhotos((prev) => [...prev, ...validFiles]);
  };

  const removePhoto = (index) => {
    setConditionPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEquipment || !itemCondition || !pricePerDay) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append("equipment_id", selectedEquipment);
      formData.append("item_condition", itemCondition);
      formData.append("price_per_day", pricePerDay);
      formData.append("stock_quantity", stockQuantity);

      // Add condition photos
      conditionPhotos.forEach((photo, index) => {
        formData.append("condition_photos[]", photo);
      });

      console.log(
        "📸 PHOTO UPLOAD: Submitting equipment with",
        conditionPhotos.length,
        "photos"
      );
      const response = await API.renterDashboard.addEquipment(formData);
      console.log("📸 PHOTO UPLOAD: Backend response:", response);

      if (response.success) {
        setShowAddForm(false);
        resetForm();
        fetchData(); // Refresh the list
        showSuccess("Equipment added successfully!");
      } else {
        showError(response.message || "Failed to add equipment");
      }
    } catch (err) {
      showError("Failed to add equipment");
      console.error("Error adding equipment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditEquipment = (equipment) => {
    setEditingEquipment(equipment);
    setSelectedEquipment(equipment.equipment_id.toString());
    setItemCondition(equipment.item_condition);
    setPricePerDay(equipment.price_per_day.toString());
    setStockQuantity(equipment.stock_quantity.toString());
    setCurrentPhotos(equipment.photos || []);
    setNewPhotos([]);
    setShowAddForm(true);
  };

  const handleUpdateEquipment = async (e) => {
    e.preventDefault();

    if (!editingEquipment) return;

    try {
      setSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append("item_condition", itemCondition);
      formData.append("price_per_day", pricePerDay);
      formData.append("stock_quantity", stockQuantity);

      // Add new photos if any
      if (newPhotos.length > 0) {
        newPhotos.forEach((photo, index) => {
          formData.append("new_photos[]", photo);
        });
      }

      // Use POST for updates with files, PUT for updates without files
      const hasNewPhotos = newPhotos.length > 0;
      const response = hasNewPhotos
        ? await API.renterDashboard.updateEquipmentWithPhotos(
            editingEquipment.renter_equipment_id,
            formData
          )
        : await API.renterDashboard.updateEquipment(
            editingEquipment.renter_equipment_id,
            {
              item_condition: itemCondition,
              price_per_day: parseFloat(pricePerDay),
              stock_quantity: parseInt(stockQuantity),
            }
          );

      if (response.success) {
        setShowAddForm(false);
        setEditingEquipment(null);
        resetForm();
        fetchData();
        showSuccess("Equipment updated successfully!");
      } else {
        showError(response.message || "Failed to update equipment");
      }
    } catch (err) {
      showError("Failed to update equipment");
      console.error("Error updating equipment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEquipment = (equipmentId) => {
    const equipment = renterEquipment.find(
      (eq) => eq.renter_equipment_id === equipmentId
    );
    const equipmentName = equipment
      ? getEquipmentName(equipment.equipment_id)
      : "this equipment";

    showConfirmationModal(
      "Archive Equipment",
      `Are you sure you want to archive ${equipmentName}? This will remove it from your active listings but you can restore it later.`,
      async () => {
        try {
          const response = await API.renterDashboard.deleteEquipment(
            equipmentId
          );
          if (response.success) {
            showSuccess("Equipment archived successfully!");
            fetchData();
          } else {
            showError(response.message || "Failed to archive equipment");
          }
        } catch (err) {
          showError("Failed to archive equipment");
          console.error("Error archiving equipment:", err);
        }
      }
    );
  };

  const handleRestoreEquipment = (equipmentId) => {
    const equipment = renterEquipment.find(
      (eq) => eq.renter_equipment_id === equipmentId
    );
    const equipmentName = equipment
      ? getEquipmentName(equipment.equipment_id)
      : "this equipment";

    showConfirmationModal(
      "Restore Equipment",
      `Are you sure you want to restore ${equipmentName} to active status? This will make it available for customers to rent again.`,
      async () => {
        try {
          const response = await API.renterDashboard.restoreEquipment(
            equipmentId
          );
          if (response.success) {
            showSuccess("Equipment restored successfully!");
            fetchData();
          } else {
            showError(response.message || "Failed to restore equipment");
          }
        } catch (err) {
          showError("Failed to restore equipment");
          console.error("Error restoring equipment:", err);
        }
      }
    );
  };

  const handleRemovePhoto = (photoId) => {
    showConfirmationModal(
      "Remove Photo",
      "Are you sure you want to remove this photo? This action cannot be undone and the photo will be permanently deleted.",
      async () => {
        const loadingKey = `remove_${photoId}`;
        setLoadingState(loadingKey, true);

        try {
          const response = await API.renterDashboard.removeEquipmentPhoto(
            photoId
          );
          if (response.success) {
            // Remove photo from current photos state
            setCurrentPhotos((prev) =>
              prev.filter((photo) => photo.photo_id !== photoId)
            );
            // Refresh data to get updated photo list
            fetchData();
            showSuccess("Photo removed successfully!");
          } else {
            showError(response.message || "Failed to remove photo");
          }
        } catch (err) {
          showError("Failed to remove photo");
          console.error("Error removing photo:", err);
        } finally {
          setLoadingState(loadingKey, false);
        }
      }
    );
  };

  const handleNewPhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setNewPhotos(files);
  };

  const removeNewPhoto = (index) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePhotoClick = (photoUrl) => {
    setSelectedPhoto(photoUrl);
  };

  const handleSetPrimaryPhoto = (photoId) => {
    showConfirmationModal(
      "Set Primary Photo",
      "This photo will be displayed as the main image for this equipment. Are you sure you want to set it as the primary photo?",
      async () => {
        const loadingKey = `primary_${photoId}`;
        setLoadingState(loadingKey, true);

        try {
          const response = await API.renterDashboard.setPrimaryPhoto(photoId);
          if (response.success) {
            // Refresh the equipment data to get updated photo order
            fetchData();
            showSuccess("Primary photo updated successfully!");
          } else {
            showError(response.message || "Failed to set primary photo");
          }
        } catch (err) {
          showError("Failed to set primary photo");
          console.error("Error setting primary photo:", err);
        } finally {
          setLoadingState(loadingKey, false);
        }
      }
    );
  };

  const getEquipmentName = (equipmentId) => {
    for (const category of equipmentCatalog) {
      const equipment = category.equipment.find(
        (e) => e.equipment_id.toString() === equipmentId
      );
      if (equipment) return equipment.name;
    }
    return "Unknown Equipment";
  };

  const getCategoryName = (equipmentId) => {
    for (const category of equipmentCatalog) {
      const equipment = category.equipment.find(
        (e) => e.equipment_id.toString() === equipmentId
      );
      if (equipment) return category.name;
    }
    return "Unknown Category";
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <SectionHeader
        title="My Services"
        subtitle="Manage your rental equipment inventory"
        actions={
          <Button
            onClick={handleAddEquipment}
            className="flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add Equipment
          </Button>
        }
      />

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Add/Edit Equipment Form */}
      {showAddForm && (
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              {editingEquipment ? "Edit Equipment" : "Add New Equipment"}
            </h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingEquipment(null);
                resetForm();
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form
            onSubmit={editingEquipment ? handleUpdateEquipment : handleSubmit}
            className="space-y-6"
          >
            {/* Equipment Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Equipment <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                disabled={editingEquipment}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                required
              >
                <option value="">Choose equipment to rent...</option>
                {equipmentCatalog.map((category) => (
                  <optgroup
                    key={category.category_id}
                    label={`${category.type} - ${category.name}`}
                  >
                    {category.equipment.map((equipment) => (
                      <option
                        key={equipment.equipment_id}
                        value={equipment.equipment_id}
                      >
                        {equipment.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Item Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Condition <span className="text-red-500">*</span>
              </label>
              <Input
                value={itemCondition}
                onChange={(e) => setItemCondition(e.target.value)}
                placeholder="e.g., Excellent, Good, Fair"
                required
              />
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Day (LKR) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={pricePerDay}
                  onChange={(e) => setPricePerDay(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  min="1"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  placeholder="1"
                  required
                />
              </div>
            </div>

            {/* Condition Photos (only for new equipment) */}
            {!editingEquipment && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition Photos
                </label>
                <div className="space-y-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-cyan-400 transition-colors"
                  >
                    <CloudArrowUpIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload photos or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, WebP up to 5MB each
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* Photo Previews */}
                  {conditionPhotos.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-500 mb-3">
                        Selected Photos ({conditionPhotos.length})
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {conditionPhotos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square overflow-hidden rounded-lg border-2 border-dashed border-cyan-300 bg-cyan-50">
                              <img
                                src={URL.createObjectURL(photo)}
                                alt={`Condition photo ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                              title="Remove photo"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-2 left-2 bg-cyan-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              {index === 0 ? "Primary" : `Photo ${index + 1}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Photo Management (only for editing equipment) */}
            {editingEquipment && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Photos
                </label>

                {/* Current Photos */}
                {currentPhotos.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-600 mb-3">
                      Current Photos ({currentPhotos.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {currentPhotos.map((photo, index) => (
                        <div key={photo.photo_id} className="relative group">
                          <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                            <img
                              src={photo.photo_url}
                              alt={`Equipment photo ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                              onClick={() => handlePhotoClick(photo.photo_url)}
                            />
                          </div>

                          {/* Primary Photo Badge */}
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              Primary
                            </div>
                          )}

                          {/* Action Buttons - Show on Hover */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex gap-2">
                              {index !== 0 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSetPrimaryPhoto(photo.photo_id);
                                  }}
                                  disabled={
                                    loadingStates[`primary_${photo.photo_id}`]
                                  }
                                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Set as primary photo"
                                >
                                  {loadingStates[
                                    `primary_${photo.photo_id}`
                                  ] ? (
                                    <svg
                                      className="w-4 h-4 animate-spin"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                  ) : (
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                      />
                                    </svg>
                                  )}
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemovePhoto(photo.photo_id);
                                }}
                                disabled={
                                  loadingStates[`remove_${photo.photo_id}`]
                                }
                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Remove photo"
                              >
                                {loadingStates[`remove_${photo.photo_id}`] ? (
                                  <svg
                                    className="w-4 h-4 animate-spin"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                ) : (
                                  <XMarkIcon className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add New Photos */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-600">
                    Add New Photos
                  </h4>
                  <div
                    onClick={() =>
                      document.getElementById("new-photos-input")?.click()
                    }
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-cyan-400 transition-colors"
                  >
                    <CloudArrowUpIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload additional photos
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, WebP up to 5MB each
                    </p>
                  </div>

                  <input
                    id="new-photos-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleNewPhotoChange}
                    className="hidden"
                  />

                  {/* New Photo Previews */}
                  {newPhotos.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-500 mb-3">
                        New Photos ({newPhotos.length})
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {newPhotos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square overflow-hidden rounded-lg border-2 border-dashed border-blue-300 bg-blue-50">
                              <img
                                src={URL.createObjectURL(photo)}
                                alt={`New photo ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeNewPhoto(index)}
                              className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                              title="Remove photo"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              New
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {editingEquipment ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    {editingEquipment ? "Update Equipment" : "Add Equipment"}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingEquipment(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Equipment List */}
      {renterEquipment.length === 0 ? (
        <div className="text-center py-12">
          <PhotoIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Equipment Listed
          </h3>
          <p className="text-gray-600 mb-6">
            Start by adding your first piece of equipment to rent out.
          </p>
          <Button
            onClick={handleAddEquipment}
            className="flex items-center gap-2 mx-auto"
          >
            <PlusIcon className="w-5 h-5" />
            Add Your First Equipment
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renterEquipment.map((equipment) => (
            <div
              key={equipment.renter_equipment_id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Equipment Image */}
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {equipment.photos && equipment.photos.length > 0 ? (
                  <img
                    src={equipment.photos[0].photo_url}
                    alt={equipment.equipment_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PhotoIcon className="w-12 h-12 text-gray-400" />
                )}
              </div>

              {/* Equipment Details */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {equipment.equipment_name}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      equipment.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {equipment.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {getCategoryName(equipment.equipment_id)}
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  <span className="font-medium">Condition:</span>{" "}
                  {equipment.item_condition}
                </p>

                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="font-semibold text-cyan-600">
                    LKR {parseFloat(equipment.price_per_day).toFixed(2)}/day
                  </span>
                  <span className="text-gray-600">
                    Stock: {equipment.stock_quantity}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {equipment.status === "Active" ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditEquipment(equipment)}
                        className="flex-1 flex items-center justify-center gap-1"
                      >
                        <PencilIcon className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleDeleteEquipment(equipment.renter_equipment_id)
                        }
                        className="flex items-center justify-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditEquipment(equipment)}
                        className="flex-1 flex items-center justify-center gap-1"
                      >
                        <PencilIcon className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleRestoreEquipment(equipment.renter_equipment_id)
                        }
                        className="flex items-center justify-center gap-1 text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <ArrowUturnLeftIcon className="w-4 h-4" />
                        Restore
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-4 -right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
            >
              <XMarkIcon className="w-6 h-6 text-gray-600" />
            </button>
            <img
              src={selectedPhoto}
              alt="Equipment photo"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
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
