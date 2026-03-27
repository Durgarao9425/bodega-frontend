import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ProtectedRoute - wraps pages that require login
// If user is not logged in, redirect to /login
// If still checking auth status, show loading spinner

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token, isLoading } = useAuth();

  // Still checking localStorage for saved token (rare now - handled by GlobalLoader in App)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-10 h-10 border-4 border-[#0ea5e9]/20 border-t-[#0ea5e9] rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in → redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in → render the protected page
  return <>{children}</>;
};

export default ProtectedRoute;
