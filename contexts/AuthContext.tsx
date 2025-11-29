'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  emailVerified: boolean;
  status: string;
  createdAt?: string;
  vendorProfile?: {
    id: string;
    businessName: string;
    logo?: string;
    stripeOnboarded: boolean;
  };
  customerProfile?: {
    id: string;
    phone?: string;
    address?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, locale?: string) => Promise<void>;
  register: (data: RegisterData, locale?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  loginWithGoogle: (token: string, locale?: string) => Promise<void>;
  loginWithGithub: (code: string, locale?: string) => Promise<void>;
  isAuthenticated: boolean;
  isVendor: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'CUSTOMER' | 'VENDOR';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Get current locale from pathname
  const getCurrentLocale = () => {
    const localeMatch = pathname?.match(/^\/([a-z]{2})\//);
    return localeMatch ? localeMatch[1] : 'en';
  };

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await authAPI.getCurrentUser();
      setUser(response.data.data.user);
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data.data.user);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const login = async (email: string, password: string, locale?: string) => {
    try {
      const response = await authAPI.login(email, password);
      const { user, accessToken, refreshToken } = response.data.data;

      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Set user
      setUser(user);

      toast.success('Login successful!');

      // Use provided locale or current locale
      const currentLocale = locale || getCurrentLocale();

      // Redirect based on role
      if (user.role === 'VENDOR') {
        router.push(`/${currentLocale}/vendor/dashboard`);
      } else if (user.role === 'ADMIN') {
        router.push(`/${currentLocale}/admin`);
      } else {
        router.push(`/${currentLocale}`);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const register = async (data: RegisterData, locale?: string) => {
    try {
      const response = await authAPI.register(data);
      const { user, accessToken, refreshToken } = response.data.data;

      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Set user
      setUser(user);

      toast.success('Registration successful! Please verify your email.');

      // Use provided locale or current locale
      const currentLocale = locale || getCurrentLocale();

      // Redirect based on role
      if (data.role === 'VENDOR') {
        router.push(`/${currentLocale}/vendor`);
      } else {
        router.push(`/${currentLocale}`);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    // Clear tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Clear user
    setUser(null);

    toast.success('Logged out successfully');

    const currentLocale = getCurrentLocale();
    router.push(`/${currentLocale}`);
  };

  const loginWithGoogle = async (token: string, locale?: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Google login failed');

      const { user, accessToken, refreshToken } = data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(user);

      toast.success('Logged in with Google!');
      const currentLocale = locale || getCurrentLocale();
      router.push(`/${currentLocale}`);
    } catch (error: any) {
      toast.error(error.message || 'Google login failed');
      throw error;
    }
  };

  const loginWithGithub = async (code: string, locale?: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/auth/github`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'GitHub login failed');

      const { user, accessToken, refreshToken } = data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(user);

      toast.success('Logged in with GitHub!');
      const currentLocale = locale || getCurrentLocale();
      router.push(`/${currentLocale}`);
    } catch (error: any) {
      toast.error(error.message || 'GitHub login failed');
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
    loginWithGoogle,
    loginWithGithub,
    isAuthenticated: !!user,
    isVendor: user?.role === 'VENDOR',
    isAdmin: user?.role === 'ADMIN',
    isCustomer: user?.role === 'CUSTOMER',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

