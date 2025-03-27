export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // Hashed password
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  rememberMe?: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface UserFormData {
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
} 