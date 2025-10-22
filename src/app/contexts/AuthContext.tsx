'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'event_organizer';
  marketingAccess?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Get token from localStorage
  const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  };

  // Set token in localStorage
  const setToken = (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  };

  // Remove token from localStorage
  const removeToken = (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  };

  // API call helper with auth headers
  const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
    const token = getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          message: `HTTP error! status: ${response.status}` 
        }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check if the server is running on http://localhost:3000');
      }
      throw error;
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.access_token) {
        setToken(response.access_token);
        // Fetch user profile after successful login
        await refreshProfile();
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      if (response.access_token) {
        setToken(response.access_token);
        // Fetch user profile after successful registration
        await refreshProfile();
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = (): void => {
    removeToken();
    setUser(null);
  };

  // Forgot password function
  const forgotPassword = async (email: string): Promise<void> => {
    await apiCall('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  };

  // Reset password function
  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    await apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  };

  // Change password function
  const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
    await apiCall('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  };

  // Refresh user profile
  const refreshProfile = async (): Promise<void> => {
    try {
      const token = getToken();
      console.log('🔍 RefreshProfile: Token exists:', !!token);
      if (!token) {
        console.log('🚫 RefreshProfile: No token found');
        setUser(null);
        return;
      }

      console.log('📡 RefreshProfile: Calling /users/me...');
      const userData = await apiCall('/users/me');
      console.log('✅ RefreshProfile: User data received:', userData);
      setUser(userData);
      console.log('💾 RefreshProfile: User state updated');
    } catch (error) {
      console.error('❌ RefreshProfile: Failed to fetch user profile:', error);
      // Token might be invalid, remove it
      removeToken();
      setUser(null);
    }
  };

  // Check authentication status on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        await refreshProfile();
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};