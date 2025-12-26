// src/SavedJobs.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './savedjobs.css';

const API_URL = 'http://localhost:5000';

function SavedJobs() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'employee') {
      navigate('/');
    } else {
      fetchSavedJobs();
    }
  }, [user, navigate]);

  const fetchSavedJobs = async () => {
    try {
      const response = await fetch(`${API_URL}/user/${user.id}/saved-jobs`);
      const data = await response.json();

      if (data.success) {
        setSavedJobs(data.savedJobs);
      } else {
        setError('Failed to fetch saved jobs');
      }
    } catch (err) {
      setError('Error loading saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSaved = async (savedJobId) => {
    if (!window.confirm('Remove this job from saved?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/saved-jobs/${savedJobId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        alert('Job removed from saved');
        fetchSavedJobs(); // Refresh list
      } else {
        alert('Failed to remove job');
      }
    } catch (err) {
      alert('Error removing job');
    }
  };

  const getJobLogo = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('frontend') || titleLower.includes('react')) return '💻';
    if (titleLower.includes('backend') || titleLower.includes('node')) return '⚙️';
    if (titleLower.includes('full stack') || titleLower.includes('fullstack')) return '🚀';
    if (titleLower.includes('design') || titleLower.includes('ui/ux')) return '🎨';
    if (titleLower.includes('data') || titleLower.includes('analyst')) return '📊';
    if (titleLower.includes('mobile') || titleLower.includes('android') || titleLower.includes('ios')) return '📱';
    if (titleLower.includes('devops') || titleLower.includes('cloud')) return '☁️';
    if (titleLower.includes('manager') || titleLower.includes('lead')) return '👔';
    return '💼';
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const saved = new Date(date);
    const diffTime = Math.abs(now - saved);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (!user || user.role !== 'employee') {
    return null;
  }

  return (
    <div className="saved-jobs-container">
      <div className="saved-jobs-header">
        <button 
          className="back-btn"
          onClick={() => navigate('/', { state: { user } })}
        >
          ← Back to Homepage
        </button>
      </div>

      <div className="saved-jobs-content">
        <h1 className="page-title">Saved Jobs</h1>
        <p className="page-subtitle">Jobs you've bookmarked for later</p>

        {error && <div className="error-box">{error}</div>}

        {loading ? (
          <div className="loading-message">Loading saved jobs...</div>
        ) : savedJobs.length === 0 ? (
          <div className="no-saved-box">
            <div className="no-saved-icon">❤️</div>
            <h3>No Saved Jobs Yet</h3>
            <p>Start saving jobs that interest you!</p>
            <button 
              className="browse-jobs-btn"
              onClick={() => navigate('/home', { state: { user } })}
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="saved-jobs-grid">
            {savedJobs.map((savedJob) => {
              const job = savedJob.jobId;
              if (!job) return null;

              return (
                <div key={savedJob._id} className="saved-job-card">
                  <div className="card-header">
                    <div className="company-logo">{getJobLogo(job.title)}</div>
                    <div className="job-badge">{job.type}</div>
                  </div>
                  
                  <h3 
                    className="job-title"
                    onClick={() => navigate(`/job/${job._id}`, { state: { user } })}
                  >
                    {job.title}
                  </h3>
                  <p className="company-name">{job.company}</p>
                  
                  <div className="job-details">
                    <div className="detail-item">
                      <span className="icon">📍</span>
                      <span>{job.location}</span>
                    </div>
                    <div className="detail-item">
                      <span className="icon">💰</span>
                      <span>{job.salary}</span>
                    </div>
                  </div>

                  <p className="job-description">
                    {job.description.length > 100 
                      ? job.description.substring(0, 100) + '...' 
                      : job.description}
                  </p>

                  {job.skills && job.skills.length > 0 && (
                    <div className="skills-preview">
                      {job.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="skill-tag-small">{skill}</span>
                      ))}
                      {job.skills.length > 3 && (
                        <span className="skill-tag-small more">+{job.skills.length - 3}</span>
                      )}
                    </div>
                  )}

                  <div className="card-footer">
                    <span className="saved-date">
                      Saved {getTimeAgo(savedJob.savedAt)}
                    </span>
                    <div className="card-actions">
                      <button 
                        className="view-btn"
                        onClick={() => navigate(`/job/${job._id}`, { state: { user } })}
                      >
                        View Details
                      </button>
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveSaved(savedJob._id)}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedJobs;