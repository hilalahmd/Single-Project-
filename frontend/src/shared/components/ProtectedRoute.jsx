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

  const userRole = user?.role || role;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Logged in but doesn't have the right role
    if (userRole === 'admin') return <Navigate to="/admin" replace />;
    if (userRole === 'manager') return <Navigate to="/manager/dashboard" replace />;
    if (userRole === 'trainer' || userRole === 'wellness_coach') return <Navigate to="/trainer/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  // Trainer Status Guard
  if (user && (user.role === 'trainer' || user.role === 'wellness_coach') && location.pathname.startsWith('/trainer')) {
    if (user.trainerStatus === 'pending') {
      return (
        <div className="min-h-screen bg-[#07080C] text-white flex flex-col items-center justify-center p-4">
          <h2 className="text-2xl font-bold mb-4">Application Under Review</h2>
          <p className="text-gray-400 mb-6 text-center max-w-md">Your trainer application is currently being reviewed by an admin. We will notify you once it's approved.</p>
          <button onClick={() => { localStorage.removeItem('fitforge_user'); window.location.href='/auth/trainer-login'; }} className="px-6 py-2 bg-orange-600 hover:bg-orange-700 transition-colors rounded-xl font-bold text-white">Log out</button>
        </div>
      )
    }
    if (user.trainerStatus === 'suspended') {
      return (
        <div className="min-h-screen bg-[#07080C] text-white flex flex-col items-center justify-center p-4">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Account Suspended</h2>
          <p className="text-gray-400 mb-6 text-center max-w-md">Your trainer account has been suspended by an admin.</p>
          <button onClick={() => { localStorage.removeItem('fitforge_user'); window.location.href='/auth/trainer-login'; }} className="px-6 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-xl font-bold text-white">Log out</button>
        </div>
      )
    }
    if (user.trainerStatus === 'rejected') {
      return <Navigate to="/auth/trainer-resubmit" replace />
    }
    if (user.trainerStatus === null || user.trainerStatus === 'incomplete') {
      return <Navigate to="/auth/trainer-register" replace />
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
