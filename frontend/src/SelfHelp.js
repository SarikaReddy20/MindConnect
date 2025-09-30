import React, { useEffect, useState } from "react";
import axios from "axios";

// Define the styles object
const styles = {
  container: {
    maxWidth: "850px",
    margin: "50px auto",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textAlign: "left",
  },
  mainHeader: {
    color: "#0056b3",
    borderBottom: "2px solid #007bff",
    paddingBottom: "10px",
    marginBottom: "30px",
    textAlign: "center",
    fontSize: "2em",
  },
  sectionHeader: {
    color: "#007bff",
    marginTop: "30px",
    marginBottom: "15px",
    fontSize: "1.5em",
  },
  // --- Resources Section ---
  resourceList: {
    listStyleType: "none",
    padding: 0,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
  },
  resourceItem: {
    padding: "15px",
    borderRadius: "8px",
    backgroundColor: "#e6f2ff", // Light blue background
    border: "1px solid #cce0ff",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
  },
  resourceTitle: {
    fontWeight: "bold",
    color: "#0056b3",
    display: "block",
    marginBottom: "5px",
  },
  resourceLink: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "600",
  },
  // --- Journal Form ---
  journalForm: {
    padding: "25px",
    borderRadius: "10px",
    backgroundColor: "#f4f7f9", // Light blue-grey background
    border: "1px solid #b3cde6",
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    fontWeight: "600",
    color: "#333",
    marginRight: "10px",
  },
  select: {
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #b3cde6",
    minWidth: "150px",
  },
  textarea: {
    width: "100%",
    minHeight: "100px",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #b3cde6",
    resize: "vertical",
    boxSizing: "border-box",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745", // Green for positive action (Journaling)
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
    alignSelf: "flex-start",
  },
  // --- Past Entries ---
  journalEntryList: {
    listStyleType: "none",
    padding: 0,
  },
  journalEntryItem: {
    padding: "15px",
    borderLeft: "5px solid #007bff",
    borderRadius: "4px",
    marginBottom: "10px",
    backgroundColor: "#ffffff",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },
  entryMood: (mood) => {
    let color = "#333";
    if (mood === "Happy") color = "#28a745";
    else if (mood === "Sad") color = "#dc3545";
    else color = "#ffc107";
    return {
      fontWeight: "bold",
      color: color,
    };
  },
  entryDate: {
    fontSize: "0.9em",
    color: "#666",
    float: "right",
  }
};

const SelfHelp = () => {
  const [resources, setResources] = useState([]);
  const [mood, setMood] = useState("Happy");
  const [note, setNote] = useState("");
  const [journals, setJournals] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/selfhelp/resources", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResources(res.data);
      } catch (err) {
        console.error("Error fetching resources:", err);
      }
    };

    const fetchJournals = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/selfhelp/journal", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJournals(res.data);
      } catch (err) {
        console.error("Error fetching journals:", err);
      }
    };

    fetchResources();
    fetchJournals();
  }, [token]);

  const handleJournalSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) return; // Prevent empty submission

    try {
        await axios.post("http://localhost:5000/api/selfhelp/journal",
          { mood, note },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNote(""); // Clear the input
        
        // Refresh journal entries
        const res = await axios.get("http://localhost:5000/api/selfhelp/journal", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJournals(res.data);

    } catch (err) {
        console.error("Error submitting journal:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.mainHeader}>Self-Care & Journaling Hub 🌱</h2>

      {/* --- Self-Help Resources --- */}
      <h2 style={styles.sectionHeader}>Curated Resources</h2>
      {resources.length === 0 ? (
        <p>No resources available.</p>
      ) : (
        <ul style={styles.resourceList}>
          {resources.map(r => (
            <li key={r._id} style={styles.resourceItem}>
              <span style={styles.resourceTitle}>{r.title}</span> 
              <span style={{ color: "#666", fontSize: "0.9em" }}>({r.type})</span>
              <br/>
              <a href={r.content} target="_blank" rel="noopener noreferrer" style={styles.resourceLink}>
                View Resource →
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* --- Daily Journal Form --- */}
      <h2 style={styles.sectionHeader}>Daily Journal Entry</h2>
      <form onSubmit={handleJournalSubmit} style={styles.journalForm}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <label style={styles.label}>How are you feeling today?</label>
          <select value={mood} onChange={(e) => setMood(e.target.value)} style={styles.select}>
            <option>Happy</option>
            <option>Neutral</option>
            <option>Sad</option>
          </select>
        </div>
        
        <textarea 
          placeholder="Write your thoughts, feelings, or what you're grateful for today..." 
          value={note} 
          onChange={(e)=>setNote(e.target.value)} 
          style={styles.textarea}
          required
        />
        
        <button type="submit" style={styles.submitButton}>
          Submit Journal
        </button>
      </form>

      {/* --- Past Entries --- */}
      <h3 style={{ ...styles.sectionHeader, fontSize: "1.2em" }}>Your Past Entries</h3>
      {journals.length === 0 ? (
        <p>You have no past journal entries.</p>
      ) : (
        <ul style={styles.journalEntryList}>
          {journals.map(j => (
            <li key={j._id} style={styles.journalEntryItem}>
              <span style={styles.entryDate}>{new Date(j.createdAt).toLocaleDateString()}</span>
              <span style={styles.entryMood(j.mood)}>{j.mood}</span>
              <p style={{ margin: "5px 0 0 0", color: "#495057" }}>{j.note}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelfHelp;