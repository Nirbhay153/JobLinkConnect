// src/App.js - Main Router Component
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login';
import Register from './register';
import ForgotPassword from './forgotpass';
//import ResetPassword from './ResetPassword';
import RoleSelection from './roleselection';
//import EmployeeProfileSetup from './EmployeeProfileSetup';
//import EmployerProfileSetup from './EmployerProfileSetup';
//import JobSeekerDashboard from './JobSeekerDashboard';
//import EmployerDashboard from './EmployerDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/role-selection" element={<RoleSelection />} />
        {/*
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/employee-profile-setup" element={<EmployeeProfileSetup />} />
        <Route path="/employer-profile-setup" element={<EmployerProfileSetup />} />
        <Route path="/jobseeker/dashboard" element={<JobSeekerDashboard />} />
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />*/}
      </Routes>
    </Router>
  );
}

export default App;