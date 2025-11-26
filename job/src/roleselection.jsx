// src/RoleSelection.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './roleselection.css';

const API_URL = 'http://localhost:5000';

function roleselection() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  const [selectedRole, setSelectedRole] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/');
    return null;
  }

  const handleRoleSelect = async () => {
    if (!selectedRole) {
      setError('Please select a role to continue');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/set-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id, role: selectedRole })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to profile setup based on role
        if (selectedRole === 'employee') {
          navigate('/employee-profile-setup', { state: { user: data.user } });
        } else {
          navigate('/employer-profile-setup', { state: { user: data.user } });
        }
      } else {
        setError(data.message || 'Failed to set role');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
    console.log("Sending to backend:", {
  userId: user.id,
  role: selectedRole
});
  };

  return (
    <div className="container">
      <div className="role-card">
        <div className="header">
          <h1 className="title">Welcome! 👋</h1>
          <p className="subtitle">Please choose your role to continue</p>
        </div>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <div className="roles-container">
          <div
            className={`role-option ${selectedRole === 'employee' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('employee')}
          >
            <div className="role-icon">👤</div>
            <h3 className="role-title">Employee</h3>
            <p className="role-description">I'm looking for job opportunities</p>
            <ul className="role-features">
              <li>Search and apply for jobs</li>
              <li>Create professional profile</li>
              <li>Upload resume</li>
              <li>Track applications</li>
            </ul>
          </div>

          <div
            className={`role-option ${selectedRole === 'employer' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('employer')}
          >
            <div className="role-icon">🏢</div>
            <h3 className="role-title">Employer</h3>
            <p className="role-description">I'm hiring talented professionals</p>
            <ul className="role-features">
              <li>Post job openings</li>
              <li>Find qualified candidates</li>
              <li>Manage applications</li>
              <li>Build your company profile</li>
            </ul>
          </div>
        </div>

        <button
          onClick={handleRoleSelect}
          disabled={loading || !selectedRole}
          className={`continue-button ${(loading || !selectedRole) ? 'button-disabled' : ''}`}
        >
          {loading ? 'Setting up...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}

export default roleselection;