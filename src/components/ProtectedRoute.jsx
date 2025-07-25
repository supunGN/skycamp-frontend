import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  redirectTo = "/login",
}) {
  const user = JSON.parse(localStorage.getItem("user"));

  // If no user is found, redirect to login
  if (!user) return <Navigate to={redirectTo} replace />;

  // If allowedRoles is defined but user's role is not allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.user_role)) {
    return <Navigate to="/" replace />;
  }

  // If everything is fine, render children
  return children;
}
