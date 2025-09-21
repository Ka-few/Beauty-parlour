// src/pages/ProtectedRoute.jsx
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import API from "../api";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get("/me");
        if (res.data) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (err) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <p>Loading...</p>;

  return authenticated ? children : <Navigate to="/login" />;
}
