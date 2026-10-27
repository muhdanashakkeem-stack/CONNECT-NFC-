'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, LoginCredentials } from '@/types/auth';
import {
  getStoredToken,
  setStoredToken,
  getStoredUser,
  setStoredUser,
  clearStoredSession,
  getRedirectPathForRole,
} from './session';
import { apiLogin, apiLogout } from '@/lib/api/auth';
import { checkBackendHealth } from '@/lib/api/client';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  backendOnline: boolean | null;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => Promise<void>;
  switchRolePreview: (role: UserRole) => void;
  checkHealth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Standby fallback definitions (configured strictly with verified owner)
const PREVIEW_USERS: Record<UserRole, User> = {
  superadmin: {
    id: '80d5de39-bfc6-4fa1-85d6-f86b6f5f65e0',
    email: 'muhdanashakkeem@gmail.com',
    name: 'Muhammed Anas (Super Admin)',
    role: 'superadmin',
    company: 'CONNECT NFC Headquarters',
    title: 'Super Platform Director & Founder',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString(),
  },
  admin: {
    id: '80d5de39-bfc6-4fa1-85d6-f86b6f5f65e0',
    email: 'muhdanashakkeem@gmail.com',
    name: 'Muhammed Anas (Super Admin)',
    role: 'admin',
    company: 'CONNECT NFC Headquarters',
    title: 'Super Platform Director & Founder',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString(),
  },
  client: {
    id: '80d5de39-bfc6-4fa1-85d6-f86b6f5f65e0',
    email: 'muhdanashakkeem@gmail.com',
    name: 'Muhammed Anas',
    role: 'client',
    company: 'CONNECT NFC Client',
    title: 'Verified Member',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString(),
  },
  customer: {
    id: '80d5de39-bfc6-4fa1-85d6-f86b6f5f65e0',
    email: 'muhdanashakkeem@gmail.com',
    name: 'Muhammed Anas',
    role: 'customer',
    company: 'CONNECT NFC Customer',
    title: 'Verified Cardholder',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString(),
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const router = useRouter();

  const verifyHealth = useCallback(async () => {
    const health = await checkBackendHealth();
    setBackendOnline(health.online);
  }, []);

  useEffect(() => {
    // Initial check from localStorage
    const savedToken = getStoredToken();
    const savedUser = getStoredUser();

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setIsLoading(false);
    verifyHealth();
  }, [verifyHealth]);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    setIsLoading(true);
    try {
      // 1. First attempt to call the official backend API
      const response = await apiLogin(credentials);
      setToken(response.token);
      setUser(response.user);
      setStoredToken(response.token);
      setStoredUser(response.user);
      setBackendOnline(true);
      return response.user;
    } catch (err: any) {
      // If backend is offline, check if user requested a preview role for demonstration
      if (err?.data?.isBackendOffline) {
        setBackendOnline(false);
        const selectedRole = credentials.role || (credentials.email.includes('admin') ? 'admin' : credentials.email.includes('client') ? 'client' : 'customer');
        const previewUser = PREVIEW_USERS[selectedRole];
        const previewToken = `offline_preview_jwt_${selectedRole}_${Date.now()}`;
        
        setToken(previewToken);
        setUser(previewUser);
        setStoredToken(previewToken);
        setStoredUser(previewUser);
        return previewUser;
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiLogout();
    } catch (e) {
      console.warn('Logout API call notice:', e);
    } finally {
      clearStoredSession();
      setUser(null);
      setToken(null);
      setIsLoading(false);
      router.push('/');
    }
  };

  const switchRolePreview = (newRole: UserRole) => {
    const previewUser = PREVIEW_USERS[newRole];
    const previewToken = `offline_preview_jwt_${newRole}_${Date.now()}`;
    setUser(previewUser);
    setToken(previewToken);
    setStoredToken(previewToken);
    setStoredUser(previewUser);
    router.push(getRedirectPathForRole(newRole));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        backendOnline,
        login,
        logout,
        switchRolePreview,
        checkHealth: verifyHealth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
