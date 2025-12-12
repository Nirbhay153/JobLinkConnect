// src/EmployerProfileSetup.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './profilesetup.css';

const API_URL = 'http://localhost:5000';

function EmployerProfileSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  const [formData, setFormData] = useState({
    companyName: '',
    employerName: '',
    phoneNumber: '',
    companyAddress: '',
    businessType: '',
    hrContactDetails: '',
    companyLogo: ''
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

  const handleSubmit = async () => {
    setError('');

    // Validation
    if (!formData.companyName || !formData.employerName || !formData.phoneNumber || 
        !formData.companyAddress || !formData.businessType) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/employer-profile`, {
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
        alert('Company profile created successfully. Redirecting to your employer dashboard...');
        navigate('/employerdash', { state: { user } });
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
          <h1 className="title">Employer Profile Setup</h1>
          <p className="subtitle">Set up your company profile to start hiring</p>
        </div>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <div className="form">
          <div className="input-group">
            <label className="label">Company Name *</label>
            <input
              type="text"
              name="companyName"
              placeholder="Enter company name"
              value={formData.companyName}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="input"
            />
          </div>

          <div className="input-group">
            <label className="label">Employer Name *</label>
            <input
              type="text"
              name="employerName"
              placeholder="Your full name"
              value={formData.employerName}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="input"
            />
          </div>

          <div className="input-group">
            <label className="label">Official Email *</label>
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
              placeholder="Company contact number"
              value={formData.phoneNumber}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="input"
            />
          </div>

          <div className="input-group">
            <label className="label">Company Address *</label>
            <textarea
              name="companyAddress"
              placeholder="Full company address"
              value={formData.companyAddress}
              onChange={handleChange}
              className="input textarea"
              rows="3"
            />
          </div>

          <div className="input-group">
            <label className="label">Business Type *</label>
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select business type</option>
              <option value="IT Services">IT Services</option>
              <option value="Software Development">Software Development</option>
              <option value="Consulting">Consulting</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Retail">Retail</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Finance">Finance</option>
              <option value="Startups">Startups</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="input-group">
            <label className="label">HR Contact Details (Optional)</label>
            <input
              type="text"
              name="hrContactDetails"
              placeholder="HR email or phone number"
              value={formData.hrContactDetails}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="input"
            />
          </div>

          <div className="input-group">
            <label className="label">Company Logo URL (Optional)</label>
            <input
              type="text"
              name="companyLogo"
              placeholder="Link to company logo"
              value={formData.companyLogo}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="input"
            />
            <small className="hint">Provide a shareable link to your company logo</small>
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

export default EmployerProfileSetup;