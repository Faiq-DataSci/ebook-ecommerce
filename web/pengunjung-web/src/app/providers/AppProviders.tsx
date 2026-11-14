import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  CustomerProfile,
  LoginCredentials,
  RegisterPayload,
} from '../../types/user.types';
import { authService } from '../../services/auth.service';
import {
  checkBackendHealth,
  type ApiHealthStatus,
} from '../../services/api/apiClient';
import {
  AuthContext,
  type AuthContextValue,
} from '../../features/auth/hooks/useAuth';

export function AppProviders({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<CustomerProfile | null>(() =>
    authService.getStoredSession(),
  );
  const [apiHealth, setApiHealth] = useState<ApiHealthStatus>({
    reachable: false,
    mode: 'SIMULASI_LOKAL',
    checkedAt: new Date().toISOString(),
  });

  useEffect(() => {
    let active = true;
    checkBackendHealth().then((status) => {
      if (active) {
        setApiHealth(status);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const profile = await authService.login(credentials);
    setCustomer(profile);
    return profile;
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const profile = await authService.register(payload);
    setCustomer(profile);
    return profile;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setCustomer(null);
  }, []);

  const loginWithDemoAccount = useCallback(async () => {
    const demoCreds = authService.getDefaultDemoCredentials();
    const profile = await authService.login(demoCreds);
    setCustomer(profile);
    return profile;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      customer,
      isAuthenticated: Boolean(customer),
      apiHealth,
      login,
      register,
      logout,
      loginWithDemoAccount,
    }),
    [customer, apiHealth, login, register, logout, loginWithDemoAccount],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
