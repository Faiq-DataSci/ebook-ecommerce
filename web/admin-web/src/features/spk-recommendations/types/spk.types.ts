export type CriterionType = 'BENEFIT' | 'COST';

export type SpkTab = 'kriteria' | 'matriks';

export interface SawCriterionAdminRecord {
  id: string;
  name: string;
  field: string;
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

export interface SawMatrixAuditData {
  criteriaVersion: string;
  calculatedAt: string;
  totalAlternatives: number;
  activeCriteriaCount: number;
  totalWeight: number;
  isWeightValid: boolean;
  criteria: SawCriterionAdminRecord[];
  extremeValues: Record<string, { max: number; min: number; type: CriterionType }>;
  candidates: SawLiveMatrixCandidate[];
}

export interface UpdateWeightsPayload {
  criteria: Array<{
    id: string;
    weight: number;
  }>;
}
