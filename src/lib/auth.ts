// src/lib/auth.ts
import api from './api';

export interface AdminUser {
  id: string;
  email: string;
}

export interface LoginResponse {
  message: string;
  user: AdminUser;
  session: {
    access_token: string;
    refresh_token?: string;
  };
}

// Always false now — we don't use Supabase directly in the frontend
export const usingSupabase = false;

// Legacy stub so any old import doesn't crash at module load
export const supabase = null;

/**
 * Log in an admin user via the backend.
 */
export async function signInWithPassword(email: string, password: string): Promise<AdminUser> {
  const res = await api.post<LoginResponse>('/auth/login', { email, password });
  const { session, user } = res.data;

  localStorage.setItem('admin_token', session.access_token);
  localStorage.setItem('admin_user', JSON.stringify(user));

  return user;
}

/**
 * Sign out — clears local state.
 */
export async function signOut(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch (e) {
    // ignore network errors during logout
  } finally {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }
}

/**
 * Get the currently stored admin user (from localStorage).
 */
export function getCurrentUser(): AdminUser | null {
  const raw = localStorage.getItem('admin_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

/**
 * Check if there's a stored token.
 */
export function isLoggedIn(): boolean {
  return !!localStorage.getItem('admin_token');
}