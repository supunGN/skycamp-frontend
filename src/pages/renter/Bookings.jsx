import React, { useState, useEffect } from "react";
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  UserIcon,
  PhoneIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { API } from "../../api";
import { useToast } from "../../components/atoms/ToastProvider";
import Modal from "../../components/molecules/Modal";
import SectionHeader from "../../components/dashboard/SectionHeader";

export default function Bookings() {
  const [activeTab, setActiveTab] = useState("pending");
  const [bookings, setBookings] = useState({
    past_bookings: [],
    pending_bookings: [],
  });
  const [loading, setLoading] = useState(true);
  const [markingReceived, setMarkingReceived] = useState(false);

  // Confirmation modal state
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await API.renterDashboard.getRenterBookings();

      if (response.success) {
        setBookings(response.data);
      } else {
        showError(response.message || "Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      showError("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
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

  const handleMarkAsReceived = (booking) => {
    showConfirmationModal(
      "Mark as Received",
      `Are you sure you want to mark booking #${booking.booking_id} as received? This will update the booking status to completed and restore equipment stock quantities.`,
      async () => {
        try {
          setMarkingReceived(true);
          const response = await API.renterDashboard.markBookingAsReceived(
            booking.booking_id
          );

          if (response.success) {
            showSuccess("Booking marked as received successfully!");
            fetchBookings(); // Refresh the bookings list
          } else {
            showError(response.message || "Failed to mark booking as received");
          }
        } catch (error) {
          console.error("Error marking booking as received:", error);
          showError("Failed to mark booking as received");
        } finally {
          setMarkingReceived(false);
        }
      }
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Completed: {
        icon: CheckCircleIcon,
        color: "bg-green-100 text-green-800",
        text: "Completed",
      },
      Confirmed: {
        icon: ClockIcon,
        color: "bg-yellow-100 text-yellow-800",
        text: "Pending",
      },
    };

    const config = statusConfig[status] || statusConfig.Confirmed;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="h-3 w-3" />
        {config.text}
      </span>
    );
  };

  const renderBookingCard = (booking) => (
    <div
      key={booking.booking_id}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Booking #{booking.booking_id}
          </h3>
          <p className="text-sm text-gray-600">
            Booked on {formatDate(booking.booking_date)}
          </p>
        </div>
        {getStatusBadge(booking.status)}
      </div>

      {/* Customer Information */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <UserIcon className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-900">
            {booking.customer_first_name} {booking.customer_last_name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <PhoneIcon className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {booking.customer_phone}
          </span>
        </div>
      </div>

      {/* Booking Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            <strong>Period:</strong> {formatDate(booking.start_date)} -{" "}
            {formatDate(booking.end_date)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <CurrencyDollarIcon className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            <strong>Total Amount:</strong>{" "}
            {formatCurrency(booking.total_amount)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <CurrencyDollarIcon className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            <strong>Advance Paid:</strong>{" "}
            {formatCurrency(booking.advance_paid)}
          </span>
        </div>
      </div>

      {/* Equipment Details */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Equipment:</h4>
        <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
          {booking.equipment_details}
        </p>
      </div>

      {/* Action Button for Pending Bookings */}
      {booking.status === "Confirmed" && (
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={() => handleMarkAsReceived(booking)}
            disabled={markingReceived}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            {markingReceived ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-4 w-4" />
                Mark as Received
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Bookings"
        subtitle="Manage your equipment bookings"
      />

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("pending")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "pending"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              Pending Bookings ({bookings.pending_bookings.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "past"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="h-4 w-4" />
              Past Bookings ({bookings.past_bookings.length})
            </div>
          </button>
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeTab === "pending" ? (
          <div>
            {bookings.pending_bookings.length === 0 ? (
              <div className="text-center py-12">
                <ClockIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Pending Bookings
                </h3>
                <p className="text-gray-600">
                  You don't have any pending bookings at the moment.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {bookings.pending_bookings.map(renderBookingCard)}
              </div>
            )}
          </div>
        ) : (
          <div>
            {bookings.past_bookings.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircleIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Past Bookings
                </h3>
                <p className="text-gray-600">
                  You haven't completed any bookings yet.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {bookings.past_bookings.map(renderBookingCard)}
              </div>
            )}
          </div>
        )}
      </div>

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
