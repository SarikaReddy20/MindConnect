// frontend/src/pages/Appointments.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define the styles object
const styles = {
  container: {
    maxWidth: "800px",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff", // White background for content area
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    color: "#0056b3", // Darker blue for headers
    borderBottom: "2px solid #007bff", // Primary blue underline
    paddingBottom: "10px",
    marginBottom: "20px",
  },
  form: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "30px",
    backgroundColor: "#f4f7f9", // Light blue-grey background for the form
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box", // Include padding and border in the element's total width and height
  },
  select: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
    backgroundColor: "#fff",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff", // Primary blue button
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#0056b3", // Darker blue on hover (Note: pure CSS for hover isn't possible with inline styles, but this indicates the desired color)
  },
  list: {
    listStyleType: "none",
    padding: "0",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    border: "1px solid #b3d9ff", // Light blue border
    borderRadius: "6px",
    marginBottom: "10px",
    backgroundColor: "#e6f2ff", // Very light blue background for list items
  },
  chatButton: {
    marginLeft: "10px",
    padding: "8px 15px",
    backgroundColor: "#28a745", // Green for chat button for contrast
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

const Appointments = () => {
  const [therapists, setTherapists] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Fetch therapists
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/therapists", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTherapists(res.data);
      } catch (error) {
        console.error("Error fetching therapists:", error);
      }
    };
    fetchTherapists();
  }, [token]);

  // Fetch patient appointments
  const fetchAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [token]);

  // Handle booking
  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedTherapist || !date) return;
    try {
      await axios.post(
        "http://localhost:5000/api/appointments",
        { therapistId: selectedTherapist, date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Appointment booked!");
      // Refresh appointments
      fetchAppointments();
      setSelectedTherapist(""); // Clear form fields
      setDate("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error booking appointment");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Book an Appointment 📅</h2>
      <form onSubmit={handleBook} style={styles.form}>
        <div>
          <label style={styles.label}>Select Therapist:</label>
          <select
            value={selectedTherapist}
            onChange={(e) => setSelectedTherapist(e.target.value)}
            required
            style={styles.select}
          >
            <option value="">-- Select --</option>
            {therapists.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name} ({t.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={styles.label}>Select Date & Time:</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>
          Book Appointment
        </button>
      </form>

      {/* --- */}

      <h2 style={styles.header}>Your Appointments 📝</h2>
      {appointments.length === 0 ? (
        <p>You have no scheduled appointments.</p>
      ) : (
        <ul style={styles.list}>
          {appointments.map((a) => (
            <li key={a._id} style={styles.listItem}>
              <div>
                <strong>Therapist:</strong> {a.therapist.name} |{" "}
                <strong>Date:</strong> {new Date(a.date).toLocaleString()}
              </div>
              <button
                style={styles.chatButton}
                onClick={() => navigate(`/chat/${a._id}`)}
              >
                Chat Now 💬
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Appointments;