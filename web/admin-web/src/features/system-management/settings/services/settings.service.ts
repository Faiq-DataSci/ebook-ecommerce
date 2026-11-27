import {
  API_BASE_URL,
  apiClient,
  ApiError,
} from '../../../../services/api/apiClient'
import { isSupabaseConfigured, supabase } from '../../../../services/supabase/client'
import type { AdminUser } from '../../../authentication/types/auth.types'
import type {
  AdminProfileData,
  SystemHealthSnapshot,
  UpdateAdminProfilePayload,
} from '../types/settings.types'

interface RawUserMeResponse {
  id: string
  email: string
  fullName: string
  phone: string | null
  role: 'ADMIN' | 'CUSTOMER'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Mengambil profil admin yang sedang login dari `GET /api/v1/users/me`.
 * Jika backend tidak dapat dijangkau atau sesi simulasi, menggunakan informasi sesi auth lokal.
 */
export async function fetchAdminProfile(
  fallbackUser: AdminUser | null,
): Promise<{ profile: AdminProfileData | null; warning?: string }> {
  try {
    const res = await apiClient.get<RawUserMeResponse>('/users/me')
    if (res.data) {
      return {
        profile: {
          id: res.data.id,
          email: res.data.email,
          fullName: res.data.fullName,
          phone: res.data.phone ?? null,
          role: res.data.role,
          isActive: res.data.isActive,
          createdAt: res.data.createdAt,
          updatedAt: res.data.updatedAt,
          source: 'BACKEND',
        },
      }
    }
  } catch (err) {
    const warning =
      err instanceof ApiError
        ? `Profil backend (/users/me) tidak dapat dimuat (${err.message}). Menampilkan data dari sesi autentikasi aktif.`
        : 'Profil backend tidak dapat dimuat. Menampilkan data dari sesi autentikasi aktif.'

    if (fallbackUser) {
      return {
        profile: {
          id: fallbackUser.id,
          email: fallbackUser.email,
          fullName: fallbackUser.fullName,
          phone: null,
          role: fallbackUser.role,
          isActive: true,
          createdAt: null,
          updatedAt: null,
          source: 'AUTH_SESSION',
        },
        warning,
      }
    }
    return { profile: null, warning }
  }

  return { profile: null }
}

/**
 * Memperbarui profil admin yang sedang login melalui `PATCH /api/v1/users/me`.
 * Validasi backend: fullName (2–120 karakter), phone (maks 25 karakter, opsional).
 */
export async function updateAdminProfile(
  payload: UpdateAdminProfilePayload,
): Promise<AdminProfileData> {
  const res = await apiClient.patch<RawUserMeResponse>('/users/me', {
    fullName: payload.fullName.trim(),
    phone: payload.phone && payload.phone.trim() ? payload.phone.trim() : null,
  })

  return {
    id: res.data.id,
    email: res.data.email,
    fullName: res.data.fullName,
    phone: res.data.phone ?? null,
    role: res.data.role,
    isActive: res.data.isActive,
    createdAt: res.data.createdAt,
    updatedAt: res.data.updatedAt,
    source: 'BACKEND',
  }
}

/**
 * Mengubah kata sandi akun admin yang sedang login melalui Supabase Auth.
 * Admin tidak dapat mengubah kata sandi pengguna lain dari fungsi ini.
 */
export async function updateOwnAdminPassword(
  newPassword: string,
): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase Auth belum dikonfigurasi pada environment ini. Pengubahan kata sandi hanya tersedia pada sesi Supabase Auth aktif.',
    )
  }

  const { data: sessionData } = await supabase.auth.getSession()
  if (!sessionData.session) {
    throw new Error(
      'Tidak ada sesi Supabase Auth aktif. Masuk dengan akun admin Supabase untuk mengubah kata sandi.',
    )
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    throw new Error(error.message || 'Gagal memperbarui kata sandi melalui Supabase Auth.')
  }
}

/**
 * Memeriksa status layanan backend nyata melalui `GET /api/v1/health` dan `GET /api/v1/admin/ping`.
 * Tidak pernah mengekspos secret key, API key, atau kredensial database.
 */
export async function checkSystemHealth(): Promise<SystemHealthSnapshot> {
  let backendReachable: boolean
  let backendStatusText: string
  let backendEnvironment: string | null = null
  let adminAuthorized = false
  let adminAuthStatusText: string

  try {
    const healthRes = await apiClient.get<{ status?: string; environment?: string }>('/health')
    backendReachable = true
    backendStatusText = healthRes.data?.status === 'ok' ? 'Aktif (OK)' : 'Terespons'
    backendEnvironment = healthRes.data?.environment ?? null
  } catch (err) {
    backendReachable = false
    backendStatusText =
      err instanceof ApiError && err.statusCode === 0
        ? 'Server backend tidak terjangkau'
        : 'Gagal memeriksa /health'
  }

  if (backendReachable) {
    try {
      const pingRes = await apiClient.get<{ pong?: boolean }>('/admin/ping')
      adminAuthorized = Boolean(pingRes.data?.pong)
      adminAuthStatusText = adminAuthorized
        ? 'Terverifikasi (Role ADMIN)'
        : 'Respons tidak terduga'
    } catch (err) {
      adminAuthorized = false
      if (err instanceof ApiError && err.statusCode === 401) {
        adminAuthStatusText = 'Token JWT tidak aktif atau sesi simulasi'
      } else if (err instanceof ApiError && err.statusCode === 403) {
        adminAuthStatusText = 'Akses ditolak (bukan role ADMIN)'
      } else {
        adminAuthStatusText = 'Gagal memeriksa otorisasi admin'
      }
    }
  } else {
    adminAuthStatusText = 'Menunggu koneksi backend'
  }

  return {
    backendReachable,
    backendStatusText,
    backendEnvironment,
    adminAuthorized,
    adminAuthStatusText,
    supabaseConfigured: isSupabaseConfigured,
    apiBaseUrl: API_BASE_URL,
    checkedAt: new Date().toISOString(),
  }
}
