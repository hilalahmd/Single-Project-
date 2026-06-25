import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Context
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from local storage on mount (Mocking backend JWT behavior)
  useEffect(() => {
    const storedUser = localStorage.getItem('fitforge_session');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // For testing, let's auto-login a dummy CLIENT user
      // Change role to 'trainer' or 'admin' here to test other dashboards
      const mockUser = {
        _id: 't_456',
        name: 'Alex Coach',
        email: 'alex@fitforge.com',
        role: 'trainer', // Switched to trainer to preview Step 3
        subscriptionTier: 'personal_training',
        avatar: null
      };
      setUser(mockUser);
      localStorage.setItem('fitforge_session', JSON.stringify(mockUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('fitforge_session', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fitforge_session');
  };

  const value = {
    user,
    role: user?.role || null,
    subscriptionTier: user?.subscriptionTier || 'free',
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
