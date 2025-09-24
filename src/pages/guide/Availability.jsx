import React, { useState, useEffect } from "react";
import Button from "../../components/atoms/Button";
import SectionHeader from "../../components/dashboard/SectionHeader";
import { API } from "../../api";
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const Availability = () => {
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [editingDay, setEditingDay] = useState(null);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Load availability data on mount
  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await API.guideDashboard.getAvailability();

      if (response.success) {
        // Transform the data into a more convenient format
        const availabilityData = {};
        response.data.forEach((item) => {
          if (!availabilityData[item.day_of_week]) {
            availabilityData[item.day_of_week] = [];
          }
          availabilityData[item.day_of_week].push({
            id: item.availability_id,
            startTime: item.start_time,
            endTime: item.end_time,
            isBooked: item.is_booked || false,
            bookingId: item.booking_id || null,
          });
        });
        setAvailability(availabilityData);
      }
    } catch (error) {
      console.error("Failed to load availability:", error);
      setMessage({
        type: "error",
        text: "Failed to load availability schedule",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAvailability = async () => {
    try {
      setSaving(true);
      setMessage(null);

      // Transform data back to the format expected by the API
      const availabilityData = [];
      Object.keys(availability).forEach((day) => {
        availability[day].forEach((slot) => {
          if (!slot.isBooked) {
            // Only save non-booked slots
            // Ensure time format is HH:MM:SS for consistency
            const formatTime = (time) => {
              if (!time) return time;
              // If time is already in HH:MM:SS format, return as is
              if (time.includes(":") && time.split(":").length === 3) {
                return time;
              }
              // If time is in HH:MM format, add :00 for seconds
              if (time.includes(":") && time.split(":").length === 2) {
                return time + ":00";
              }
              return time;
            };

            availabilityData.push({
              day_of_week: day,
              start_time: formatTime(slot.startTime),
              end_time: formatTime(slot.endTime),
            });
          }
        });
      });

      const response = await API.guideDashboard.updateAvailability(
        availabilityData
      );

      if (response.success) {
        setMessage({
          type: "success",
          text: "Availability schedule updated successfully",
        });
        setEditingDay(null);
        // Refresh data to get updated IDs
        setTimeout(() => {
          fetchAvailability();
        }, 1000);
      } else {
        setMessage({
          type: "error",
          text: response.message || "Failed to update availability",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update availability schedule",
      });
    } finally {
      setSaving(false);
    }
  };

  const addTimeSlot = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: [
        ...(prev[day] || []),
        {
          id: `temp_${Date.now()}`,
          startTime: "09:00",
          endTime: "17:00",
          isBooked: false,
          bookingId: null,
        },
      ],
    }));
  };

  const removeTimeSlot = (day, index) => {
    const slot = availability[day][index];

    // Don't allow removal of booked slots
    if (slot.isBooked) {
      setMessage({
        type: "error",
        text: "Cannot remove booked time slots",
      });
      return;
    }

    setAvailability((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }));
  };

  const updateTimeSlot = (day, index, field, value) => {
    const slot = availability[day][index];

    // Don't allow editing of booked slots
    if (slot.isBooked) {
      setMessage({
        type: "error",
        text: "Cannot modify booked time slots",
      });
      return;
    }

    setAvailability((prev) => ({
      ...prev,
      [day]: prev[day].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const validateTimeSlot = (startTime, endTime) => {
    if (!startTime || !endTime) return false;

    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    return start < end;
  };

  const getStatusColor = (day) => {
    const slots = availability[day] || [];
    if (slots.length === 0) return "bg-gray-100 text-gray-700";

    const hasBooked = slots.some((slot) => slot.isBooked);
    const hasAvailable = slots.some((slot) => !slot.isBooked);

    if (hasBooked && hasAvailable) return "bg-yellow-100 text-yellow-700";
    if (hasBooked) return "bg-red-100 text-red-700";
    return "bg-green-100 text-green-700";
  };

  const getStatusText = (day) => {
    const slots = availability[day] || [];
    if (slots.length === 0) return "Not Available";

    const hasBooked = slots.some((slot) => slot.isBooked);
    const hasAvailable = slots.some((slot) => !slot.isBooked);

    if (hasBooked && hasAvailable) return "Partially Booked";
    if (hasBooked) return "Fully Booked";
    return "Available";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading availability...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Availability Schedule"
        subtitle="Manage your weekly availability for customers to book"
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

      {/* Availability Schedule */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Weekly Schedule
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Set your availability for each day of the week. Booked slots
                cannot be modified.
              </p>
            </div>
            <Button
              onClick={handleSaveAvailability}
              disabled={saving}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                "Save Schedule"
              )}
            </Button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {daysOfWeek.map((day, dayIndex) => (
            <div key={day} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h4 className="text-base font-medium text-gray-900">{day}</h4>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      day
                    )}`}
                  >
                    {getStatusText(day)}
                  </span>
                </div>
                <button
                  onClick={() => addTimeSlot(day)}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Time Slot
                </button>
              </div>

              <div className="space-y-3">
                {availability[day]?.length > 0 ? (
                  availability[day].map((slot, index) => (
                    <div
                      key={slot.id || index}
                      className={`flex items-center gap-4 p-4 rounded-lg border ${
                        slot.isBooked
                          ? "bg-red-50 border-red-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      {slot.isBooked ? (
                        <XCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                      ) : (
                        <ClockIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}

                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-700">
                            From:
                          </label>
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) =>
                              updateTimeSlot(
                                day,
                                index,
                                "startTime",
                                e.target.value
                              )
                            }
                            disabled={slot.isBooked}
                            className={`px-3 py-2 border rounded-lg text-sm ${
                              slot.isBooked
                                ? "bg-red-100 border-red-300 text-red-700 cursor-not-allowed"
                                : "bg-white border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                            }`}
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-700">
                            To:
                          </label>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) =>
                              updateTimeSlot(
                                day,
                                index,
                                "endTime",
                                e.target.value
                              )
                            }
                            disabled={slot.isBooked}
                            className={`px-3 py-2 border rounded-lg text-sm ${
                              slot.isBooked
                                ? "bg-red-100 border-red-300 text-red-700 cursor-not-allowed"
                                : "bg-white border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                            }`}
                          />
                        </div>

                        {!validateTimeSlot(slot.startTime, slot.endTime) &&
                          !slot.isBooked && (
                            <span className="text-xs text-red-600">
                              End time must be after start time
                            </span>
                          )}
                      </div>

                      {slot.isBooked ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-red-600 font-medium">
                            Booked
                          </span>
                          <span className="text-xs text-gray-500">
                            (ID: {slot.bookingId})
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => removeTimeSlot(day, index)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ClockIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No availability set for {day}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Click "Add Time Slot" to set your availability
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <ClockIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              How Availability Works
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Set your weekly schedule for each day of the week</li>
              <li>• You can add multiple time slots per day</li>
              <li>• Once a customer books a time slot, it becomes locked</li>
              <li>• Booked slots cannot be modified or removed</li>
              <li>
                • After a booking is completed, the slot becomes available again
              </li>
              <li>
                • Your availability is visible to customers on your profile
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Availability;
