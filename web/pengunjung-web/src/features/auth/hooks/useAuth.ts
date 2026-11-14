import { createContext, useContext } from 'react';
import type {
  CustomerProfile,
  LoginCredentials,
  RegisterPayload,
} from '../../../types/user.types';
import type { ApiHealthStatus } from '../../../services/api/apiClient';

export interface AuthContextValue {
  customer: CustomerProfile | null;
  isAuthenticated: boolean;
  apiHealth: ApiHealthStatus;
  login: (credentials: LoginCredentials) => Promise<CustomerProfile>;
  register: (payload: RegisterPayload) => Promise<CustomerProfile>;
  logout: () => void;
  loginWithDemoAccount: () => Promise<CustomerProfile>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AppProviders.');
  }
  return context;
}
