import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const doctorId = localStorage.getItem("doctorId");

  if (!doctorId) return <Navigate to="/login" />;

  return children;
}
