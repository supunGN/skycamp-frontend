import React, { useState } from "react";
import {
  CalendarDaysIcon,
  MapPinIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const MyBookings = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  // Mock data - replace with actual API call
  const bookings = [
    {
      id: "booking_001",
      type: "Equipment Rental",
      items: ["4-Person Tent", "Sleeping Bag x2", "Portable Stove"],
      renterName: "Mountain Gear Co.",
      startDate: "2024-02-15",
      endDate: "2024-02-17",
      status: "confirmed",
      totalAmount: 15750.0,
      location: "Ella, Sri Lanka",
    },
    {
      id: "booking_002",
      type: "Guide Service",
      guideName: "Kamal Perera",
      startDate: "2024-02-20",
      endDate: "2024-02-22",
      status: "completed",
      totalAmount: 17000.0,
      location: "Horton Plains National Park",
    },
    {
      id: "booking_003",
      type: "Equipment Rental",
      items: ["Telescope", "Camping Chair x2"],
      renterName: "StarGaze Rentals",
      startDate: "2024-03-05",
      endDate: "2024-03-06",
      status: "cancelled",
      totalAmount: 8500.0,
      location: "Ritigala Forest Reserve",
    },
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case "confirmed":
        return {
          color: "cyan",
          icon: CalendarDaysIcon,
          label: "Confirmed",
        };
      case "completed":
        return {
          color: "green",
          icon: CheckCircleIcon,
          label: "Completed",
        };
      case "cancelled":
        return {
          color: "red",
          icon: XCircleIcon,
          label: "Cancelled",
        };
      default:
        return {
          color: "gray",
          icon: ClockIcon,
          label: "Pending",
        };
    }
  };

  const filterOptions = [
    { id: "all", label: "All Bookings" },
    { id: "confirmed", label: "Confirmed" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  const filteredBookings =
    activeFilter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === activeFilter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-50 to-indigo-50 rounded-xl border border-cyan-100 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-100 rounded-lg">
            <CalendarDaysIcon className="w-6 h-6 text-cyan-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">My Bookings</h2>
            <p className="text-sm text-gray-600 mt-1">
              Track and manage your camping equipment and guide bookings
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex overflow-x-auto">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setActiveFilter(option.id)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 ${
                activeFilter === option.id
                  ? "text-cyan-600 border-cyan-600 bg-cyan-50"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => {
            const statusConfig = getStatusConfig(booking.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={booking.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Main Booking Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.type}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Booking ID: {booking.id}
                        </p>
                      </div>

                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-${statusConfig.color}-100 text-${statusConfig.color}-800 border border-${statusConfig.color}-200`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig.label}
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        {booking.type === "Equipment Rental" ? (
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Equipment Items:
                            </p>
                            <ul className="text-sm text-gray-600">
                              {booking.items.map((item, index) => (
                                <li
                                  key={index}
                                  className="flex items-center gap-1"
                                >
                                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                            <div className="flex items-center gap-2 mt-2">
                              <UserIcon className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {booking.renterName}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Guide: {booking.guideName}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <MapPinIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {booking.location}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <ClockIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {new Date(booking.startDate).toLocaleDateString()} -{" "}
                            {new Date(booking.endDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="text-right lg:text-left">
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="text-lg font-semibold text-gray-900">
                            LKR {booking.totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 lg:flex-col">
                    <button className="px-4 py-2 text-sm font-medium text-cyan-600 bg-cyan-50 border border-cyan-200 rounded-lg hover:bg-cyan-100 transition-colors">
                      View Details
                    </button>

                    {booking.status === "confirmed" && (
                      <button className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                        Cancel Booking
                      </button>
                    )}

                    {booking.status === "completed" && (
                      <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                        Leave Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <CalendarDaysIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeFilter === "all"
                ? "No bookings found"
                : `No ${activeFilter} bookings`}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeFilter === "all"
                ? "You haven't made any bookings yet. Start exploring our equipment rentals and guide services!"
                : `You don't have any ${activeFilter} bookings at the moment.`}
            </p>
            <button className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
              Browse Services
            </button>
          </div>
        )}
      </div>

      {/* Booking Summary Stats */}
      {bookings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-cyan-600">
              {bookings.filter((b) => b.status === "confirmed").length}
            </div>
            <div className="text-sm text-gray-600">Active Bookings</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter((b) => b.status === "completed").length}
            </div>
            <div className="text-sm text-gray-600">Completed Trips</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-gray-900">
              LKR{" "}
              {bookings
                .filter((b) => b.status === "completed")
                .reduce((sum, b) => sum + b.totalAmount, 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
