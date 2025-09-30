import React, { useState, useEffect } from "react";
import axios from "axios";

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
    fontSize: "1.8em",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionHeader: {
    color: "#007bff",
    borderLeft: "5px solid #007bff",
    paddingLeft: "10px",
    marginTop: "25px",
    marginBottom: "15px",
    fontSize: "1.4em",
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
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "10px",
    backgroundColor: "#f4f7f9", // Very light grey-blue background for items
    border: "1px solid #cce0ff",
    lineHeight: "1.6",
  },
  highlight: {
    fontWeight: "600",
    color: "#333",
  },
  date: {
    fontSize: "0.9em",
    color: "#666",
    float: "right",
  },
  noteContent: {
    marginTop: "5px",
    borderLeft: "3px solid #007bff",
    paddingLeft: "10px",
    color: "#495057",
  },
};

const PatientHistory = ({ patient, onBack }) => {
  const [history, setHistory] = useState({ phq9: [], journals: [], messages: [] });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/therapists/patients/${patient._id}/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (patient) fetchHistory();
  }, [patient]);

  if (!patient) return <p>Loading patient data...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3>History for {patient.name} 📋</h3>
        <button onClick={onBack} style={styles.backButton}>
          ← Back to Patients
        </button>
      </div>

      {/* PHQ-9 Scores */}
      <h4 style={styles.sectionHeader}>PHQ-9 Scores</h4>
      {history.phq9.length === 0 ? (
        <p>No PHQ-9 scores available.</p>
      ) : (
        <ul style={styles.list}>
          {history.phq9.map((item) => (
            <li key={item._id} style={styles.listItem}>
              <span style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</span>
              <span style={styles.highlight}>Score: {item.score}</span>, 
              Result: {item.result}
            </li>
          ))}
        </ul>
      )}

      {/* Journals */}
      <h4 style={styles.sectionHeader}>Journals</h4>
      {history.journals.length === 0 ? (
        <p>No journal entries available.</p>
      ) : (
        <ul style={styles.list}>
          {history.journals.map((item) => (
            <li key={item._id} style={styles.listItem}>
              <span style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</span>
              <span style={styles.highlight}>Mood: {item.mood}</span>
              <div style={styles.noteContent}>Note: {item.note}</div>
            </li>
          ))}
        </ul>
      )}

      {/* Messages */}
      <h4 style={styles.sectionHeader}>Messages (Last 20)</h4>
      {history.messages.length === 0 ? (
        <p>No chat messages available.</p>
      ) : (
        <ul style={styles.list}>
          {history.messages.map((item) => (
            <li key={item._id} style={styles.listItem}>
              <span style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</span>
              <span style={styles.highlight}>{item.sender.name}:</span> {item.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientHistory;