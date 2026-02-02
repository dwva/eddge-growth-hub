import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole, getRoleRoute } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleRoute(user.role)} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
