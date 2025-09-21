import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/login", { phone_number: phone, password });
      localStorage.setItem("token", res.data.access_token); // save token
      navigate("/appointments"); // ✅ redirect
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="card form-card">
      <h2 className="form-title">Login</h2>
      <form onSubmit={handleLogin} className="form">
        <input
          type="text"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn">
          Login
        </button>
      </form>

      {message && <p className="message error">{message}</p>}

      <p className="form-footer">
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
