import type { CSSProperties } from 'react';
import type { SawMatrixAuditData } from '../types/spk.types';

interface SawLiveMatrixAuditorProps {
  auditData: SawMatrixAuditData;
  onRefreshMatrix: () => void;
  isLoading: boolean;
}

export function SawLiveMatrixAuditor({
  auditData,
  onRefreshMatrix,
  isLoading,
}: SawLiveMatrixAuditorProps) {
  const { criteria, candidates, extremeValues } = auditData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Info Panel (design.md §10.8) */}
      <div
        className="nb-card"
        style={{
          padding: '16px 20px',
          backgroundColor: 'var(--nb-white)',
          border: '2.5px solid var(--nb-black)',
          boxShadow: '3px 3px 0 var(--nb-black)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                padding: '2px 8px',
                backgroundColor: 'var(--nb-lavender)',
                border: '1.5px solid var(--nb-black)',
                fontFamily: 'var(--font-heading)',
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
              }}
            >
              AUDIT MATRIKS SAW REAL-TIME
            </span>
            <span
              style={{
                padding: '2px 8px',
                backgroundColor: 'var(--nb-yellow)',
                border: '1.5px solid var(--nb-black)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              DATA SIMULASI TERVERIFIKASI
            </span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 900, margin: 0 }}>
            Inspeksi Transparansi Kalkulasi Algoritma SAW
          </h2>
          <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--nb-text-muted)' }}>
            Menampilkan seluruh tahap kalkulasi deterministik: Matriks Keputusan ($X$), Matriks Normalisasi ($R$), dan Pembobotan Preferensi ($V$).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            className="tf-action-btn"
            style={{ backgroundColor: 'var(--nb-paper)', minHeight: '38px', padding: '0 16px' }}
            onClick={onRefreshMatrix}
            disabled={isLoading}
          >
            <span>{isLoading ? 'Menyinkronkan...' : 'Sinkronkan Matriks'}</span>
          </button>
        </div>
      </div>

      {/* METRIC KPI AUDIT STRIP */}
      <div className="tf-kpi-grid">
        <div className="tf-kpi-card" style={{ '--card-accent': 'var(--nb-lavender)' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Alternatif E-Book</span>
          </div>
          <div className="tf-kpi-value">{auditData.totalAlternatives} Buku</div>
          <div className="tf-kpi-footer">
            <span>Kandidat e-book aktif dianalisis</span>
          </div>
        </div>

        <div className="tf-kpi-card" style={{ '--card-accent': 'var(--nb-yellow)' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Kriteria Aktif</span>
          </div>
          <div className="tf-kpi-value">{auditData.activeCriteriaCount} Kriteria</div>
          <div className="tf-kpi-footer">
            <span>{criteria.map((c) => c.id).join(', ')}</span>
          </div>
        </div>

        <div className="tf-kpi-card" style={{ '--card-accent': 'var(--nb-green)' } as CSSProperties}>
          <div className="tf-kpi-header">
            <span className="tf-kpi-title">Integritas Bobot</span>
          </div>
          <div className="tf-kpi-value">{auditData.totalWeight.toFixed(2)} / 1.00</div>
          <div className="tf-kpi-footer">
            <span>{auditData.isWeightValid ? '100% Akumulasi valid' : 'Belum seimbang'}</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAHAP 1: MATRIKS KEPUTUSAN ASLI (X)                      */}
      {/* ======================================================== */}
      <div className="tf-table-card">
        <div style={{ padding: '14px 18px', backgroundColor: 'var(--nb-yellow)', borderBottom: '2px solid var(--nb-black)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span className="tf-mono" style={{ fontSize: '11px', fontWeight: 800 }}>TAHAP 1: MATRIKS KEPUTUSAN (X)</span>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 800 }}>
                Data Mentah Nilai Alternatif E-Book (x_ij)
              </h3>
            </div>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
              Skala Asli Basis Data
            </span>
          </div>
        </div>

        <div className="tf-table-responsive">
          <table className="tf-table" style={{ minWidth: '820px' }}>
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>No</th>
                <th>Alternatif E-Book</th>
                <th>Kategori</th>
                {criteria.map((c) => (
                  <th key={c.id} style={{ textAlign: 'right' }}>
                    {c.id}: {c.name} ({c.type})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {candidates.map((cand, idx) => (
                <tr key={cand.id}>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                    {idx + 1}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{cand.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--nb-text-muted)' }}>{cand.author}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '11px', padding: '1px 6px', backgroundColor: 'var(--nb-paper)', border: '1px solid var(--nb-black)' }}>
                      {cand.categoryName}
                    </span>
                  </td>
                  {criteria.map((c) => {
                    const raw = cand.rawValues[c.id] ?? 0;
                    const formatted = c.id === 'C1' ? `Rp ${raw.toLocaleString('id-ID')}` : String(raw);
                    return (
                      <td key={c.id} className="tf-money">
                        <span>{formatted}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: '#FFFDF5', fontWeight: 800 }}>
                <td colSpan={3} style={{ textAlign: 'right', textTransform: 'uppercase', padding: '10px 14px' }}>
                  Nilai Ekstremum Pembagi (Max Benefit / Min Cost):
                </td>
                {criteria.map((c) => {
                  const extreme = extremeValues[c.id];
                  const val = c.type === 'COST' ? extreme?.min : extreme?.max;
                  const label = c.type === 'COST' ? `Min: Rp ${val?.toLocaleString('id-ID')}` : `Max: ${val}`;
                  return (
                    <td key={c.id} className="tf-money" style={{ padding: '10px 14px', backgroundColor: 'var(--nb-paper)' }}>
                      <span>{label}</span>
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAHAP 2: MATRIKS NORMALISASI (R)                         */}
      {/* ======================================================== */}
      <div className="tf-table-card">
        <div style={{ padding: '14px 18px', backgroundColor: 'var(--nb-paper)', borderBottom: '2px solid var(--nb-black)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span className="tf-mono" style={{ fontSize: '11px', fontWeight: 800 }}>TAHAP 2: MATRIKS NORMALISASI (R)</span>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 800 }}>
                Normalisasi Kinerja Ternormalisasi (r_ij)
              </h3>
            </div>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
              Rentang [0.0000 - 1.0000]
            </span>
          </div>
        </div>

        <div className="tf-table-responsive">
          <table className="tf-table" style={{ minWidth: '820px' }}>
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>No</th>
                <th>Alternatif E-Book</th>
                {criteria.map((c) => (
                  <th key={c.id} style={{ textAlign: 'right' }}>
                    r_{c.id} ({c.type === 'COST' ? 'min / x' : 'x / max'})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {candidates.map((cand, idx) => (
                <tr key={cand.id}>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                    {idx + 1}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{cand.title}</div>
                  </td>
                  {criteria.map((c) => {
                    const norm = cand.normalizedValues[c.id] ?? 0;
                    return (
                      <td key={c.id} className="tf-money">
                        <span style={{ color: norm === 1 ? '#087F5B' : 'var(--nb-black)' }}>
                          {norm.toFixed(4)}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAHAP 3: KONTRIBUSI BERBOBOT & PERINGKAT AKHIR (V)       */}
      {/* ======================================================== */}
      <div className="tf-table-card">
        <div style={{ padding: '14px 18px', backgroundColor: 'var(--nb-lavender)', borderBottom: '2px solid var(--nb-black)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span className="tf-mono" style={{ fontSize: '11px', fontWeight: 800 }}>TAHAP 3: PEMBOBOTAN & HASIL REKOMENDASI (V)</span>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 800 }}>
                Kontribusi Berbobot (w_j × r_ij) & Peringkat Akhir (V_i)
              </h3>
            </div>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
              Urutan Ranking Rekomendasi Toko
            </span>
          </div>
        </div>

        <div className="tf-table-responsive">
          <table className="tf-table" style={{ minWidth: '820px' }}>
            <thead>
              <tr>
                <th style={{ width: '90px', textAlign: 'center' }}>Peringkat</th>
                <th>Alternatif E-Book</th>
                {criteria.map((c) => (
                  <th key={c.id} style={{ textAlign: 'right' }}>
                    w_{c.id} × r_{c.id} (w={c.weight.toFixed(2)})
                  </th>
                ))}
                <th style={{ textAlign: 'right', width: '130px', backgroundColor: '#FEEAA2' }}>
                  Skor Akhir (V_i)
                </th>
                <th style={{ width: '120px', textAlign: 'center' }}>Status Kelayakan</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((cand) => {
                const isWinner = cand.rank === 1;

                return (
                  <tr
                    key={cand.id}
                    style={{
                      backgroundColor: isWinner ? '#FFF9DB' : 'var(--nb-white)',
                    }}
                  >
                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          backgroundColor: isWinner ? 'var(--nb-yellow)' : 'var(--nb-paper)',
                          border: '1.5px solid var(--nb-black)',
                          fontFamily: 'var(--font-heading)',
                          fontSize: '12px',
                          fontWeight: 900,
                        }}
                      >
                        #{cand.rank}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontWeight: 800, fontSize: '13.5px' }}>{cand.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--nb-text-muted)' }}>
                        {cand.author} • {cand.priceFormatted}
                      </div>
                    </td>

                    {criteria.map((c) => {
                      const contrib = cand.weightedContributions[c.id] ?? 0;
                      return (
                        <td key={c.id} className="tf-money">
                          <span>{contrib.toFixed(4)}</span>
                        </td>
                      );
                    })}

                    <td className="tf-money" style={{ backgroundColor: isWinner ? '#FFF3C4' : '#FAF8F5' }}>
                      <span style={{ fontSize: '14px', fontWeight: 900, color: 'var(--nb-black)' }}>
                        {cand.displayScore}
                      </span>
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontWeight: 800,
                          padding: '2px 6px',
                          backgroundColor: cand.isEligible ? 'var(--nb-green)' : 'var(--nb-pink)',
                          color: cand.isEligible ? 'var(--nb-black)' : 'var(--nb-white)',
                          border: '1px solid var(--nb-black)',
                        }}
                      >
                        {cand.isEligible ? 'LENGKAP' : 'DATA KURANG'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
