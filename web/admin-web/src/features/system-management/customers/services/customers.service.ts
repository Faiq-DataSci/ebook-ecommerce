import { apiClient, ApiError } from '../../../../services/api/apiClient'
import { fetchDashboardSummary } from '../../../dashboard/services/dashboard.service'
import type {
  CustomerRecord,
  CustomerTableFilters,
  FetchCustomersResult,
} from '../types/customer.types'
import {
  computeCustomerSummary,
  filterAndSortCustomers,
} from '../utils/customer.utils'

/**
 * DATA SIMULASI — Hanya digunakan jika admin secara eksplisit mengaktifkan
 * pratinjau simulasi saat endpoint backend `GET /api/v1/admin/customers` belum tersedia.
 * Struktur mengikuti model Prisma aktual: `User`, `Order`, `EbookAccess`.
 */
export const SIMULATION_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'sim-usr-001',
    fullName: 'DATA SIMULASI - Rina Kartika',
    email: 'rina.simulasi@example.com',
    phone: '081234560001',
    role: 'CUSTOMER',
    isActive: true,
    createdAt: '2026-11-12T08:30:00.000Z',
    updatedAt: '2026-11-24T10:15:00.000Z',
    ordersCount: 3,
    paidOrdersCount: 2,
    totalSpent: 195000,
    ownedEbooksCount: 2,
    activeAccessCount: 2,
    orders: [
      {
        id: 'sim-ord-101',
        orderNumber: 'ORD-SIM-20261118-01',
        totalAmount: 120000,
        status: 'PAID',
        createdAt: '2026-11-18T09:12:00.000Z',
        itemCount: 1,
      },
      {
        id: 'sim-ord-102',
        orderNumber: 'ORD-SIM-20261122-04',
        totalAmount: 75000,
        status: 'PAID',
        createdAt: '2026-11-22T14:40:00.000Z',
        itemCount: 1,
      },
      {
        id: 'sim-ord-103',
        orderNumber: 'ORD-SIM-20261125-09',
        totalAmount: 95000,
        status: 'PENDING',
        createdAt: '2026-11-25T16:05:00.000Z',
        itemCount: 1,
      },
    ],
    ebookAccesses: [
      {
        id: 'sim-acc-001',
        ebookId: 'sim-ebk-001',
        ebookTitle: 'Arsitektur Backend Modern dengan Node.js & Prisma',
        ebookAuthor: 'Budi Santoso, M.T.',
        orderNumber: 'ORD-SIM-20261118-01',
        grantedAt: '2026-11-18T09:15:00.000Z',
        isRevoked: false,
      },
      {
        id: 'sim-acc-002',
        ebookId: 'sim-ebk-002',
        ebookTitle: 'Panduan Praktis Flutter & Clean Architecture',
        ebookAuthor: 'Ahmad Dahlan, S.Kom.',
        orderNumber: 'ORD-SIM-20261122-04',
        grantedAt: '2026-11-22T14:42:00.000Z',
        isRevoked: false,
      },
    ],
  },
  {
    id: 'sim-usr-002',
    fullName: 'DATA SIMULASI - Dimas Pratama',
    email: 'dimas.simulasi@example.com',
    phone: '081234560002',
    role: 'CUSTOMER',
    isActive: true,
    createdAt: '2026-11-05T11:00:00.000Z',
    updatedAt: '2026-11-20T07:45:00.000Z',
    ordersCount: 1,
    paidOrdersCount: 1,
    totalSpent: 95000,
    ownedEbooksCount: 1,
    activeAccessCount: 0,
    orders: [
      {
        id: 'sim-ord-201',
        orderNumber: 'ORD-SIM-20261110-02',
        totalAmount: 95000,
        status: 'PAID',
        createdAt: '2026-11-10T11:20:00.000Z',
        itemCount: 1,
      },
    ],
    ebookAccesses: [
      {
        id: 'sim-acc-003',
        ebookId: 'sim-ebk-003',
        ebookTitle: 'Dasar Basis Data Relasional PostgreSQL & SQL Lanjut',
        ebookAuthor: 'Citra Permata, Ph.D.',
        orderNumber: 'ORD-SIM-20261110-02',
        grantedAt: '2026-11-10T11:22:00.000Z',
        isRevoked: true,
      },
    ],
  },
  {
    id: 'sim-usr-003',
    fullName: 'DATA SIMULASI - Nadia Putri',
    email: 'nadia.simulasi@example.com',
    phone: null,
    role: 'CUSTOMER',
    isActive: false,
    createdAt: '2026-10-01T06:20:00.000Z',
    updatedAt: '2026-11-01T13:10:00.000Z',
    ordersCount: 1,
    paidOrdersCount: 0,
    totalSpent: 0,
    ownedEbooksCount: 0,
    activeAccessCount: 0,
    orders: [
      {
        id: 'sim-ord-301',
        orderNumber: 'ORD-SIM-20261004-07',
        totalAmount: 135000,
        status: 'EXPIRED',
        createdAt: '2026-10-04T09:00:00.000Z',
        itemCount: 1,
      },
    ],
    ebookAccesses: [],
  },
  {
    id: 'sim-usr-004',
    fullName: 'DATA SIMULASI - Admin Utama',
    email: 'admin.simulasi@example.com',
    phone: '081100009999',
    role: 'ADMIN',
    isActive: true,
    createdAt: '2026-09-15T04:00:00.000Z',
    updatedAt: '2026-11-26T08:00:00.000Z',
    ordersCount: 0,
    paidOrdersCount: 0,
    totalSpent: 0,
    ownedEbooksCount: 0,
    activeAccessCount: 0,
    orders: [],
    ebookAccesses: [],
  },
]

interface RawBackendCustomer {
  id: string
  fullName: string
  email: string
  phone?: string | null
  role: 'CUSTOMER' | 'ADMIN'
  isActive: boolean
  createdAt: string
  updatedAt: string
  ordersCount?: number
  paidOrdersCount?: number
  totalSpent?: number | string
  ownedEbooksCount?: number
  activeAccessCount?: number
  orders?: CustomerRecord['orders']
  ebookAccesses?: CustomerRecord['ebookAccesses']
  _count?: {
    orders?: number
    ebookAccesses?: number
  }
}

function mapBackendCustomer(raw: RawBackendCustomer): CustomerRecord {
  const spent =
    typeof raw.totalSpent === 'number'
      ? raw.totalSpent
      : parseFloat(String(raw.totalSpent ?? 0)) || 0

  return {
    id: raw.id,
    fullName: raw.fullName,
    email: raw.email,
    phone: raw.phone ?? null,
    role: raw.role,
    isActive: Boolean(raw.isActive),
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    ordersCount: raw.ordersCount ?? raw._count?.orders ?? raw.orders?.length ?? 0,
    paidOrdersCount: raw.paidOrdersCount ?? 0,
    totalSpent: spent,
    ownedEbooksCount:
      raw.ownedEbooksCount ??
      raw._count?.ebookAccesses ??
      raw.ebookAccesses?.length ??
      0,
    activeAccessCount:
      raw.activeAccessCount ??
      raw.ebookAccesses?.filter((a) => !a.isRevoked).length ??
      0,
    orders: raw.orders,
    ebookAccesses: raw.ebookAccesses,
  }
}

/**
 * Mengambil daftar pelanggan dari backend (`GET /api/v1/admin/customers`).
 */
export async function fetchAdminCustomers(
  filters: CustomerTableFilters,
): Promise<FetchCustomersResult> {
  const dashboardPromise = fetchDashboardSummary()

  const params = new URLSearchParams()
  params.set('page', String(filters.page))
  params.set('limit', String(filters.limit))
  if (filters.search.trim()) params.set('search', filters.search.trim())
  if (filters.status !== 'ALL') params.set('status', filters.status)
  if (filters.role !== 'ALL') params.set('role', filters.role)
  params.set('sortBy', filters.sortBy)
  params.set('sortOrder', filters.sortOrder)

  try {
    const [res, dashboard] = await Promise.all([
      apiClient.get<
        RawBackendCustomer[] | { items: RawBackendCustomer[]; summary?: FetchCustomersResult['summary'] }
      >(`/admin/customers?${params.toString()}`),
      dashboardPromise,
    ])

    const rawList = Array.isArray(res.data) ? res.data : res.data?.items ?? []
    const items = rawList.map(mapBackendCustomer)
    const summary =
      !Array.isArray(res.data) && res.data?.summary
        ? res.data.summary
        : computeCustomerSummary(items)

    return {
      items,
      total: res.meta?.total ?? items.length,
      totalPages: res.meta?.totalPages ?? Math.max(1, Math.ceil(items.length / filters.limit)),
      summary,
      liveDashboardActiveCount: dashboard?.activeCustomersCount ?? null,
      source: 'LIVE',
    }
  } catch (err) {
    const dashboard = await dashboardPromise
    let errorMessage =
      'Data pelanggan belum dapat dimuat dari backend. Pastikan server backend berjalan.'

    if (err instanceof ApiError) {
      if (err.statusCode === 404) {
        errorMessage =
          'Endpoint backend GET /api/v1/admin/customers belum tersedia (status [RENCANA] pada dokumentasi proyek).'
      } else if (err.statusCode === 401 || err.statusCode === 403) {
        errorMessage =
          'Akses ditolak oleh backend. Pastikan Anda masuk dengan akun ber-role ADMIN yang aktif.'
      } else if (err.statusCode === 0) {
        errorMessage =
          'Tidak dapat terhubung ke server backend API. Periksa koneksi jaringan atau status server.'
      } else {
        errorMessage = err.message
      }
    }

    return {
      items: [],
      total: 0,
      totalPages: 1,
      summary: null,
      liveDashboardActiveCount: dashboard?.activeCustomersCount ?? null,
      source: 'UNAVAILABLE',
      errorMessage,
    }
  }
}

/**
 * Mengambil detail pelanggan berdasarkan ID (`GET /api/v1/admin/customers/:id`).
 */
export async function fetchCustomerDetail(
  customerId: string,
): Promise<CustomerRecord | null> {
  const res = await apiClient.get<RawBackendCustomer>(`/admin/customers/${customerId}`)
  return res.data ? mapBackendCustomer(res.data) : null
}

/**
 * Mengubah status aktif/nonaktif akun pelanggan (`PATCH /api/v1/admin/customers/:id/status`).
 */
export async function updateCustomerAccountStatus(
  customerId: string,
  isActive: boolean,
): Promise<CustomerRecord> {
  const res = await apiClient.patch<RawBackendCustomer>(
    `/admin/customers/${customerId}/status`,
    { isActive },
  )
  return mapBackendCustomer(res.data)
}

/**
 * Memproses data simulasi lokal secara eksplisit hanya ketika pengguna memilih mode DATA SIMULASI.
 */
export function querySimulationCustomers(
  records: CustomerRecord[],
  filters: CustomerTableFilters,
  liveDashboardActiveCount: number | null,
): FetchCustomersResult {
  const { paginated, total, totalPages } = filterAndSortCustomers(records, filters)
  return {
    items: paginated,
    total,
    totalPages,
    summary: computeCustomerSummary(records),
    liveDashboardActiveCount,
    source: 'SIMULATION',
  }
}
