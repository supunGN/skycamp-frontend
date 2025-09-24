import { useState, useEffect } from "react";
import { API } from "../../api";
import Button from "../atoms/Button";
import {
  X as XIcon,
  MapPin as MapPinIcon,
  Calendar as CalendarIcon,
  Users as UsersIcon,
  FileText as FileTextIcon,
  Loader2 as LoaderIcon,
} from "lucide-react";

export default function CreatePostForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    destination: "",
    travel_date: "",
    companions_needed: 1,
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Load available locations
  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoadingLocations(true);
      const response = await API.locations.getAllLocations();
      setLocations(response.data || []);
    } catch (error) {
      console.error("Error loading locations:", error);
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.destination.trim()) {
      newErrors.destination = "Destination is required";
    }

    if (!formData.travel_date) {
      newErrors.travel_date = "Travel date is required";
    } else {
      const selectedDate = new Date(formData.travel_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        newErrors.travel_date = "Travel date must be in the future";
      }
    }

    if (!formData.companions_needed || formData.companions_needed < 1) {
      newErrors.companions_needed = "At least 1 companion is required";
    } else if (formData.companions_needed > 10) {
      newErrors.companions_needed = "Maximum 10 companions allowed";
    }

    if (formData.notes && formData.notes.length > 1000) {
      newErrors.notes = "Notes cannot exceed 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Convert companions_needed to integer
      const submitData = {
        ...formData,
        companions_needed: parseInt(formData.companions_needed),
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Create Travel Plan
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Destination */}
          <div>
            <label
              htmlFor="destination"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <MapPinIcon className="w-4 h-4 inline mr-1" />
              Destination
            </label>
            <select
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
                errors.destination ? "border-red-300" : "border-gray-300"
              }`}
              disabled={isSubmitting || loadingLocations}
            >
              <option value="">Select a destination</option>
              {locations.map((location) => (
                <option key={location.location_id} value={location.name}>
                  {location.name} ({location.district})
                </option>
              ))}
            </select>
            {loadingLocations && (
              <p className="mt-1 text-sm text-gray-500 flex items-center">
                <LoaderIcon className="w-3 h-3 animate-spin mr-1" />
                Loading destinations...
              </p>
            )}
            {errors.destination && (
              <p className="mt-1 text-sm text-red-600">{errors.destination}</p>
            )}
          </div>

          {/* Travel Date */}
          <div>
            <label
              htmlFor="travel_date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <CalendarIcon className="w-4 h-4 inline mr-1" />
              Travel Date
            </label>
            <input
              type="date"
              id="travel_date"
              name="travel_date"
              value={formData.travel_date}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
                errors.travel_date ? "border-red-300" : "border-gray-300"
              }`}
              disabled={isSubmitting}
            />
            {errors.travel_date && (
              <p className="mt-1 text-sm text-red-600">{errors.travel_date}</p>
            )}
          </div>

          {/* Companions Needed */}
          <div>
            <label
              htmlFor="companions_needed"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <UsersIcon className="w-4 h-4 inline mr-1" />
              Companions Needed
            </label>
            <select
              id="companions_needed"
              name="companions_needed"
              value={formData.companions_needed}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
                errors.companions_needed ? "border-red-300" : "border-gray-300"
              }`}
              disabled={isSubmitting}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "companion" : "companions"}
                </option>
              ))}
            </select>
            {errors.companions_needed && (
              <p className="mt-1 text-sm text-red-600">
                {errors.companions_needed}
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <FileTextIcon className="w-4 h-4 inline mr-1" />
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              placeholder="Share details about your travel plan, activities, requirements, or anything else potential companions should know..."
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none ${
                errors.notes ? "border-red-300" : "border-gray-300"
              }`}
              disabled={isSubmitting}
            />
            <div className="mt-1 flex justify-between text-sm">
              {errors.notes ? (
                <p className="text-red-600">{errors.notes}</p>
              ) : (
                <p className="text-gray-500">
                  {formData.notes.length}/1000 characters
                </p>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <LoaderIcon className="w-4 h-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create Plan"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
