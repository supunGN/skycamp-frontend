import React, { useState, useEffect } from "react";
import Button from "../../components/atoms/Button";
import SectionHeader from "../../components/dashboard/SectionHeader";
import { API } from "../../api";
import {
  PhotoIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Load images on mount
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await API.guideDashboard.getImages();

      if (response.success) {
        setImages(response.data);
      }
    } catch (error) {
      console.error("Failed to load images:", error);
      setMessage({
        type: "error",
        text: "Failed to load image gallery",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);

    if (files.length === 0) return;

    // Validate files
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setMessage({
          type: "error",
          text: "Only JPG, PNG, and WebP images are allowed",
        });
        return;
      }
      if (file.size > maxSize) {
        setMessage({
          type: "error",
          text: "File size must be less than 5MB",
        });
        return;
      }
    }

    try {
      setUploading(true);
      setMessage(null);

      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });

      const response = await API.guideDashboard.uploadImages(formData);

      if (response.success) {
        setMessage({
          type: "success",
          text: `${files.length} image(s) uploaded successfully`,
        });
        // Refresh images
        fetchImages();
        // Clear file input
        event.target.value = "";
      } else {
        setMessage({
          type: "error",
          text: response.message || "Failed to upload images",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to upload images",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      const response = await API.guideDashboard.deleteImage(imageId);

      if (response.success) {
        setMessage({
          type: "success",
          text: "Image deleted successfully",
        });
        // Refresh images
        fetchImages();
      } else {
        setMessage({
          type: "error",
          text: response.message || "Failed to delete image",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to delete image",
      });
    }
  };

  const handlePreviewImage = (image) => {
    setSelectedImage(image);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setSelectedImage(null);
  };

  // Build public URL for image
  const buildImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // Normalize path separators
    const normalizedPath = imagePath.replace(/\\/g, "/");

    // If already a full URL, return as-is
    if (normalizedPath.startsWith("http")) {
      return normalizedPath;
    }

    // Remove storage/uploads prefix if present
    let relativePath = normalizedPath;
    if (normalizedPath.includes("storage/uploads/")) {
      relativePath = normalizedPath.split("storage/uploads/")[1];
    }

    // Build the public URL with cache busting
    return `http://localhost/skycamp/skycamp-backend/storage/uploads/${relativePath}?ts=${Date.now()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading image gallery...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Image Gallery"
        subtitle="Upload and manage your experience photos for customers to see"
      />

      {/* Message Display */}
      {message && (
        <div
          className={`p-4 rounded-lg border ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircleIcon className="w-5 h-5" />
            ) : (
              <ExclamationTriangleIcon className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Upload Experience Photos
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Upload photos from your past trips and experiences to showcase
              your work
            </p>
          </div>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                uploading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-cyan-600 hover:bg-cyan-700 text-white"
              }`}
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <PlusIcon className="w-4 h-4" />
                  Upload Images
                </>
              )}
            </label>
          </div>
        </div>

        {/* Upload Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <PhotoIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-800">
              <p className="font-medium mb-2">Image Guidelines:</p>
              <ul className="space-y-1 text-blue-700">
                <li>
                  • Upload high-quality photos from your trips and experiences
                </li>
                <li>• Supported formats: JPG, PNG, WebP</li>
                <li>• Maximum file size: 5MB per image</li>
                <li>• You can select multiple images at once</li>
                <li>• Images will be displayed on your public profile</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Your Experience Photos
          </h3>
          <span className="text-sm text-gray-500">
            {images.length} {images.length === 1 ? "image" : "images"}
          </span>
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.image_id}
                className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={buildImageUrl(image.image_path)}
                  alt={`Experience ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity duration-200">
                    <button
                      onClick={() => handlePreviewImage(image)}
                      className="p-2 bg-white bg-opacity-90 text-gray-700 rounded-lg hover:bg-opacity-100 transition-colors"
                      title="Preview image"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.image_id)}
                      className="p-2 bg-red-500 bg-opacity-90 text-white rounded-lg hover:bg-opacity-100 transition-colors"
                      title="Delete image"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Upload date */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                  <p className="text-xs text-white">
                    {new Date(image.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <PhotoIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No images uploaded yet
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Upload photos from your experiences to showcase your work to
              customers
            </p>
            <label
              htmlFor="image-upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg cursor-pointer transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Upload Your First Images
            </label>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {showPreview && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closePreview}
              className="absolute top-4 right-4 z-10 p-2 bg-white bg-opacity-90 text-gray-700 rounded-full hover:bg-opacity-100 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <img
              src={buildImageUrl(selectedImage.image_path)}
              alt="Experience preview"
              className="max-w-full max-h-full rounded-lg"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-t from-black to-transparent p-4 rounded-b-lg">
              <p className="text-white text-sm">
                Uploaded:{" "}
                {new Date(selectedImage.uploaded_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <PhotoIcon className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-green-900 mb-2">
              Why Upload Experience Photos?
            </h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>
                • Showcase your expertise and past trips to potential customers
              </li>
              <li>• Build trust and credibility with high-quality photos</li>
              <li>• Give customers a preview of what they can expect</li>
              <li>• Photos appear on your public guide profile page</li>
              <li>
                • Help customers choose the right guide for their adventure
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
