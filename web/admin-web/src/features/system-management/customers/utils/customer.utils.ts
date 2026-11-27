import type {
  CustomerRecord,
  CustomerSummaryMetrics,
  CustomerTableFilters,
} from '../types/customer.types'

export function formatIndonesianDate(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatIndonesianDateTime(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function computeCustomerSummary(
  records: CustomerRecord[],
): CustomerSummaryMetrics {
  const now = Date.now()
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000

  let activeCustomers = 0
  let inactiveCustomers = 0
  let newCustomersLast30Days = 0

  for (const item of records) {
    if (item.isActive) {
      activeCustomers += 1
    } else {
      inactiveCustomers += 1
    }

    const createdMs = new Date(item.createdAt).getTime()
    if (!Number.isNaN(createdMs) && now - createdMs <= thirtyDaysMs) {
      newCustomersLast30Days += 1
    }
  }

  return {
    totalCustomers: records.length,
    activeCustomers,
    inactiveCustomers,
    newCustomersLast30Days,
  }
}

export function filterAndSortCustomers(
  records: CustomerRecord[],
  filters: CustomerTableFilters,
): {
  paginated: CustomerRecord[]
  total: number
  totalPages: number
} {
  const keyword = filters.search.trim().toLowerCase()

  const filtered = records.filter((item) => {
    if (filters.status === 'ACTIVE' && !item.isActive) return false
    if (filters.status === 'INACTIVE' && item.isActive) return false
    if (filters.role !== 'ALL' && item.role !== filters.role) return false

    if (keyword) {
      const hay = `${item.fullName} ${item.email} ${item.phone ?? ''}`.toLowerCase()
      if (!hay.includes(keyword)) return false
    }

    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    const dir = filters.sortOrder === 'asc' ? 1 : -1

    switch (filters.sortBy) {
      case 'fullName':
        return a.fullName.localeCompare(b.fullName, 'id-ID') * dir
      case 'totalSpent':
        return (a.totalSpent - b.totalSpent) * dir
      case 'isActive':
        return (Number(a.isActive) - Number(b.isActive)) * dir
      case 'createdAt':
      default:
        return (
          (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) *
          dir
        )
    }
  })

  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / filters.limit))
  const safePage = Math.min(Math.max(1, filters.page), totalPages)
  const start = (safePage - 1) * filters.limit

  return {
    paginated: sorted.slice(start, start + filters.limit),
    total,
    totalPages,
  }
}
