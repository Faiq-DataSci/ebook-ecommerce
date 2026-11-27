import type {
  SawCriterionAdminRecord,
  SawLiveMatrixCandidate,
} from '../../types/spk.types';
import { getRecommendationTier } from '../../utils/sawMatrixFormatters';

interface SawWeightedAndRankingTablesProps {
  criteria: SawCriterionAdminRecord[];
  candidates: SawLiveMatrixCandidate[];
  topScore: number;
  candidateCodeMap: Map<string, string>;
}

export function SawWeightedAndRankingTables({
  criteria,
  candidates,
  topScore,
  candidateCodeMap,
}: SawWeightedAndRankingTablesProps) {
  return (
    <>
      <section className="tf-table-card" aria-label="Matriks Terbobot W kali R">
        <div className="saw-stage-head is-paper">
          <div>
            <span className="saw-stage-kicker">TAHAP 4 · MATRIKS TERBOBOT (W × R)</span>
            <h3 className="saw-stage-title">Kontribusi Setiap Kriteria terhadap Skor Preferensi</h3>
          </div>
          <span className="saw-stage-note">Hasil Perkalian w_j × r_ij</span>
        </div>

        <div className="tf-table-responsive">
          <table className="tf-table" style={{ minWidth: '800px' }}>
            <thead>
              <tr>
                <th style={{ width: '68px', textAlign: 'center' }}>Kode</th>
                <th>Alternatif E-Book</th>
                {criteria.map((c) => (
                  <th key={c.id} style={{ textAlign: 'right' }}>
                    {c.id} (w={c.weight.toFixed(2)})
                  </th>
                ))}
                <th style={{ textAlign: 'right', backgroundColor: 'var(--nb-lavender)' }}>
                  Total Skor (V)
                </th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((cand) => (
                <tr key={cand.id}>
                  <td style={{ textAlign: 'center' }}>
                    <span className="saw-alt-code">{candidateCodeMap.get(cand.id)}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{cand.title}</div>
                  </td>
                  {criteria.map((c) => {
                    const contrib = cand.weightedContributions[c.id] ?? 0;
                    return (
                      <td key={c.id} className="tf-money">
                        <span>{contrib.toFixed(4)}</span>
                      </td>
                    );
                  })}
                  <td
                    className="tf-money"
                    style={{ fontWeight: 800, backgroundColor: 'var(--nb-paper)' }}
                  >
                    <span>{cand.finalScore.toFixed(4)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="tf-table-card" aria-label="Tabel Pemeringkatan Akhir Skor V">
        <div className="saw-stage-head is-green">
          <div>
            <span className="saw-stage-kicker">TAHAP 5 · PEMERINGKATAN AKHIR (RANKING SKOR V)</span>
            <h3 className="saw-stage-title">
              Tabel Perengkingan Hasil Perhitungan Skor Preferensi (V)
            </h3>
          </div>
          <span className="saw-stage-note">Urutan Tertinggi ke Terendah</span>
        </div>

        <div className="tf-table-responsive">
          <table className="tf-table" style={{ minWidth: '860px' }}>
            <thead>
              <tr>
                <th style={{ width: '96px', textAlign: 'center' }}>Peringkat</th>
                <th style={{ width: '68px', textAlign: 'center' }}>Kode</th>
                <th>Alternatif E-Book</th>
                <th style={{ textAlign: 'right', backgroundColor: 'var(--nb-yellow)' }}>
                  Skor V (4 Desimal)
                </th>
                <th style={{ textAlign: 'right' }}>Skor Tampilan</th>
                <th style={{ width: '160px' }}>Visual Kontribusi</th>
                <th style={{ textAlign: 'right' }}>Selisih dari #1</th>
                <th style={{ textAlign: 'center' }}>Kategori Rekomendasi</th>
                <th style={{ textAlign: 'center' }}>Kelayakan</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((cand) => {
                const isWinner = cand.rank === 1;
                const diffFromTop = cand.finalScore - topScore;
                const tier = getRecommendationTier(cand.rank, cand.finalScore);

                return (
                  <tr
                    key={cand.id}
                    style={{
                      backgroundColor: isWinner ? '#FFF9DB' : 'var(--nb-white)',
                    }}
                  >
                    <td style={{ textAlign: 'center' }}>
                      <span
                        className={`saw-badge ${isWinner ? 'is-yellow' : ''}`}
                        style={{ fontSize: '12px', padding: '4px 10px' }}
                      >
                        #{cand.rank}
                      </span>
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <span className="saw-alt-code">{candidateCodeMap.get(cand.id)}</span>
                    </td>

                    <td>
                      <div style={{ fontWeight: 800, fontSize: '13.5px' }}>{cand.title}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--nb-text-muted)' }}>
                        {cand.author} · {cand.categoryName} · {cand.priceFormatted}
                      </div>
                    </td>

                    <td
                      className="tf-money"
                      style={{
                        fontWeight: 900,
                        fontSize: '14px',
                        backgroundColor: isWinner ? '#FFF3C4' : 'var(--nb-paper)',
                      }}
                    >
                      <span>{cand.finalScore.toFixed(4)}</span>
                    </td>

                    <td className="tf-money">
                      <span>{cand.displayScore}</span>
                    </td>

                    <td>
                      <div
                        className="saw-rank-bar-track"
                        title={`Skor V: ${cand.finalScore.toFixed(4)}`}
                      >
                        {criteria.map((c, idx) => {
                          const contrib = cand.weightedContributions[c.id] ?? 0;
                          const widthPct = Math.max(0, Math.min(100, contrib * 100));
                          return (
                            <div
                              key={c.id}
                              className={`saw-scorebar-seg pattern-${idx % 5}`}
                              style={{ width: `${widthPct}%` }}
                            />
                          );
                        })}
                      </div>
                    </td>

                    <td className="tf-money">
                      <span>{isWinner ? '0.0000' : diffFromTop.toFixed(4)}</span>
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <span className={`saw-badge ${tier.badgeClass}`}>{tier.label}</span>
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <span
                        className={`saw-badge ${cand.isEligible ? 'is-green' : 'is-pink'}`}
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

        <div className="saw-rank-footer-note">
          Peringkat di atas merupakan hasil perhitungan deterministik metode Simple
          Additive Weighting (SAW) berdasarkan kriteria dan bobot aktif yang
          ditetapkan admin. Jika terdapat dua alternatif dengan skor V identik,
          tie-breaker diurutkan secara alfabetis berdasarkan judul e-book (A–Z).
        </div>
      </section>
    </>
  );
}
