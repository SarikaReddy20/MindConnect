import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Appointments from "./Appointments";
import Chat from "./Chat";
import PHQ9Form from "./PHQ9Form";
import SelfHelp from "./SelfHelp";
import HomePage from "./HomePage"

// Simple Auth Check
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <PrivateRoute>
              <Appointments />
            </PrivateRoute>
          }
        />

        <Route
          path="/chat/:appointmentId"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />

        <Route
          path="/phq9"
          element={
            <PrivateRoute>
              <PHQ9Form />
            </PrivateRoute>
          }
        />

        <Route
          path="/selfhelp"
          element={
            <PrivateRoute>
              <SelfHelp />
            </PrivateRoute>
          }
        />

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
