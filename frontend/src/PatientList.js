import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PatientHistory from "./PatientHistory";
import ProgressChart from "./ProgressChart";

// Define the styles object
const styles = {
  container: {
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    border: "1px solid #e0e0e0",
    marginTop: "20px",
    textAlign: "left",
  },
  header: {
    color: "#0056b3",
    borderBottom: "2px solid #007bff",
    paddingBottom: "10px",
    marginBottom: "20px",
    fontSize: "1.5em",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    padding: "8px 15px",
    backgroundColor: "#6c757d", // Grey for back button
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
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
    border: "1px solid #cce0ff", // Light blue border
    borderRadius: "8px",
    marginBottom: "10px",
    backgroundColor: "#e6f2ff", // Very light blue background
    flexWrap: "wrap",
  },
  patientInfo: {
    fontWeight: "600",
    color: "#333",
    flex: "1 1 50%", // Takes up about half the space
    minWidth: "250px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "5px", // For wrapping on small screens
  },
  buttonBase: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background-color 0.3s ease",
    fontSize: "13px",
  },
  actionButton: {
    backgroundColor: "#007bff", // Primary blue
    color: "white",
  },
  chatButton: {
    backgroundColor: "#28a745", // Green for chat
    color: "white",
  },
  noAppointments: {
    padding: "15px",
    backgroundColor: "#fff3cd",
    border: "1px solid #ffeeba",
    color: "#856404",
    borderRadius: "6px",
    textAlign: "center",
  }
};

const PatientList = ({ onBack }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [view, setView] = useState("list");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const res = await axios.get("http://localhost:5000/api/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter appointments for the current therapist
        const therapistAppointments = res.data.filter(appt => appt.therapist && appt.therapist._id === userId);
        setAppointments(therapistAppointments);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAppointments();
  }, []);

  if (view === "history") {
    return <PatientHistory patient={selectedPatient} onBack={() => setView("list")} />;
  }

  if (view === "progress") {
    return <ProgressChart patient={selectedPatient} onBack={() => setView("list")} />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3>My Appointments & Patients 👥</h3>
        <button onClick={onBack} style={styles.backButton}>
          ← Back to Dashboard
        </button>
      </div>
      
      {appointments.length === 0 ? (
        <p style={styles.noAppointments}>You have no scheduled appointments.</p>
      ) : (
        <ul style={styles.list}>
          {appointments.map((appt) => (
            <li key={appt._id} style={styles.listItem}>
              <div style={styles.patientInfo}>
                Patient: {appt.patient.name} ({appt.patient.email}) <br />
                <span style={{ fontSize: "0.9em", color: "#666" }}>
                  Appointment: {new Date(appt.date).toLocaleDateString()}
                </span>
              </div>
              
              <div style={styles.buttonGroup}>
                <button 
                  onClick={() => { setSelectedPatient(appt.patient); setView("history"); }}
                  style={{ ...styles.buttonBase, ...styles.actionButton }}
                >
                  View History
                </button>
                <button 
                  onClick={() => { setSelectedPatient(appt.patient); setView("progress"); }}
                  style={{ ...styles.buttonBase, ...styles.actionButton }}
                >
                  View Progress
                </button>
                <button 
                  onClick={() => navigate(`/chat/${appt._id}`)}
                  style={{ ...styles.buttonBase, ...styles.chatButton }}
                >
                  Chat 💬
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientList;