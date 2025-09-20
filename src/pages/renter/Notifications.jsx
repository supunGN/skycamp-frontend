import React, { useState, useEffect } from "react";
import { API } from "../../api";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import SectionHeader from "../../components/dashboard/SectionHeader";
import {
  BellIcon,
  CheckIcon,
  XMarkIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, unread, verification, booking, etc.
  const [markingAsRead, setMarkingAsRead] = useState(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.notifications.getUserNotifications(100);

      if (response.success) {
        setNotifications(response.data || []);
      } else {
        setError("Failed to fetch notifications");
      }
    } catch (err) {
      setError("Error loading notifications");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      setMarkingAsRead(notificationId);
      await API.notifications.markAsRead(notificationId);

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.notification_id === notificationId
            ? { ...notif, is_read: 1 }
            : notif
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    } finally {
      setMarkingAsRead(null);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await API.notifications.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: 1 }))
      );
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.is_read;
    if (filter === "Booking") {
      return (
        notification.type === "Booking" ||
        notification.type === "BookingCreated" ||
        notification.type === "BookingCompleted"
      );
    }
    return notification.type === filter;
  });

  // Get notification icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case "Verification":
        return <CheckCircleIcon className="w-5 h-5 text-blue-500" />;
      case "Booking":
      case "BookingCreated":
      case "BookingCompleted":
        return <BellIcon className="w-5 h-5 text-green-500" />;
      case "PaymentSuccess":
        return <CurrencyDollarIcon className="w-5 h-5 text-green-500" />;
      case "TravelBuddyRequest":
        return <UserGroupIcon className="w-5 h-5 text-purple-500" />;
      case "PolicyViolation":
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      case "EquipmentAddedToCart":
        return <BellIcon className="w-5 h-5 text-orange-500" />;
      default:
        return <BellIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  // Get notification color
  const getNotificationColor = (type, isRead) => {
    if (isRead) return "border-gray-200 bg-gray-50";

    switch (type) {
      case "Verification":
        return "border-blue-200 bg-blue-50";
      case "Booking":
      case "BookingCreated":
      case "BookingCompleted":
        return "border-green-200 bg-green-50";
      case "PaymentSuccess":
        return "border-green-200 bg-green-50";
      case "TravelBuddyRequest":
        return "border-purple-200 bg-purple-50";
      case "PolicyViolation":
        return "border-red-200 bg-red-50";
      case "EquipmentAddedToCart":
        return "border-orange-200 bg-orange-50";
      default:
        return "border-gray-200 bg-white";
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="p-6 space-y-6">
      <SectionHeader
        title="Notifications"
        subtitle="Stay updated with your account activity"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                try {
                  await API.renterDashboard.createTestNotifications();
                  fetchNotifications();
                } catch (err) {
                  console.error("Error creating test notifications:", err);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <BellIcon className="w-4 h-4" />
              Create Test Data
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-cyan-600 bg-cyan-50 border border-cyan-200 rounded-lg hover:bg-cyan-100 transition-colors"
              >
                <CheckIcon className="w-4 h-4" />
                Mark all as read
              </button>
            )}
          </div>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <FunnelIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
        {[
          { key: "all", label: "All", count: notifications.length },
          { key: "unread", label: "Unread", count: unreadCount },
          {
            key: "Verification",
            label: "Verification",
            count: notifications.filter((n) => n.type === "Verification")
              .length,
          },
          {
            key: "Booking",
            label: "Bookings",
            count: notifications.filter(
              (n) =>
                n.type === "Booking" ||
                n.type === "BookingCreated" ||
                n.type === "BookingCompleted"
            ).length,
          },
          {
            key: "EquipmentAddedToCart",
            label: "Cart Updates",
            count: notifications.filter(
              (n) => n.type === "EquipmentAddedToCart"
            ).length,
          },
          {
            key: "PaymentSuccess",
            label: "Payments",
            count: notifications.filter((n) => n.type === "PaymentSuccess")
              .length,
          },
        ].map((filterOption) => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              filter === filterOption.key
                ? "bg-cyan-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {filterOption.label}
            {filterOption.count > 0 && (
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  filter === filterOption.key
                    ? "bg-cyan-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {filterOption.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
            <p className="text-gray-500 mt-2">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchNotifications}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <BellIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {filter === "all"
                ? "No notifications yet"
                : `No ${filter} notifications found`}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.notification_id}
              className={`p-4 rounded-lg border transition-all hover:shadow-sm ${getNotificationColor(
                notification.type,
                notification.is_read
              )}`}
            >
              <div className="flex items-start gap-3">
                {/* Notification Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Notification Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className={`text-sm font-medium ${
                            notification.is_read
                              ? "text-gray-600"
                              : "text-gray-900"
                          }`}
                        >
                          {notification.type}
                        </h3>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                        )}
                      </div>
                      <p
                        className={`text-sm ${
                          notification.is_read
                            ? "text-gray-500"
                            : "text-gray-700"
                        }`}
                      >
                        {notification.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(
                          new Date(notification.created_at),
                          {
                            addSuffix: true,
                          }
                        )}
                      </span>
                      {!notification.is_read && (
                        <button
                          onClick={() =>
                            markAsRead(notification.notification_id)
                          }
                          disabled={
                            markingAsRead === notification.notification_id
                          }
                          className="p-1 text-gray-400 hover:text-cyan-600 transition-colors"
                          title="Mark as read"
                        >
                          {markingAsRead === notification.notification_id ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-cyan-600 rounded-full animate-spin"></div>
                          ) : (
                            <CheckIcon className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
