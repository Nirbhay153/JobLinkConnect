// src/ManageJobs.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './managejobs.css';

const API_URL = 'http://localhost:5000';

function ManageJobs() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'employer') {
      navigate('/');
    } else {
      fetchJobs();
    }
  }, [user, navigate]);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_URL}/employer/${user.id}/jobs`);
      const data = await response.json();

      if (data.success) {
        setJobs(data.jobs);
      } else {
        setError('Failed to fetch jobs');
      }
    } catch (err) {
      setError('Error loading jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/jobs/${jobId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        alert('Job deleted successfully');
        fetchJobs(); // Refresh list
      } else {
        alert('Failed to delete job');
      }
    } catch (err) {
      alert('Error deleting job');
    }
  };

  const handleToggleStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'closed' : 'active';

    try {
      const response = await fetch(`${API_URL}/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Job ${newStatus === 'active' ? 'activated' : 'closed'} successfully`);
        fetchJobs(); // Refresh list
      } else {
        alert('Failed to update job status');
      }
    } catch (err) {
      alert('Error updating job status');
    }
  };

  const handleViewApplications = (jobId) => {
    navigate(`/job-applications/${jobId}`, { state: { user } });
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (!user || user.role !== 'employer') {
    return null;
  }

  return (
    <div className="manage-jobs-container">
      <div className="manage-jobs-header">
        <button 
          className="back-btn"
          onClick={() => navigate('/employerdash', { state: { user } })}
        >
          ← Back to Dashboard
        </button>
        <button 
          className="post-new-btn"
          onClick={() => navigate('/post-job', { state: { user } })}
        >
          ➕ Post New Job
        </button>
      </div>

      <div className="manage-jobs-content">
        <h1 className="page-title">Manage Your Jobs</h1>
        <p className="page-subtitle">View, edit, and manage all your job postings</p>

        {error && <div className="error-box">{error}</div>}

        {loading ? (
          <div className="loading-message">Loading your jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="no-jobs-box">
            <div className="no-jobs-icon">📋</div>
            <h3>No Jobs Posted Yet</h3>
            <p>Start by posting your first job opening</p>
            <button 
              className="post-first-job-btn"
              onClick={() => navigate('/post-job', { state: { user } })}
            >
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className="jobs-list">
            {jobs.map((job) => (
              <div key={job._id} className="job-item">
                <div className="job-item-header">
                  <div>
                    <h3 className="job-item-title">{job.title}</h3>
                    <p className="job-item-company">{job.company}</p>
                  </div>
                  <div className={`status-badge ${job.status}`}>
                    {job.status === 'active' ? '✓ Active' : '✕ Closed'}
                  </div>
                </div>

                <div className="job-item-details">
                  <span className="detail-item">📍 {job.location}</span>
                  <span className="detail-item">💼 {job.type}</span>
                  <span className="detail-item">💰 {job.salary}</span>
                  <span className="detail-item">📅 Posted {getTimeAgo(job.createdAt)}</span>
                </div>

                <p className="job-item-description">
                  {job.description.substring(0, 150)}...
                </p>

                {job.skills && job.skills.length > 0 && (
                  <div className="job-item-skills">
                    {job.skills.slice(0, 5).map((skill, index) => (
                      <span key={index} className="skill-tag-small">{skill}</span>
                    ))}
                    {job.skills.length > 5 && (
                      <span className="skill-tag-small more">+{job.skills.length - 5} more</span>
                    )}
                  </div>
                )}

                <div className="job-item-actions">
                  <button 
                    className="action-btn view"
                    onClick={() => navigate(`/job/${job._id}`, { state: { user } })}
                  >
                    👁️ View
                  </button>
                  <button 
                    className="action-btn applications"
                    onClick={() => handleViewApplications(job._id)}
                  >
                    👥 Applications
                  </button>
                  <button 
                    className="action-btn toggle"
                    onClick={() => handleToggleStatus(job._id, job.status)}
                  >
                    {job.status === 'active' ? '⏸️ Close' : '▶️ Activate'}
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDeleteJob(job._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageJobs;