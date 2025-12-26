// src/JobDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './jobdetail.css';

const API_URL = 'http://localhost:5000';

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/jobs/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setJob(data.job);
      } else {
        setError('Job not found');
      }
    } catch (err) {
      setError('Error loading job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/', { state: { message: 'Please login to apply' } });
      return;
    }

    setApplying(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: id,
          applicantId: user.id,
          coverLetter
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Application submitted successfully!');
        setShowApplyForm(false);
        setCoverLetter('');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error submitting application');
    } finally {
      setApplying(false);
    }
  };

  const handleSaveJob = async () => {
    if (!user) {
      navigate('/');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/saved-jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          jobId: id
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Job saved successfully!');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Error saving job');
    }
  };

  if (loading) {
    return <div className="loading">Loading job details...</div>;
  }

  if (!job) {
    return <div className="error">Job not found</div>;
  }

  return (
    <div className="job-detail-container">
      <div className="job-detail-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
      </div>

      <div className="job-detail-card">
        <div className="job-header">
          <div>
            <div className="job-badge">{job.type}</div>
            <h1 className="job-title">{job.title}</h1>
            <p className="company-name">{job.company}</p>
          </div>
          <div className="company-logo">💼</div>
        </div>

        <div className="job-meta">
          <div className="meta-item">
            <span className="meta-icon">📍</span>
            <span>{job.location}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">💰</span>
            <span>{job.salary}</span>
          </div>
          {job.experience && (
            <div className="meta-item">
              <span className="meta-icon">⏱️</span>
              <span>{job.experience}</span>
            </div>
          )}
          <div className="meta-item">
            <span className="meta-icon">📅</span>
            <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {success && <div className="success-box">{success}</div>}
        {error && <div className="error-box">{error}</div>}

        <div className="action-buttons">
          {!showApplyForm ? (
            <>
              <button onClick={() => setShowApplyForm(true)} className="apply-btn-large">
                Apply Now
              </button>
              <button onClick={handleSaveJob} className="save-btn-large">
                ❤️ Save Job
              </button>
            </>
          ) : (
            <div className="apply-form">
              <h3>Apply for this position</h3>
              <textarea
                placeholder="Write a cover letter (optional)"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows="5"
                className="cover-letter-input"
              />
              <div className="apply-form-buttons">
                <button onClick={() => setShowApplyForm(false)} className="cancel-btn">
                  Cancel
                </button>
                <button onClick={handleApply} disabled={applying} className="submit-btn">
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="job-section">
          <h2 className="section-title">Job Description</h2>
          <p className="section-content">{job.description}</p>
        </div>

        {job.requirements && (
          <div className="job-section">
            <h2 className="section-title">Requirements</h2>
            <p className="section-content">{job.requirements}</p>
          </div>
        )}

        {job.skills && job.skills.length > 0 && (
          <div className="job-section">
            <h2 className="section-title">Required Skills</h2>
            <div className="skills-list">
              {job.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobDetail;