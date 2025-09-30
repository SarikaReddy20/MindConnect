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
    padding: "15px",
    border: "1px solid #b3d9ff", // Light blue border
    borderRadius: "8px",
    marginBottom: "15px",
    backgroundColor: "#e6f2ff", // Very light blue background
    lineHeight: "1.6",
  },
  rating: (rating) => ({
    fontWeight: "bold",
    color: rating >= 4 ? "#28a745" : rating >= 2 ? "#ffc107" : "#dc3545", // Green for high, Yellow for medium, Red for low
    fontSize: "1.1em",
  }),
  comment: {
    marginTop: "5px",
    borderLeft: "3px solid #007bff",
    paddingLeft: "10px",
    color: "#495057",
    fontStyle: "italic",
  },
  infoLabel: {
    fontWeight: "600",
    color: "#0056b3",
  }
};

const FeedbackView = ({ onBack }) => {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/therapists/feedback", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedback(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFeedback();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3>My Patient Feedback ⭐</h3>
        <button onClick={onBack} style={styles.backButton}>
          ← Back to Dashboard
        </button>
      </div>

      {feedback.length === 0 ? (
        <p>No feedback has been submitted yet.</p>
      ) : (
        <ul style={styles.list}>
          {feedback.map((item) => (
            <li key={item._id} style={styles.listItem}>
              <div>
                <span style={styles.infoLabel}>Patient:</span> {item.patient.name} ({item.patient.email})
              </div>
              <div>
                <span style={styles.infoLabel}>Rating:</span> 
                <span style={styles.rating(item.rating)}> {item.rating}/5</span>
              </div>
              
              <div style={{ marginTop: "10px" }}>
                <span style={styles.infoLabel}>Comment:</span>
                <div style={styles.comment}>{item.comment || "No comment provided."}</div>
              </div>
              
              <div style={{ marginTop: "10px", fontSize: "0.9em", color: "#666" }}>
                <span style={styles.infoLabel}>Submitted On:</span> {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FeedbackView;