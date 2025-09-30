import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
  noData: {
    padding: "15px",
    backgroundColor: "#fff3cd", // Yellowish warning
    border: "1px solid #ffeeba",
    color: "#856404",
    borderRadius: "6px",
    textAlign: "center",
    marginTop: "20px",
  },
  chartWrapper: {
    padding: "20px 0",
    marginTop: "15px",
  }
};

const ProgressChart = ({ patient, onBack }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!patient) return;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/therapists/patients/${patient._id}/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProgress();
  }, [patient]);

  if (!patient) {
    return <div>Loading patient...</div>;
  }

  // --- Render No Data State with Blue UI ---
  if (!data.length) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h3>Progress for {patient.name} 📈</h3>
          <button onClick={onBack} style={styles.backButton}>
            ← Back to Patients
          </button>
        </div>
        <p style={styles.noData}>No PHQ-9 data available yet for this patient.</p>
      </div>
    );
  }

  // Define chart options (Using blue shades)
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
            color: '#333',
        }
      },
      title: {
        display: true,
        text: 'PHQ-9 Score Over Time',
        color: '#0056b3',
        font: {
            size: 16
        }
      },
      tooltip: {
        backgroundColor: '#007bff',
      }
    },
    scales: {
      y: {
        min: 0,
        max: 27, // Max score for PHQ-9
        title: {
          display: true,
          text: 'PHQ-9 Score',
          color: '#0056b3'
        },
        grid: {
            color: '#e6f2ff' // Very light blue grid lines
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date',
          color: '#0056b3'
        },
        grid: {
            color: '#e6f2ff'
        }
      }
    }
  };


  const chartData = {
    labels: data.map(item => new Date(item.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: "PHQ-9 Score",
        data: data.map(item => item.score),
        borderColor: "#007bff", // Primary blue line
        backgroundColor: "rgba(0, 123, 255, 0.4)", // Lighter blue area fill
        tension: 0.4, // Smooths the line
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3>Progress for {patient.name} 📈</h3>
        <button onClick={onBack} style={styles.backButton}>
          ← Back to Patients
        </button>
      </div>
      
      <div style={styles.chartWrapper}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ProgressChart;