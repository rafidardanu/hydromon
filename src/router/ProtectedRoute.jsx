import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
    // Redirect ke halaman login jika tidak terautentikasi
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
