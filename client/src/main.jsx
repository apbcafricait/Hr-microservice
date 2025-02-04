import './index.css';
import App from './App.jsx';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import React from 'react';
import { Provider } from 'react-redux';
import store from './store.js';
import { ToastContainer } from 'react-toastify';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
// Import all performance components
import { 
  PerformanceReviews,
  GoalSetting,
  PerformanceMetrics,
  Feedback,
  EmployeeProgress,
  PerformanceDashboard,
  ReviewHistory,
  SelfAssessment,
  ManagerAssessment 
} from './components/pages/Performance';
// Import all recruitment components
import { 
  JobPostings,
  Applicants,
  InterviewSchedule,
  InterviewResults,
  ApplicantDetails,
  RecruitmentDashboard,
  JobApplicationForm,
  CandidateShortlist,
  RecruitmentReports
} from './components/pages/Recruitment';

const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
{/* Routing for Performance Pages */}

          <Route path="/performance-reviews" element={<PerformanceReviews />} />
          <Route path="/goal-setting" element={<GoalSetting />} />
          <Route path="/performance-metrics" element={<PerformanceMetrics />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/employee-progress" element={<EmployeeProgress />} />
          <Route path="/performance-dashboard" element={<PerformanceDashboard />} />
          <Route path="/review-history" element={<ReviewHistory />} />
          <Route path="/self-assessment" element={<SelfAssessment />} />
          <Route path="/manager-assessment" element={<ManagerAssessment />} />
    {/* Routing for Recruitment Pages */}
    
          <Route path="/job-postings" element={<JobPostings />} />
          <Route path="/applicants" element={<Applicants />} />
          <Route path="/interview-schedule" element={<InterviewSchedule />} />
          <Route path="/interview-results" element={<InterviewResults />} />
          <Route path="/applicant-details/:id" element={<ApplicantDetails />} />
          <Route path="/recruitment-dashboard" element={<RecruitmentDashboard />} />
          <Route path="/job-application-form" element={<JobApplicationForm />} />
          <Route path="/candidate-shortlist" element={<CandidateShortlist />} />
          <Route path="/recruitment-reports" element={<RecruitmentReports />} />
        

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