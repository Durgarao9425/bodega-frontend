import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthContextType } from '../types';
import api from '../services/api';

// Add updateUser to AuthContextType
interface ExtendedAuthContextType extends AuthContextType {
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<ExtendedAuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app startup, restore auth state from localStorage AND refresh profile
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      refreshProfile(savedToken); // ensure latest name/email from backend
    }

    setIsLoading(false);
  }, []);

  // After login, fetch fresh user profile to get name/email
  const refreshProfile = useCallback(async (authToken: string) => {
    try {
      const res = await api.get('/user/me', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.data.user) {
        const freshUser: User = {
          id: res.data.user._id,
          phone: res.data.user.phone,
          name: res.data.user.name || '',
          email: res.data.user.email || '',
        };
        setUser(freshUser);
        localStorage.setItem('user', JSON.stringify(freshUser));
      }
    } catch {
      // If refresh fails, keep existing user data
    }
  }, []);

  // Login function - called after OTP verification
  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    // Refresh profile to get latest name/email
    refreshProfile(authToken);
  };

  // Update user data (e.g., after profile edit)
  const updateUser = (userData: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...userData };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  // Logout function - clear everything
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
