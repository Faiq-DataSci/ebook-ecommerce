import { Calculator, Info, X } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatCurrency';
import type { SawRecommendationItem } from '../types/recommendation.types';

interface SawCalculationDetailModalProps {
  item: SawRecommendationItem | null;
  onClose: () => void;
}

export function SawCalculationDetailModal({
  item,
  onClose,
}: SawCalculationDetailModalProps) {
  if (!item) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="saw-modal-title"
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--nb-white)',
          border: '4px solid var(--nb-black)',
          boxShadow: '10px 10px 0 var(--nb-black)',
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: 'var(--nb-lavender)',
            borderBottom: '3px solid var(--nb-black)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={20} aria-hidden="true" />
            <h2
              id="saw-modal-title"
              style={{
                fontFamily: 'var(--nb-font-heading)',
                fontSize: '1.125rem',
                fontWeight: 900,
                margin: 0,
              }}
            >
              Transparansi Perhitungan SAW
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Dialog"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'var(--nb-white)',
              border: '2px solid var(--nb-black)',
              boxShadow: '2px 2px 0 var(--nb-black)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontWeight: 800,
            }}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: '20px 22px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Target Ebook Quick Info */}
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--nb-paper)',
              border: '2px solid var(--nb-black)',
              boxShadow: '2px 2px 0 var(--nb-black)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--nb-font-heading)',
                  fontSize: '1rem',
                  fontWeight: 900,
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontFamily: 'var(--nb-font-body)',
                  fontSize: '0.8125rem',
                  color: 'var(--nb-text-muted)',
                }}
              >
                Penulis: {item.author}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  padding: '4px 10px',
                  backgroundColor: 'var(--nb-yellow)',
                  border: '2px solid var(--nb-black)',
                  fontFamily: 'var(--nb-font-heading)',
                  fontSize: '0.8125rem',
                  fontWeight: 800,
                }}
              >
                Rank #{item.rank}
              </span>
              <span
                style={{
                  padding: '4px 10px',
                  backgroundColor: 'var(--nb-black)',
                  color: 'var(--nb-white)',
                  border: '2px solid var(--nb-black)',
                  fontFamily: 'var(--nb-font-mono)',
                  fontSize: '0.875rem',
                  fontWeight: 800,
                }}
              >
                Skor: {item.displayScore}
              </span>
            </div>
          </div>

          {/* Table Breakdown Steps (design.md §11.2) */}
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.8125rem',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: 'var(--nb-yellow)' }}>
                  <th style={{ padding: '8px 10px', border: '2px solid var(--nb-black)' }}>
                    Kriteria
                  </th>
                  <th style={{ padding: '8px 10px', border: '2px solid var(--nb-black)' }}>
                    Jenis
                  </th>
                  <th style={{ padding: '8px 10px', border: '2px solid var(--nb-black)', textAlign: 'right' }}>
                    Bobot (w)
                  </th>
                  <th style={{ padding: '8px 10px', border: '2px solid var(--nb-black)', textAlign: 'right' }}>
                    Nilai Asli (x)
                  </th>
                  <th style={{ padding: '8px 10px', border: '2px solid var(--nb-black)', textAlign: 'right' }}>
                    Normalisasi (r)
                  </th>
                  <th style={{ padding: '8px 10px', border: '2px solid var(--nb-black)', textAlign: 'right' }}>
                    Kontribusi (w × r)
                  </th>
                </tr>
              </thead>
              <tbody>
                {item.calculationSteps.map((step) => {
                  const displayRaw =
                    step.field === 'price' || step.criterionId === 'C1'
                      ? formatCurrency(step.rawValue)
                      : step.field === 'pageCount'
                        ? `${step.rawValue} hal.`
                        : String(step.rawValue);

                  return (
                    <tr key={step.criterionId} style={{ backgroundColor: 'var(--nb-white)' }}>
                      <td style={{ padding: '8px 10px', border: '2px solid var(--nb-black)', fontWeight: 700 }}>
                        {step.criterionId}: {step.criterionName}
                      </td>
                      <td style={{ padding: '8px 10px', border: '2px solid var(--nb-black)' }}>
                        <span
                          style={{
                            padding: '1px 6px',
                            backgroundColor: step.type === 'BENEFIT' ? 'var(--nb-green)' : 'var(--nb-pink)',
                            color: step.type === 'BENEFIT' ? 'var(--nb-black)' : 'var(--nb-white)',
                            border: '1px solid var(--nb-black)',
                            fontSize: '0.6875rem',
                            fontWeight: 800,
                          }}
                        >
                          {step.type}
                        </span>
                      </td>
                      <td style={{ padding: '8px 10px', border: '2px solid var(--nb-black)', textAlign: 'right', fontFamily: 'var(--nb-font-mono)' }}>
                        {step.weight.toFixed(2)}
                      </td>
                      <td style={{ padding: '8px 10px', border: '2px solid var(--nb-black)', textAlign: 'right', fontFamily: 'var(--nb-font-mono)' }}>
                        {displayRaw}
                      </td>
                      <td style={{ padding: '8px 10px', border: '2px solid var(--nb-black)', textAlign: 'right', fontFamily: 'var(--nb-font-mono)', fontWeight: 700 }}>
                        {step.normalizedValue.toFixed(4)}
                      </td>
                      <td style={{ padding: '8px 10px', border: '2px solid var(--nb-black)', textAlign: 'right', fontFamily: 'var(--nb-font-mono)', fontWeight: 800 }}>
                        {step.weightedContribution.toFixed(4)}
                      </td>
                    </tr>
                  );
                })}
                {/* Total Row */}
                <tr style={{ backgroundColor: 'var(--nb-paper)', fontWeight: 900 }}>
                  <td colSpan={5} style={{ padding: '10px', border: '2px solid var(--nb-black)', textAlign: 'right', textTransform: 'uppercase' }}>
                    Total Nilai Preferensi (Skor Akhir V):
                  </td>
                  <td style={{ padding: '10px', border: '2px solid var(--nb-black)', textAlign: 'right', fontFamily: 'var(--nb-font-mono)', fontSize: '0.9375rem', backgroundColor: 'var(--nb-lavender)' }}>
                    {item.displayScore}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Explanation in plain terms */}
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: 'var(--nb-paper)',
              border: '2px solid var(--nb-black)',
              fontSize: '0.75rem',
              lineHeight: 1.5,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800 }}>
              <Info size={16} aria-hidden="true" />
              <span>Prinsip Rumus SAW (Simple Additive Weighting):</span>
            </div>
            <div>
              • <strong>Kriteria Benefit:</strong> Semakin tinggi nilainya semakin baik (rumus: <code>r_ij = x_ij / max(x)</code>).
            </div>
            <div>
              • <strong>Kriteria Cost:</strong> Semakin rendah harganya semakin terjangkau (rumus: <code>r_ij = min(x) / x_ij</code>).
            </div>
            <div>
              • <strong>Skor Akhir (V):</strong> Penjumlahan seluruh perkalian bobot kriteria dengan nilai normalisasinya (<code>Σ w_j × r_ij</code>).
            </div>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: '0.6875rem',
              color: 'var(--nb-text-muted)',
              fontStyle: 'italic',
            }}
          >
            * Catatan Transparansi: Rekomendasi adalah hasil model objektif dari kriteria dan bobot yang ditetapkan oleh Admin toko, bukan jaminan bahwa e-book ini cocok untuk seluruh kebutuhan pembaca.
          </p>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '14px 20px',
            backgroundColor: 'var(--nb-paper)',
            borderTop: '2px solid var(--nb-black)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              height: '38px',
              padding: '0 20px',
              backgroundColor: 'var(--nb-yellow)',
              border: '2px solid var(--nb-black)',
              boxShadow: '2px 2px 0 var(--nb-black)',
              fontFamily: 'var(--nb-font-heading)',
              fontSize: '0.8125rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Tutup Rincian
          </button>
        </div>
      </div>
    </div>
  );
}
