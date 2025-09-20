import { useState, useEffect, useCallback } from "react";
import { API } from "../api";

/**
 * Secure Session Management Hook
 * Replaces localStorage with secure session-based authentication
 */
export const useSecureSession = () => {
  const [session, setSession] = useState({
    authenticated: false,
    user: null,
    admin: null,
    sessionType: null,
    loading: true,
    error: null,
  });

  const [lastActivity, setLastActivity] = useState(Date.now());

  // Check session status from backend
  const checkSession = useCallback(async () => {
    try {
      setSession((prev) => ({ ...prev, loading: true, error: null }));

      // First check if we have any session data in localStorage as a hint
      const hasUserData = localStorage.getItem("user");
      const hasAdminData = localStorage.getItem("admin");

      let authenticated = false;
      let user = null;
      let admin = null;
      let sessionType = null;

      // Only make API calls if we have localStorage hints
      if (hasUserData) {
        try {
          const userResponse = await API.auth.me();
          if (userResponse?.data?.authenticated) {
            authenticated = true;
            user = userResponse.data.user;
            sessionType = "user";
          }
        } catch (error) {
          // User session not valid, try admin if we have admin data
          if (hasAdminData) {
            try {
              const adminResponse = await API.admin.me();
              if (adminResponse?.authenticated) {
                authenticated = true;
                admin = adminResponse.user;
                sessionType = "admin";
              }
            } catch (adminError) {
              // Neither session is valid
            }
          }
        }
      } else if (hasAdminData) {
        try {
          const adminResponse = await API.admin.me();
          if (adminResponse?.authenticated) {
            authenticated = true;
            admin = adminResponse.user;
            sessionType = "admin";
          }
        } catch (error) {
          // Admin session not valid
        }
      }
      // If no localStorage hints, don't make any API calls - user is not authenticated

      setSession({
        authenticated,
        user,
        admin,
        sessionType,
        loading: false,
        error: null,
      });

      // Clean up localStorage if no valid session found
      if (!authenticated) {
        localStorage.removeItem("user");
        localStorage.removeItem("admin");
      }

      // Update last activity
      setLastActivity(Date.now());
    } catch (error) {
      console.error("Session check failed:", error);
      setSession({
        authenticated: false,
        user: null,
        admin: null,
        sessionType: null,
        loading: false,
        error: error.message,
      });
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    const currentSessionType = session.sessionType; // Capture current session type

    try {
      if (currentSessionType === "admin") {
        await API.admin.logout();
      } else {
        await API.auth.logout();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear session regardless of API call result
      setSession({
        authenticated: false,
        user: null,
        admin: null,
        sessionType: null,
        loading: false,
        error: null,
      });

      // Clear any remaining localStorage data
      localStorage.removeItem("user");
      localStorage.removeItem("admin");
      localStorage.removeItem("pendingUser");
      localStorage.removeItem("resetEmail");

      // Redirect to appropriate login page based on captured session type
      if (currentSessionType === "admin") {
        window.location.replace("/admin/login");
      } else {
        window.location.replace("/login");
      }
    }
  }, [session.sessionType]);

  // Update activity timestamp
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Check for idle timeout (30 minutes)
  useEffect(() => {
    const checkIdleTimeout = () => {
      const now = Date.now();
      const idleTime = now - lastActivity;
      const idleTimeout = 30 * 60 * 1000; // 30 minutes

      if (idleTime > idleTimeout && session.authenticated) {
        console.log("Session expired due to inactivity");
        logout();
      }
    };

    const interval = setInterval(checkIdleTimeout, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [lastActivity, session.authenticated, logout]);

  // Track user activity
  useEffect(() => {
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    const updateActivityOnEvent = () => {
      updateActivity();
    };

    events.forEach((event) => {
      document.addEventListener(event, updateActivityOnEvent, true);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, updateActivityOnEvent, true);
      });
    };
  }, [updateActivity]);

  // Periodic session refresh (every 5 minutes)
  useEffect(() => {
    if (!session.authenticated) return;

    const interval = setInterval(() => {
      checkSession();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [session.authenticated, checkSession]);

  // Initial session check with delay to avoid race conditions
  useEffect(() => {
    const timer = setTimeout(() => {
      checkSession();
    }, 100); // Small delay to ensure app is fully loaded

    return () => clearTimeout(timer);
  }, [checkSession]);

  return {
    ...session,
    checkSession,
    logout,
    updateActivity,
    isUser: session.sessionType === "user",
    isAdmin: session.sessionType === "admin",
  };
};
