import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store.js';
import { ToastContainer } from 'react-toastify';

// Import all pages and components
import App from './App.jsx';
import LandingPage from './components/pages/Landing/Landing.jsx';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PerformanceEntry from './components/pages/Performance/performanceEntry';
import AdminDashboard from './components/pages/AdminDashboard/AdminDashboard.jsx';
// Import all leave management components
import LeaveManagementEntry from './components/pages/LeaveManagement/LeaveManagementEntry';
import LeaveDashboard from './components/pages/LeaveManagement/LeaveDashboard';
import ApplyLeave from './components/pages/LeaveManagement/ApplyLeave';
import LeaveRequests from './components/pages/LeaveManagement/LeaveRequests';
import LeaveHistory from './components/pages/LeaveManagement/LeaveHistory';
import LeaveApproval from './components/pages/LeaveManagement/LeaveApproval';
import LeaveBalance from './components/pages/LeaveManagement/LeaveBalance';
import LeaveTypeManagement from './components/pages/LeaveManagement/LeaveTypeManagement';
import LeaveSettings from './components/pages/LeaveManagement/LeaveSettings';


import RecruitmentEntry from './components/pages/Recruitment/RecruitmentEntry.jsx';

const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* The root route is the Landing Page */}
      <Route path="/" element={<App />}>
        <Route index element={<LandingPage />} /> {/* Default landing page route */}
        
        {/* Auth routes */}
        <Route path="login" element={<Login />} />

        <Route path="register" element={<Register />} />

        {/* AdminDashboard routes */}
        <Route path="admin" element={<AdminDashboard/>} />
        {/* Performance Routes */}
        <Route path="performance" element={<PerformanceEntry />} />
        
        {/* Recruitment Routes */}
        <Route path="recruitment" element={<RecruitmentEntry />} />
        
        {/* Leave Management Routes */}
        <Route path="leave-management" element={<LeaveManagementEntry />} />
        <Route path="dashboard" element={<LeaveDashboard />} />
        <Route path="apply-leave" element={<ApplyLeave />} />
        <Route path="leave-requests" element={<LeaveRequests />} />
        <Route path="leave-history" element={<LeaveHistory />} />
        <Route path="leave-approval" element={<LeaveApproval />} />
        <Route path="leave-balance" element={<LeaveBalance />} />
        <Route path="leave-type" element={<LeaveTypeManagement />} />
        <Route path="leave-settings" element={<LeaveSettings />} />

      </Route>
    </>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={routes} />
      <ToastContainer />
    </Provider>
  </React.StrictMode>
);
