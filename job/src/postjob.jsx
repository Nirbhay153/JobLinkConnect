// src/PostJob.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SkillSelect from './components/SkillSelect';
import './PostJob.css';

const API_URL = 'http://localhost:5000';

function PostJob() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-Time',
    salary: '',
    description: '',
    requirements: '',
    skills: [],
    experience: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Check authentication in useEffect
  useEffect(() => {
    if (!user || user.role !== 'employer') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSkillsChange = (selectedSkills) => {
    setFormData({
      ...formData,
      skills: selectedSkills
    });
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.title || !formData.company || !formData.location || 
        !formData.salary || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employerId: user.id,
          ...formData
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setError('');
        // Clear form
        setFormData({
          title: '',
          company: '',
          location: '',
          type: 'Full-Time',
          salary: '',
          description: '',
          requirements: '',
          skills: [],
          experience: ''
        });
        
        setTimeout(() => {
          navigate('/employer/dashboard', { state: { user } });
        }, 2000);
      } else {
        setError(data.message || 'Failed to post job');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-container">
      <div className="post-job-header">
        <button 
          className="back-btn"
          onClick={() => navigate('/employer/dashboard', { state: { user } })}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="post-job-card">
        <div className="header">
          <h1 className="title">Post a New Job</h1>
          <p className="subtitle">Fill in the details to create a job listing</p>
        </div>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {success && (
          <div className="success-box">
            Job posted successfully! Redirecting to dashboard...
          </div>
        )}

        <div className="form">
          <div className="form-row">
            <div className="input-group">
              <label className="label">Job Title *</label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Senior Frontend Developer"
                value={formData.title}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div className="input-group">
              <label className="label">Company Name *</label>
              <input
                type="text"
                name="company"
                placeholder="Your company name"
                value={formData.company}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label className="label">Location *</label>
              <input
                type="text"
                name="location"
                placeholder="e.g., Mumbai, Maharashtra"
                value={formData.location}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div className="input-group">
              <label className="label">Job Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label className="label">Salary Range *</label>
              <input
                type="text"
                name="salary"
                placeholder="e.g., ₹8-12 LPA"
                value={formData.salary}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div className="input-group">
              <label className="label">Experience Required</label>
              <input
                type="text"
                name="experience"
                placeholder="e.g., 2-5 years"
                value={formData.experience}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div className="input-group">
            <label className="label">Job Description *</label>
            <textarea
              name="description"
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              value={formData.description}
              onChange={handleChange}
              className="input textarea"
              rows="5"
            />
          </div>

          <div className="input-group">
            <label className="label">Requirements</label>
            <textarea
              name="requirements"
              placeholder="List the qualifications, education, and other requirements..."
              value={formData.requirements}
              onChange={handleChange}
              className="input textarea"
              rows="4"
            />
          </div>

          <div className="input-group">
            <label className="label">Required Skills</label>
            <SkillSelect
              selectedSkills={formData.skills}
              onChange={handleSkillsChange}
              placeholder="Select required skills for this position..."
            />
            <small className="hint">Select skills that candidates should have</small>
          </div>

          <div className="button-group">
            <button
              onClick={() => navigate('/employer/dashboard', { state: { user } })}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`submit-button ${loading ? 'button-disabled' : ''}`}
            >
              {loading ? 'Posting Job...' : 'Post Job'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostJob;