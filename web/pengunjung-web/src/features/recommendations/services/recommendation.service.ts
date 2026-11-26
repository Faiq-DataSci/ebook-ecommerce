import { APP_CONFIG } from '../../../constants/app.constants';
import { API_ENDPOINTS } from '../../../services/api/endpoints';
import type {
  SawCalculationStep,
  SawCriterionInfo,
  SawRecommendationFilter,
  SawRecommendationItem,
  SawRecommendationResponse,
} from '../types/recommendation.types';

/**
 * Dataset simulasi resmi dari docs/03-saw/perhitungan-manual.md & api-saw-contract.md
 * Digunakan sebagai fallback terverifikasi berlabel DATA SIMULASI bila backend offline.
 */
export const SIMULATION_ACTIVE_CRITERIA: SawCriterionInfo[] = [
  { id: 'C1', name: 'Harga E-Book', field: 'price', type: 'COST', weight: 0.4 },
  { id: 'C2', name: 'Rating Rata-Rata', field: 'ratingAvg', type: 'BENEFIT', weight: 0.35 },
  { id: 'C3', name: 'Jumlah Terjual', field: 'salesCount', type: 'BENEFIT', weight: 0.25 },
];

export const SIMULATION_RECOMMENDATIONS_DATA: SawRecommendationItem[] = [
  {
    rank: 1,
    ebookId: 'ebook-sim-003',
    title: 'Panduan Praktis Flutter & Clean Architecture',
    author: 'Ahmad Dahlan, S.Kom.',
    price: '75000',
    coverUrl: null,
    category: { id: 'cat-mob', name: 'Mobile Development', slug: 'mobile-dev' },
    sawScore: 1.0,
    displayScore: '1.000',
    rawValues: { C1: 75000, C2: 4.9, C3: 420 },
    normalizedValues: { C1: 1.0, C2: 1.0, C3: 1.0 },
    calculationSteps: [
      {
        criterionId: 'C1',
        criterionName: 'Harga E-Book',
        type: 'COST',
        weight: 0.4,
        rawValue: 75000,
        normalizedValue: 1.0,
        weightedContribution: 0.4,
      },
      {
        criterionId: 'C2',
        criterionName: 'Rating Rata-Rata',
        type: 'BENEFIT',
        weight: 0.35,
        rawValue: 4.9,
        normalizedValue: 1.0,
        weightedContribution: 0.35,
      },
      {
        criterionId: 'C3',
        criterionName: 'Jumlah Terjual',
        type: 'BENEFIT',
        weight: 0.25,
        rawValue: 420,
        normalizedValue: 1.0,
        weightedContribution: 0.25,
      },
    ],
  },
  {
    rank: 2,
    ebookId: 'ebook-sim-001',
    title: 'Arsitektur Backend Modern dengan Node.js & Prisma',
    author: 'Budi Santoso, M.T.',
    price: '120000',
    coverUrl: null,
    category: { id: 'cat-back', name: 'Backend & Cloud', slug: 'backend-cloud' },
    sawScore: 0.848125,
    displayScore: '0.848',
    rawValues: { C1: 120000, C2: 4.8, C3: 310 },
    normalizedValues: { C1: 0.625, C2: 0.979592, C3: 0.738095 },
    calculationSteps: [
      {
        criterionId: 'C1',
        criterionName: 'Harga E-Book',
        type: 'COST',
        weight: 0.4,
        rawValue: 120000,
        normalizedValue: 0.625,
        weightedContribution: 0.25,
      },
      {
        criterionId: 'C2',
        criterionName: 'Rating Rata-Rata',
        type: 'BENEFIT',
        weight: 0.35,
        rawValue: 4.8,
        normalizedValue: 0.979592,
        weightedContribution: 0.342857,
      },
      {
        criterionId: 'C3',
        criterionName: 'Jumlah Terjual',
        type: 'BENEFIT',
        weight: 0.25,
        rawValue: 310,
        normalizedValue: 0.738095,
        weightedContribution: 0.184524,
      },
    ],
  },
  {
    rank: 3,
    ebookId: 'ebook-sim-002',
    title: 'Dasar Basis Data Relasional PostgreSQL & SQL Lanjut',
    author: 'Citra Permata, Ph.D.',
    price: '95000',
    coverUrl: null,
    category: { id: 'cat-data', name: 'Basis Data', slug: 'database' },
    sawScore: 0.638333,
    displayScore: '0.638',
    rawValues: { C1: 95000, C2: 4.2, C3: 140 },
    normalizedValues: { C1: 0.789474, C2: 0.857143, C3: 0.333333 },
    calculationSteps: [
      {
        criterionId: 'C1',
        criterionName: 'Harga E-Book',
        type: 'COST',
        weight: 0.4,
        rawValue: 95000,
        normalizedValue: 0.789474,
        weightedContribution: 0.315789,
      },
      {
        criterionId: 'C2',
        criterionName: 'Rating Rata-Rata',
        type: 'BENEFIT',
        weight: 0.35,
        rawValue: 4.2,
        normalizedValue: 0.857143,
        weightedContribution: 0.3,
      },
      {
        criterionId: 'C3',
        criterionName: 'Jumlah Terjual',
        type: 'BENEFIT',
        weight: 0.25,
        rawValue: 140,
        normalizedValue: 0.333333,
        weightedContribution: 0.083333,
      },
    ],
  },
];

interface RawBackendRecommendationItem {
  rank: number;
  ebookId: string;
  title: string;
  author?: string;
  price?: string | number;
  coverUrl?: string | null;
  category?: { id: string; name: string; slug: string } | null;
  sawScore: number;
  displayScore?: string;
  rawValues?: Record<string, number>;
  normalizedValues?: Record<string, number>;
}

export const recommendationService = {
  async getSawRecommendations(
    filter: SawRecommendationFilter,
  ): Promise<SawRecommendationResponse> {
    const params = new URLSearchParams();
    if (filter.categoryId) {
      params.append('categoryId', filter.categoryId);
    }
    params.append('limit', String(filter.limit || 5));

    const url = `${APP_CONFIG.API_BASE_URL}${API_ENDPOINTS.SAW_RECOMMENDATIONS}?${params.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Gagal memuat rekomendasi SAW (HTTP ${response.status})`);
      }

      const json = await response.json();
      const rawData = json.data;

      // Map response backend riil
      if (Array.isArray(rawData)) {
        const items: SawRecommendationItem[] = (rawData as RawBackendRecommendationItem[]).map((item) => {
          const rawValues = item.rawValues || {};
          const normalizedValues = item.normalizedValues || {};

          // Bentuk step kalkulasi per kriteria aktif
          const calculationSteps: SawCalculationStep[] = SIMULATION_ACTIVE_CRITERIA.map((crit) => {
            const rawVal = rawValues[crit.id] ?? (rawValues[crit.field] || 0);
            const normVal = normalizedValues[crit.id] ?? 0;
            const contrib = Number((crit.weight * normVal).toFixed(4));
            return {
              criterionId: crit.id,
              criterionName: crit.name,
              type: crit.type,
              weight: crit.weight,
              rawValue: rawVal,
              normalizedValue: normVal,
              weightedContribution: contrib,
            };
          });

          return {
            rank: item.rank,
            ebookId: item.ebookId,
            title: item.title,
            author: item.author || 'Penulis Digital',
            price: item.price || '0',
            coverUrl: item.coverUrl,
            category: item.category,
            sawScore: item.sawScore,
            displayScore: item.displayScore || item.sawScore.toFixed(3),
            rawValues,
            normalizedValues,
            calculationSteps,
          };
        });

        return {
          isSimulation: false,
          criteriaVersion: 'SERVER_ACTIVE_V1',
          calculatedAt: new Date().toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          totalAlternatives: items.length,
          activeCriteria: SIMULATION_ACTIVE_CRITERIA,
          items,
        };
      }

      throw new Error('Format response backend tidak sesuai');
    } catch {
      // Fallback transparan berlabel DATA SIMULASI jika backend belum aktif
      const filtered = filter.categoryId
        ? SIMULATION_RECOMMENDATIONS_DATA.filter(
            (b) => b.category?.id === filter.categoryId,
          )
        : SIMULATION_RECOMMENDATIONS_DATA;

      const sliced = filtered.slice(0, filter.limit || 5);

      return {
        isSimulation: true,
        criteriaVersion: 'DATA SIMULASI (Perhitungan Manual)',
        calculatedAt: new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        totalAlternatives: sliced.length,
        activeCriteria: SIMULATION_ACTIVE_CRITERIA,
        items: sliced,
      };
    }
  },
};
