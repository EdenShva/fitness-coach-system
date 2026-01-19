import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // אם הגדרנו אילו roles מותרים למסך הזה
  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      // אם מחובר אבל לא עם התפקיד הנכון -> נשלח למסך המתאים
      return <Navigate to={role === "client" ? "/client" : "/coach"} replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
