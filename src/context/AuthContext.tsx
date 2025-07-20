import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { AuthService } from '../services/authService';
import { toast } from 'react-toastify';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      if (AuthService.isTokenValid()) {
        const userData = await AuthService.getProfile();
        setUser(userData);
        localStorage.setItem('admin_user', JSON.stringify(userData));
      } else {
        // Token is invalid, clear everything
        setUser(null);
        AuthService.removeToken();
        localStorage.removeItem('admin_user');
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
      AuthService.removeToken();
      localStorage.removeItem('admin_user');
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have a valid token
        if (AuthService.isTokenValid()) {
          await refreshUser();
        } else {
          // Clear any invalid data
          AuthService.removeToken();
          localStorage.removeItem('admin_user');
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await AuthService.login({ email, password });

      // Store token and user data
      AuthService.setToken(response.token);
      setUser(response.user);
      localStorage.setItem('admin_user', JSON.stringify(response.user));

      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Always clear local data
      setUser(null);
      AuthService.removeToken();
      localStorage.removeItem('admin_user');
      toast.success('Logged out successfully');
    }
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};