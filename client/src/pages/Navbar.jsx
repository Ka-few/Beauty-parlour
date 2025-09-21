import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";

export default function Navbar() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      API.get("/me")
        .then(res => setProfile(res.data))
        .catch(() => setProfile(null));
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setProfile(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h1 className="logo">Beauty Parlour</h1>

      <div className="nav-links">
        <Link to="/services" className="nav-link">Services</Link>
        <Link to="/appointments" className="nav-link">Appointments</Link>

        {token ? (
          <>
            {profile && <span className="welcome-text">Welcome, {profile.name}</span>}
            <button className="btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
