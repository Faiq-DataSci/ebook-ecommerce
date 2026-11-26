import { useState } from 'react';
import type { SawCriterionAdminRecord } from '../types/spk.types';

interface SawWeightEditModalProps {
  criterion: SawCriterionAdminRecord | null;
  onClose: () => void;
  onUpdateCriterionWeight: (id: string, newWeight: number) => void;
}

export function SawWeightEditModal({
  criterion,
  onClose,
  onUpdateCriterionWeight,
}: SawWeightEditModalProps) {
  const [weightInput, setWeightInput] = useState<string>(
    criterion ? criterion.weight.toFixed(2) : '0.40',
  );
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!criterion) return null;

  const handleSave = () => {
    const parsed = parseFloat(weightInput);
    if (isNaN(parsed) || parsed <= 0 || parsed > 1.0) {
      setErrorMsg('Bobot harus berupa angka desimal positif antara 0.01 hingga 1.00');
      return;
    }
    onUpdateCriterionWeight(criterion.id, Number(parsed.toFixed(2)));
    onClose();
  };

  return (
    <div className="tf-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="tf-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="tf-modal-header">
          <span className="tf-modal-title">Sesuaikan Bobot: {criterion.id} - {criterion.name}</span>
          <button
            type="button"
            className="tf-action-btn"
            style={{ height: 32, padding: '0 10px', fontSize: 11 }}
            onClick={onClose}
          >
            Tutup
          </button>
        </div>

        <div className="tf-modal-body" style={{ gap: '16px' }}>
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: 'var(--nb-paper)',
              border: '2px solid var(--nb-black)',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--nb-text-muted)' }}>
              TIPE & ATRIBUT KRITERIA
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: 800, marginTop: '2px' }}>
              {criterion.name} ({criterion.type}) • Field: <code>{criterion.field}</code>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--nb-text-muted)', marginTop: '4px' }}>
              {criterion.type === 'COST'
                ? 'Kriteria Biaya (Cost): nilai lebih kecil memberikan normalisasi lebih tinggi (menguntungkan konsumen).'
                : 'Kriteria Manfaat (Benefit): nilai lebih besar memberikan normalisasi lebih tinggi (menguntungkan konsumen).'}
            </div>
          </div>

          <div>
            <label
              htmlFor="weight-input"
              style={{
                display: 'block',
                fontFamily: 'var(--font-heading)',
                fontSize: '12.5px',
                fontWeight: 800,
                marginBottom: '6px',
              }}
            >
              Nilai Bobot Relatif (Rentang 0.01 - 1.00):
            </label>
            <input
              id="weight-input"
              type="number"
              step="0.05"
              min="0.01"
              max="1.00"
              value={weightInput}
              onChange={(e) => {
                setWeightInput(e.target.value);
                setErrorMsg('');
              }}
              style={{
                width: '100%',
                height: '42px',
                padding: '0 12px',
                border: '2px solid var(--nb-black)',
                boxShadow: '2px 2px 0 var(--nb-black)',
                fontFamily: 'var(--font-mono)',
                fontSize: '16px',
                fontWeight: 800,
                backgroundColor: 'var(--nb-white)',
              }}
            />
            {errorMsg && (
              <div style={{ fontSize: '12px', color: 'var(--nb-pink)', fontWeight: 700, marginTop: '4px' }}>
                {errorMsg}
              </div>
            )}
          </div>

          <div
            style={{
              padding: '10px 12px',
              backgroundColor: '#FFF9DB',
              border: '1.5px solid var(--nb-black)',
              fontSize: '11.5px',
              lineHeight: 1.45,
            }}
          >
            <strong>Catatan Dampak:</strong> Mengubah bobot kriteria ini akan langsung memengaruhi perhitungan skor preferensi SAW e-book pada katalog toko publik setelah total bobot berjumlah 1,00 dan disimpan.
          </div>
        </div>

        <div className="tf-modal-footer">
          <button
            type="button"
            className="tf-action-btn"
            style={{ backgroundColor: 'var(--nb-yellow)', minHeight: '38px', padding: '0 20px' }}
            onClick={handleSave}
          >
            <span>Terapkan Bobot Lokal</span>
          </button>
          <button
            type="button"
            className="tf-action-btn"
            style={{ minHeight: '38px', padding: '0 16px' }}
            onClick={onClose}
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
