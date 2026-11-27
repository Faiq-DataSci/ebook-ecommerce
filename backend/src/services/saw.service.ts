import { AppError } from '../utils/app-error.js'

export type CriterionType = 'BENEFIT' | 'COST'

export interface SawCriterion {
  id: string
  name: string
  field: string
  type: CriterionType
  weight: number
  isActive?: boolean
  description?: string
}

export interface SawAlternative {
  id: string
  title: string
  values: Record<string, number>
  [key: string]: unknown
}

export interface SawRecommendationResult {
  rank: number
  ebookId: string
  title: string
  sawScore: number
  displayScore: string
  normalizedValues: Record<string, number>
  rawValues: Record<string, number>
  [key: string]: unknown
}

/**
 * Konfigurasi kriteria simulasi berdasarkan docs/03-saw/perhitungan-manual.md (DATA SIMULASI)
 */
export const SIMULATION_SAW_CRITERIA: SawCriterion[] = [
  { id: 'C1', name: 'Harga E-Book', field: 'price', type: 'COST', weight: 0.4 },
  { id: 'C2', name: 'Rating Rata-Rata', field: 'ratingAvg', type: 'BENEFIT', weight: 0.35 },
  { id: 'C3', name: 'Jumlah Terjual', field: 'salesCount', type: 'BENEFIT', weight: 0.25 },
]

/**
 * Validasi bobot kriteria SAW:
 * 1. Minimal 1 kriteria aktif.
 * 2. Seluruh bobot numerik terdefinisi dan > 0.
 * 3. Total bobot harus sama dengan 1.0 (toleransi 1e-6).
 */
export function validateSawWeights(criteria: SawCriterion[]): void {
  if (!criteria || criteria.length === 0) {
    throw new AppError(400, 'SAW_CONFIGURATION_INVALID', 'Konfigurasi kriteria SAW tidak boleh kosong')
  }

  let totalWeight = 0

  for (const criterion of criteria) {
    if (typeof criterion.weight !== 'number' || !Number.isFinite(criterion.weight)) {
      throw new AppError(
        400,
        'SAW_CONFIGURATION_INVALID',
        `Bobot kriteria ${criterion.id} harus berupa angka numerik valid`,
      )
    }

    if (criterion.weight < 0) {
      throw new AppError(
        400,
        'SAW_CONFIGURATION_INVALID',
        `Bobot kriteria ${criterion.id} tidak boleh bernilai negatif`,
      )
    }

    if (criterion.weight === 0) {
      throw new AppError(
        400,
        'SAW_CONFIGURATION_INVALID',
        `Bobot kriteria aktif ${criterion.id} harus lebih besar dari 0`,
      )
    }

    if (criterion.type !== 'BENEFIT' && criterion.type !== 'COST') {
      throw new AppError(
        400,
        'SAW_CONFIGURATION_INVALID',
        `Tipe kriteria harus BENEFIT atau COST: ${criterion.id}`,
      )
    }

    totalWeight += criterion.weight
  }

  if (Math.abs(totalWeight - 1.0) > 1e-6) {
    throw new AppError(
      400,
      'SAW_CONFIGURATION_INVALID',
      `Total bobot kriteria SAW harus sama dengan 1.0 (aktual: ${totalWeight.toFixed(6)})`,
    )
  }
}

/**
 * Normalisasi matriks keputusan (Benefit/Cost):
 * - Benefit: r_ij = x_ij / max(x_j) (jika max <= 0, r_ij = 0 untuk mencegah NaN)
 * - Cost: r_ij = min(x_j) / x_ij (jika semua 0, r_ij = 0; jika x_ij == 0, r_ij = 1.0; cegah Infinity)
 * Presisi penuh dipertahankan tanpa pembulatan di tengah kalkulasi.
 */
export function normalizeSawMatrix(
  alternatives: SawAlternative[],
  criteria: SawCriterion[],
): Map<string, Record<string, number>> {
  const result = new Map<string, Record<string, number>>()

  if (!alternatives || alternatives.length === 0) {
    return result
  }

  // Inisialisasi map hasil per alternatif
  for (const alt of alternatives) {
    result.set(alt.id, {})
  }

  for (const criterion of criteria) {
    const rawValues: number[] = []

    for (const alt of alternatives) {
      const val = alt.values[criterion.id] ?? alt.values[criterion.field] ?? 0
      if (typeof val !== 'number' || !Number.isFinite(val)) {
        throw new AppError(
          400,
          'SAW_DATA_INVALID',
          `Nilai kriteria ${criterion.id} untuk alternatif ${alt.id} tidak valid`,
        )
      }
      if (val < 0) {
        throw new AppError(
          400,
          'SAW_DATA_INVALID',
          `Nilai kriteria ${criterion.id} untuk alternatif ${alt.id} tidak boleh negatif`,
        )
      }
      rawValues.push(val)
    }

    if (criterion.type === 'BENEFIT') {
      const maxVal = Math.max(...rawValues)

      for (const alt of alternatives) {
        const val = alt.values[criterion.id] ?? alt.values[criterion.field] ?? 0
        let r_ij = 0
        if (maxVal > 0) {
          r_ij = val / maxVal
        }
        result.get(alt.id)![criterion.id] = r_ij
      }
    } else {
      // COST criterion
      const minVal = Math.min(...rawValues)
      const maxVal = Math.max(...rawValues)

      for (const alt of alternatives) {
        const val = alt.values[criterion.id] ?? alt.values[criterion.field] ?? 0
        let r_ij = 0

        if (minVal === 0 && maxVal === 0) {
          // Semua alternatif bernilai 0: tetapkan 0 (EC-03 / TC-SAW-07)
          r_ij = 0
        } else if (val === 0) {
          // Biaya 0 (misal gratis): utilitas maksimal 1.0 (EC-05)
          r_ij = 1.0
        } else if (minVal === 0) {
          // Ada kandidat berbiaya 0, kandidat ini bernilai > 0
          r_ij = 0
        } else {
          // Standar: min / x_ij
          r_ij = minVal / val
        }

        result.get(alt.id)![criterion.id] = r_ij
      }
    }
  }

  return result
}

/**
 * Menghitung skor preferensi V_i, mengurutkan hasil, menerapkan tie-breaker deterministik (A-Z),
 * serta menetapkan peringkat dan skor tampilan.
 */
export function calculateSawScores(
  alternatives: SawAlternative[],
  criteria: SawCriterion[] = SIMULATION_SAW_CRITERIA,
): SawRecommendationResult[] {
  if (!alternatives || alternatives.length === 0) {
    return []
  }

  validateSawWeights(criteria)

  const normalizedMatrix = normalizeSawMatrix(alternatives, criteria)

  const scoredItems: Array<{
    ebookId: string
    title: string
    sawScore: number
    normalizedValues: Record<string, number>
    rawValues: Record<string, number>
  }> = []

  for (const alt of alternatives) {
    const normalized = normalizedMatrix.get(alt.id) || {}
    let v_i = 0

    for (const criterion of criteria) {
      const r_ij = normalized[criterion.id] ?? 0
      v_i += criterion.weight * r_ij
    }

    // Pastikan tidak ada NaN atau Infinity
    const finalScore = Number.isFinite(v_i) ? v_i : 0

    const rawValues: Record<string, number> = {}
    for (const criterion of criteria) {
      rawValues[criterion.id] = alt.values[criterion.id] ?? alt.values[criterion.field] ?? 0
    }

    scoredItems.push({
      ebookId: alt.id,
      title: alt.title,
      sawScore: finalScore,
      normalizedValues: normalized,
      rawValues,
    })
  }

  // Pengurutan ranking:
  // 1. Skor presisi penuh tertinggi menduduki peringkat teratas (descending)
  // 2. Tie-breaker deterministik (FR-S04, TC-SAW-09): Jika skor identik (|a - b| <= 1e-12), urutkan judul A-Z
  // 3. Fallback ID unik (A-Z) jika judul juga identik
  scoredItems.sort((a, b) => {
    if (Math.abs(b.sawScore - a.sawScore) > 1e-12) {
      return b.sawScore - a.sawScore
    }

    const titleCompare = a.title.localeCompare(b.title, 'id', { sensitivity: 'base' })
    if (titleCompare !== 0) {
      return titleCompare
    }

    return a.ebookId.localeCompare(b.ebookId)
  })

  // Berikan rank (1-indexed) dan displayScore (format 3 desimal untuk UI)
  return scoredItems.map((item, index) => ({
    rank: index + 1,
    ebookId: item.ebookId,
    title: item.title,
    sawScore: item.sawScore,
    displayScore: item.sawScore.toFixed(3),
    normalizedValues: item.normalizedValues,
    rawValues: item.rawValues,
  }))
}
