import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getStoredToken, validateToken } from '@/services/jwtAuthService';

interface SuperAdminProtectedRouteProps {
  children: ReactNode;
}

/**
 * Strict RBAC Protected Route for SuperAdmin Dashboard
 * Only allows users with 'superadmin' role and valid JWT token
 * Denies: admin, teacher, student, parent
 */
const SuperAdminProtectedRoute = ({ children }: SuperAdminProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Strict RBAC: Only allow superadmin role
  if (user.role !== 'superadmin') {
    // Deny all other roles and redirect to login
    return <Navigate to="/login" replace />;
  }

  // Validate JWT token
  const token = getStoredToken();
  if (!token) {
    // No token found, redirect to login
    return <Navigate to="/login" replace />;
  }

  const payload = validateToken(token);
  if (!payload) {
    // Token invalid or expired, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Verify token payload matches current user
  if (payload.email !== user.email || payload.role !== 'superadmin') {
    // Token doesn't match user, redirect to login
    return <Navigate to="/login" replace />;
  }

  // All checks passed, allow access
  return <>{children}</>;
};

export default SuperAdminProtectedRoute;

