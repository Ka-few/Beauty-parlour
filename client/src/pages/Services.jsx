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
    <div>
      <h2>Services</h2>
      <input
        type="datetime-local"
        value={appointmentTime}
        onChange={(e) => setAppointmentTime(e.target.value)}
      />
      {services.map(s => (
        <div key={s.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "5px" }}>
          <p>{s.name} - ${s.price}</p>
          <button onClick={() => bookAppointment(s.id)}>Book</button>
        </div>
      ))}
      <p>{message}</p>
    </div>
  );
}
