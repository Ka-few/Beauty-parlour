import { useState, useEffect } from "react";
import API from "../api";

export default function Services() {
  const [services, setServices] = useState([]);
  const [appointmentTime, setAppointmentTime] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get("/services")
      .then(res => setServices(res.data))
      .catch(() => setMessage("Error loading services"));
  }, []);

  const bookAppointment = async (serviceId) => {
    try {
      const res = await API.post("/appointments", {
        service_id: serviceId,
        appointment_time: appointmentTime.replace("T", " ") + ":00"
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error booking appointment");
    }
  };

  return (
    <div className="card">
      <h2>Available Services</h2>

      <input
        type="datetime-local"
        className="form-input"
        value={appointmentTime}
        onChange={(e) => setAppointmentTime(e.target.value)}
      />

      <div className="services-grid">
        {services.map((s) => (
          <div key={s.id} className="service-card">
            <p className="service-title">{s.name}</p>
            <p className="service-price">${s.price}</p>
            <button className="btn" onClick={() => bookAppointment(s.id)}>
              Book
            </button>
          </div>
        ))}
      </div>

      <p>{message}</p>
    </div>
  );
}
