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
import PerformanceEntry from './components/pages/Performance/PerformanceEntry';
import LeaveManagementEntry from './components/pages/LeaveManagement/LeaveManagementEntry';
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
        
        {/* Performance Routes */}
        <Route path="performance" element={<PerformanceEntry />} />
        
        {/* Recruitment Routes */}
        <Route path="recruitment" element={<RecruitmentEntry />} />
        
        {/* Leave Management Routes */}
        <Route path="leave-management" element={<LeaveManagementEntry />} />
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
