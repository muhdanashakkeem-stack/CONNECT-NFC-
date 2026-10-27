import { apiClient } from './client';
import { AuthResponse, LoginCredentials, User } from '@/types/auth';

/**
 * Calls backend POST /api/auth/login
 * Validates credentials on backend and returns JWT token + User metadata
 */
export async function apiLogin(credentials: LoginCredentials): Promise<AuthResponse> {
  const res = await apiClient<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  return res.data;
}

/**
 * Calls backend POST /api/auth/logout
 * Backend invalidates token or session
 */
export async function apiLogout(): Promise<{ success: boolean }> {
  try {
    const res = await apiClient<{ success: boolean }>('/auth/logout', {
      method: 'POST',
    });
    return res.data;
  } catch {
    return { success: true };
  }
}

/**
 * Calls backend GET /api/auth/me
 * Validates current JWT and retrieves current authenticated user profile
 */
export async function apiGetCurrentUser(): Promise<User> {
  const res = await apiClient<User>('/auth/me', {
    method: 'GET',
  });
  return res.data;
}
