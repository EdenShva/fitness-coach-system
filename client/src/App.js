import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import CoachDashboard from "./components/CoachDashboard";
import ClientDetails from "./components/ClientDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/coach" element={<CoachDashboard />} />
        <Route path="/clients/:id" element={<ClientDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
