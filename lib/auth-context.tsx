'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError, clearToken, setToken } from './api';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  studentId?: string;
  department?: string;
  faculty?: string;
  level?: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refresh = useCallback(async () => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    try {
      const me = await api.get<User>('/api/auth/me', { signal: controller.signal });
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      window.clearTimeout(timeout);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await api.post<{ user: User; accessToken: string }>(
      '/api/auth/login',
      { email, password },
      { skipAuth: true },
    );
    setToken(result.accessToken);
    setUser(result.user);
    return result.user;
  }, []);

  const register = useCallback(async (data: RegisterInput) => {
    const result = await api.post<{ user: User; accessToken: string }>(
      '/api/auth/register',
      data,
      { skipAuth: true },
    );
    setToken(result.accessToken);
    setUser(result.user);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    router.push('/');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export { ApiError };
