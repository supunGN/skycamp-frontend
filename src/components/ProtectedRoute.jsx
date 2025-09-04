import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  redirectTo = "/login",
  requireAuth = true,
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // For auth flow routes (password reset), check for required state
        if (!requireAuth) {
          // Check if user has the required state for auth flow routes
          const hasRequiredState = checkAuthFlowState(location.pathname);
          if (hasRequiredState) {
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          } else {
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
          }
        }

        // Get user from localStorage
        const userData = localStorage.getItem("user");

        if (!userData) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const userObj = JSON.parse(userData);
        setUser(userObj);

        // Check if user has required fields
        if (!userObj.user_id || !userObj.email) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Verify session with backend
        const response = await fetch(
          "http://localhost/skycamp/skycamp-backend/api/auth/check-session.php",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (data.success && data.data) {
          setIsAuthenticated(true);
          // Update localStorage with fresh data
          localStorage.setItem("user", JSON.stringify(data.data));
          setUser(data.data);
        } else {
          // Session invalid, clear localStorage
          localStorage.removeItem("user");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // On error, clear localStorage and redirect to login
        localStorage.removeItem("user");
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname, requireAuth]);

  // Helper function to check auth flow state
  const checkAuthFlowState = (pathname) => {
    switch (pathname) {
      case "/check-email":
        // Should have email in sessionStorage or localStorage
        return (
          sessionStorage.getItem("resetEmail") ||
          localStorage.getItem("resetEmail")
        );

      case "/verify-otp":
        // Should have email and token in location state or sessionStorage
        const locationState = location.state;
        return (
          (locationState?.email && locationState?.token) ||
          (sessionStorage.getItem("resetEmail") &&
            sessionStorage.getItem("resetToken"))
        );

      case "/set-new-password":
        // Should have token and verified status
        const setPasswordState = location.state;
        return (
          (setPasswordState?.token && setPasswordState?.verified) ||
          (sessionStorage.getItem("resetToken") &&
            sessionStorage.getItem("otpVerified"))
        );

      case "/password-reset-success":
        // Should have user data (after successful password reset)
        return localStorage.getItem("user");

      default:
        return false;
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to appropriate page
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  // For auth flow routes, don't check roles
  if (!requireAuth) {
    return children;
  }

  // If allowedRoles is defined but user's role is not allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.user_role)) {
    // Redirect based on user role
    if (user?.user_role === "customer") {
      return <Navigate to="/profile" replace />;
    } else if (user?.user_role === "service_provider") {
      if (user?.provider_type === "Local Guide") {
        return <Navigate to="/dashboard/guide/overview" replace />;
      } else if (user?.provider_type === "Equipment Renter") {
        return <Navigate to="/dashboard/renter/overview" replace />;
      }
    }
    return <Navigate to="/" replace />;
  }

  // If everything is fine, render children
  return children;
}
