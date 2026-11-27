import {
  SAW_CRITERION_FIELD_OPTIONS,
  type CriterionType,
  type SawCriterionAdminRecord,
  type SawCriterionField,
} from '../types/spk.types';
import type { DraftCriterionRow } from '../utils/sawCriteria.utils';

const inputStyle = {
  width: '100%',
  minHeight: '34px',
  padding: '4px 8px',
  border: '1.5px solid var(--nb-black)',
  backgroundColor: 'var(--nb-white)',
  fontSize: '12.5px',
  fontWeight: 600,
  color: 'var(--nb-black)',
} as const;

interface SawCriterionViewRowProps {
  criterion: SawCriterionAdminRecord;
  onOpenEditModal: (criterion: SawCriterionAdminRecord) => void;
}

export function SawCriterionViewRow({
  criterion,
  onOpenEditModal,
}: SawCriterionViewRowProps) {
  const isBenefit = criterion.type === 'BENEFIT';
  const percent = Math.round((criterion.isActive ? criterion.weight : 0) * 100);

  return (
    <tr style={{ opacity: criterion.isActive ? 1 : 0.65 }}>
      <td>
        <span
          className="tf-mono"
          style={{
            backgroundColor: 'var(--nb-paper)',
            border: '1.5px solid var(--nb-black)',
            padding: '2px 8px',
            fontSize: '12px',
            display: 'inline-block',
          }}
        >
          {criterion.id}
        </span>
      </td>

      <td>
        <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{criterion.name}</div>
        {criterion.description && (
          <div style={{ fontSize: '11px', color: 'var(--nb-text-muted)', marginTop: '2px' }}>
            {criterion.description}
          </div>
        )}
      </td>

      <td>
        <code
          style={{
            fontSize: '11.5px',
            backgroundColor: 'var(--nb-paper)',
            padding: '2px 6px',
          }}
        >
          {criterion.field}
        </code>
      </td>

      <td>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '2px 8px',
            border: '1.5px solid var(--nb-black)',
            fontSize: '11px',
            fontWeight: 800,
            backgroundColor: isBenefit ? 'var(--nb-green)' : 'var(--nb-pink)',
            color: isBenefit ? 'var(--nb-black)' : 'var(--nb-white)',
          }}
        >
          <span>{criterion.type}</span>
          <span style={{ fontSize: '10px' }}>
            ({isBenefit ? 'Makin tinggi makin baik' : 'Makin rendah makin baik'})
          </span>
        </span>
      </td>

      <td className="tf-money">
        <span style={{ fontSize: '14px' }}>
          {(criterion.isActive ? criterion.weight : 0).toFixed(2)}
        </span>
      </td>

      <td style={{ textAlign: 'center' }}>
        <span
          className="tf-mono"
          style={{
            fontSize: '12px',
            padding: '2px 6px',
            backgroundColor: 'var(--nb-paper)',
            border: '1px solid var(--nb-black)',
          }}
        >
          {percent}%
        </span>
      </td>

      <td>
        <span
          style={{
            padding: '2px 6px',
            fontSize: '10.5px',
            fontWeight: 800,
            backgroundColor: criterion.isActive ? 'var(--nb-green)' : 'var(--nb-paper)',
            color: criterion.isActive ? 'var(--nb-black)' : 'var(--nb-text-muted)',
            border: '1px solid var(--nb-black)',
          }}
        >
          {criterion.isActive ? 'AKTIF' : 'NONAKTIF'}
        </span>
      </td>

      <td style={{ textAlign: 'center' }}>
        <button
          type="button"
          className="tf-action-btn"
          onClick={() => onOpenEditModal(criterion)}
          disabled={!criterion.isActive}
          title={
            criterion.isActive
              ? `Ubah bobot kriteria ${criterion.name}`
              : 'Aktifkan kriteria melalui mode Edit Banyak untuk mengubah bobot'
          }
          style={{ opacity: criterion.isActive ? 1 : 0.5 }}
        >
          <span>Ubah Bobot</span>
        </button>
      </td>
    </tr>
  );
}

interface SawCriterionEditRowProps {
  row: DraftCriterionRow;
  canRemove: boolean;
  onUpdateRow: (rowKey: string, patch: Partial<DraftCriterionRow>) => void;
  onFieldChange: (rowKey: string, nextField: SawCriterionField) => void;
  onWeightTextChange: (rowKey: string, rawText: string) => void;
  onToggleActive: (rowKey: string) => void;
  onRemove: (rowKey: string) => void;
}

export function SawCriterionEditRow({
  row,
  canRemove,
  onUpdateRow,
  onFieldChange,
  onWeightTextChange,
  onToggleActive,
  onRemove,
}: SawCriterionEditRowProps) {
  const percent = Math.round((row.isActive ? row.weight : 0) * 100);

  return (
    <tr style={{ backgroundColor: row.isActive ? 'var(--nb-white)' : '#F8F9FA' }}>
      <td>
        <input
          type="text"
          aria-label="Kode kriteria"
          value={row.id}
          maxLength={12}
          onChange={(e) =>
            onUpdateRow(row.rowKey, { id: e.target.value.toUpperCase() })
          }
          style={{
            ...inputStyle,
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            textTransform: 'uppercase',
          }}
        />
      </td>

      <td>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <input
            type="text"
            aria-label={`Nama kriteria ${row.id}`}
            placeholder="Nama kriteria (mis. Jumlah Halaman)"
            value={row.name}
            maxLength={100}
            onChange={(e) => onUpdateRow(row.rowKey, { name: e.target.value })}
            style={{ ...inputStyle, fontWeight: 700 }}
          />
          <input
            type="text"
            aria-label={`Deskripsi kriteria ${row.id}`}
            placeholder="Deskripsi singkat kriteria (opsional)"
            value={row.description ?? ''}
            maxLength={250}
            onChange={(e) => onUpdateRow(row.rowKey, { description: e.target.value })}
            style={{
              ...inputStyle,
              minHeight: '28px',
              fontSize: '11.5px',
              fontWeight: 500,
              backgroundColor: 'var(--nb-paper)',
            }}
          />
        </div>
      </td>

      <td>
        <select
          aria-label={`Field basis data ${row.id}`}
          value={row.field}
          onChange={(e) =>
            onFieldChange(row.rowKey, e.target.value as SawCriterionField)
          }
          style={inputStyle}
        >
          {SAW_CRITERION_FIELD_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </td>

      <td>
        <select
          aria-label={`Tipe kriteria ${row.id}`}
          value={row.type}
          onChange={(e) =>
            onUpdateRow(row.rowKey, { type: e.target.value as CriterionType })
          }
          style={{
            ...inputStyle,
            fontWeight: 800,
            backgroundColor: row.type === 'BENEFIT' ? '#E6FCF5' : '#FFF0F6',
          }}
        >
          <option value="BENEFIT">BENEFIT (Tinggi)</option>
          <option value="COST">COST (Rendah)</option>
        </select>
      </td>

      <td>
        <input
          type="number"
          aria-label={`Bobot kriteria ${row.id}`}
          step="0.01"
          min="0"
          max="1"
          disabled={!row.isActive}
          value={row.isActive ? row.weightText : '0.00'}
          onChange={(e) => onWeightTextChange(row.rowKey, e.target.value)}
          style={{
            ...inputStyle,
            textAlign: 'right',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            backgroundColor: row.isActive ? 'var(--nb-white)' : 'var(--nb-paper)',
            opacity: row.isActive ? 1 : 0.6,
          }}
        />
      </td>

      <td style={{ textAlign: 'center' }}>
        <span
          className="tf-mono"
          style={{
            fontSize: '12px',
            padding: '3px 7px',
            backgroundColor: 'var(--nb-paper)',
            border: '1px solid var(--nb-black)',
          }}
        >
          {percent}%
        </span>
      </td>

      <td>
        <button
          type="button"
          onClick={() => onToggleActive(row.rowKey)}
          style={{
            width: '100%',
            minHeight: '32px',
            padding: '2px 8px',
            fontSize: '11px',
            fontWeight: 800,
            backgroundColor: row.isActive ? 'var(--nb-green)' : 'var(--nb-paper)',
            color: row.isActive ? 'var(--nb-black)' : 'var(--nb-text-muted)',
            border: '1.5px solid var(--nb-black)',
            cursor: 'pointer',
          }}
          title="Klik untuk mengaktifkan atau menonaktifkan kriteria"
        >
          {row.isActive ? 'AKTIF' : 'NONAKTIF'}
        </button>
      </td>

      <td style={{ textAlign: 'center' }}>
        <button
          type="button"
          className="tf-action-btn"
          onClick={() => onRemove(row.rowKey)}
          disabled={!canRemove}
          style={{
            backgroundColor: canRemove ? '#FFE3E3' : 'var(--nb-paper)',
            color: '#C92A2A',
            opacity: canRemove ? 1 : 0.45,
            cursor: canRemove ? 'pointer' : 'not-allowed',
            padding: '0 10px',
            minHeight: '32px',
          }}
          title={
            canRemove ? `Hapus kriteria ${row.id}` : 'Minimal harus ada 1 kriteria'
          }
        >
          <span>Hapus</span>
        </button>
      </td>
    </tr>
  );
}
