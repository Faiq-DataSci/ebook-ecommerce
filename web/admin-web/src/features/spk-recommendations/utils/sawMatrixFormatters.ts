import type { SawCriterionAdminRecord } from '../types/spk.types';

export function formatRawCriterionValue(
  criterion: SawCriterionAdminRecord,
  value: number,
): string {
  if (criterion.field === 'price') {
    return `Rp ${value.toLocaleString('id-ID')}`;
  }
  if (criterion.field === 'pageCount') {
    return `${value.toLocaleString('id-ID')} hal.`;
  }
  if (criterion.field === 'ratingAvg') {
    return value.toFixed(1);
  }
  return value.toLocaleString('id-ID');
}

export function formatRawNumberPlain(
  criterion: SawCriterionAdminRecord,
  value: number,
): string {
  if (criterion.field === 'ratingAvg') {
    return value.toFixed(1);
  }
  return value.toLocaleString('id-ID');
}

export function getRecommendationTier(
  rank: number,
  score: number,
): { label: string; badgeClass: string } {
  if (rank === 1) {
    return { label: 'Rekomendasi Utama', badgeClass: 'is-yellow' };
  }
  if (score >= 0.8) {
    return { label: 'Sangat Direkomendasikan', badgeClass: 'is-green' };
  }
  if (score >= 0.65) {
    return { label: 'Direkomendasikan', badgeClass: 'is-blue' };
  }
  return { label: 'Alternatif', badgeClass: '' };
}
