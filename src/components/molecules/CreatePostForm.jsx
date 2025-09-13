import React, { useState, useRef } from "react";
import { XMarkIcon, PhotoIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Button from "../atoms/Button";
import { Input } from "./Input";
import DropdownSelect from "./DropdownSelect";

export default function CreatePostForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    location: "",
    adventureType: "",
    companions: "",
    fromDate: "",
    toDate: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const imageUploadRef = useRef();

  // Adventure type options
  const adventureOptions = ["Camping", "Stargazing"];
  
  // Companions options (1-10)
  const companionOptions = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });

    // Clear error when user starts typing
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: null,
      });
    }
  };

  const handleDropdownChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Clear error when user selects
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 2) {
      alert("You can only upload up to 2 images");
      return;
    }

    const validFiles = files.filter(file => {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name} is not a valid image file (JPG, PNG, or WebP)`);
        return false;
      }
      
      if (file.size > maxSize) {
        alert(`${file.name} is too large. File size must be less than 5MB`);
        return false;
      }
      
      return true;
    });

    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random(),
    }));

    setImages([...images, ...newImages]);
  };

  const removeImage = (imageId) => {
    setImages(images.filter(img => img.id !== imageId));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    if (!formData.adventureType) {
      newErrors.adventureType = "Please select an adventure type";
    }
    if (!formData.companions) {
      newErrors.companions = "Please select number of companions";
    }
    if (!formData.fromDate) {
      newErrors.fromDate = "From date is required";
    }
    if (!formData.toDate) {
      newErrors.toDate = "To date is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Please describe your adventure";
    }

    // Validate date range
    if (formData.fromDate && formData.toDate) {
      const fromDate = new Date(formData.fromDate);
      const toDate = new Date(formData.toDate);
      if (fromDate >= toDate) {
        newErrors.toDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("location", formData.location);
      submitData.append("adventureType", formData.adventureType);
      submitData.append("companions", formData.companions);
      submitData.append("fromDate", formData.fromDate);
      submitData.append("toDate", formData.toDate);
      submitData.append("description", formData.description);

      // Add image files
      images.forEach((image, index) => {
        submitData.append(`image_${index}`, image.file);
      });

      // Call the onSubmit callback with the form data
      if (onSubmit) {
        await onSubmit(submitData);
      }

      // Reset form
      setFormData({
        location: "",
        adventureType: "",
        companions: "",
        fromDate: "",
        toDate: "",
        description: "",
      });
      setImages([]);
      setErrors({});

      // Close the form
      if (onClose) {
        onClose();
      }

    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create Post</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <Input
              id="location"
              placeholder="Where are you going?"
              value={formData.location}
              onChange={handleChange}
              className={`w-full h-12 rounded-xl border-gray-300 focus:border-cyan-500 ${
                errors.location ? "border-red-300 focus:border-red-500" : ""
              }`}
            />
            {errors.location && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.location}
              </p>
            )}
          </div>

          {/* Adventure Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Adventure Type
            </label>
            <DropdownSelect
              label="Choose your adventure (Camping or Stargazing)"
              options={adventureOptions}
              selected={formData.adventureType}
              onSelect={(value) => handleDropdownChange("adventureType", value)}
            />
            {errors.adventureType && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.adventureType}
              </p>
            )}
          </div>

          {/* Companions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              No of Companions
            </label>
            <DropdownSelect
              label="How many companions are with you?"
              options={companionOptions}
              selected={formData.companions}
              onSelect={(value) => handleDropdownChange("companions", value)}
            />
            {errors.companions && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.companions}
              </p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <Input
                id="fromDate"
                type="date"
                value={formData.fromDate}
                onChange={handleChange}
                className={`w-full h-12 rounded-xl border-gray-300 focus:border-cyan-500 ${
                  errors.fromDate ? "border-red-300 focus:border-red-500" : ""
                }`}
              />
              {errors.fromDate && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.fromDate}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <Input
                id="toDate"
                type="date"
                value={formData.toDate}
                onChange={handleChange}
                className={`w-full h-12 rounded-xl border-gray-300 focus:border-cyan-500 ${
                  errors.toDate ? "border-red-300 focus:border-red-500" : ""
                }`}
              />
              {errors.toDate && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.toDate}
                </p>
              )}
            </div>
          </div>

          {/* Add Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add images
            </label>
            <div className="space-y-3">
              {/* Image Upload Area */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-cyan-400 hover:bg-gray-50 transition-colors"
                onClick={() => imageUploadRef.current?.click()}
              >
                <PhotoIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Click to upload images</p>
                <p className="text-xs text-gray-500">PNG, JPG, WebP up to 5MB each (max 2 images)</p>
              </div>

              <input
                ref={imageUploadRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative">
                      <img
                        src={image.preview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Describe your upcoming adventure
            </label>
            <textarea
              id="description"
              placeholder="Tell us about your camping or stargazing adventure!"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[100px] resize-none transition-all duration-200 ${
                errors.description
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-cyan-500 hover:border-gray-400"
              }`}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-start pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              size="md"
              variant="primary"
              className="rounded-xl"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Posting...
                </div>
              ) : (
                "Post"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
