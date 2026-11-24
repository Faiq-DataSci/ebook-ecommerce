import type { Session } from '@supabase/supabase-js'

export type UserRole = 'ADMIN' | 'CUSTOMER'

export interface AdminUser {
  id: string
  email: string
  fullName: string
  role: 'ADMIN'
  isSimulation?: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginValidationErrors {
  email?: string
  password?: string
  general?: string
}

export interface AuthState {
  user: AdminUser | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}
