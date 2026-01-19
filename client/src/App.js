import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import CoachDashboard from "./components/CoachDashboard";
import ClientDetails from "./components/ClientDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import ClientHome from "./components/ClientHome";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/coach"
          element={
            <ProtectedRoute allowedRoles={["coach"]}>
              <CoachDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clients/:id"
          element={
            <ProtectedRoute allowedRoles={["coach"]}>
              <ClientDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <ClientHome />
            </ProtectedRoute>
          }
        />

      </Routes>

    </Router>
  );
}

export default App;
