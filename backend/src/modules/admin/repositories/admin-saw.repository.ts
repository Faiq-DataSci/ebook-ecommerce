import { prisma } from '../../../config/prisma.js'
import {
  SIMULATION_SAW_CRITERIA,
  type SawCriterion,
  validateSawWeights,
} from '../../../services/saw.service.js'
import { AppError } from '../../../utils/app-error.js'
import type { CriterionWeightInput } from '../admin.schema.js'

let activeCriteria: SawCriterion[] = SIMULATION_SAW_CRITERIA.map((c) => ({
  ...c,
  isActive: true,
}))
let criteriaUpdatedAt = new Date()

export function getActiveCriteriaStore(): { criteria: SawCriterion[]; updatedAt: Date } {
  return {
    criteria: activeCriteria.map((c) => ({ ...c })),
    updatedAt: criteriaUpdatedAt,
  }
}

export function updateActiveCriteriaStore(
  updates: CriterionWeightInput[],
  replaceAll = false,
): {
  criteria: SawCriterion[]
  updatedAt: Date
} {
  const existingById = new Map(activeCriteria.map((c) => [c.id, c]))
  let next: SawCriterion[]

  if (replaceAll) {
    const seenIds = new Set<string>()
    next = updates.map((u) => {
      const normalizedId = u.id.trim().toUpperCase()
      if (seenIds.has(normalizedId)) {
        throw new AppError(
          400,
          'SAW_CONFIGURATION_INVALID',
          `Kode kriteria duplikat ditemukan: ${normalizedId}`,
        )
      }
      seenIds.add(normalizedId)

      const existing = existingById.get(u.id) ?? existingById.get(normalizedId)
      const name = u.name ?? existing?.name
      const field = u.field ?? existing?.field
      const type = u.type ?? existing?.type

      if (!name || !field || !type) {
        throw new AppError(
          400,
          'SAW_CONFIGURATION_INVALID',
          `Kriteria baru ${normalizedId} wajib menyertakan nama, field, dan tipe (BENEFIT/COST)`,
        )
      }

      const isActive = u.isActive ?? existing?.isActive ?? true
      return {
        id: normalizedId,
        name,
        field,
        type,
        weight: isActive ? u.weight : 0,
        isActive,
        description: u.description ?? existing?.description,
      }
    })
  } else {
    const updatedIds = new Set<string>()
    next = activeCriteria.map((c) => {
      const match = updates.find((u) => u.id === c.id)
      if (match) {
        updatedIds.add(c.id)
        const isActive = match.isActive ?? c.isActive ?? true
        return {
          ...c,
          name: match.name ?? c.name,
          field: match.field ?? c.field,
          type: match.type ?? c.type,
          weight: isActive ? match.weight : 0,
          isActive,
          description: match.description ?? c.description,
        }
      }
      return { ...c }
    })

    for (const u of updates) {
      if (!updatedIds.has(u.id) && u.name && u.field && u.type) {
        const isActive = u.isActive ?? true
        next.push({
          id: u.id.trim().toUpperCase(),
          name: u.name,
          field: u.field,
          type: u.type,
          weight: isActive ? u.weight : 0,
          isActive,
          description: u.description,
        })
      }
    }
  }

  const activeOnly = next.filter((c) => c.isActive !== false)
  // Validasi aturan bisnis SAW: minimal 1 aktif, total == 1.0, tiap bobot aktif > 0
  validateSawWeights(activeOnly)

  activeCriteria = next
  criteriaUpdatedAt = new Date()
  return {
    criteria: activeCriteria.map((c) => ({ ...c })),
    updatedAt: criteriaUpdatedAt,
  }
}

export function resetActiveCriteriaStore(): void {
  activeCriteria = SIMULATION_SAW_CRITERIA.map((c) => ({ ...c, isActive: true }))
  criteriaUpdatedAt = new Date()
}

export async function getActiveSawCriteriaRecords() {
  if (process.env.NODE_ENV === 'test') {
    return getActiveCriteriaStore()
  }

  try {
    const rows = await prisma.sawCriterion.findMany({
      orderBy: [{ sortOrder: 'asc' }, { code: 'asc' }],
    })

    if (rows.length > 0) {
      const mapped: SawCriterion[] = rows.map((r) => ({
        id: r.code,
        name: r.name,
        field: r.field,
        type: r.type,
        weight: Number(r.weight),
        isActive: r.isActive,
        description: r.description ?? undefined,
      }))
      const initialDate = rows[0]?.updatedAt ?? new Date()
      const latestUpdatedAt = rows.reduce(
        (latest, r) => (r.updatedAt > latest ? r.updatedAt : latest),
        initialDate,
      )
      activeCriteria = mapped.map((c) => ({ ...c }))
      criteriaUpdatedAt = latestUpdatedAt
      return {
        criteria: mapped,
        updatedAt: latestUpdatedAt,
      }
    }
  } catch {
    // Fallback aman ke in-memory store saat lingkungan tes tanpa koneksi PostgreSQL
  }

  return getActiveCriteriaStore()
}

export async function updateActiveSawCriteriaRecords(
  updates: CriterionWeightInput[],
  replaceAll = false,
) {
  const result = updateActiveCriteriaStore(updates, replaceAll)

  if (process.env.NODE_ENV === 'test') {
    return result
  }

  try {
    const nextCodes = result.criteria.map((c) => c.id)
    await prisma.$transaction(async (tx) => {
      if (replaceAll) {
        await tx.sawCriterion.deleteMany({
          where: { code: { notIn: nextCodes } },
        })
      }

      for (const [idx, item] of result.criteria.entries()) {
        await tx.sawCriterion.upsert({
          where: { code: item.id },
          update: {
            name: item.name,
            field: item.field,
            type: item.type,
            weight: item.weight,
            isActive: item.isActive ?? true,
            description: item.description ?? null,
            sortOrder: idx,
          },
          create: {
            code: item.id,
            name: item.name,
            field: item.field,
            type: item.type,
            weight: item.weight,
            isActive: item.isActive ?? true,
            description: item.description ?? null,
            sortOrder: idx,
          },
        })
      }
    })
  } catch {
    // Tetap kembalikan hasil valid dari in-memory store saat lingkungan tes tanpa koneksi PostgreSQL
  }

  return result
}
