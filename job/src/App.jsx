// src/App.js - Main Router Component
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login';
import Register from './register';
import ForgotPassword from './forgotpass';
//import ResetPassword from './ResetPassword';
import RoleSelection from './roleselection';
import EmployeeProfileSetup from './employeeprofile';
import EmployerProfileSetup from './employerprofile';
import JobSeekerDashboard from './employeedash';
import Homepage from './homepage';
import PostJob from './postjob';
import JobDetail from './jobdetail';
import ManageJobs from './managejobs';
import ViewApplications from './viewapp';

import EmployerDashboard from './employerdash';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/roleselection" element={<RoleSelection />} />
        <Route path="/employerprofile" element={<EmployerProfileSetup/>} />
        <Route path="/employeeprofile" element={<EmployeeProfileSetup />} />
        <Route path="/employeedash" element={<JobSeekerDashboard />} />
        <Route path="/employerdash" element={<EmployerDashboard/>} />
        <Route path="/postjob" element={<PostJob />} />
        <Route path="/jobdetail" element={<JobDetail />} />
        <Route path="/manage-jobs" element={<ManageJobs />} />
        <Route path="/view-applications" element={<ViewApplications />} />
        {/*
        <Route path="/reset-password" element={<ResetPassword />} />
        
        
        
        */}
      </Routes>
    </Router>
  );
}

export default App;