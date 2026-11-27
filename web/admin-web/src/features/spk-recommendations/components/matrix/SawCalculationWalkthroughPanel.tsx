import type {
  CriterionType,
  SawCriterionAdminRecord,
  SawLiveMatrixCandidate,
} from '../../types/spk.types';
import { formatRawNumberPlain } from '../../utils/sawMatrixFormatters';

interface SawCalculationWalkthroughPanelProps {
  criteria: SawCriterionAdminRecord[];
  candidates: SawLiveMatrixCandidate[];
  selectedCandidate: SawLiveMatrixCandidate | undefined;
  totalWeight: number;
  extremeValues: Record<string, { max: number; min: number; type: CriterionType }>;
  candidateCodeMap: Map<string, string>;
  onSelectCandidate: (candidateId: string) => void;
}

export function SawCalculationWalkthroughPanel({
  criteria,
  candidates,
  selectedCandidate,
  totalWeight,
  extremeValues,
  candidateCodeMap,
  onSelectCandidate,
}: SawCalculationWalkthroughPanelProps) {
  return (
    <section className="saw-calc-panel" aria-label="Panel Bedah Perhitungan Metode SAW">
      <div className="saw-stage-head is-lavender">
        <div>
          <span className="saw-stage-kicker">TAHAP 3 · RUANG BEDAH PERHITUNGAN SAW</span>
          <h3 className="saw-stage-title">
            Penjabaran Rumus Normalisasi &amp; Perhitungan Skor Preferensi (V)
          </h3>
        </div>
        <span className="saw-stage-note">Transparansi Langkah per Langkah</span>
      </div>

      <div className="saw-calc-body">
        <div className="saw-formula-grid">
          <div className="saw-formula-card">
            <h4 className="saw-formula-title">1. Rumus Normalisasi Matriks (R)</h4>
            <div className="saw-formula-box">
              <div>Kriteria BENEFIT : r_ij = x_ij / Max(x_j)</div>
              <div>Kriteria COST    : r_ij = Min(x_j) / x_ij</div>
            </div>
            <p className="saw-formula-note">
              Nilai optimal pada setiap kriteria bernilai 1.0000. Perhitungan di
              memori mempertahankan presisi penuh tanpa pembulatan antara.
            </p>
          </div>

          <div className="saw-formula-card">
            <h4 className="saw-formula-title">2. Rumus Nilai Preferensi Akhir (V)</h4>
            <div className="saw-formula-box">
              <div>V_i = Σ (w_j × r_ij)</div>
              <div>
                V_i ={' '}
                {criteria
                  .map((c) => `(${c.weight.toFixed(2)} × r_${c.id})`)
                  .join(' + ')}
              </div>
            </div>
            <p className="saw-formula-note">
              Total bobot aktif saat ini:{' '}
              <strong className="font-mono-nb">{totalWeight.toFixed(2)}</strong>.
              Semakin besar nilai V_i, semakin tinggi peringkat rekomendasi e-book.
            </p>
          </div>
        </div>

        {selectedCandidate && (
          <>
            <div className="saw-selector-section">
              <span className="saw-selector-label">
                Pilih Alternatif E-Book untuk Melihat Detail Perhitungan:
              </span>
              <div
                className="saw-selector-strip"
                role="tablist"
                aria-label="Pilih alternatif e-book"
              >
                {candidates.map((cand) => {
                  const code = candidateCodeMap.get(cand.id) ?? '-';
                  const isSelected = cand.id === selectedCandidate.id;
                  return (
                    <button
                      key={cand.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      className={`saw-alt-btn nb-btn ${isSelected ? 'is-active' : ''}`}
                      onClick={() => onSelectCandidate(cand.id)}
                    >
                      <span className="saw-alt-btn-code">{code}</span>
                      <span>
                        Peringkat #{cand.rank} ·{' '}
                        {cand.title.length > 28
                          ? `${cand.title.slice(0, 28)}...`
                          : cand.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="saw-walkthrough-box" role="tabpanel">
              <div className="saw-walkthrough-head">
                <div>
                  <div className="saw-badge-row" style={{ marginBottom: 6 }}>
                    <span className="saw-alt-code">
                      {candidateCodeMap.get(selectedCandidate.id)}
                    </span>
                    <span className="saw-badge is-lavender">
                      Peringkat #{selectedCandidate.rank}
                    </span>
                    <span className="saw-badge">{selectedCandidate.categoryName}</span>
                  </div>
                  <h4 className="saw-walkthrough-book">{selectedCandidate.title}</h4>
                  <p className="saw-walkthrough-meta">
                    {selectedCandidate.author} · {selectedCandidate.priceFormatted}
                  </p>
                </div>

                <div className="saw-walkthrough-score-pill">
                  Skor V = {selectedCandidate.finalScore.toFixed(4)}
                </div>
              </div>

              <div>
                <h5 className="saw-step-heading">
                  Langkah A — Perhitungan Normalisasi (r_ij)
                </h5>
                <div className="saw-norm-steps-grid">
                  {criteria.map((c) => {
                    const raw = selectedCandidate.rawValues[c.id] ?? 0;
                    const norm = selectedCandidate.normalizedValues[c.id] ?? 0;
                    const ext = extremeValues[c.id];
                    const divVal = c.type === 'COST' ? ext?.min ?? 0 : ext?.max ?? 0;

                    const expression =
                      c.type === 'COST'
                        ? `${formatRawNumberPlain(c, divVal)} / ${formatRawNumberPlain(c, raw)}`
                        : `${formatRawNumberPlain(c, raw)} / ${formatRawNumberPlain(c, divVal)}`;

                    return (
                      <div key={c.id} className="saw-norm-step-card">
                        <div className="saw-norm-step-top">
                          <span className="saw-criteria-code">{c.id}</span>
                          <span
                            className={`saw-badge ${c.type === 'COST' ? 'is-pink' : 'is-green'}`}
                          >
                            {c.type}
                          </span>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '13px' }}>{c.name}</div>
                        <div className="saw-norm-equation">
                          r_{c.id} = {expression}
                        </div>
                        <div className="saw-norm-result">
                          <span>Hasil Normalisasi:</span>
                          <span>{norm.toFixed(4)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h5 className="saw-step-heading">
                  Langkah B — Pembobotan (w_j × r_ij) &amp; Penjumlahan Skor Akhir (V)
                </h5>
                <div className="saw-v-equation-box">
                  <div className="saw-v-line">
                    <strong>Substitusi:</strong> V({candidateCodeMap.get(selectedCandidate.id)}) ={' '}
                    {criteria
                      .map((c) => {
                        const norm = selectedCandidate.normalizedValues[c.id] ?? 0;
                        return `(${c.weight.toFixed(2)} × ${norm.toFixed(4)})`;
                      })
                      .join(' + ')}
                  </div>

                  <div className="saw-v-line">
                    <strong>Kontribusi:</strong> V({candidateCodeMap.get(selectedCandidate.id)}) ={' '}
                    {criteria
                      .map((c) =>
                        (selectedCandidate.weightedContributions[c.id] ?? 0).toFixed(4),
                      )
                      .join(' + ')}
                  </div>

                  <div>
                    <span className="saw-v-total-line">
                      <span>
                        Skor Akhir V({candidateCodeMap.get(selectedCandidate.id)}) ={' '}
                        {selectedCandidate.finalScore.toFixed(4)}
                      </span>
                      <span>(Tampilan 3 desimal: {selectedCandidate.displayScore})</span>
                    </span>
                  </div>

                  <div className="saw-scorebar-wrap">
                    <div
                      className="saw-scorebar-track"
                      aria-label={`Proporsi kontribusi skor ${selectedCandidate.title}`}
                    >
                      {criteria.map((c, idx) => {
                        const contrib = selectedCandidate.weightedContributions[c.id] ?? 0;
                        const widthPct = Math.max(0, Math.min(100, contrib * 100));
                        return (
                          <div
                            key={c.id}
                            className={`saw-scorebar-seg pattern-${idx % 5}`}
                            style={{ width: `${widthPct}%` }}
                            title={`${c.id} (${c.name}): ${contrib.toFixed(4)}`}
                          >
                            {widthPct >= 10 ? c.id : ''}
                          </div>
                        );
                      })}
                    </div>

                    <div className="saw-scorebar-legend">
                      {criteria.map((c, idx) => {
                        const contrib = selectedCandidate.weightedContributions[c.id] ?? 0;
                        return (
                          <span key={c.id} className="saw-legend-item">
                            <span
                              className={`saw-legend-swatch saw-scorebar-seg pattern-${idx % 5}`}
                              aria-hidden="true"
                            />
                            <span>
                              {c.id}: {contrib.toFixed(4)}
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
