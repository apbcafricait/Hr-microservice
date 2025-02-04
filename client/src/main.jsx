import React from 'react';
import './index.css';
import App from './App.jsx';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store.js';
import { ToastContainer } from 'react-toastify';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PerformanceEntry from './components/pages/Performance/performanceEntry';

// Import all leave management components
import LeaveManagementEntry from './components/pages/LeaveManagement/LeaveManagementEntry';
import LeaveDashboard from './components/pages/LeaveManagement/LeaveDashboard';
import ApplyLeave from './components/pages/LeaveManagement/ApplyLeave';
import LeaveRequests from './components/pages/LeaveManagement/LeaveRequests';
import LeaveHistory from './components/pages/LeaveManagement/LeaveHistory';
import LeaveApprovl from './components/pages/LeaveManagement/LeaveApproval';
import LeaveBalance from './components/pages/LeaveManagement/LeaveBalance';
import LeaveTypeManagement from './components/pages/LeaveManagement/LeaveTypeManagement'; 
import LeaveSettings from './components/pages/LeaveManagement/LeaveSettings.jsx';


// Import all recruitment components
import RecruitmentEntry from './components/pages/Recruitment/RecruitmentEntry.jsx'

const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Routing for Performance Pages */}
        <Route path="/Performance" element={<PerformanceEntry />} />
        {/* Routing for Recruitment Pages */}
        <Route path="/recruitment" element={<RecruitmentEntry />} />

        // Leave management routes
      <Route path="/Leave-Management" element={<LeaveManagementEntry />} />
      <Route path="/dashboard" element={<LeaveDashboard />} />
      <Route path="/apply-leave" element={<ApplyLeave />} />
      <Route path="/leave-requests" element={<LeaveRequests />} />
      <Route path="/leave-history" element={<LeaveHistory />} />
      <Route path="/leave-approval" element={<LeaveApprovl />} />
      <Route path="/leave-balance" element={<LeaveBalance />} />
      <Route path="/leave-type-management" element={<LeaveTypeManagement />} />
      <Route path="/leave-settings" element={<LeaveSettings />} />
      
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