import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PatientList from "./PatientList";
import ProgressChart from "./ProgressChart";
import FeedbackView from "./FeedbackView";
import FeedbackForm from "./FeedbackForm";

// Define the styles object
const styles = {
  container: {
    margin: "50px auto",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textAlign: "center",
  },
  header: {
    color: "#0056b3", // Darker blue
    marginBottom: "10px",
  },
  subheader: {
    color: "#666",
    marginBottom: "30px",
  },
  menu: {
    listStyle: "none",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    alignItems: "center",
  },
  menuItem: {
    width: "100%",
    maxWidth: "350px", // Limit button width for better appearance
  },
  button: {
    width: "100%",
    padding: "15px 20px",
    margin: "0",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "background-color 0.3s, transform 0.1s",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  primaryButton: {
    backgroundColor: "#007bff", // Primary blue
    color: "white",
  },
  logoutButton: {
    padding: "10px 25px",
    marginTop: "30px",
    backgroundColor: "#dc3545", // Red for logout/danger
    color: "white",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  therapistContainer: {
    maxWidth: "900px", // Wider container for therapist view
    margin: "50px auto",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textAlign: "center",
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [view, setView] = useState("main");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (role === "therapist") {
    return (
      <div style={styles.therapistContainer}>
        <h2 style={styles.header}>Welcome to MindConnect - Therapist Dashboard 👨‍⚕️</h2>
        <p style={styles.subheader}>
          {view === "main" ? "Select a feature below to get started:" : <span style={{color: "#007bff", cursor: "pointer"}} onClick={() => setView("main")}>← Back to Main Menu</span>}
        </p>

        {view === "main" && (
          <ul style={styles.menu}>
            <li style={styles.menuItem}>
              <button
                onClick={() => navigate("/appointments")}
                style={{ ...styles.button, ...styles.primaryButton }}
              >
                🗓️ Manage Appointments
              </button>
            </li>
            <li style={styles.menuItem}>
              <button
                onClick={() => setView("patients")}
                style={{ ...styles.button, ...styles.primaryButton }}
              >
                👥 View Patients & Track Progress
              </button>
            </li>
            <li style={styles.menuItem}>
              <button
                onClick={() => setView("feedback")}
                style={{ ...styles.button, ...styles.primaryButton }}
              >
                ⭐ View Patient Feedback
              </button>
            </li>
          </ul>
        )}

        {view === "patients" && <PatientList onBack={() => setView("main")} />}
        {view === "feedback" && <FeedbackView onBack={() => setView("main")} />}

        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
    );
  }

  // Patient dashboard
  return (
    <div style={{ ...styles.container, maxWidth: "600px" }}>
      <h2 style={styles.header}>Welcome to MindConnect 🧘</h2>
      <p style={styles.subheader}>
        {view === "main" ? "Select a tool below for your journey:" : <span style={{color: "#007bff", cursor: "pointer"}} onClick={() => setView("main")}>← Back to Main Menu</span>}
      </p>

      {view === "main" && (
        <ul style={styles.menu}>
          <li style={styles.menuItem}>
            <button
              onClick={() => navigate("/appointments")}
              style={{ ...styles.button, ...styles.primaryButton }}
            >
              🗓️ Book & View Appointments
            </button>
          </li>
          <li style={styles.menuItem}>
            <button
              onClick={() => navigate("/phq9")}
              style={{ ...styles.button, ...styles.primaryButton }}
            >
              🧠 PHQ-9 Evaluation
            </button>
          </li>
          <li style={styles.menuItem}>
            <button
              onClick={() => navigate("/selfhelp")}
              style={{ ...styles.button, ...styles.primaryButton }}
            >
              🛠️ Self-Help Tools & Journaling
            </button>
          </li>
          <li style={styles.menuItem}>
            <button
              onClick={() => navigate("/chat")}
              style={{ ...styles.button, ...styles.primaryButton }}
            >
              💬 Chat With Your Therapist
            </button>
          </li>
          <li style={styles.menuItem}>
            <button
              onClick={() => setView("feedback")}
              style={{ ...styles.button, ...styles.primaryButton }}
            >
              📝 Submit Feedback
            </button>
          </li>
        </ul>
      )}

      {view === "feedback" && <FeedbackForm onBack={() => setView("main")} />}

      <button onClick={handleLogout} style={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;