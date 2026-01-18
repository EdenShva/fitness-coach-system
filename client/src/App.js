import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import CoachDashboard from "./components/CoachDashboard";
import ClientDetails from "./components/ClientDetails";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route
          path="/coach"
          element={
            <ProtectedRoute>
              <CoachDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clients/:id"
          element={
            <ProtectedRoute>
              <ClientDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
