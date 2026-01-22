import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import CoachDashboard from "./components/CoachDashboard";
import ClientDetails from "./components/ClientDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import ClientHome from "./components/ClientHome";
import ClientHistory from "./components/ClientHistory";
import ClientProgress from "./components/ClientProgress";
import CreateClient from "./components/CreateClient";

function App() {
  return (
    <Router>
      <Routes>
        {/* מסך התחברות */}
        <Route path="/" element={<Login />} />

        {/* מסך מאמן – רשימת לקוחות */}
        <Route
          path="/coach"
          element={
            <ProtectedRoute allowedRoles={["coach"]}>
              <CoachDashboard />
            </ProtectedRoute>
          }
        />

        {/* מסך יצירת לקוח חדש */}
        <Route
          path="/coach/create-client"
          element={
            <ProtectedRoute allowedRoles={["coach"]}>
              <CreateClient />
            </ProtectedRoute>
          }
        />

        {/* מסך פרטי לקוח (עבור המאמן) */}
        <Route
          path="/clients/:id"
          element={
            <ProtectedRoute allowedRoles={["coach"]}>
              <ClientDetails />
            </ProtectedRoute>
          }
        />

        {/* מסך בית של הלקוח */}
        <Route
          path="/client"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <ClientHome />
            </ProtectedRoute>
          }
        />

        {/* היסטוריה שבועית של לקוח */}
        <Route
          path="/client/history"
          element={
            <ProtectedRoute>
              <ClientHistory />
            </ProtectedRoute>
          }
        />

        {/* עדכון מטרות + עדכון שבועי של לקוח */}
        <Route
          path="/client/progress"
          element={
            <ProtectedRoute>
              <ClientProgress />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
