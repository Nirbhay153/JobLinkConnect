// src/EmployerDashboard.js
import React from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import './dashboard.css';

function EmployerDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  if (!user) {
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="nav-content">
          <h2 className="nav-title">Employer</h2>
          <div className="nav-actions">
            <span className="user-email">{user.email}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome to Your Employer Dashboard! 🏢</h1>
          <p className="welcome-subtitle">Manage your hiring process efficiently</p>
        </div>

        <div className="cards-grid">
          <div className="dashboard-card">
            <div className="card-content">
            <div className="card-icon">➕</div>
            <h3 className="card-title">Post New Job</h3>
            <p className="card-description">Create and publish job openings for candidates</p>
             </div>
            <button className="card-button" onClick={() => navigate('/postjob')}>Post Job</button>
            
          </div>

          <div className="dashboard-card">
            <div className="card-content">
            <div className="card-icon">📋</div>
            <h3 className="card-title">Manage Jobs</h3>
            <p className="card-description">View and edit your active job postings</p>
             </div>
            <button className="card-button">View Jobs</button>
           
          </div>

          <div className="dashboard-card">
            <div className="card-content">
            <div className="card-icon">👥</div>
            <h3 className="card-title">Applications</h3>
            <p className="card-description">Review candidate applications and resumes</p>
             </div>
            <button className="card-button">View Applications</button>
           
          </div>

          <div className="dashboard-card">
            <div className="card-content">
            <div className="card-icon">🏢</div>
            <h3 className="card-title">Company Profile</h3>
            <p className="card-description">Update your company information</p>
            </div>
            <button className="card-button">Edit Profile</button>
            
          </div>
        </div>

        <div className="info-section">
          
          <h3 className="info-title">Overview</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">0</div>
              <div className="stat-label">Active Jobs</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">0</div>
              <div className="stat-label">Total Applications</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">0</div>
              <div className="stat-label">Candidates Hired</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployerDashboard;