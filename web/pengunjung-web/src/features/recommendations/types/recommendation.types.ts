export type CriterionType = 'BENEFIT' | 'COST';

export interface SawCriterionInfo {
  id: string;
  name: string;
  field: string;
  type: CriterionType;
  weight: number;
}

export interface SawCalculationStep {
  criterionId: string;
  criterionName: string;
  field?: string;
  type: CriterionType;
  weight: number;
  rawValue: number;
  normalizedValue: number;
  weightedContribution: number;
}

export interface SawRecommendationItem {
  rank: number;
  ebookId: string;
  title: string;
  author: string;
  price: string | number;
  coverUrl?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  sawScore: number;
  displayScore: string;
  rawValues: Record<string, number>;
  normalizedValues: Record<string, number>;
  calculationSteps: SawCalculationStep[];
}

export interface SawRecommendationResponse {
  isSimulation: boolean;
  criteriaVersion: string;
  calculatedAt: string;
  totalAlternatives: number;
  activeCriteria: SawCriterionInfo[];
  items: SawRecommendationItem[];
}

export interface SawRecommendationFilter {
  categoryId?: string;
  limit: number;
}
