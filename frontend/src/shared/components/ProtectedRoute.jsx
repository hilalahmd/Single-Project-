import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
    // Not logged in, redirect to login page with the return url
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Logged in but doesn't have the right role
    // For example, a "user" trying to access "/admin"
    // Redirect them to their appropriate dashboard based on their actual role
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'trainer') return <Navigate to="/trainer/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
