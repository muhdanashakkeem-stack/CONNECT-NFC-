import { User, UserRole } from '@/types/auth';

const PRIMARY_TOKEN_KEY = 'nfc_auth_token';
const PRIMARY_USER_KEY = 'nfc_auth_user';
const ALT_TOKEN_KEY = 'speed_nfc_token';
const ALT_USER_KEY = 'speed_nfc_user';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(PRIMARY_TOKEN_KEY) || localStorage.getItem(ALT_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PRIMARY_TOKEN_KEY, token);
    localStorage.setItem(ALT_TOKEN_KEY, token);
  } catch (err) {
    console.error('Failed to save auth token:', err);
  }
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PRIMARY_USER_KEY) || localStorage.getItem(ALT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PRIMARY_USER_KEY, JSON.stringify(user));
    localStorage.setItem(ALT_USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to save user data:', err);
  }
}

export function clearStoredSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(PRIMARY_TOKEN_KEY);
    localStorage.removeItem(PRIMARY_USER_KEY);
    localStorage.removeItem(ALT_TOKEN_KEY);
    localStorage.removeItem(ALT_USER_KEY);
  } catch (err) {
    console.error('Failed to clear session:', err);
  }
}

export function getRedirectPathForRole(role: UserRole | string): string {
  const normalized = String(role || '').toLowerCase();
  switch (normalized) {
    case 'admin':
    case 'superadmin':
      return '/admin';
    case 'client':
      return '/client';
    case 'customer':
      return '/customer';
    default:
      return '/';
  }
}
