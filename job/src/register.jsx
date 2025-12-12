// src/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import SkillSelect from './components/SkillSelect';

const API_URL = 'http://localhost:5000';

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    setError('');
    setSuccess(false);

    // Client-side validation
    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, confirmPassword })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setError('');
        console.log('Registration successful:', data.user);
        
        // Clear form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1 className="title">Create Account</h1>
          <p className="subtitle">Sign up for a new account</p>
        </div>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {success && (
          <div className="success-box">
            Registration successful! Redirecting to login...
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
            <label className="label">Password</label>
            <input
              type="password"
              placeholder="Create a password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input"
            />
          </div>

          <div className="input-group">
            <label className="label">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input"
            />
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className={`button ${loading ? 'button-disabled' : ''}`}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <p className="signup-text">
            Already have an account? <Link to="/" className="signup-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;