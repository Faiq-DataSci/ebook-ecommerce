import { isSupabaseConfigured, supabase } from '../supabase/client'

/**
 * Base URL untuk Express backend REST API
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'
).replace(/\/+$/, '')

export class ApiError extends Error {
  statusCode: number
  code?: string
  details?: unknown

  constructor(message: string, statusCode = 500, code?: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  message?: string
}

/**
 * Mengambil Authorization header dari sesi aktif Supabase Auth
 */
export async function getAuthHeader(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {}
  if (isSupabaseConfigured) {
    try {
      const { data } = await supabase.auth.getSession()
      if (data.session?.access_token) {
        headers.Authorization = `Bearer ${data.session.access_token}`
      }
    } catch (err) {
      console.warn('Gagal membaca token sesi Supabase:', err)
    }
  }
  return headers
}

/**
 * Memanggil endpoint backend dengan otentikasi Bearer token otomatis
 */
export async function requestApi<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const authHeaders = await getAuthHeader()
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  const url = `${API_BASE_URL}${cleanPath}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...authHeaders,
    ...((options.headers as Record<string, string>) || {}),
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    })

    const json = (await res.json().catch(() => null)) as ApiResponse<T> | null

    if (!res.ok) {
      const errorMsg =
        (json as unknown as { error?: { message?: string } })?.error?.message ||
        json?.message ||
        `Permintaan API gagal dengan status ${res.status}`
      const errorCode = (json as unknown as { error?: { code?: string } })?.error?.code
      const errorDetails = (json as unknown as { error?: { details?: unknown } })?.error?.details
      throw new ApiError(errorMsg, res.status, errorCode, errorDetails)
    }

    if (!json) {
      throw new ApiError('Format respon server tidak valid', res.status)
    }

    return json
  } catch (err) {
    if (err instanceof ApiError) {
      throw err
    }
    const message = err instanceof Error ? err.message : 'Koneksi ke server backend gagal'
    throw new ApiError(message, 0, 'NETWORK_ERROR')
  }
}

export const apiClient = {
  get: <T>(path: string, options?: RequestInit) =>
    requestApi<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body?: unknown, options?: RequestInit) =>
    requestApi<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(path: string, body?: unknown, options?: RequestInit) =>
    requestApi<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(path: string, body?: unknown, options?: RequestInit) =>
    requestApi<T>(path, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string, options?: RequestInit) =>
    requestApi<T>(path, { ...options, method: 'DELETE' }),
}
