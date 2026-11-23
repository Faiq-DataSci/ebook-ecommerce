import { prisma } from '../../config/prisma.js'
import {
  SIMULATION_SAW_CRITERIA,
  type SawCriterion,
  validateSawWeights,
} from '../../services/saw.service.js'

export interface DashboardSummary {
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
}

// In-memory persistent store for active criteria (default dari SIMULATION_SAW_CRITERIA)
let activeCriteria: SawCriterion[] = SIMULATION_SAW_CRITERIA.map((c) => ({ ...c }))
let criteriaUpdatedAt = new Date()

export function getActiveCriteriaStore(): { criteria: SawCriterion[]; updatedAt: Date } {
  return {
    criteria: activeCriteria.map((c) => ({ ...c })),
    updatedAt: criteriaUpdatedAt,
  }
}

export function updateActiveCriteriaStore(updates: { id: string; weight: number }[]): {
  criteria: SawCriterion[]
  updatedAt: Date
} {
  const next = activeCriteria.map((c) => {
    const match = updates.find((u) => u.id === c.id)
    if (match) {
      return { ...c, weight: match.weight }
    }
    return { ...c }
  })

  // Validasi aturan bisnis SAW (total == 1.0, tiap bobot > 0)
  validateSawWeights(next)

  activeCriteria = next
  criteriaUpdatedAt = new Date()
  return {
    criteria: activeCriteria.map((c) => ({ ...c })),
    updatedAt: criteriaUpdatedAt,
  }
}

export function resetActiveCriteriaStore(): void {
  activeCriteria = SIMULATION_SAW_CRITERIA.map((c) => ({ ...c }))
  criteriaUpdatedAt = new Date()
}

export class AdminRepository {
  async getDashboardSummary(): Promise<DashboardSummary> {
    // 1. Total revenue dari transaksi yang tercatat
    const revenueSum = await prisma.transaction.aggregate({
      _sum: { amount: true },
    })
    const totalRevenue = revenueSum._sum.amount ? Number(revenueSum._sum.amount) : 0

    // 2. Orders per status
    const groupedOrders = await prisma.order.groupBy({
      by: ['status'],
      _count: true,
    })
    const ordersCount = {
      PENDING: 0,
      PAID: 0,
      FAILED: 0,
      EXPIRED: 0,
      CANCELLED: 0,
      total: 0,
    }
    for (const item of groupedOrders) {
      if (item.status in ordersCount) {
        ordersCount[item.status as keyof typeof ordersCount] = item._count
        ordersCount.total += item._count
      }
    }

    // 3. Ebook aktif
    const activeEbooksCount = await prisma.ebook.count({
      where: { isActive: true },
    })

    // 4. Pelanggan aktif
    const activeCustomersCount = await prisma.user.count({
      where: { role: 'CUSTOMER', isActive: true },
    })

    return {
      totalRevenue,
      ordersCount,
      activeEbooksCount,
      activeCustomersCount,
    }
  }

  getActiveSawCriteria() {
    return getActiveCriteriaStore()
  }

  updateActiveSawCriteria(updates: { id: string; weight: number }[]) {
    return updateActiveCriteriaStore(updates)
  }
}

export const adminRepository = new AdminRepository()
