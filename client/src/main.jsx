import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Import leave from admin dashboard
import AssignLeave from './components/pages/AdminDashboard/Leave Dashboard/AssignLeave.jsx';
import LeaveList from './components/pages/AdminDashboard/Leave Dashboard/LeaveList.jsx';
import LeaveApply from './components/pages/AdminDashboard/Leave Dashboard/LeaveApply.jsx';
import MyLeave from './components/pages/AdminDashboard/Leave Dashboard/MyLeave.jsx';
import Time from './components/pages/AdminDashboard/Time.jsx';

// Import all pages and components
import App from './App.jsx';
import LandingPage from './components/pages/Landing/Landing.jsx';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import NotAuthorized from './components/common/NotAuthorized'; // Create this component for unauthorized access

// Admin dashboard components
import AdminDashboard from './components/pages/AdminDashboard/AdminDashboard.jsx';
import CreateOrganization from './components/pages/AdminDashboard/CreateOrganization.jsx';
import ViewOrganization from './components/pages/AdminDashboard/ViewOrganizations.jsx';

// Manager dashboard components
import ManagerDashboard from './components/pages/ManagerDashboard/ManagerDashboard.jsx';

// Employee dashboard components
import EmployeeDashboard from './components/pages/EmployeeDashboard/EmployeeDashboard.jsx';
import EmployeeProfile from './components/pages/EmployeeDashboard/EmployeeProfile.jsx';
import PersonalDetails from './components/pages/EmployeeDashboard/PersonalDetails.jsx';
// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userInfo } = store.getState().auth;
  console.log(userInfo, "Logged in user")

 


  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  const userRole = userInfo.role;

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/not-authorized" />;
  }

  return children;
};

// Router Configuration
const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public Routes */}
      <Route index element={<LandingPage />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="not-authorized" element={<NotAuthorized />} />

      {/* Admin Routes */}
      <Route
        path="admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="admin/create-organization"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CreateOrganization />
          </ProtectedRoute>
        }
      />
      <Route
        path="admin/view-organization"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ViewOrganization />
          </ProtectedRoute>
        }
      />

      {/* Manager Routes */}
      <Route
        path="manager"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Employee Routes */}
      <Route
        path="employee"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="employee-profile"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <EmployeeProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="personal-details"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <PersonalDetails />
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={routes} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Provider>
  </React.StrictMode>
);