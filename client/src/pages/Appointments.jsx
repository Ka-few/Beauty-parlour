import { useState, useEffect } from "react";
import API from "../api";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error

  // Fetch appointments + services
  const fetchAppointments = () => {
    API.get("/appointments")
      .then((res) => setAppointments(res.data))
      .catch(() => {
        setMessage("Error loading appointments");
        setMessageType("error");
      });
  };

  useEffect(() => {
    fetchAppointments();
    API.get("/services")
      .then((res) => setServices(res.data))
      .catch(() => {
        setMessage("Error loading services");
        setMessageType("error");
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    API.post("/appointments", {
      service_id: serviceId,
      appointment_time: appointmentTime,
    })
      .then(() => {
        setMessage("✅ Appointment booked!");
        setMessageType("success");
        setServiceId("");
        setAppointmentTime("");
        fetchAppointments();
      })
      .catch(() => {
        setMessage("❌ Error booking appointment");
        setMessageType("error");
      });
  };

  const removeAppointment = (id) => {
    API.delete(`/appointments/${id}`)
      .then((res) => {
        setMessage(res.data.message || "Appointment removed");
        setMessageType("success");
        fetchAppointments();
      })
      .catch(() => {
        setMessage("❌ Error removing appointment");
        setMessageType("error");
      });
  };

  return (
    <div className="card">
      <h2>My Appointments</h2>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="appointment-form">
        <select
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          required
        >
          <option value="">Select Service</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} - ${s.price}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={appointmentTime}
          onChange={(e) =>
            setAppointmentTime(e.target.value.replace("T", " ") + ":00")
          }
          required
        />

        <button type="submit" className="btn">
          Book Appointment
        </button>
      </form>

      {/* Appointment List */}
      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <ul className="appointment-list">
          {appointments.map((a) => (
            <li key={a.id} className="appointment-item">
              <span>
                <strong>{a.service}</strong> on {a.appointment_time}
              </span>
              <button
                className="btn danger"
                onClick={() => removeAppointment(a.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Messages */}
      {message && (
        <p className={`message ${messageType}`}>
          {message}
        </p>
      )}
    </div>
  );
}
