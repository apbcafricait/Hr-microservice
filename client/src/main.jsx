import React from 'react';
import './index.css';

import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import SettingsProvider
import { SettingsProvider } from './context/SettingsContext.jsx';
// layout components
import Features from './components/Layouts/Features.jsx';
import Benefits from './components/Layouts/Benefits';
import Pricing from './components/Layouts/Pricing';
import Contact from './components/Layouts/Contact';
import Careers from './components/Layouts/Careers.jsx';
import HelpCenter from './components/Layouts/HelpCenter.jsx';
import FAQ from './components/Layouts/FAQ.jsx';

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
import NotAuthorized from './components/common/NotAuthorized';

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
import Subscribe from './components/common/Subscribe.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public Routes */}
      <Route index element={<LandingPage />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="not-authorized" element={<NotAuthorized />} />
      <Route path="subscribe" element={<Subscribe />} />
      <Route path="careers" element={<Careers/>} />
      <Route path="help" element={<HelpCenter />} />
      <Route path="faq" element={<FAQ />} />

      {/* Layout components routes*/}
        <Route path="features" element={<Features />} />
        <Route path="benefits" element={<Benefits />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="contact" element={<Contact />} />
        

      {/* Admin Routes */}
      <Route
        path="admin"
        element={
          <ProtectedRoute allowedRoles={['admin']} requireSubscription={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      >

        {/* Nested Leave Routes */}
        <Route
          path="assign-leave"
          element={
            <ProtectedRoute allowedRoles={['admin']} requireSubscription={true}>
              <AssignLeave />
            </ProtectedRoute>
          }
        />
        <Route
          path="leave-list"
          element={
            <ProtectedRoute allowedRoles={['admin']} requireSubscription={true}>
              <LeaveList />
            </ProtectedRoute>
          }
        />
        <Route
          path="leave-apply"
          element={
            <ProtectedRoute allowedRoles={['admin']} requireSubscription={true}>
              <LeaveApply />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-leave"
          element={
            <ProtectedRoute allowedRoles={['admin']} requireSubscription={true}>
              <MyLeave />
            </ProtectedRoute>
          }
        />
        <Route
          path="time"
          element={
            <ProtectedRoute allowedRoles={['admin']} requireSubscription={true}>
              <Time />
            </ProtectedRoute>
          }
        />
        {/* Other Admin Routes */}
        <Route
          path="create-organization"
          element={
            <ProtectedRoute allowedRoles={['admin']} requireSubscription={true}>
              <CreateOrganization />
            </ProtectedRoute>
          }
        />
        <Route
          path="view-organization"
          element={
            <ProtectedRoute allowedRoles={['admin']} requireSubscription={true}>
              <ViewOrganization />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Manager Routes */}
      <Route
        path="manager"
        element={
          <ProtectedRoute allowedRoles={['manager']} requireSubscription={true}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Employee Routes */}
      <Route
        path="employee"
        element={
          <ProtectedRoute allowedRoles={['employee']} requireSubscription={true}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="employee-profile"
        element={
          <ProtectedRoute allowedRoles={['employee']} requireSubscription={true}>
            <EmployeeProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="personal-details"
        element={
          <ProtectedRoute allowedRoles={['employee']} requireSubscription={true}>
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
      <SettingsProvider> {/* ✅ Wrap all app logic here */}
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
      </SettingsProvider>
    </Provider>
  </React.StrictMode>
);
