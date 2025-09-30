// frontend/src/pages/Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define the styles object
const styles = {
  container: {
    maxWidth: "450px",
    margin: "80px auto",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
    backgroundColor: "#ffffff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textAlign: "center",
  },
  header: {
    color: "#0056b3", // Darker blue for the title
    marginBottom: "25px",
    fontSize: "2em",
    fontWeight: "600",
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
    padding: "12px 15px",
    border: "1px solid #b3cde6", // Light blue border
    borderRadius: "8px",
    boxSizing: "border-box",
    fontSize: "16px",
    transition: "border-color 0.3s",
  },
  inputFocus: {
    borderColor: "#007bff", // Primary blue on focus (Note: only works with separate CSS/Styled Components, but included here for intent)
  },
  submitButton: {
    padding: "12px 25px",
    marginTop: "10px",
    backgroundColor: "#007bff", // Primary blue button
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
  error: {
    color: "#dc3545", // Red for error messages
    backgroundColor: "#f8d7da",
    border: "1px solid #f5c6cb",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "15px",
  },
  linkText: {
    marginTop: "20px",
    color: "#666",
  },
  link: {
    color: "#007bff", // Primary blue link
    textDecoration: "none",
    fontWeight: "600",
  }
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token); // save JWT token
      localStorage.setItem("userId", res.data._id); // save user ID
      localStorage.setItem("role", res.data.role); // save role
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Welcome Back! 👋</h2>
      
      {error && <p style={styles.error}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        
        <button type="submit" style={styles.submitButton}>
          Login
        </button>
      </form>
      
      <p style={styles.linkText}>
        Don't have an account? <a href="/register" style={styles.link}>Register here</a>
      </p>
    </div>
  );
};

export default Login;