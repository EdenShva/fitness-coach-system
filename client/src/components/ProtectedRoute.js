import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // אם אין טוקן בכלל – שולחים למסך התחברות
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // אם הוגדרו תפקידים מותרים למסלול הזה
  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      // אם התפקיד לא מתאים – ננתב למסך המתאים לפי role
      if (role === "coach") {
        return <Navigate to="/coach" replace />;
      }
      if (role === "client") {
        return <Navigate to="/client" replace />;
      }
      // אם מסיבה כלשהי role לא תקין
      return <Navigate to="/" replace />;
    }
  }

  // אם הכול תקין – מציגים את הילדים
  return children;
}

export default ProtectedRoute;
