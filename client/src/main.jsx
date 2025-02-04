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
import PerformanceEntry from './components/pages/Performance/PerformanceEntry';
import LeaveManagementEntry from './components/pages/LeaveManagement/LeaveManagementEntry';
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