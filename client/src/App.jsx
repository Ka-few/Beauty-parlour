import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Services from "./pages/Services";
import Appointments from "./pages/Appointments";

export default function App() {
  return (
    <Router>
      <nav style={{ padding: "1rem", background: "#f4f4f4" }}>
        <Link to="/register" style={{ marginRight: "10px" }}>Register</Link>
        <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
        <Link to="/services" style={{ marginRight: "10px" }}>Services</Link>
        <Link to="/appointments">My Appointments</Link>
      </nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/services" element={<Services />} />
        <Route path="/appointments" element={<Appointments />} />
      </Routes>
    </Router>
  );
}
