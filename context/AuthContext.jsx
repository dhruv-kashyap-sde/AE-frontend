"use client"

import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/lib/auth-api';

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async (userData) => {},
  logout: async () => {},
  isAuthenticated: false
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const initAuth = async () => {
      try {
        // First check localStorage for cached user
        const cachedUser = authApi.getCurrentUser();
        if (cachedUser) {
          setUser(cachedUser);
        }
        
        // Verify with server (cookies will be sent automatically)
        const response = await authApi.getProfile();
        if (response.success && response.data.user) {
          setUser(response.data.user);
          authApi.saveUser(response.data.user);
        } else {
          // Server rejected, clear local user
          setUser(null);
          authApi.clearUser();
        }
      } catch (error) {
        // Auth failed, user not logged in
        console.error('Auth initialization error:', error);
        setUser(null);
        authApi.clearUser();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    authApi.saveUser(userData);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
