// ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from './authSlice';

export const ProtectedRoute = ({ allowedRoles, children }) => {
  const user = useSelector(selectCurrentUser);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = `/${user.role}/dashboard`;
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};