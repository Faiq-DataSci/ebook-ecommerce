import type {
  CriterionType,
  SawCriterionAdminRecord,
  SawLiveMatrixCandidate,
} from '../../types/spk.types';
import { formatRawCriterionValue } from '../../utils/sawMatrixFormatters';

interface SawDecisionAndNormTablesProps {
  criteria: SawCriterionAdminRecord[];
  candidates: SawLiveMatrixCandidate[];
  extremeValues: Record<string, { max: number; min: number; type: CriterionType }>;
  candidateCodeMap: Map<string, string>;
}

export function SawDecisionAndNormTables({
  criteria,
  candidates,
  extremeValues,
  candidateCodeMap,
}: SawDecisionAndNormTablesProps) {
  return (
    <>
      <section className="tf-table-card" aria-label="Matriks Keputusan Asli">
        <div className="saw-stage-head is-yellow">
          <div>
            <span className="saw-stage-kicker">TAHAP 1 · MATRIKS KEPUTUSAN (X)</span>
            <h3 className="saw-stage-title">Nilai Mentah Alternatif E-Book per Kriteria</h3>
          </div>
          <span className="saw-stage-note">Skala Asli Basis Data</span>
        </div>

        <div className="tf-table-responsive">
          <table className="tf-table" style={{ minWidth: '820px' }}>
            <thead>
              <tr>
                <th style={{ width: '68px', textAlign: 'center' }}>Kode</th>
                <th>Alternatif E-Book</th>
                <th>Kategori</th>
                {criteria.map((c) => (
                  <th key={c.id} style={{ textAlign: 'right' }}>
                    {c.id} · {c.name} ({c.type})
                  </th>
                ))}
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
                    <div style={{ fontSize: '11.5px', color: 'var(--nb-text-muted)' }}>
                      {cand.author}
                    </div>
                  </td>
                  <td>
                    <span className="saw-badge">{cand.categoryName}</span>
                  </td>
                  {criteria.map((c) => {
                    const raw = cand.rawValues[c.id] ?? 0;
                    return (
                      <td key={c.id} className="tf-money">
                        <span>{formatRawCriterionValue(c, raw)}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: 'var(--nb-paper)', fontWeight: 800 }}>
                <td
                  colSpan={3}
                  style={{ textAlign: 'right', padding: '10px 14px', textTransform: 'uppercase' }}
                >
                  Nilai Ekstrem Pembagi (Max Benefit / Min Cost)
                </td>
                {criteria.map((c) => {
                  const ext = extremeValues[c.id];
                  const val = c.type === 'COST' ? ext?.min ?? 0 : ext?.max ?? 0;
                  const prefix = c.type === 'COST' ? 'Min' : 'Max';
                  return (
                    <td key={c.id} className="tf-money" style={{ padding: '10px 14px' }}>
                      <span>
                        {prefix}: {formatRawCriterionValue(c, val)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <section className="tf-table-card" aria-label="Matriks Normalisasi R">
        <div className="saw-stage-head is-paper">
          <div>
            <span className="saw-stage-kicker">TAHAP 2 · MATRIKS NORMALISASI (R)</span>
            <h3 className="saw-stage-title">Hasil Nilai Ternormalisasi (r_ij)</h3>
          </div>
          <span className="saw-stage-note">Rentang 0.0000 – 1.0000</span>
        </div>

        <div className="tf-table-responsive">
          <table className="tf-table" style={{ minWidth: '780px' }}>
            <thead>
              <tr>
                <th style={{ width: '68px', textAlign: 'center' }}>Kode</th>
                <th>Alternatif E-Book</th>
                {criteria.map((c) => (
                  <th key={c.id} style={{ textAlign: 'right' }}>
                    R_{c.id} ({c.type})
                  </th>
                ))}
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
                    const norm = cand.normalizedValues[c.id] ?? 0;
                    const isOptimal = Math.abs(norm - 1) < 1e-9;
                    return (
                      <td key={c.id} className="tf-money">
                        <span className={isOptimal ? 'saw-optimal-val' : undefined}>
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
      </section>
    </>
  );
}
