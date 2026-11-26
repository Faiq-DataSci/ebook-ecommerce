import { isSupabaseConfigured, supabase } from '../../../services/supabase/client'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export interface WeeklySalesPointData {
  day: string
  date: string
  totalAmount: number
  totalLabel: string
  heightPercent: number
  regulerPercent: number
  bundlingPercent: number
  regulerTooltip: string
  bundlingTooltip: string
  isPeak?: boolean
  peakBadge?: string
}

export interface DashboardSummaryData {
  totalRevenue: number
  ordersCount: {
    PENDING: number
    PAID: number
    FAILED: number
    EXPIRED: number
    CANCELLED: number
    total: number
  }
  activeEbooksCount: number
  activeCustomersCount: number
  weeklySales?: WeeklySalesPointData[]
  yAxisTicks?: string[]
  lastSyncAt?: string
  source?: string
}

/**
 * Berlangganan event perubahan data transaksi/pesanan riil di Supabase secara real-time.
 */
export function subscribeToRealtimeSalesUpdates(onUpdate: () => void): () => void {
  if (!isSupabaseConfigured) {
    return () => {}
  }

  const channel = supabase
    .channel('realtime-dashboard-sales')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      () => {
        onUpdate()
      },
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'transactions' },
      () => {
        onUpdate()
      },
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

/**
 * Mengambil ringkasan statistik KPI langsung dari backend Express / PostgreSQL Supabase.
 * Endpoint: GET /api/v1/admin/dashboard
 */
export async function fetchDashboardSummary(): Promise<DashboardSummaryData | null> {
  if (!API_BASE_URL) return null

  try {
    let token: string | undefined
    if (isSupabaseConfigured) {
      const { data } = await supabase.auth.getSession()
      token = data.session?.access_token
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const res = await fetch(`${API_BASE_URL}/admin/dashboard`, { headers })
    if (!res.ok) return null

    const json = await res.json()
    if (json && json.success && json.data) {
      return json.data as DashboardSummaryData
    }
    return null
  } catch {
    return null
  }
}
