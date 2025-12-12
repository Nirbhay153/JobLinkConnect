// src/JobSeekerDashboard.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './dashboard.css';

function JobSeekerDashboard() {
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
          <h2 className="nav-title">Job Seeker</h2>
          <div className="nav-actions">
            <span className="user-email">{user.email}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome to Your Dashboard! 🎉</h1>
          <p className="welcome-subtitle">Start your job search journey</p>
        </div>

        <div className="cards-grid">
          
          <div className="dashboard-card">
            <div className="card-content">
            <div className="card-icon">🔍</div>
            <h3 className="card-title">Search Jobs</h3>
            <p className="card-description">Find your dream job from thousands of opportunities</p>
            </div>
            <button className="card-button">Browse Jobs</button>
          </div>
          

          <div className="dashboard-card">
            <div className="card-content">
            <div className="card-icon">👤</div>
            <h3 className="card-title">My Profile</h3>
            <p className="card-description">View and update your professional profile</p>
            
            </div><button className="card-button">View Profile</button>
            
          </div>

          <div className="dashboard-card">
            <div className="card-content">
            <div className="card-icon">✉️</div>
            <h3 className="card-title">My Applications</h3>
            <p className="card-description">Track your job applications and their status</p>
            </div><button className="card-button">View Applications</button>
            
          </div>
           <div className="dashboard-card">
            <div className="card-content">
            <div className="card-icon">📄</div>
            <h3 className="card-title">My Resume</h3>
            <p className="card-description">View And Build personal resume</p>
            </div><button className="card-button">View </button>
            
          </div>
         
          
        </div>

        <div className="info-section">
          <h3 className="info-title">Quick Stats</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">0</div>
              <div className="stat-label">Applications Sent</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">0</div>
              <div className="stat-label">Saved Jobs</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">0</div>
              <div className="stat-label">Profile Views</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobSeekerDashboard;