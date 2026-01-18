import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // אם אין טוקן – מפנים למסך ההתחברות
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
