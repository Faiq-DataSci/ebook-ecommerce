import { describe, expect, it } from 'vitest'
import {
  calculateSawScores,
  normalizeSawMatrix,
  SIMULATION_SAW_CRITERIA,
  validateSawWeights,
  type SawAlternative,
  type SawCriterion,
} from '../../src/services/saw.service.js'
import { AppError } from '../../src/utils/app-error.js'

describe('SAW Calculation Engine Unit Tests', () => {
  // Dataset simulasi sesuai docs/03-saw/perhitungan-manual.md (DATA SIMULASI)
  const simulationAlternatives: SawAlternative[] = [
    {
      id: 'ebook-sim-001',
      title: 'DATA SIMULASI - Arsitektur Backend Modern',
      values: {
        price: 50000,
        ratingAvg: 4.5,
        salesCount: 120,
      },
    },
    {
      id: 'ebook-sim-002',
      title: 'DATA SIMULASI - Dasar Basis Data Relasional',
      values: {
        price: 75000,
        ratingAvg: 4.0,
        salesCount: 80,
      },
    },
    {
      id: 'ebook-sim-003',
      title: 'DATA SIMULASI - Panduan Praktis Flutter',
      values: {
        price: 40000,
        ratingAvg: 4.8,
        salesCount: 150,
      },
    },
  ]

  // TC-SAW-01: Verifikasi kecocokan hasil dengan perhitungan manual
  it('TC-SAW-01: matches exact manual calculation dataset from perhitungan-manual.md', () => {
    const results = calculateSawScores(simulationAlternatives, SIMULATION_SAW_CRITERIA)

    expect(results).toHaveLength(3)

    // Peringkat 1: A3 (Flutter)
    const rank1 = results[0]
    expect(rank1.ebookId).toBe('ebook-sim-003')
    expect(rank1.title).toBe('DATA SIMULASI - Panduan Praktis Flutter')
    expect(rank1.rank).toBe(1)
    expect(rank1.sawScore).toBeCloseTo(1.0, 6)
    expect(rank1.displayScore).toBe('1.000')

    // Peringkat 2: A1 (Backend)
    const rank2 = results[1]
    expect(rank2.ebookId).toBe('ebook-sim-001')
    expect(rank2.title).toBe('DATA SIMULASI - Arsitektur Backend Modern')
    expect(rank2.rank).toBe(2)
    // Nilai presisi penuh: (0.40 * 0.8) + (0.35 * 0.9375) + (0.25 * 0.8) = 0.848125
    expect(rank2.sawScore).toBeCloseTo(0.848125, 6)
    expect(rank2.displayScore).toBe('0.848')

    // Peringkat 3: A2 (Database)
    const rank3 = results[2]
    expect(rank3.ebookId).toBe('ebook-sim-002')
    expect(rank3.title).toBe('DATA SIMULASI - Dasar Basis Data Relasional')
    expect(rank3.rank).toBe(3)
    // Nilai presisi penuh: (0.40 * 8/15) + (0.35 * 5/6) + (0.25 * 8/15) = 19.15 / 30 = 0.6383333333333333
    expect(rank3.sawScore).toBeCloseTo(19.15 / 30, 6)
    expect(rank3.displayScore).toBe('0.638')
  })

  // TC-SAW-02: Konfigurasi bobot valid (sum = 1.0)
  it('TC-SAW-02: validates correct weights configuration where sum = 1.0', () => {
    expect(() => validateSawWeights(SIMULATION_SAW_CRITERIA)).not.toThrow()
  })

  // TC-SAW-03: Bobot tidak berjumlah 1.0
  it('TC-SAW-03: throws SAW_CONFIGURATION_INVALID when weights sum != 1.0', () => {
    const invalidCriteria: SawCriterion[] = [
      { id: 'C1', name: 'Harga', field: 'price', type: 'COST', weight: 0.5 },
      { id: 'C2', name: 'Rating', field: 'ratingAvg', type: 'BENEFIT', weight: 0.3 },
      { id: 'C3', name: 'Sales', field: 'salesCount', type: 'BENEFIT', weight: 0.1 }, // total = 0.9
    ]

    expect(() => validateSawWeights(invalidCriteria)).toThrow(AppError)
    expect(() => validateSawWeights(invalidCriteria)).toThrow('Total bobot kriteria SAW harus sama dengan 1.0')
  })

  // TC-SAW-04: Bobot bernilai negatif atau 0
  it('TC-SAW-04: throws SAW_CONFIGURATION_INVALID when weight is negative or zero', () => {
    const negativeCriteria: SawCriterion[] = [
      { id: 'C1', name: 'Harga', field: 'price', type: 'COST', weight: 0.6 },
      { id: 'C2', name: 'Rating', field: 'ratingAvg', type: 'BENEFIT', weight: 0.5 },
      { id: 'C3', name: 'Sales', field: 'salesCount', type: 'BENEFIT', weight: -0.1 },
    ]
    expect(() => validateSawWeights(negativeCriteria)).toThrow('tidak boleh bernilai negatif')

    const zeroCriteria: SawCriterion[] = [
      { id: 'C1', name: 'Harga', field: 'price', type: 'COST', weight: 0.7 },
      { id: 'C2', name: 'Rating', field: 'ratingAvg', type: 'BENEFIT', weight: 0.3 },
      { id: 'C3', name: 'Sales', field: 'salesCount', type: 'BENEFIT', weight: 0 },
    ]
    expect(() => validateSawWeights(zeroCriteria)).toThrow('harus lebih besar dari 0')
  })

  // TC-SAW-05: Normalisasi kriteria Benefit
  it('TC-SAW-05: normalizes Benefit criteria (ratingAvg: 4.5, 4.0, 4.8)', () => {
    const matrix = normalizeSawMatrix(simulationAlternatives, SIMULATION_SAW_CRITERIA)

    // max ratingAvg = 4.8
    // A1: 4.5 / 4.8 = 0.9375
    // A2: 4.0 / 4.8 = 0.8333333333333334
    // A3: 4.8 / 4.8 = 1.0
    expect(matrix.get('ebook-sim-001')?.['C2']).toBeCloseTo(4.5 / 4.8, 6)
    expect(matrix.get('ebook-sim-002')?.['C2']).toBeCloseTo(4.0 / 4.8, 6)
    expect(matrix.get('ebook-sim-003')?.['C2']).toBeCloseTo(1.0, 6)
  })

  // TC-SAW-06: Normalisasi kriteria Cost
  it('TC-SAW-06: normalizes Cost criteria (price: 50000, 75000, 40000)', () => {
    const matrix = normalizeSawMatrix(simulationAlternatives, SIMULATION_SAW_CRITERIA)

    // min price = 40000
    // A1: 40000 / 50000 = 0.8
    // A2: 40000 / 75000 = 0.5333333333333333
    // A3: 40000 / 40000 = 1.0
    expect(matrix.get('ebook-sim-001')?.['C1']).toBeCloseTo(0.8, 6)
    expect(matrix.get('ebook-sim-002')?.['C1']).toBeCloseTo(40000 / 75000, 6)
    expect(matrix.get('ebook-sim-003')?.['C1']).toBeCloseTo(1.0, 6)
  })

  // TC-SAW-07: Semua kandidat bernilai 0 pada satu kriteria
  it('TC-SAW-07: sets normalized score to 0 when all candidates have value 0 without NaN/Infinity', () => {
    const zeroSalesAlternatives: SawAlternative[] = [
      { id: 'ebk-1', title: 'Book 1', values: { price: 50000, ratingAvg: 4.0, salesCount: 0 } },
      { id: 'ebk-2', title: 'Book 2', values: { price: 50000, ratingAvg: 4.0, salesCount: 0 } },
    ]

    const matrix = normalizeSawMatrix(zeroSalesAlternatives, SIMULATION_SAW_CRITERIA)
    expect(matrix.get('ebk-1')?.['C3']).toBe(0)
    expect(matrix.get('ebk-2')?.['C3']).toBe(0)

    const scores = calculateSawScores(zeroSalesAlternatives, SIMULATION_SAW_CRITERIA)
    expect(Number.isFinite(scores[0].sawScore)).toBe(true)
    expect(Number.isFinite(scores[1].sawScore)).toBe(true)
  })

  // TC-SAW-08: Data kandidat e-book kosong
  it('TC-SAW-08: returns empty array when candidates list is empty', () => {
    const results = calculateSawScores([], SIMULATION_SAW_CRITERIA)
    expect(results).toEqual([])
  })

  // TC-SAW-09: Deterministik tie-breaker (A-Z) saat skor identik
  it('TC-SAW-09: breaks score ties deterministically by title alphabetically A-Z', () => {
    const tiedAlternatives: SawAlternative[] = [
      {
        id: 'ebk-zebra',
        title: 'DATA SIMULASI - Zebra Data Science',
        values: { price: 50000, ratingAvg: 4.0, salesCount: 100 },
      },
      {
        id: 'ebk-alfa',
        title: 'DATA SIMULASI - Alfa Algoritma Pemrograman',
        values: { price: 50000, ratingAvg: 4.0, salesCount: 100 },
      },
    ]

    const results = calculateSawScores(tiedAlternatives, SIMULATION_SAW_CRITERIA)

    // Keduanya punya nilai kriteria identik sehingga sawScore sama persis (1.0)
    expect(results[0].sawScore).toBeCloseTo(results[1].sawScore, 6)
    // Tie-breaker memastikan Alfa berada di peringkat 1 dan Zebra di peringkat 2
    expect(results[0].title).toBe('DATA SIMULASI - Alfa Algoritma Pemrograman')
    expect(results[0].rank).toBe(1)
    expect(results[1].title).toBe('DATA SIMULASI - Zebra Data Science')
    expect(results[1].rank).toBe(2)
  })

  // TC-SAW-10: Hanya satu kandidat e-book aktif
  it('TC-SAW-10: returns rank 1 with valid score 1.0 when only single candidate exists', () => {
    const singleAlt: SawAlternative[] = [
      {
        id: 'ebk-only-one',
        title: 'DATA SIMULASI - Buku Tunggal',
        values: { price: 50000, ratingAvg: 4.5, salesCount: 100 },
      },
    ]

    const results = calculateSawScores(singleAlt, SIMULATION_SAW_CRITERIA)

    expect(results).toHaveLength(1)
    expect(results[0].rank).toBe(1)
    expect(results[0].sawScore).toBeCloseTo(1.0, 6)
    expect(results[0].displayScore).toBe('1.000')
  })

  // TC-SAW-11: Kriteria kosong atau tidak valid
  it('TC-SAW-11: throws SAW_CONFIGURATION_INVALID when criteria is empty', () => {
    expect(() => calculateSawScores(simulationAlternatives, [])).toThrow(
      'Konfigurasi kriteria SAW tidak boleh kosong',
    )
  })

  // TC-SAW-12: E-book tanpa rating (ratingAvg = 0)
  it('TC-SAW-12: safely assigns r=0 for unrated ebook without throwing errors', () => {
    const withUnrated: SawAlternative[] = [
      {
        id: 'ebk-unrated',
        title: 'Buku Baru Belum Ada Rating',
        values: { price: 40000, ratingAvg: 0, salesCount: 10 },
      },
      {
        id: 'ebk-rated',
        title: 'Buku Populer Berating Tinggi',
        values: { price: 40000, ratingAvg: 5.0, salesCount: 100 },
      },
    ]

    const matrix = normalizeSawMatrix(withUnrated, SIMULATION_SAW_CRITERIA)
    expect(matrix.get('ebk-unrated')?.['C2']).toBe(0)
    expect(matrix.get('ebk-rated')?.['C2']).toBe(1.0)

    const results = calculateSawScores(withUnrated, SIMULATION_SAW_CRITERIA)
    expect(results[0].ebookId).toBe('ebk-rated')
    expect(results[1].ebookId).toBe('ebk-unrated')
    expect(Number.isFinite(results[1].sawScore)).toBe(true)
  })

  // TC-SAW-13: Pencegahan NaN dan Infinity pada seluruh output
  it('TC-SAW-13: ensures all scores are finite numbers (no NaN or Infinity)', () => {
    const edgeCases: SawAlternative[] = [
      {
        id: 'ebk-zeros',
        title: 'Buku Serba Nol',
        values: { price: 0, ratingAvg: 0, salesCount: 0 },
      },
      {
        id: 'ebk-normal',
        title: 'Buku Normal',
        values: { price: 50000, ratingAvg: 4.2, salesCount: 50 },
      },
    ]

    const results = calculateSawScores(edgeCases, SIMULATION_SAW_CRITERIA)
    for (const r of results) {
      expect(Number.isFinite(r.sawScore)).toBe(true)
      expect(Number.isNaN(r.sawScore)).toBe(false)
    }
  })

  // TC-SAW-15: Konsistensi pemanggilan berulang (idempotensi deterministik)
  it('TC-SAW-15: produces 100% identical rankings across repeated calls', () => {
    const run1 = calculateSawScores(simulationAlternatives, SIMULATION_SAW_CRITERIA)
    const run2 = calculateSawScores(simulationAlternatives, SIMULATION_SAW_CRITERIA)
    const run3 = calculateSawScores(simulationAlternatives, SIMULATION_SAW_CRITERIA)

    expect(run1).toEqual(run2)
    expect(run2).toEqual(run3)
  })
})
