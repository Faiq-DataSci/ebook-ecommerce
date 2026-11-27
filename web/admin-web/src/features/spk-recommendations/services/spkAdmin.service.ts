import { apiClient, ApiError } from '../../../services/api/apiClient';
import type {
  SawCriterionAdminRecord,
  SawCriterionField,
  SawLiveMatrixCandidate,
  SawMatrixAuditData,
  UpdateWeightsPayload,
} from '../types/spk.types';

const VALID_FIELDS = new Set<SawCriterionField>([
  'price',
  'ratingAvg',
  'salesCount',
  'pageCount',
  'publishedYear',
]);

function normalizeField(field: string): SawCriterionField {
  return VALID_FIELDS.has(field as SawCriterionField)
    ? (field as SawCriterionField)
    : 'price';
}

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

interface SimulationBookSeed {
  id: string;
  title: string;
  author: string;
  priceFormatted: string;
  categoryName: string;
  fields: Record<SawCriterionField, number>;
}

const SIMULATION_AUDIT_SEEDS: SimulationBookSeed[] = [
  {
    id: 'ebook-sim-003',
    title: 'Panduan Praktis Flutter & Clean Architecture',
    author: 'Ahmad Dahlan, S.Kom.',
    priceFormatted: 'Rp 75.000',
    categoryName: 'Mobile Development',
    fields: { price: 75000, ratingAvg: 4.9, salesCount: 420, pageCount: 340, publishedYear: 2025 },
  },
  {
    id: 'ebook-sim-001',
    title: 'Arsitektur Backend Modern dengan Node.js & Prisma',
    author: 'Budi Santoso, M.T.',
    priceFormatted: 'Rp 120.000',
    categoryName: 'Backend & Cloud',
    fields: { price: 120000, ratingAvg: 4.8, salesCount: 310, pageCount: 410, publishedYear: 2025 },
  },
  {
    id: 'ebook-sim-002',
    title: 'Dasar Basis Data Relasional PostgreSQL & SQL Lanjut',
    author: 'Citra Permata, Ph.D.',
    priceFormatted: 'Rp 95.000',
    categoryName: 'Basis Data',
    fields: { price: 95000, ratingAvg: 4.2, salesCount: 140, pageCount: 280, publishedYear: 2023 },
  },
  {
    id: 'ebook-sim-004',
    title: 'Keamanan Siber & Ethical Hacking Praktis',
    author: 'Dian Nugraha, S.T.',
    priceFormatted: 'Rp 135.000',
    categoryName: 'Keamanan Sistem',
    fields: { price: 135000, ratingAvg: 4.6, salesCount: 215, pageCount: 390, publishedYear: 2024 },
  },
  {
    id: 'ebook-sim-005',
    title: 'Desain Antarmuka Neubrutalism dengan Figma & CSS',
    author: 'Eka Wijaya, S.Ds.',
    priceFormatted: 'Rp 88.000',
    categoryName: 'UI/UX Design',
    fields: { price: 88000, ratingAvg: 4.7, salesCount: 275, pageCount: 245, publishedYear: 2026 },
  },
];

function computeDynamicAuditMatrix(
  criteriaList: SawCriterionAdminRecord[],
): Pick<SawMatrixAuditData, 'extremeValues' | 'candidates'> {
  const enabledCriteria = criteriaList.filter((c) => c.isActive);
  const extremeValues: Record<string, { max: number; min: number; type: 'BENEFIT' | 'COST' }> = {};

  for (const crit of enabledCriteria) {
    const vals = SIMULATION_AUDIT_SEEDS.map((s) => s.fields[crit.field] ?? 0);
    extremeValues[crit.id] = {
      min: vals.length > 0 ? Math.min(...vals) : 0,
      max: vals.length > 0 ? Math.max(...vals) : 0,
      type: crit.type,
    };
  }

  const computed: SawLiveMatrixCandidate[] = SIMULATION_AUDIT_SEEDS.map((seed) => {
    const rawValues: Record<string, number> = {};
    const normalizedValues: Record<string, number> = {};
    const weightedContributions: Record<string, number> = {};
    let finalScore = 0;

    for (const crit of enabledCriteria) {
      const val = seed.fields[crit.field] ?? 0;
      const ext = extremeValues[crit.id];
      rawValues[crit.id] = val;

      let norm: number;
      if (crit.type === 'BENEFIT') {
        norm = ext.max > 0 ? val / ext.max : 0;
      } else {
        if (ext.min === 0 && ext.max === 0) norm = 0;
        else if (val === 0) norm = 1;
        else if (ext.min === 0) norm = 0;
        else norm = ext.min / val;
      }

      const contrib = crit.weight * norm;
      normalizedValues[crit.id] = norm;
      weightedContributions[crit.id] = contrib;
      finalScore += contrib;
    }

    return {
      id: seed.id,
      title: seed.title,
      author: seed.author,
      priceFormatted: seed.priceFormatted,
      categoryName: seed.categoryName,
      rawValues,
      normalizedValues,
      weightedContributions,
      finalScore,
      displayScore: finalScore.toFixed(3),
      rank: 0,
      isEligible: true,
    };
  });

  computed.sort((a, b) => {
    if (Math.abs(b.finalScore - a.finalScore) > 1e-12) {
      return b.finalScore - a.finalScore;
    }
    return a.title.localeCompare(b.title, 'id', { sensitivity: 'base' });
  });

  computed.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  return { extremeValues, candidates: computed };
}

export const spkAdminService = {
  // Ambil daftar kriteria dan bobot aktif
  async getActiveSawWeights(token?: string): Promise<{
    criteria: SawCriterionAdminRecord[];
    updatedAt: string;
    isSimulation: boolean;
  }> {
    try {
      const json = await apiClient.get<{
        criteria?: Array<{
          id: string;
          name: string;
          field: string;
          type: 'BENEFIT' | 'COST';
          weight: number;
          isActive?: boolean;
          description?: string;
        }>;
        updatedAt?: string;
      }>('/admin/saw/weights', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const backendCriteria = json.data?.criteria || [];

      const mapped: SawCriterionAdminRecord[] = backendCriteria.map((c) => ({
        id: c.id,
        name: c.name,
        field: normalizeField(c.field),
        type: c.type,
        weight: c.weight,
        isActive: c.isActive !== false,
        description:
          c.description ||
          (c.type === 'COST'
            ? 'Kriteria Biaya: makin kecil nominal nilai makin menguntungkan pembeli'
            : 'Kriteria Manfaat: makin besar nilai capaian buku makin menguntungkan pembeli'),
      }));

      return {
        criteria: mapped.length > 0 ? mapped : INITIAL_ADMIN_CRITERIA,
        updatedAt: json.data?.updatedAt || new Date().toISOString(),
        isSimulation: false,
      };
    } catch {
      // Fallback data simulasi terverifikasi saat backend offline / belum terautentikasi
      return {
        criteria: INITIAL_ADMIN_CRITERIA,
        updatedAt: new Date().toISOString(),
        isSimulation: true,
      };
    }
  },

  // Simpan pembaharuan kriteria & bobot ke backend (tanpa false-success)
  async updateSawWeights(
    payload: UpdateWeightsPayload,
    token?: string,
  ): Promise<{ success: boolean; message: string; isSimulation: boolean }> {
    const activeItems = payload.criteria.filter((c) => c.isActive !== false);
    const totalWeight = activeItems.reduce((acc, c) => acc + c.weight, 0);
    if (activeItems.length === 0) {
      throw new Error('Minimal harus ada 1 kriteria yang berstatus AKTIF.');
    }
    if (Math.abs(totalWeight - 1.0) > 1e-4) {
      throw new Error(
        `Total bobot kriteria aktif harus berjumlah 1,00 (aktual: ${totalWeight.toFixed(2)})`,
      );
    }

    try {
      const json = await apiClient.put<{ criteria?: unknown[]; updatedAt?: string }>(
        '/admin/saw/weights',
        payload,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        },
      );

      return {
        success: true,
        message:
          json.message ||
          'Konfigurasi kriteria & bobot SAW berhasil diperbarui di server.',
        isSimulation: false,
      };
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.statusCode === 0) {
          throw new Error(
            'Gagal menyimpan bobot SAW: server backend tidak terjangkau. Pastikan backend berjalan.',
            { cause: err },
          );
        }
        if (err.statusCode === 401 || err.statusCode === 403) {
          throw new Error(
            'Gagal menyimpan bobot SAW: sesi tidak valid atau akun bukan ADMIN.',
            { cause: err },
          );
        }
        throw new Error(err.message, { cause: err });
      }
      throw err instanceof Error
        ? err
        : new Error('Gagal menyimpan konfigurasi bobot SAW ke server.', {
            cause: err,
          });
    }
  },

  // Dapatkan dataset audit matriks SAW otomatis dari backend (/recommendations/saw) jika tersedia
  async getLiveMatrixAuditData(
    allCriteria: SawCriterionAdminRecord[],
    token?: string,
  ): Promise<SawMatrixAuditData> {
    const calculatedAt = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // 1. Coba ambil hasil perhitungan SAW otomatis langsung dari backend Express + PostgreSQL
    try {
      const json = (await apiClient.get<
        Array<{
          rank: number;
          ebookId: string;
          title: string;
          sawScore: number;
          displayScore: string;
          author?: string;
          price?: string | number;
          category?: { id: string; name: string; slug: string };
          rawValues?: Record<string, number>;
          normalizedValues?: Record<string, number>;
        }>
      >('/recommendations/saw?limit=20', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })) as {
        success?: boolean;
        data?: Array<{
          rank: number;
          ebookId: string;
          title: string;
          sawScore: number;
          displayScore: string;
          author?: string;
          price?: string | number;
          category?: { id: string; name: string; slug: string };
          rawValues?: Record<string, number>;
          normalizedValues?: Record<string, number>;
        }>;
        meta?: {
          activeCriteria?: Array<{
            id: string;
            name: string;
            field: string;
            type: 'BENEFIT' | 'COST';
            weight: number;
            isActive?: boolean;
            description?: string;
          }>;
        };
      };

      const rawItems = Array.isArray(json.data) ? json.data : [];
      const backendCriteriaRaw = json.meta?.activeCriteria;
      const activeCriteria: SawCriterionAdminRecord[] =
        backendCriteriaRaw && backendCriteriaRaw.length > 0
          ? backendCriteriaRaw
              .filter((c) => c.isActive !== false)
              .map((c) => ({
                id: c.id,
                name: c.name,
                field: normalizeField(c.field),
                type: c.type,
                weight: c.weight,
                isActive: true,
                description: c.description,
              }))
          : allCriteria.filter((c) => c.isActive);

      const totalWeight = activeCriteria.reduce((acc, c) => acc + c.weight, 0);
      const isWeightValid =
        activeCriteria.length > 0 && Math.abs(totalWeight - 1.0) <= 1e-4;

      // Backend aktif, namun belum ada e-book aktif di database
      if (rawItems.length === 0) {
        return {
          criteriaVersion: 'BACKEND_LIVE_SAW',
          calculatedAt,
          totalAlternatives: 0,
          activeCriteriaCount: activeCriteria.length,
          totalWeight,
          isWeightValid,
          isSimulation: false,
          dataSource: 'BACKEND_EMPTY',
          sourceMessage:
            'Backend terhubung, namun belum ada data e-book aktif di database untuk dihitung oleh engine SAW.',
          criteria: activeCriteria,
          extremeValues: {},
          candidates: [],
        };
      }

      // Hitung nilai ekstremum (Min/Max) langsung dari rawValues hasil backend
      const extremeValues: Record<
        string,
        { max: number; min: number; type: 'BENEFIT' | 'COST' }
      > = {};
      for (const crit of activeCriteria) {
        const vals = rawItems.map(
          (item) => item.rawValues?.[crit.id] ?? item.rawValues?.[crit.field] ?? 0,
        );
        extremeValues[crit.id] = {
          min: vals.length > 0 ? Math.min(...vals) : 0,
          max: vals.length > 0 ? Math.max(...vals) : 0,
          type: crit.type,
        };
      }

      const candidates: SawLiveMatrixCandidate[] = rawItems.map((item) => {
        const rawValues: Record<string, number> = {};
        const normalizedValues: Record<string, number> = {};
        const weightedContributions: Record<string, number> = {};

        for (const crit of activeCriteria) {
          const rawVal =
            item.rawValues?.[crit.id] ?? item.rawValues?.[crit.field] ?? 0;
          const normVal = item.normalizedValues?.[crit.id] ?? 0;
          rawValues[crit.id] = rawVal;
          normalizedValues[crit.id] = normVal;
          weightedContributions[crit.id] = crit.weight * normVal;
        }

        const priceNum =
          typeof item.price === 'number'
            ? item.price
            : parseFloat(String(item.price ?? rawValues.C1 ?? 0)) || 0;

        return {
          id: item.ebookId,
          title: item.title,
          author: item.author || 'Penulis Tidak Tercatat',
          priceFormatted: `Rp ${priceNum.toLocaleString('id-ID')}`,
          categoryName: item.category?.name || 'Umum',
          rawValues,
          normalizedValues,
          weightedContributions,
          finalScore: item.sawScore,
          displayScore: item.displayScore || item.sawScore.toFixed(3),
          rank: item.rank,
          isEligible: true,
        };
      });

      return {
        criteriaVersion: 'BACKEND_LIVE_SAW',
        calculatedAt,
        totalAlternatives: candidates.length,
        activeCriteriaCount: activeCriteria.length,
        totalWeight,
        isWeightValid,
        isSimulation: false,
        dataSource: 'BACKEND_LIVE',
        sourceMessage:
          'Dihitung otomatis oleh engine SPK SAW backend dari data e-book aktif di database PostgreSQL.',
        criteria: activeCriteria,
        extremeValues,
        candidates,
      };
    } catch {
      // 2. Fallback DATA SIMULASI jika backend sedang offline / tidak terjangkau
      const enabledCriteria = allCriteria.filter((c) => c.isActive);
      const totalWeight = enabledCriteria.reduce((acc, c) => acc + c.weight, 0);
      const isWeightValid =
        enabledCriteria.length > 0 && Math.abs(totalWeight - 1.0) <= 1e-4;
      const { extremeValues, candidates } = computeDynamicAuditMatrix(allCriteria);

      return {
        criteriaVersion: 'SIMULATION_FALLBACK_V1',
        calculatedAt,
        totalAlternatives: candidates.length,
        activeCriteriaCount: enabledCriteria.length,
        totalWeight,
        isWeightValid,
        isSimulation: true,
        dataSource: 'SIMULATION_FALLBACK',
        sourceMessage:
          'Server backend tidak terjangkau. Menampilkan perhitungan otomatis menggunakan dataset DATA SIMULASI lokal.',
        criteria: enabledCriteria,
        extremeValues,
        candidates,
      };
    }
  },
};
