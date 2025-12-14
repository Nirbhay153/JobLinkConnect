// src/ViewApplications.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './viewapp.css';

const API_URL = 'http://localhost:5000';

function ViewApplications() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'employer') {
      navigate('/');
    } else {
      fetchEmployerJobs();
    }
  }, [user, navigate]);

  const fetchEmployerJobs = async () => {
    try {
      const response = await fetch(`${API_URL}/employer/${user.id}/jobs`);
      const data = await response.json();

      if (data.success && data.jobs.length > 0) {
        setJobs(data.jobs);
        // Auto-select first job
        fetchApplicationsForJob(data.jobs[0]._id);
        setSelectedJob(data.jobs[0]);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationsForJob = async (jobId) => {
    try {
      const response = await fetch(`${API_URL}/job/${jobId}/applications`);
      const data = await response.json();

      if (data.success) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    fetchApplicationsForJob(job._id);
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/applications/${applicationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Application ${newStatus}!`);
        fetchApplicationsForJob(selectedJob._id);
      } else {
        alert('Failed to update application');
      }
    } catch (err) {
      alert('Error updating application');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#fef3c7',
      reviewed: '#dbeafe',
      shortlisted: '#d1fae5',
      rejected: '#fee2e2',
      accepted: '#d1fae5'
    };
    return colors[status] || '#f3f4f6';
  };

  if (!user || user.role !== 'employer') {
    return null;
  }

  return (
    <div className="applications-container">
      <div className="applications-header">
        <button 
          onClick={() => navigate('/employer/dashboard', { state: { user } })}
          className="back-btn"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="applications-content">
        <h1 className="page-title">Applications</h1>
        <p className="page-subtitle">Review and manage candidate applications</p>

        {loading ? (
          <div className="loading-message">Loading applications...</div>
        ) : jobs.length === 0 ? (
          <div className="no-jobs-message">
            <p>No jobs posted yet. Post a job to start receiving applications.</p>
          </div>
        ) : (
          <div className="applications-layout">
            {/* Jobs Sidebar */}
            <div className="jobs-sidebar">
              <h3 className="sidebar-title">Your Jobs</h3>
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className={`sidebar-job ${selectedJob?._id === job._id ? 'active' : ''}`}
                  onClick={() => handleJobSelect(job)}
                >
                  <h4>{job.title}</h4>
                  <p>{job.company}</p>
                </div>
              ))}
            </div>

            {/* Applications List */}
            <div className="applications-main">
              {selectedJob && (
                <>
                  <h2 className="selected-job-title">{selectedJob.title}</h2>
                  <p className="applications-count">
                    {applications.length} application{applications.length !== 1 ? 's' : ''}
                  </p>

                  {applications.length === 0 ? (
                    <div className="no-applications">
                      No applications received yet for this job.
                    </div>
                  ) : (
                    <div className="applications-list">
                      {applications.map((app) => (
                        <div key={app._id} className="application-card">
                          <div className="application-header">
                            <div>
                              <h4 className="applicant-email">
                                {app.applicantId?.email || 'Unknown applicant'}
                              </h4>
                              <p className="applied-date">
                                Applied: {new Date(app.appliedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div
                              className="application-status"
                              style={{ backgroundColor: getStatusColor(app.status) }}
                            >
                              {app.status}
                            </div>
                          </div>

                          {app.coverLetter && (
                            <div className="cover-letter">
                              <h5>Cover Letter:</h5>
                              <p>{app.coverLetter}</p>
                            </div>
                          )}

                          <div className="application-actions">
                            {app.status === 'pending' && (
                              <button
                                onClick={() => handleUpdateStatus(app._id, 'reviewed')}
                                className="status-btn reviewed"
                              >
                                Mark as Reviewed
                              </button>
                            )}
                            {(app.status === 'pending' || app.status === 'reviewed') && (
                              <button
                                onClick={() => handleUpdateStatus(app._id, 'shortlisted')}
                                className="status-btn shortlisted"
                              >
                                Shortlist
                              </button>
                            )}
                            {app.status === 'shortlisted' && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(app._id, 'accepted')}
                                  className="status-btn accepted"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(app._id, 'rejected')}
                                  className="status-btn rejected"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {app.status === 'pending' && (
                              <button
                                onClick={() => handleUpdateStatus(app._id, 'rejected')}
                                className="status-btn rejected"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewApplications;