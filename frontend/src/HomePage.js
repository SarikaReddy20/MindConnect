import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-brand">MindConnect</div>
        <div className="navbar-actions">
          <Link to="/login" className="btn">Login</Link>
          <Link to="/register" className="btn btn-primary">Signup</Link>
        </div>
      </nav>

      <header className="hero-section">
        <h1>Empowering Mental Wellness for Everyone</h1>
        <p>Your trusted platform for accessible, private, and scalable mental health support.</p>
        <Link to="/register" className="btn btn-cta">Get Started</Link>
      </header>

      {/* --- NEW SECTION: Our Mission --- */}
      <section className="mission-section">
        <p>Our mission is to bridge the gap in mental health care, providing a safe, confidential, and effective digital space for connection, healing, and growth. We believe mental wellness is a right, not a privilege.</p>
      </section>

      {/* --- Existing Features Section --- */}
      <section className="features-section">
        <h2>Core Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🧑‍⚕️ User Onboarding & Profiles</h3>
            <p>Secure sign-up for patients, therapists, and admins. Manage personal info and therapy needs.</p>
          </div>
          <div className="feature-card">
            <h3>💬 Therapy & Counseling</h3>
            <p>Text-based sessions and easy scheduling with licensed therapists.</p>
          </div>
          <div className="feature-card">
            <h3>📅 Appointment Booking</h3>
            <p>Book, reschedule, or cancel sessions with automated reminders.</p>
          </div>
          <div className="feature-card">
            <h3>🧘 Self-Help Resources</h3>
            <p>Access meditation, journaling, and educational materials.</p>
          </div>
          <div className="feature-card">
            <h3>🧠 Mental Health Evaluations</h3>
            <p>Automated screening tools like PHQ-9 and GAD-7 with therapist reviews.</p>
          </div>
          <div className="feature-card">
            <h3>🔒 Privacy & Security</h3>
            <p>End-to-end encryption, anonymity, HIPAA/GDPR compliance.</p>
          </div>
          <div className="feature-card">
            <h3>👩‍⚕️ Therapist Management</h3>
            <p>Verified onboarding, dashboards, and feedback system for therapists.</p>
          </div>
          <div className="feature-card">
            <h3>📊 Analytics & Reports</h3>
            <p>Progress reports, therapist insights, and admin analytics.</p>
          </div>
        </div>
      </section>

      {/* --- NEW SECTION: How It Works --- */}
      <section className="how-it-works-section">
        <h2>How MindConnect Works</h2>
        <div className="how-it-works-grid">
          <div className="step-card">
            <span className="step-number">1</span>
            <h3>Sign Up & Assess</h3>
            <p>Create a secure account, choose your role (Patient/Therapist), and complete a brief initial assessment.</p>
          </div>
          <div className="step-card">
            <span className="step-number">2</span>
            <h3>Connect & Schedule</h3>
            <p>Browse licensed therapists, match with your preferred provider, and book your first session online.</p>
          </div>
          <div className="step-card">
            <span className="step-number">3</span>
            <h3>Start Your Journey</h3>
            <p>Engage in confidential text sessions, track your mood, and access personalized self-help content.</p>
          </div>
        </div>
      </section>

      {/* --- Existing Testimonials Section --- */}
      <section className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial">
            <p>"MindConnect made therapy accessible from the comfort of my home. Truly life-changing!"</p>
            <span>– Ananya S., Patient</span>
          </div>
          <div className="testimonial">
            <p>"As a therapist, the platform helps me focus on patients while MindConnect handles logistics."</p>
            <span>– Dr. Mehul R., Therapist</span>
          </div>
          <div className="testimonial">
            <p>"I love the mood tracking and guided meditations. It helps me stay grounded every day."</p>
            <span>– Rahul P., Student</span>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 MindConnect. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;