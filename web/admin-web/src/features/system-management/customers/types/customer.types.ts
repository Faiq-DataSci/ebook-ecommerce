/**
 * Tipe data domain Pelanggan & User.
 * Diselaraskan dengan model Prisma `User`, `Order`, `Transaction`, dan `EbookAccess`.
 * KEAMANAN: Tidak pernah menyertakan password, passwordHash, atau session token.
 */

export type UserRole = 'CUSTOMER' | 'ADMIN'

export type CustomerStatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE'
export type CustomerRoleFilter = 'ALL' | UserRole
export type CustomerSortField = 'fullName' | 'createdAt' | 'totalSpent' | 'isActive'
export type SortDirection = 'asc' | 'desc'

export interface CustomerOrderSummary {
  id: string
  orderNumber: string
  totalAmount: number
  status: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'CANCELLED'
  createdAt: string
  itemCount: number
}

export interface CustomerEbookAccessRecord {
  id: string
  ebookId: string
  ebookTitle: string
  ebookAuthor: string
  orderNumber: string
  grantedAt: string
  isRevoked: boolean
}

export interface CustomerRecord {
  id: string
  fullName: string
  email: string
  phone: string | null
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
  ordersCount: number
  paidOrdersCount: number
  totalSpent: number
  ownedEbooksCount: number
  activeAccessCount: number
  orders?: CustomerOrderSummary[]
  ebookAccesses?: CustomerEbookAccessRecord[]
}

export interface CustomerSummaryMetrics {
  totalCustomers: number
  activeCustomers: number
  inactiveCustomers: number
  newCustomersLast30Days: number
}

export interface CustomerTableFilters {
  search: string
  status: CustomerStatusFilter
  role: CustomerRoleFilter
  sortBy: CustomerSortField
  sortOrder: SortDirection
  page: number
  limit: number
}

export type CustomerDataSource = 'LIVE' | 'SIMULATION' | 'UNAVAILABLE'

export interface FetchCustomersResult {
  items: CustomerRecord[]
  total: number
  totalPages: number
  summary: CustomerSummaryMetrics | null
  liveDashboardActiveCount: number | null
  source: CustomerDataSource
  errorMessage?: string
}
