import {
  SAW_CRITERION_FIELD_OPTIONS,
  type SawCriterionAdminRecord,
  type SawCriterionField,
} from '../types/spk.types';

export interface DraftCriterionRow extends SawCriterionAdminRecord {
  rowKey: string;
  weightText: string;
}

export interface SawCriteriaValidationResult {
  totalWeight: number;
  isWeightValid: boolean;
  validationErrors: string[];
  activeCount: number;
}

export function getNextCriterionCode(rows: Array<{ id: string }>): string {
  const used = new Set(rows.map((r) => r.id.trim().toUpperCase()));
  let idx = rows.length + 1;
  while (used.has(`C${idx}`)) {
    idx += 1;
  }
  return `C${idx}`;
}

export function getNextSuggestedField(
  rows: Array<{ field: SawCriterionField }>,
): SawCriterionField {
  const used = new Set(rows.map((r) => r.field));
  const unused = SAW_CRITERION_FIELD_OPTIONS.find((opt) => !used.has(opt.value));
  return unused ? unused.value : 'pageCount';
}

export function toDraftRows(criteria: SawCriterionAdminRecord[]): DraftCriterionRow[] {
  return criteria.map((c, idx) => ({
    ...c,
    rowKey: `row-${c.id}-${idx}`,
    weightText: c.weight.toFixed(2),
  }));
}

export function buildNewDraftRow(baseRows: DraftCriterionRow[]): DraftCriterionRow {
  const nextCode = getNextCriterionCode(baseRows);
  const nextField = getNextSuggestedField(baseRows);
  const fieldMeta =
    SAW_CRITERION_FIELD_OPTIONS.find((opt) => opt.value === nextField) ||
    SAW_CRITERION_FIELD_OPTIONS[0];

  const currentActiveSum = baseRows.reduce(
    (sum, r) => sum + (r.isActive ? r.weight : 0),
    0,
  );
  const suggestedWeight =
    currentActiveSum < 1
      ? Number(Math.max(0.05, 1 - currentActiveSum).toFixed(2))
      : 0.1;

  return {
    rowKey: `row-new-${Date.now()}-${Math.random()}`,
    id: nextCode,
    name: fieldMeta.label.split(' (')[0],
    field: fieldMeta.value,
    type: fieldMeta.defaultType,
    weight: suggestedWeight,
    weightText: suggestedWeight.toFixed(2),
    isActive: true,
    description: fieldMeta.defaultDescription,
  };
}

export function validateSawCriteriaRows(
  rows: SawCriterionAdminRecord[],
): SawCriteriaValidationResult {
  const errors: string[] = [];
  const seenIds = new Set<string>();
  let activeTotal = 0;
  let activeCounter = 0;

  for (const row of rows) {
    const normalizedId = row.id.trim().toUpperCase();
    if (!normalizedId) {
      errors.push('Ada baris kriteria yang kodenya masih kosong.');
    } else if (seenIds.has(normalizedId)) {
      errors.push(`Kode kriteria "${normalizedId}" terdeteksi duplikat.`);
    } else {
      seenIds.add(normalizedId);
    }

    if (!row.name.trim()) {
      errors.push(`Nama kriteria untuk kode "${normalizedId || '?'}" wajib diisi.`);
    }

    if (row.isActive) {
      activeCounter += 1;
      if (!Number.isFinite(row.weight) || row.weight <= 0) {
        errors.push(
          `Bobot kriteria aktif "${normalizedId || '?'}" harus lebih besar dari 0.`,
        );
      } else {
        activeTotal += row.weight;
      }
    }
  }

  if (activeCounter === 0) {
    errors.push('Minimal harus ada 1 kriteria yang berstatus AKTIF.');
  }

  const weightOk = activeCounter > 0 && Math.abs(activeTotal - 1.0) <= 1e-4;
  return {
    totalWeight: activeTotal,
    isWeightValid: weightOk,
    validationErrors: errors,
    activeCount: activeCounter,
  };
}

export function distributeWeightsEvenly(rows: DraftCriterionRow[]): DraftCriterionRow[] {
  const activeIndices = rows
    .map((row, idx) => (row.isActive ? idx : -1))
    .filter((idx) => idx >= 0);

  if (activeIndices.length === 0) return rows;

  const count = activeIndices.length;
  const base = Math.floor(100 / count) / 100;
  const lastWeight = Number((1 - base * (count - 1)).toFixed(2));
  const lastActiveIdx = activeIndices[activeIndices.length - 1];

  return rows.map((row, idx) => {
    if (!row.isActive) {
      return { ...row, weight: 0, weightText: '0.00' };
    }
    const nextWeight = idx === lastActiveIdx ? lastWeight : base;
    return {
      ...row,
      weight: nextWeight,
      weightText: nextWeight.toFixed(2),
    };
  });
}
