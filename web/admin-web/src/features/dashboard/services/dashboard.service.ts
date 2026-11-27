import { apiClient } from '../../../services/api/apiClient'
import { isSupabaseConfigured, supabase } from '../../../services/supabase/client'

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
  try {
    const json = await apiClient.get<DashboardSummaryData>('/admin/dashboard')
    if (json && json.success && json.data) {
      return json.data
    }
    return null
  } catch {
    return null
  }
}
