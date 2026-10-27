export type UserRole = 'admin' | 'client' | 'customer' | 'superadmin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  company?: string;
  title?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  refreshToken?: string;
  expiresIn?: number;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  role?: UserRole;
}

export interface SessionState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
