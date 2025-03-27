import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetEmployeeQuery } from './slices/employeeSlice';
import { useGetOrganisationByIdQuery } from './slices/organizationSlice';
import { useState, useEffect } from 'react';

export const ProtectedRoute = ({ allowedRoles, children, requireSubscription = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;

  const {
    data: employee,
    isLoading: isEmployeeLoading,
    error: employeeError
  } = useGetEmployeeQuery(id, {
    skip: !id // Skip the query if there's no id
  });

  const organisationId = employee?.data?.employee?.organisationId;

  const {
    data: organisation,
    isLoading: isOrgLoading,
    error: orgError
  } = useGetOrganisationByIdQuery(organisationId, {
    skip: !organisationId // Skip the query if there's no organisationId
  });

  useEffect(() => {
    const checkAuth = async () => {
      // Reset states
      setIsLoading(true);
      setShouldRedirect(false);
      setRedirectPath('');

      // Check if user is logged in
      if (!userInfo) {
        setShouldRedirect(true);
        setRedirectPath('/login');
        setIsLoading(false);
        return;
      }

      // Check role permissions
      if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
        setShouldRedirect(true);
        setRedirectPath(`/${userInfo.role}/dashboard`);
        setIsLoading(false);
        return;
      }

      // Wait for employee and organisation data to load
      if (!isEmployeeLoading && !isOrgLoading) {
        // Check subscription status if required
        if (requireSubscription) {
          if (organisation?.data?.organisation?.subscriptionStatus !== 'active') {
            setShouldRedirect(true);
            setRedirectPath('/subscribe');
          }
        }
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [
    userInfo,
    allowedRoles,
    requireSubscription,
    isEmployeeLoading,
    isOrgLoading,
    organisation,
    employee
  ]);

  // Show loading state or handle errors
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Handle API errors
  if (employeeError || orgError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error loading data</p>
          <p className="mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  // Handle redirects
  if (shouldRedirect) {
    return <Navigate to={redirectPath} replace />;
  }

  // If all checks pass, render the protected content
  return children;
};