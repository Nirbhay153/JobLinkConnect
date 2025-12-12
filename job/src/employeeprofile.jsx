// src/EmployeeProfileSetup.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import SkillSelect from './components/SkillSelect';


import './ProfileSetup.css';

const API_URL = 'http://localhost:5000';

function EmployeeProfileSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    skills: [],
    qualification: '',
    experience: '',
    resume: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/');
    return null;
  }

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

    // Validation
    if (!formData.fullName || !formData.phoneNumber || !formData.qualification) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.skills.length === 0) {
      setError('Please select at least one skill');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/employee-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          ...formData
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Show success message and redirect
        alert('Profile setup completed successfully. Redirecting to your dashboard...');
        navigate('/', { state: { user } });
      } else {
        setError(data.message || 'Failed to create profile');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div className="container">
      <div className="profile-card">
        <div className="header">
          <h1 className="title">Job Seeker Profile Setup</h1>
          <p className="subtitle">Complete your profile to start applying for jobs</p>
        </div>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <div className="form">
          <div className="input-group">
            <label className="label">Full Name *</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="input"
            />
          </div>

          <div className="input-group">
            <label className="label">Email *</label>
            <input
              type="email"
              value={user.email}
              className="input"
              disabled
              style={{ backgroundColor: '#f9fafb', cursor: 'not-allowed' }}
            />
          </div>

          <div className="input-group">
            <label className="label">Phone Number *</label>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="input"
            />
          </div>

          <div className="input-group">
            <label className="label">Skills *</label>
            <SkillSelect
              selectedSkills={formData.skills}
              onChange={handleSkillsChange}
              placeholder="Select your skills from categories..."
            />
            <small className="hint">Choose multiple skills from different categories</small>
          </div>

          <div className="input-group">
            <label className="label">Qualification *</label>
            <select
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select qualification</option>
              <option value="High School">High School</option>
              <option value="Diploma">Diploma</option>
              <option value="Bachelor's Degree">Bachelor's Degree</option>
              <option value="Master's Degree">Master's Degree</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          <div className="input-group">
            <label className="label">Experience (Optional)</label>
            <textarea
              name="experience"
              placeholder="Brief description of your work experience"
              value={formData.experience}
              onChange={handleChange}
              className="input textarea"
              rows="4"
            />
          </div>

         

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`submit-button ${loading ? 'button-disabled' : ''}`}
          >
            {loading ? 'Creating Profile...' : 'Complete Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeProfileSetup;