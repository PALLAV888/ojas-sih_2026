import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
  currentPath: string;
  onRedirect: (path: string) => void;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole,
  currentPath,
  onRedirect,
  children
}) => {
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // Not logged in -> go to login
    if (!user) {
      onRedirect('/login');
      return;
    }

    // Role mismatch
    if (requiredRole && role !== requiredRole) {
      onRedirect(role === 'patient' ? '/patient' : '/practitioner');
      return;
    }

    // If practitioner has unverified status and tries to access something outside verification or dashboard
    if (
      role === 'practitioner' &&
      user.verificationStatus === 'not_started' &&
      currentPath !== '/practitioner/verification' &&
      currentPath !== '/practitioner'
    ) {
      onRedirect('/practitioner/verification');
    }
  }, [loading, user, role, requiredRole, currentPath, onRedirect]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-xs text-[#6b7280]">
        Verifying AYUSH credentials...
      </div>
    );
  }

  // Prevent rendering protected children while redirect is pending
  if (!user) {
    return null;
  }

  if (requiredRole && role !== requiredRole) {
    return null;
  }

  if (
    role === 'practitioner' &&
    user.verificationStatus === 'not_started' &&
    currentPath !== '/practitioner/verification' &&
    currentPath !== '/practitioner'
  ) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
