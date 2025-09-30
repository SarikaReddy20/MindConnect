// frontend/src/pages/PHQ9Form.js
import React, { useState } from "react";
import axios from "axios";

// PHQ-9 Questions
const questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself (e.g., that you are a failure or have let yourself or your family down)",
  "Trouble concentrating on things (e.g., reading the newspaper or watching television)",
  "Moving or speaking so slowly that other people could have noticed, or the opposite—being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself in some way",
];

// Define the styles object
const styles = {
  container: {
    maxWidth: "700px",
    margin: "50px auto",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    color: "#0056b3",
    borderBottom: "2px solid #007bff",
    paddingBottom: "10px",
    marginBottom: "25px",
    textAlign: "center",
  },
  questionGroup: {
    marginBottom: "20px",
    padding: "15px",
    border: "1px solid #cce0ff", // Light blue border
    borderRadius: "8px",
    backgroundColor: "#f4f7f9", // Very light blue-grey background
  },
  questionText: {
    fontWeight: "600",
    color: "#333",
    marginBottom: "10px",
    lineHeight: "1.4",
  },
  select: {
    width: "100%",
    padding: "10px",
    border: "1px solid #b3cde6",
    borderRadius: "6px",
    backgroundColor: "white",
    fontSize: "14px",
    cursor: "pointer",
  },
  submitButton: {
    width: "100%",
    padding: "15px",
    marginTop: "25px",
    backgroundColor: "#007bff", // Primary blue button
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
  resultContainer: {
    marginTop: "30px",
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#e6f2ff", // Lightest blue result background
    border: "2px solid #007bff",
    textAlign: "center",
  },
  score: {
    color: "#0056b3",
    fontSize: "1.5em",
    fontWeight: "700",
  },
  resultText: {
    color: "#333",
    fontSize: "1.1em",
  }
};

const PHQ9Form = () => {
  const [answers, setAnswers] = useState(Array(9).fill(0));
  const [result, setResult] = useState(null);

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = Number(value);
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/phq9", { answers }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      // Optional: Add a user-friendly error message state
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>PHQ-9 Evaluation 🧠</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px', color: '#555' }}>
        Please answer the following questions based on how often you have been bothered by them over the last **two weeks**.
      </p>
      
      <form onSubmit={handleSubmit}>
        {questions.map((q, idx) => (
          <div key={idx} style={styles.questionGroup}>
            <p style={styles.questionText}>
              {idx + 1}. {q}
            </p>
            <select 
              value={answers[idx]} 
              onChange={(e) => handleChange(idx, e.target.value)}
              style={styles.select}
            >
              <option value={0}>0 - Not at all</option>
              <option value={1}>1 - Several days</option>
              <option value={2}>2 - More than half the days</option>
              <option value={3}>3 - Nearly every day</option>
            </select>
          </div>
        ))}
        <button type="submit" style={styles.submitButton}>
          Submit Evaluation
        </button>
      </form>

      {result && (
        <div style={styles.resultContainer}>
          <h3 style={{...styles.score, margin: '10px 0'}}>
            Total Score: {result.score}
          </h3>
          <p style={styles.resultText}>
            Interpretation: <span style={{ fontWeight: 'bold' }}>{result.result}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default PHQ9Form;