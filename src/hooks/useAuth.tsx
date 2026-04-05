'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../lib/types';
import { authService } from '../services/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const resp = await authService.getCurrentUser();
      if (resp.success) {
        setUser(resp.data);
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const resp = await authService.signIn(email, password);
    if (resp.success && resp.data) {
      setUser(resp.data);
      setLoading(false);
      return { success: true };
    }
    setLoading(false);
    return { success: false, error: resp.error || 'Authentication failed.' };
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    const resp = await authService.signUp(email, name);
    if (resp.success && resp.data) {
      setUser(resp.data);
      setLoading(false);
      return { success: true };
    }
    setLoading(false);
    return { success: false, error: resp.error || 'Account creation failed.' };
  };

  const signOut = async () => {
    setLoading(true);
    await authService.signOut();
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
