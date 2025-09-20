import { useState, useEffect } from "react";
import { API } from "../api";

export function useNotifications(refreshKey = 0) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.notifications.getUserNotifications(50);
      if (response.success) {
        setNotifications(response.data);
      } else {
        setError("Failed to fetch notifications");
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(err.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await API.notifications.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.count);
      }
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await API.notifications.markAsRead(notificationId);
      if (response.success) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.notification_id === notificationId
              ? { ...notification, is_read: true }
              : notification
          )
        );
        // Update unread count
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await API.notifications.markAllAsRead();
      if (response.success) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, is_read: true }))
        );
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  useEffect(() => {
    // Only fetch if refreshKey > 0 (user is logged in)
    if (refreshKey > 0) {
      fetchNotifications();
      fetchUnreadCount();
    } else {
      // User not logged in, clear data
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
    }
  }, [refreshKey]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
    refetchUnreadCount: fetchUnreadCount,
  };
}
