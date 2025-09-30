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
  },
  header: {
    color: "#0056b3",
    borderBottom: "2px solid #007bff",
    paddingBottom: "10px",
    marginBottom: "20px",
    fontSize: "1.5em",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  formGroup: {
    textAlign: "left",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "600",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    boxSizing: "border-box",
    fontSize: "14px",
  },
  select: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    fontSize: "14px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    boxSizing: "border-box",
    minHeight: "100px",
    resize: "vertical",
    fontSize: "14px",
  },
  buttonBase: {
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
    marginTop: "10px",
  },
  submitButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
  },
  backButton: {
    backgroundColor: "#6c757d", // Grey for back button
    color: "white",
    border: "none",
    marginRight: "10px",
  },
  message: (isSuccess) => ({
    marginTop: "20px",
    padding: "10px",
    borderRadius: "6px",
    backgroundColor: isSuccess ? "#d4edda" : "#f8d7da",
    color: isSuccess ? "#155724" : "#721c24",
    border: `1px solid ${isSuccess ? "#c3e6cb" : "#f5c6cb"}`,
    fontWeight: "bold",
  }),
};

const FeedbackForm = ({ onBack }) => {
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/therapists", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTherapists(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTherapists();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous message
    setIsSuccess(false);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/feedback/submit", {
        therapist: selectedTherapist,
        rating,
        comment,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Feedback submitted successfully! Thank you for your input.");
      setIsSuccess(true);
      // Optional: Clear form after successful submission
      setSelectedTherapist("");
      setRating(5);
      setComment("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit feedback. Please try again.");
      setIsSuccess(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ ...styles.header, flex: 1, margin: 0, borderBottom: "none" }}>Submit Feedback 📝</h3>
        <button 
          onClick={onBack} 
          style={{ ...styles.buttonBase, ...styles.backButton }}
        >
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Select Therapist:</label>
          <select 
            value={selectedTherapist} 
            onChange={(e) => setSelectedTherapist(e.target.value)} 
            required
            style={styles.select}
          >
            <option value="">-- Select Therapist --</option>
            {therapists.map((t) => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Rating (1-5):</label>
          <input 
            type="number" 
            min="1" 
            max="5" 
            value={rating} 
            onChange={(e) => setRating(e.target.value)} 
            required 
            style={styles.input}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Comment (Optional):</label>
          <textarea 
            value={comment} 
            onChange={(e) => setComment(e.target.value)} 
            style={styles.textarea}
            placeholder="Share your experience..."
          />
        </div>
        
        <button 
          type="submit" 
          style={{ ...styles.buttonBase, ...styles.submitButton }}
        >
          Submit Feedback
        </button>
      </form>
      
      {message && <p style={styles.message(isSuccess)}>{message}</p>}
    </div>
  );
};

export default FeedbackForm;