// src/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const API_URL = 'http://localhost:5000';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogin = async () => {
    setError('');
    setSuccess(false);

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setError('');
        console.log('Login successful:', data.user);
        
        // Check profile completion status and role
        const user = data.user;
        
        // Small delay to show success message
        setTimeout(() => {
          if (!user.profileCompleted) {
            // New user - redirect to role selection
            console.log('Redirecting to role selection...');
            navigate('/roleselection', { state: { user } });
          } else {
            // Existing user - redirect to appropriate dashboard
            if (user.role === 'employee') {
              console.log('Redirecting to job seeker dashboard...');
              navigate('/jobseeker/dashboard', { state: { user } });
            } else if (user.role === 'employer') {
              console.log('Redirecting to employer dashboard...');
              navigate('/employer/dashboard', { state: { user } });
            } else {
              setError('Invalid user role');
            }
          }
        }, 1000);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error. Make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && email && password) {
      handleLogin();
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1 className="title">Welcome Back</h1>
          <p className="subtitle">Sign in to your account</p>
        </div>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {success && (
          <div className="success-box">
            Login successful! Redirecting...
          </div>
        )}

        <div className="form">
          <div className="input-group">
            <label className="label">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input"
            />
          </div>

          <div className="input-group">
            <div className="label-row">
              <label className="label">Password</label>
              <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
            </div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className={`button ${(loading || !email || !password) ? 'button-disabled' : ''}`}
            onMouseOver={(e) => {
              if (!loading && email && password) e.target.style.backgroundColor = '#0056b3';
            }}
            onMouseOut={(e) => {
              if (!loading && email && password) e.target.style.backgroundColor = '#007bff';
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="signup-text">
            Don't have an account? <Link to="/register" className="signup-link">Sign up</Link>
          </p>
        </div>

        {!success && (
          <div className="test-credentials">
            <p className="test-title">Testing Instructions:</p>
            <p className="test-info">1. Register a new account first</p>
            <p className="test-info">2. Login with your credentials</p>
            <p className="test-info">3. You'll be redirected based on profile status</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login; 