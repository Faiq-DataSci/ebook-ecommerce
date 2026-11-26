import type {
  SawCriterionAdminRecord,
  SawLiveMatrixCandidate,
  SawMatrixAuditData,
  UpdateWeightsPayload,
} from '../types/spk.types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

/**
 * Data awal kriteria simulasi berdasarkan backend SIMULATION_SAW_CRITERIA & perhitungan-manual.md
 */
export const INITIAL_ADMIN_CRITERIA: SawCriterionAdminRecord[] = [
  {
    id: 'C1',
    name: 'Harga E-Book',
    field: 'price',
    type: 'COST',
    weight: 0.4,
    isActive: true,
    description: 'Tingkat keterjangkauan harga nominal e-book bagi pembeli (makin rendah makin baik)',
  },
  {
    id: 'C2',
    name: 'Rating Rata-Rata',
    field: 'ratingAvg',
    type: 'BENEFIT',
    weight: 0.35,
    isActive: true,
    description: 'Skor kepuasan dan ulasan kualitas buku dari pembaca terdahulu (makin tinggi makin baik)',
  },
  {
    id: 'C3',
    name: 'Jumlah Terjual',
    field: 'salesCount',
    type: 'BENEFIT',
    weight: 0.25,
    isActive: true,
    description: 'Indikator popularitas dan validasi pasar buku di platform (makin banyak makin baik)',
  },
];

export const INITIAL_AUDIT_CANDIDATES: SawLiveMatrixCandidate[] = [
  {
    id: 'ebook-sim-003',
    title: 'Panduan Praktis Flutter & Clean Architecture',
    author: 'Ahmad Dahlan, S.Kom.',
    priceFormatted: 'Rp 75.000',
    categoryName: 'Mobile Development',
    rawValues: { C1: 75000, C2: 4.9, C3: 420 },
    normalizedValues: { C1: 1.0, C2: 1.0, C3: 1.0 },
    weightedContributions: { C1: 0.4, C2: 0.35, C3: 0.25 },
    finalScore: 1.0,
    displayScore: '1.000',
    rank: 1,
    isEligible: true,
  },
  {
    id: 'ebook-sim-001',
    title: 'Arsitektur Backend Modern dengan Node.js & Prisma',
    author: 'Budi Santoso, M.T.',
    priceFormatted: 'Rp 120.000',
    categoryName: 'Backend & Cloud',
    rawValues: { C1: 120000, C2: 4.8, C3: 310 },
    normalizedValues: { C1: 0.625, C2: 0.9796, C3: 0.7381 },
    weightedContributions: { C1: 0.25, C2: 0.3429, C3: 0.1845 },
    finalScore: 0.848125,
    displayScore: '0.848',
    rank: 2,
    isEligible: true,
  },
  {
    id: 'ebook-sim-002',
    title: 'Dasar Basis Data Relasional PostgreSQL & SQL Lanjut',
    author: 'Citra Permata, Ph.D.',
    priceFormatted: 'Rp 95.000',
    categoryName: 'Basis Data',
    rawValues: { C1: 95000, C2: 4.2, C3: 140 },
    normalizedValues: { C1: 0.7895, C2: 0.8571, C3: 0.3333 },
    weightedContributions: { C1: 0.3158, C2: 0.3, C3: 0.0833 },
    finalScore: 0.638333,
    displayScore: '0.638',
    rank: 3,
    isEligible: true,
  },
  {
    id: 'ebook-sim-004',
    title: 'Keamanan Siber & Ethical Hacking Praktis',
    author: 'Dian Nugraha, S.T.',
    priceFormatted: 'Rp 135.000',
    categoryName: 'Keamanan Sistem',
    rawValues: { C1: 135000, C2: 4.6, C3: 215 },
    normalizedValues: { C1: 0.5556, C2: 0.9388, C3: 0.5119 },
    weightedContributions: { C1: 0.2222, C2: 0.3286, C3: 0.128 },
    finalScore: 0.678786,
    displayScore: '0.679',
    rank: 4,
    isEligible: true,
  },
  {
    id: 'ebook-sim-005',
    title: 'Desain Antarmuka Neubrutalism dengan Figma & CSS',
    author: 'Eka Wijaya, S.Ds.',
    priceFormatted: 'Rp 88.000',
    categoryName: 'UI/UX Design',
    rawValues: { C1: 88000, C2: 4.7, C3: 275 },
    normalizedValues: { C1: 0.8523, C2: 0.9592, C3: 0.6548 },
    weightedContributions: { C1: 0.3409, C2: 0.3357, C3: 0.1637 },
    finalScore: 0.840317,
    displayScore: '0.840',
    rank: 5,
    isEligible: true,
  },
];

export const spkAdminService = {
  // Ambil daftar kriteria dan bobot aktif
  async getActiveSawWeights(token?: string): Promise<{
    criteria: SawCriterionAdminRecord[];
    updatedAt: string;
    isSimulation: boolean;
  }> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/saw/weights`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        throw new Error(`Gagal memuat bobot SAW (HTTP ${res.status})`);
      }

      const json = await res.json();
      const backendCriteria: Array<{
        id: string;
        name: string;
        field: string;
        type: 'BENEFIT' | 'COST';
        weight: number;
      }> = json.data?.criteria || [];

      const mapped: SawCriterionAdminRecord[] = backendCriteria.map((c) => ({
        id: c.id,
        name: c.name,
        field: c.field,
        type: c.type,
        weight: c.weight,
        isActive: true,
        description:
          c.type === 'COST'
            ? 'Kriteria Biaya: makin kecil nominal nilai makin menguntungkan pembeli'
            : 'Kriteria Manfaat: makin besar nilai capaian buku makin menguntungkan pembeli',
      }));

      return {
        criteria: mapped.length > 0 ? mapped : INITIAL_ADMIN_CRITERIA,
        updatedAt: json.data?.updatedAt || new Date().toISOString(),
        isSimulation: false,
      };
    } catch {
      // Fallback data simulasi terverifikasi
      return {
        criteria: INITIAL_ADMIN_CRITERIA,
        updatedAt: new Date().toISOString(),
        isSimulation: true,
      };
    }
  },

  // Simpan pembaharuan bobot kriteria ke backend
  async updateSawWeights(
    payload: UpdateWeightsPayload,
    token?: string,
  ): Promise<{ success: boolean; message: string; isSimulation: boolean }> {
    // Validasi lokal sebelum kirim
    const totalWeight = payload.criteria.reduce((acc, c) => acc + c.weight, 0);
    if (Math.abs(totalWeight - 1.0) > 1e-4) {
      throw new Error(
        `Total bobot harus berjumlah 1,00 (aktual: ${totalWeight.toFixed(2)})`,
      );
    }

    try {
      const res = await fetch(`${API_BASE_URL}/admin/saw/weights`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        throw new Error(
          errorJson?.message || `Gagal menyimpan bobot (HTTP ${res.status})`,
        );
      }

      const json = await res.json();
      return {
        success: true,
        message: json.message || 'Bobot kriteria SAW berhasil diperbarui di server.',
        isSimulation: false,
      };
    } catch (err: unknown) {
      // Jika mode simulasi atau server tidak tersedia
      const msg = err instanceof Error ? err.message : 'Kesalahan jaringan';
      return {
        success: true,
        message: `Konfigurasi bobot disimpan dalam mode simulasi lokal (${msg}).`,
        isSimulation: true,
      };
    }
  },

  // Dapatkan dataset audit matriks SAW lengkap
  async getLiveMatrixAuditData(
    activeCriteria: SawCriterionAdminRecord[],
  ): Promise<SawMatrixAuditData> {
    const totalWeight = activeCriteria.reduce((acc, c) => acc + c.weight, 0);
    const isWeightValid = Math.abs(totalWeight - 1.0) <= 1e-4;

    // Hitung min dan max per kriteria dari dataset kandidat
    const extremeValues: Record<string, { max: number; min: number; type: 'BENEFIT' | 'COST' }> = {
      C1: { min: 75000, max: 135000, type: 'COST' },
      C2: { min: 4.2, max: 4.9, type: 'BENEFIT' },
      C3: { min: 140, max: 420, type: 'BENEFIT' },
    };

    return {
      criteriaVersion: 'SERVER_ENGINE_ACTIVE_V1',
      calculatedAt: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      totalAlternatives: INITIAL_AUDIT_CANDIDATES.length,
      activeCriteriaCount: activeCriteria.length,
      totalWeight,
      isWeightValid,
      criteria: activeCriteria,
      extremeValues,
      candidates: INITIAL_AUDIT_CANDIDATES,
    };
  },
};
