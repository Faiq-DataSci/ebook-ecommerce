export type CriterionType = 'BENEFIT' | 'COST';

export type SawCriterionField =
  | 'price'
  | 'ratingAvg'
  | 'salesCount'
  | 'pageCount'
  | 'publishedYear';

export interface SawCriterionFieldOption {
  value: SawCriterionField;
  label: string;
  defaultType: CriterionType;
  defaultDescription: string;
}

export const SAW_CRITERION_FIELD_OPTIONS: SawCriterionFieldOption[] = [
  {
    value: 'price',
    label: 'Harga E-Book (price)',
    defaultType: 'COST',
    defaultDescription: 'Tingkat keterjangkauan harga nominal e-book bagi pembeli (makin rendah makin baik)',
  },
  {
    value: 'ratingAvg',
    label: 'Rating Rata-Rata (ratingAvg)',
    defaultType: 'BENEFIT',
    defaultDescription: 'Skor kepuasan dan ulasan kualitas buku dari pembaca terdahulu (makin tinggi makin baik)',
  },
  {
    value: 'salesCount',
    label: 'Jumlah Terjual (salesCount)',
    defaultType: 'BENEFIT',
    defaultDescription: 'Indikator popularitas dan validasi pasar buku di platform (makin banyak makin baik)',
  },
  {
    value: 'pageCount',
    label: 'Jumlah Halaman (pageCount)',
    defaultType: 'BENEFIT',
    defaultDescription: 'Kedalaman dan kelengkapan isi materi buku berdasarkan jumlah halaman',
  },
  {
    value: 'publishedYear',
    label: 'Tahun Terbit (publishedYear)',
    defaultType: 'BENEFIT',
    defaultDescription: 'Kebaruan edisi dan relevansi terbitan e-book terhadap perkembangan terkini',
  },
];

export type SpkTab = 'kriteria' | 'matriks';

export interface SawCriterionAdminRecord {
  id: string;
  name: string;
  field: SawCriterionField;
  type: CriterionType;
  weight: number;
  isActive: boolean;
  description?: string;
}

export interface SawLiveMatrixCandidate {
  id: string;
  title: string;
  author: string;
  priceFormatted: string;
  categoryName: string;
  rawValues: Record<string, number>;
  normalizedValues: Record<string, number>;
  weightedContributions: Record<string, number>;
  finalScore: number;
  displayScore: string;
  rank: number;
  isEligible: boolean;
  ineligibleReason?: string;
}

export type SawMatrixDataSource =
  | 'BACKEND_LIVE'
  | 'BACKEND_EMPTY'
  | 'SIMULATION_FALLBACK';

export interface SawMatrixAuditData {
  criteriaVersion: string;
  calculatedAt: string;
  totalAlternatives: number;
  activeCriteriaCount: number;
  totalWeight: number;
  isWeightValid: boolean;
  isSimulation: boolean;
  dataSource: SawMatrixDataSource;
  sourceMessage?: string;
  criteria: SawCriterionAdminRecord[];
  extremeValues: Record<string, { max: number; min: number; type: CriterionType }>;
  candidates: SawLiveMatrixCandidate[];
}

export interface UpdateWeightsPayload {
  replaceAll?: boolean;
  criteria: Array<{
    id: string;
    name?: string;
    field?: SawCriterionField;
    type?: CriterionType;
    weight: number;
    isActive?: boolean;
    description?: string;
  }>;
}
