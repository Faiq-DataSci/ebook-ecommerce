import { useMemo, useState } from 'react';
import {
  SAW_CRITERION_FIELD_OPTIONS,
  type SawCriterionAdminRecord,
  type SawCriterionField,
} from '../types/spk.types';
import {
  buildNewDraftRow,
  distributeWeightsEvenly,
  toDraftRows,
  validateSawCriteriaRows,
  type DraftCriterionRow,
} from '../utils/sawCriteria.utils';
import { SawCriterionEditRow, SawCriterionViewRow } from './SawCriteriaTableRow';
import { SawWeightSummaryBar } from './SawWeightSummaryBar';

interface SawCriteriaTablePanelProps {
  criteria: SawCriterionAdminRecord[];
  onOpenEditModal: (criterion: SawCriterionAdminRecord) => void;
  onSaveAllWeights: (updatedCriteria: SawCriterionAdminRecord[]) => void;
  onResetWeights: () => void;
  isSaving: boolean;
}

export function SawCriteriaTablePanel({
  criteria,
  onOpenEditModal,
  onSaveAllWeights,
  onResetWeights,
  isSaving,
}: SawCriteriaTablePanelProps) {
  const [isBulkEditing, setIsBulkEditing] = useState(false);
  const [draftRows, setDraftRows] = useState<DraftCriterionRow[]>([]);

  const displayedRows: SawCriterionAdminRecord[] = isBulkEditing ? draftRows : criteria;

  const { totalWeight, isWeightValid, validationErrors, activeCount } = useMemo(
    () => validateSawCriteriaRows(displayedRows),
    [displayedRows],
  );

  const canSave = isWeightValid && validationErrors.length === 0 && !isSaving;
  const weightDiff = Number((1 - totalWeight).toFixed(2));

  const enterBulkEdit = () => {
    setDraftRows(toDraftRows(criteria));
    setIsBulkEditing(true);
  };

  const handleCancelBulkEdit = () => {
    setIsBulkEditing(false);
    setDraftRows([]);
  };

  const handleAddCriterion = () => {
    const baseRows = isBulkEditing ? draftRows : toDraftRows(criteria);
    setDraftRows([...baseRows, buildNewDraftRow(baseRows)]);
    if (!isBulkEditing) {
      setIsBulkEditing(true);
    }
  };

  const handleUpdateDraftRow = (
    rowKey: string,
    patch: Partial<DraftCriterionRow>,
  ) => {
    setDraftRows((prev) =>
      prev.map((row) => (row.rowKey === rowKey ? { ...row, ...patch } : row)),
    );
  };

  const handleFieldChange = (rowKey: string, nextField: SawCriterionField) => {
    const meta = SAW_CRITERION_FIELD_OPTIONS.find((opt) => opt.value === nextField);
    setDraftRows((prev) =>
      prev.map((row) =>
        row.rowKey === rowKey
          ? { ...row, field: nextField, type: meta ? meta.defaultType : row.type }
          : row,
      ),
    );
  };

  const handleWeightTextChange = (rowKey: string, rawText: string) => {
    const parsed = parseFloat(rawText.replace(',', '.'));
    setDraftRows((prev) =>
      prev.map((row) =>
        row.rowKey === rowKey
          ? {
              ...row,
              weightText: rawText,
              weight: Number.isFinite(parsed) && parsed >= 0 ? parsed : 0,
            }
          : row,
      ),
    );
  };

  const handleToggleRowActive = (rowKey: string) => {
    setDraftRows((prev) => {
      const currentSum = prev.reduce((sum, r) => sum + (r.isActive ? r.weight : 0), 0);
      return prev.map((row) => {
        if (row.rowKey !== rowKey) return row;
        if (row.isActive) {
          return { ...row, isActive: false, weight: 0, weightText: '0.00' };
        }
        const restored =
          currentSum < 1 ? Number(Math.max(0.05, 1 - currentSum).toFixed(2)) : 0.1;
        return {
          ...row,
          isActive: true,
          weight: restored,
          weightText: restored.toFixed(2),
        };
      });
    });
  };

  const handleRemoveRow = (rowKey: string) => {
    setDraftRows((prev) =>
      prev.length <= 1 ? prev : prev.filter((row) => row.rowKey !== rowKey),
    );
  };

  const handleDistributeEvenly = () => {
    setDraftRows((prev) => distributeWeightsEvenly(prev));
  };

  const handleSaveBulk = () => {
    if (!canSave) return;
    const normalized: SawCriterionAdminRecord[] = draftRows.map((row) => ({
      id: row.id.trim().toUpperCase(),
      name: row.name.trim(),
      field: row.field,
      type: row.type,
      weight: row.isActive ? Number(row.weight.toFixed(2)) : 0,
      isActive: row.isActive,
      description: row.description?.trim() || undefined,
    }));
    onSaveAllWeights(normalized);
    setIsBulkEditing(false);
    setDraftRows([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <SawWeightSummaryBar
        isBulkEditing={isBulkEditing}
        isWeightValid={isWeightValid}
        validationErrorsCount={validationErrors.length}
        activeCount={activeCount}
        totalWeight={totalWeight}
        weightDiff={weightDiff}
        canSave={canSave}
        isSaving={isSaving}
        onEnterBulkEdit={enterBulkEdit}
        onAddCriterion={handleAddCriterion}
        onSaveViewWeights={() => onSaveAllWeights(criteria)}
        onResetWeights={onResetWeights}
        onDistributeEvenly={handleDistributeEvenly}
        onSaveBulk={handleSaveBulk}
        onCancelBulkEdit={handleCancelBulkEdit}
      />

      {isBulkEditing && validationErrors.length > 0 && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#FFF5F5',
            border: '2px solid var(--nb-black)',
            fontSize: '12px',
            color: '#C92A2A',
            fontWeight: 700,
          }}
        >
          <div style={{ marginBottom: '4px', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
            Periksa kembali isian kriteria sebelum menyimpan:
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: 1.5 }}>
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="tf-table-card">
        <div className="tf-table-responsive">
          <table className="tf-table" style={{ minWidth: isBulkEditing ? '980px' : '820px' }}>
            <thead>
              <tr>
                <th style={{ width: isBulkEditing ? '90px' : '80px' }}>Kode</th>
                <th>Nama &amp; Deskripsi Kriteria</th>
                <th style={{ width: isBulkEditing ? '210px' : '160px' }}>Field Basis Data</th>
                <th style={{ width: isBulkEditing ? '150px' : '220px' }}>Tipe Kriteria</th>
                <th style={{ textAlign: 'right', width: '120px' }}>Bobot (w)</th>
                <th style={{ textAlign: 'center', width: '95px' }}>Persentase</th>
                <th style={{ width: '105px' }}>Status</th>
                <th style={{ textAlign: 'center', width: isBulkEditing ? '95px' : '130px' }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {!isBulkEditing
                ? criteria.map((criterion) => (
                    <SawCriterionViewRow
                      key={criterion.id}
                      criterion={criterion}
                      onOpenEditModal={onOpenEditModal}
                    />
                  ))
                : draftRows.map((row) => (
                    <SawCriterionEditRow
                      key={row.rowKey}
                      row={row}
                      canRemove={draftRows.length > 1}
                      onUpdateRow={handleUpdateDraftRow}
                      onFieldChange={handleFieldChange}
                      onWeightTextChange={handleWeightTextChange}
                      onToggleActive={handleToggleRowActive}
                      onRemove={handleRemoveRow}
                    />
                  ))}
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: 'var(--nb-paper)', fontWeight: 800 }}>
                <td
                  colSpan={4}
                  style={{ textAlign: 'right', textTransform: 'uppercase', padding: '12px 14px' }}
                >
                  Total Akumulasi Bobot Kriteria Aktif ({activeCount} Kriteria):
                </td>
                <td className="tf-money" style={{ padding: '12px 14px', fontSize: '15px' }}>
                  <span style={{ color: isWeightValid ? 'var(--nb-black)' : 'var(--nb-pink)' }}>
                    {totalWeight.toFixed(2)}
                  </span>
                </td>
                <td style={{ textAlign: 'center', padding: '12px 14px' }}>
                  <span className="tf-mono" style={{ fontSize: '13px' }}>
                    {Math.round(totalWeight * 100)}%
                  </span>
                </td>
                <td colSpan={2} style={{ padding: '12px 14px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: isWeightValid ? '#087F5B' : '#C92A2A',
                    }}
                  >
                    {isWeightValid ? 'Lolos Validasi Σ w = 1.0' : 'Wajib bernilai 1.0'}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
