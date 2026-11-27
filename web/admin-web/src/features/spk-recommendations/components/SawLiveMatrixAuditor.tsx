import { useState, type CSSProperties } from 'react';
import { EmptyState } from '../../../shared/components/ui';
import type {
  SawLiveMatrixCandidate,
  SawMatrixAuditData,
} from '../types/spk.types';
import { formatRawCriterionValue } from '../utils/sawMatrixFormatters';
import { SawCalculationWalkthroughPanel } from './matrix/SawCalculationWalkthroughPanel';
import { SawDecisionAndNormTables } from './matrix/SawDecisionAndNormTables';
import { SawWeightedAndRankingTables } from './matrix/SawWeightedAndRankingTables';

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

  const candidateCodeMap = new Map<string, string>(
    candidates.map((cand, idx) => [cand.id, `A${idx + 1}`]),
  );

  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    candidates[0]?.id ?? '',
  );

  const selectedCandidate: SawLiveMatrixCandidate | undefined =
    candidates.find((c) => c.id === selectedCandidateId) ?? candidates[0];

  const topScore = candidates[0]?.finalScore ?? 0;

  return (
    <div className="saw-auditor">
      <section className="saw-header-card" aria-label="Ringkasan Audit Matriks SAW">
        <div className="saw-header-copy">
          <div className="saw-badge-row">
            <span className="saw-badge is-lavender">AUDIT MATRIKS SAW</span>
            {auditData.dataSource === 'BACKEND_LIVE' && (
              <span className="saw-badge is-green">LIVE BACKEND SAW</span>
            )}
            {auditData.dataSource === 'BACKEND_EMPTY' && (
              <span className="saw-badge">DATABASE KOSONG</span>
            )}
            {auditData.dataSource === 'SIMULATION_FALLBACK' && (
              <span className="saw-badge is-yellow">DATA SIMULASI</span>
            )}
            <span className="saw-badge">VERSI: {auditData.criteriaVersion}</span>
          </div>

          <h2 className="saw-header-title">
            Inspeksi Transparansi Matriks &amp; Perhitungan Algoritma SAW
          </h2>
          <p className="saw-header-desc">
            {auditData.sourceMessage ||
              'Audit lengkap 5 tahap: Referensi Nilai Ekstrem, Matriks Keputusan (X), Matriks Normalisasi (R), Bedah Langkah Perhitungan Interaktif, Matriks Terbobot (W × R), hingga Tabel Pemeringkatan Skor Akhir (V).'}
          </p>
          <span className="saw-header-meta">
            Terakhir dihitung: {auditData.calculatedAt} · Total alternatif:{' '}
            {auditData.totalAlternatives} e-book
          </span>
        </div>

        <button
          type="button"
          className="tf-action-btn nb-btn"
          style={{ backgroundColor: 'var(--nb-paper)', minHeight: '42px', padding: '0 16px' }}
          onClick={onRefreshMatrix}
          disabled={isLoading}
        >
          <span>{isLoading ? 'Menyinkronkan...' : 'Sinkronkan Matriks'}</span>
        </button>
      </section>

      {candidates.length === 0 && (
        <EmptyState
          title="Belum ada data e-book aktif untuk dihitung SAW"
          description="Tambahkan dan aktifkan minimal satu e-book pada menu Katalog E-Book agar engine SAW backend dapat menghitung matriks keputusan, normalisasi, dan peringkat skor V secara otomatis."
          actionLabel="Sinkronkan Ulang"
          onAction={onRefreshMatrix}
        />
      )}

      {candidates.length > 0 && (
        <>
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
                <span>{auditData.isWeightValid ? 'Akumulasi bobot valid' : 'Bobot belum seimbang'}</span>
              </div>
            </div>

            <div className="tf-kpi-card" style={{ '--card-accent': 'var(--nb-blue)' } as CSSProperties}>
              <div className="tf-kpi-header">
                <span className="tf-kpi-title">Skor Tertinggi (V1)</span>
              </div>
              <div className="tf-kpi-value">{topScore.toFixed(4)}</div>
              <div className="tf-kpi-footer">
                <span>
                  {candidates[0]
                    ? `${candidateCodeMap.get(candidates[0].id)} · ${candidates[0].title.slice(0, 26)}...`
                    : '-'}
                </span>
              </div>
            </div>
          </div>

          <section aria-label="Referensi Kriteria dan Nilai Ekstrem">
            <div className="saw-criteria-ref-grid">
              {criteria.map((c) => {
                const ext = extremeValues[c.id];
                const extremeVal = c.type === 'COST' ? ext?.min ?? 0 : ext?.max ?? 0;
                const extremeLabel = c.type === 'COST' ? 'Min' : 'Max';

                return (
                  <article key={c.id} className="saw-criteria-ref-card">
                    <div className="saw-criteria-ref-top">
                      <span className="saw-criteria-code">{c.id}</span>
                      <span className={`saw-badge ${c.type === 'COST' ? 'is-pink' : 'is-green'}`}>
                        {c.type}
                      </span>
                    </div>
                    <div className="saw-criteria-name">{c.name}</div>
                    <div className="saw-criteria-stats">
                      <span>Bobot: {c.weight.toFixed(2)}</span>
                      <span>
                        {extremeLabel}: {formatRawCriterionValue(c, extremeVal)}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <SawDecisionAndNormTables
            criteria={criteria}
            candidates={candidates}
            extremeValues={extremeValues}
            candidateCodeMap={candidateCodeMap}
          />

          <SawCalculationWalkthroughPanel
            criteria={criteria}
            candidates={candidates}
            selectedCandidate={selectedCandidate}
            totalWeight={auditData.totalWeight}
            extremeValues={extremeValues}
            candidateCodeMap={candidateCodeMap}
            onSelectCandidate={setSelectedCandidateId}
          />

          <SawWeightedAndRankingTables
            criteria={criteria}
            candidates={candidates}
            topScore={topScore}
            candidateCodeMap={candidateCodeMap}
          />
        </>
      )}
    </div>
  );
}
