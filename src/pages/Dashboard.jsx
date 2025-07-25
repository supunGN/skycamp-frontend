import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  if (!user) return <Navigate to="/login" />;
  if (user.userRole === "service_provider") {
    if (user.provider_type === "Equipment Renter") {
      return <Navigate to="/dashboard/renter/overview" replace />;
    } else {
      return <Navigate to="/dashboard/guide/overview" replace />;
    }
  }
  if (user.userRole === "customer") {
    return <Navigate to="/profile" />;
  }
  return <Navigate to="/login" />;
}
