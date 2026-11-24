import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from 'react'
import { AuthContext } from './AuthContext'
import { authService } from '../../features/authentication/services/auth.service'
import type {
  AdminUser,
  AuthContextValue,
  LoginCredentials,
} from '../../features/authentication/types/auth.types'
import type { Session } from '@supabase/supabase-js'

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize and restore session on mount
  useEffect(() => {
    let isMounted = true

    async function initAuth() {
      try {
        const current = await authService.getCurrentSession()
        if (isMounted) {
          setUser(current.user)
          setSession(current.session)
        }
      } catch (err) {
        console.error('Gagal memulihkan sesi autentikasi:', err)
        if (isMounted) {
          setUser(null)
          setSession(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void initAuth()

    // Listen to Supabase auth events
    const { unsubscribe } = authService.onAuthStateChange(
      (_event, updatedSession) => {
        if (!isMounted) return

        if (!updatedSession) {
          setUser(null)
          setSession(null)
          return
        }

        const role = updatedSession.user?.app_metadata?.role
        if (role === 'ADMIN') {
          const adminUser: AdminUser = {
            id: updatedSession.user.id,
            email: updatedSession.user.email ?? '',
            fullName:
              (updatedSession.user.user_metadata?.full_name as string) ||
              'Administrator Toko',
            role: 'ADMIN',
          }
          setUser(adminUser)
          setSession(updatedSession)
        } else {
          // Invalidate non-admin session
          void authService.logout()
          setUser(null)
          setSession(null)
        }
      },
    )

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await authService.login(credentials)
      setUser(result.user)
      setSession(result.session)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat memproses autentikasi.'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await authService.logout()
      setUser(null)
      setSession(null)
      setError(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      isLoading,
      isAuthenticated: Boolean(user && user.role === 'ADMIN'),
      error,
      login,
      logout,
      clearError,
    }),
    [user, session, isLoading, error, login, logout, clearError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
