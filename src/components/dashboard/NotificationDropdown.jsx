import React, { useState, useEffect, useRef } from "react";
import { BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { API } from "../../api";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

export default function NotificationDropdown({
  onUnreadCountChange,
  initialUnreadCount = 0,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch notifications and unread count
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const [notificationsRes, countRes] = await Promise.all([
        API.notifications.getUserNotifications(10), // Get latest 10
        API.notifications.getUnreadCount(),
      ]);

      if (notificationsRes.success) {
        setNotifications(notificationsRes.data || []);
      }

      if (countRes.success) {
        const newCount = countRes.data?.count || 0;
        setUnreadCount(newCount);
        // Notify parent component about count change
        if (onUnreadCountChange) {
          onUnreadCountChange(newCount);
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Poll for notifications every 30 seconds
  useEffect(() => {
    fetchNotifications(); // Initial fetch

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Update unread count when initialUnreadCount prop changes
  useEffect(() => {
    setUnreadCount(initialUnreadCount);
  }, [initialUnreadCount]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await API.notifications.markAsRead(notificationId);
      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.notification_id === notificationId
            ? { ...notif, is_read: 1 }
            : notif
        )
      );
      const newCount = Math.max(0, unreadCount - 1);
      setUnreadCount(newCount);
      // Notify parent component about count change
      if (onUnreadCountChange) {
        onUnreadCountChange(newCount);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "Verification":
        return "🔐";
      case "Booking":
        return "📅";
      case "PaymentSuccess":
        return "💰";
      case "TravelBuddyRequest":
        return "👥";
      case "PolicyViolation":
        return "⚠️";
      default:
        return "🔔";
    }
  };

  // Get notification color based on type
  const getNotificationColor = (type, isRead) => {
    if (isRead) return "text-gray-500";

    switch (type) {
      case "Verification":
        return "text-blue-600";
      case "Booking":
        return "text-green-600";
      case "PaymentSuccess":
        return "text-green-600";
      case "TravelBuddyRequest":
        return "text-purple-600";
      case "PolicyViolation":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
        aria-label="Notifications"
      >
        <BellIcon className="w-6 h-6" />
        {/* Unread count badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-600"></div>
                <p className="text-sm text-gray-500 mt-2">
                  Loading notifications...
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <BellIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.notification_id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      notification.is_read ? "bg-gray-50" : "bg-white"
                    }`}
                    onClick={() => {
                      if (!notification.is_read) {
                        markAsRead(notification.notification_id);
                      }
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Notification Icon */}
                      <div className="flex-shrink-0">
                        <span className="text-lg">
                          {getNotificationIcon(notification.type)}
                        </span>
                      </div>

                      {/* Notification Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm font-medium ${
                              notification.is_read
                                ? "text-gray-500"
                                : "text-gray-900"
                            }`}
                          >
                            {notification.type}
                          </p>
                          <span className="text-xs text-gray-400">
                            {formatDistanceToNow(
                              new Date(notification.created_at),
                              {
                                addSuffix: true,
                              }
                            )}
                          </span>
                        </div>
                        <p
                          className={`text-sm mt-1 ${
                            notification.is_read
                              ? "text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          {notification.message}
                        </p>
                      </div>

                      {/* Unread indicator */}
                      {!notification.is_read && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <a
                href={
                  window.location.pathname.includes("/guide/")
                    ? "/dashboard/guide/notifications"
                    : "/dashboard/renter/notifications"
                }
                className="block w-full text-center text-sm text-cyan-600 hover:text-cyan-700 font-medium py-2 hover:bg-cyan-50 rounded-lg transition-colors"
              >
                View all notifications
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
