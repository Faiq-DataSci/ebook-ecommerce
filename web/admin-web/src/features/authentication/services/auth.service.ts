import type { Session } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../../../services/supabase/client'
import type { AdminUser, LoginCredentials } from '../types/auth.types'

const SIMULATION_SESSION_KEY = 'admin_simulasi_session'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export class AuthService {
  /**
   * Logs in an administrator using Supabase Auth or verified development simulation fixture.
   */
  async login(credentials: LoginCredentials): Promise<{ user: AdminUser; session: Session | null }> {
    const email = credentials.email.trim()
    const password = credentials.password

    // 1. Live Supabase Authentication Mode
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error || !data.user || !data.session) {
        // Generic error message per security requirement #10
        throw new Error('Email atau kata sandi salah.')
      }

      // 2. Strict Role Verification (Backend app_metadata)
      const role = data.user.app_metadata?.role
      if (role !== 'ADMIN') {
        // Immediately invalidate non-admin session
        await supabase.auth.signOut()
        throw new Error('Kamu tidak memiliki akses ke halaman ini.')
      }

      // 3. Optional live verification against Express backend /api/v1/admin/ping
      if (API_BASE_URL) {
        try {
          const res = await fetch(`${API_BASE_URL}/admin/ping`, {
            headers: {
              Authorization: `Bearer ${data.session.access_token}`,
            },
          })

          if (res.status === 403) {
            await supabase.auth.signOut()
            throw new Error('Kamu tidak memiliki akses ke halaman ini.')
          }
        } catch (fetchErr) {
          // If backend returned a 403, propagate the error
          if (fetchErr instanceof Error && fetchErr.message.includes('akses')) {
            throw fetchErr
          }
          // If backend is simply unreachable on local network, rely on Supabase app_metadata
          console.warn('Backend ping skipped or unavailable:', fetchErr)
        }
      }

      const adminUser: AdminUser = {
        id: data.user.id,
        email: data.user.email ?? email,
        fullName:
          (data.user.user_metadata?.full_name as string) ||
          (data.user.user_metadata?.name as string) ||
          'Administrator Toko',
        role: 'ADMIN',
      }

      return { user: adminUser, session: data.session }
    }

    // 2. Development Mode Simulation (When Supabase credentials are not yet configured)
    // Mirrors seed fixture in backend/prisma/seed-data.ts
    if (email === 'admin.simulasi@example.com') {
      const simulatedAdmin: AdminUser = {
        id: '00000000-0000-4000-8000-000000000001',
        email: 'admin.simulasi@example.com',
        fullName: 'DATA SIMULASI - Admin Toko',
        role: 'ADMIN',
        isSimulation: true,
      }
      sessionStorage.setItem(SIMULATION_SESSION_KEY, JSON.stringify(simulatedAdmin))
      return { user: simulatedAdmin, session: null }
    }

    if (email === 'customer.simulasi@example.com') {
      // Non-admin test rejection
      throw new Error('Kamu tidak memiliki akses ke halaman ini.')
    }

    throw new Error('Email atau kata sandi salah.')
  }

  /**
   * Logs out the user and clears any persistent session.
   */
  async logout(): Promise<void> {
    sessionStorage.removeItem(SIMULATION_SESSION_KEY)
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    }
  }

  /**
   * Retrieves the current authenticated administrator session if valid.
   */
  async getCurrentSession(): Promise<{ user: AdminUser | null; session: Session | null }> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session?.user) {
        return { user: null, session: null }
      }

      const role = data.session.user.app_metadata?.role
      if (role !== 'ADMIN') {
        await supabase.auth.signOut()
        return { user: null, session: null }
      }

      const adminUser: AdminUser = {
        id: data.session.user.id,
        email: data.session.user.email ?? '',
        fullName:
          (data.session.user.user_metadata?.full_name as string) ||
          'Administrator Toko',
        role: 'ADMIN',
      }

      return { user: adminUser, session: data.session }
    }

    // Check simulation session
    const saved = sessionStorage.getItem(SIMULATION_SESSION_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AdminUser
        if (parsed.role === 'ADMIN') {
          return { user: parsed, session: null }
        }
      } catch {
        sessionStorage.removeItem(SIMULATION_SESSION_KEY)
      }
    }

    return { user: null, session: null }
  }

  /**
   * Subscribes to auth state changes.
   */
  onAuthStateChange(
    callback: (event: string, session: Session | null) => void,
  ): { unsubscribe: () => void } {
    if (!isSupabaseConfigured) {
      return { unsubscribe: () => {} }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(callback)

    return {
      unsubscribe: () => subscription.unsubscribe(),
    }
  }
}

export const authService = new AuthService()
