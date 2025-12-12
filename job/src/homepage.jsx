// src/Homepage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Homepage.css';

function Homepage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    if (location.state?.user) {
      setUser(location.state.user);
    }
  }, [location.state]);

  // Dummy job data
  const jobs = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'Tech Solutions Inc.',
      location: 'Mumbai, Maharashtra',
      type: 'Full-Time',
      salary: '₹8-12 LPA',
      description: 'Looking for an experienced React developer to join our dynamic team. Must have 2+ years of experience.',
      postedDate: '2 days ago',
      logo: '💻'
    },
    {
      id: 2,
      title: 'Backend Developer',
      company: 'Digital Innovations',
      location: 'Bangalore, Karnataka',
      type: 'Full-Time',
      salary: '₹10-15 LPA',
      description: 'Seeking a Node.js expert to build scalable backend systems. Experience with MongoDB required.',
      postedDate: '3 days ago',
      logo: '⚙️'
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      company: 'StartUp Hub',
      location: 'Pune, Maharashtra',
      type: 'Full-Time',
      salary: '₹12-18 LPA',
      description: 'Join our startup as a full stack developer. Work with modern tech stack and shape the product.',
      postedDate: '5 days ago',
      logo: '🚀'
    },
    {
      id: 4,
      title: 'UI/UX Designer',
      company: 'Creative Studios',
      location: 'Delhi, NCR',
      type: 'Contract',
      salary: '₹6-10 LPA',
      description: 'Design beautiful and intuitive user interfaces. Portfolio required. Figma expertise is a must.',
      postedDate: '1 week ago',
      logo: '🎨'
    }
  ];

  const handleLogin = () => {
    setMenuOpen(false);
    navigate('/');
  };

  const handleLogout = () => {
    setUser(null);
    setMenuOpen(false);
    navigate('/');
  };

  const handleApplyNow = (jobId) => {
    if (user && user.role === 'employee') {
      // Logged in - show application form or save
      alert(`Application submitted for Job ID: ${jobId}`);
    } else {
      // Not logged in - redirect to login
      navigate('/', { state: { message: 'Please login to apply for jobs' } });
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Get user's first name from email or full name
  const getUserName = () => {
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  return (
    <div className="homepage">
      {/* Navigation Bar */}
      <nav className="navbar-home">
        <div className="nav-container">
          <div className="nav-brand" onClick={() => navigate('/')}>
            <span className="brand-logo">💼</span>
            <span className="brand-name">JobLink</span>
          </div>

          {/* Check if user is logged in as employee */}
          {user && user.role === 'employee' ? (
            // Logged-in User Bar
            <>
              <div className="user-bar-desktop">
                <span className="welcome-text">Hi {getUserName()}</span>
                <span className="user-divider">|</span>
                <a href="#applications" className="user-link">Applications</a>
                <span className="user-divider">|</span>
                <a href="#saved" className="user-link">Saved Jobs</a>
                <span className="user-divider">|</span>
                <button onClick={handleLogout} className="logout-link">Logout</button>
              </div>

              {/* Mobile Menu Button */}
              <button className="menu-toggle" onClick={toggleMenu}>
                <span className="menu-icon">☰</span>
              </button>
            </>
          ) : (
            // Guest Navigation
            <>
              <div className="nav-links-desktop">
                <a href="#jobs" className="nav-link">Jobs</a>
                <a href="#companies" className="nav-link">Companies</a>
                <a href="#about" className="nav-link">About</a>
                <a href="#contact" className="nav-link">Contact</a>
                <button onClick={() => navigate('/login')} className="login-btn">Login</button>
              </div>

              {/* Mobile Menu Button */}
              <button className="menu-toggle" onClick={toggleMenu}>
                <span className="menu-icon">☰</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="mobile-menu">
            {user && user.role === 'employee' ? (
              // Logged-in mobile menu
              <>
                <div className="mobile-user-info">
                  <span className="mobile-welcome">Hi {getUserName()}</span>
                </div>
                <a href="#applications" className="mobile-link" onClick={() => setMenuOpen(false)}>My Applications</a>
                <a href="#saved" className="mobile-link" onClick={() => setMenuOpen(false)}>Saved Jobs</a>
                <a href="#jobs" className="mobile-link" onClick={() => setMenuOpen(false)}>Browse Jobs</a>
                <a href="#profile" className="mobile-link" onClick={() => setMenuOpen(false)}>My Profile</a>
                <button onClick={handleLogout} className="mobile-logout-btn">Logout</button>
              </>
            ) : (
              // Guest mobile menu
              <>
                <a href="#jobs" className="mobile-link" onClick={() => setMenuOpen(false)}>Jobs</a>
                <a href="#companies" className="mobile-link" onClick={() => setMenuOpen(false)}>Companies</a>
                <a href="#about" className="mobile-link" onClick={() => setMenuOpen(false)}>About</a>
                <a href="#contact" className="mobile-link" onClick={() => setMenuOpen(false)}>Contact</a>
                <a href="#resources" className="mobile-link" onClick={() => setMenuOpen(false)}>Resources</a>
                <a href="#blog" className="mobile-link" onClick={() => setMenuOpen(false)}>Blog</a>
                <button  onClick={() => navigate('/')} className="mobile-login-btn">Login / Sign Up</button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            {user && user.role === 'employee' 
              ? `Welcome Back, ${getUserName()}!` 
              : 'Find Your Dream Job Today'}
          </h1>
          <p className="hero-subtitle">
            {user && user.role === 'employee'
              ? 'Discover new opportunities tailored for you'
              : 'Thousands of jobs waiting for you. Start your journey now!'}
          </p>
          <div className="search-box">
            <input
              type="text"
              placeholder="Job title, keywords..."
              className="search-input"
            />
            <input
              type="text"
              placeholder="Location"
              className="search-input"
            />
            <button className="search-btn">Search Jobs</button>
          </div>
          {!user && (
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-label">Apply for Jobs</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Build Resume</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Post Jobs</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Jobs Section */}
      <section className="jobs-section" id="jobs">
        <div className="section-header">
          <h2 className="section-title">
            {user && user.role === 'employee' ? 'Recommended Jobs' : 'Featured Jobs'}
          </h2>
          <p className="section-subtitle">
            {user && user.role === 'employee' 
              ? 'Jobs matching your profile and skills' 
              : 'Browse through our latest job openings'}
          </p>
        </div>

        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <div className="company-logo">{job.logo}</div>
                <div className="job-badge">{job.type}</div>
              </div>
              
              <h3 className="job-title">{job.title}</h3>
              <div className="company-info">
                <span className="company-name">{job.company}</span>
              </div>
              
              <div className="job-details">
                <div className="job-detail-item">
                  <span className="detail-icon">📍</span>
                  <span>{job.location}</span>
                </div>
                <div className="job-detail-item">
                  <span className="detail-icon">💰</span>
                  <span>{job.salary}</span>
                </div>
              </div>

              <p className="job-description">{job.description}</p>

              <div className="job-footer">
                <span className="posted-date">{job.postedDate}</span>
                {user && user.role === 'employee' ? (
                  <div className="job-actions">
                    <button 
                      className="save-btn"
                      onClick={() => alert('Job saved!')}
                      title="Save job"
                    >
                      ❤️
                    </button>
                    <button 
                      className="apply-btn"
                       onClick={() => navigate('/jobdetail')}
                    >
                      Apply Now
                    </button>
                  </div>
                ) : (
                  <button 
                    className="apply-btn"
                    onClick={() => navigate('/jobdetail')}
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-section">
          <button className="view-all-btn" onClick={() => user ? alert('Loading more jobs...') : handleLogin()}>
            View All Jobs
          </button>
        </div>
      </section>

      {/* Call to Action Section - Only show for guests */}
      {!user && (
        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Take the Next Step?</h2>
            <p className="cta-subtitle">Join thousands of professionals finding their dream jobs</p>
            <div className="cta-buttons">
              <button className="cta-btn primary" onClick={() => navigate('/register')}>
                Create Account
              </button>
              <button className="cta-btn secondary" onClick={() => navigate('/login')}>
                Login
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">JobLink</h3>
            <p className="footer-text">Connecting talent with opportunities</p>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">For Job Seekers</h4>
            <a href="#browse" className="footer-link">Browse Jobs</a>
            <a href="#companies" className="footer-link">Companies</a>
            <a href="#resources" className="footer-link">Career Resources</a>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">For Employers</h4>
            <a href="#post" className="footer-link">Post a Job</a>
            <a href="#pricing" className="footer-link">Pricing</a>
            <a href="#solutions" className="footer-link">Solutions</a>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">Company</h4>
            <a href="#about" className="footer-link">About Us</a>
            <a href="#contact" className="footer-link">Contact</a>
            <a href="#privacy" className="footer-link">Privacy Policy</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 JobLink. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Homepage;
  