// src/EmployerDashboard.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const API_URL = 'http://localhost:5000';

function EmployerDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    candidatesHired: 0
  });

  const [loading, setLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    if (!user) {
      navigate('/');
    } else {
      fetchDashboardStats();
    }
  }, [user, navigate]);

  const fetchDashboardStats = async () => {
    if (!user) return;

    try {
      // Fetch employer's jobs
      const jobsResponse = await fetch(`${API_URL}/employer/${user.id}/jobs`);
      const jobsData = await jobsResponse.json();

      if (jobsData.success) {
        const activeJobs = jobsData.jobs.filter(job => job.status === 'active').length;
        
        // Count total applications across all jobs
        let totalApps = 0;
        for (const job of jobsData.jobs) {
          const appsResponse = await fetch(`${API_URL}/job/${job._id}/applications`);
          const appsData = await appsResponse.json();
          if (appsData.success) {
            totalApps += appsData.applications.length;
          }
        }

        setStats({
          activeJobs: activeJobs,
          totalApplications: totalApps,
          candidatesHired: 0 // Can be calculated based on accepted applications
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handlePostJob = () => {
    navigate('/postjob', { state: { user } });
  };

  const handleManageJobs = () => {
    navigate('/managejobs', { state: { user } });
  };

  const handleViewApplications = () => {
    navigate('/viewapplications', { state: { user } });
  };

  const handleEditProfile = () => {
    navigate('/employerprofileedit', { state: { user } });
  };

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="nav-content">
          <h2 className="nav-title">JobLink - Employer</h2>
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
            <div className="card-icon">➕</div>
            <h3 className="card-title">Post New Job</h3>
            <p className="card-description">Create and publish job openings for candidates</p>
            <button className="card-button" onClick={handlePostJob}>
              Post Job
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📋</div>
            <h3 className="card-title">Manage Jobs</h3>
            <p className="card-description">View and edit your active job postings</p>
            <button className="card-button" onClick={handleManageJobs}>
              View Jobs
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">👥</div>
            <h3 className="card-title">Applications</h3>
            <p className="card-description">Review candidate applications and resumes</p>
            <button className="card-button" onClick={handleViewApplications}>
              View Applications
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🏢</div>
            <h3 className="card-title">Company Profile</h3>
            <p className="card-description">Update your company information</p>
            <button className="card-button" onClick={handleEditProfile}>
              Edit Profile
            </button>
          </div>
        </div>

        <div className="info-section">
          <h3 className="info-title">Overview</h3>
          {loading ? (
            <div className="loading-stats">Loading statistics...</div>
          ) : (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{stats.activeJobs}</div>
                <div className="stat-label">Active Jobs</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.totalApplications}</div>
                <div className="stat-label">Total Applications</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.candidatesHired}</div>
                <div className="stat-label">Candidates Hired</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployerDashboard;