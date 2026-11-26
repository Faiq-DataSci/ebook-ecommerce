import type { SawCriterionAdminRecord } from '../types/spk.types';

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
  // Hitung total bobot secara realtime
  const totalWeight = criteria.reduce((sum, c) => sum + (c.isActive ? c.weight : 0), 0);
  const isWeightValid = Math.abs(totalWeight - 1.0) <= 1e-4;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Live Weight Summer Panel (design.md §10.8) */}
      <div
        className="spk-weight-summer-card"
        style={{
          padding: '16px 20px',
          backgroundColor: isWeightValid ? '#E6FCF5' : '#FFF5F5',
          border: '2.5px solid var(--nb-black)',
          boxShadow: '3px 3px 0 var(--nb-black)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: isWeightValid ? 'var(--nb-green)' : 'var(--nb-pink)',
              color: isWeightValid ? 'var(--nb-black)' : 'var(--nb-white)',
              border: '2px solid var(--nb-black)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '18px',
              fontWeight: 900,
            }}
          >
            {isWeightValid ? '✔' : '✕'}
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 800 }}>
              {isWeightValid
                ? 'Total Bobot: 1,00 (VALID: Siap Diterapkan ke Engine)'
                : `Total Bobot: ${totalWeight.toFixed(2)} (BELUM VALID: Total bobot harus berjumlah 1,00)`}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--nb-text-muted)', marginTop: '2px' }}>
              {isWeightValid
                ? 'Seluruh kriteria aktif memenuhi syarat akumulasi probabilitas 100% untuk metode SAW.'
                : 'Silakan sesuaikan bobot masing-masing kriteria menggunakan tombol "Ubah Bobot" di bawah.'}
            </div>
          </div>
        </div>

        {/* Action Controls for Weights */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            className="tf-action-btn"
            style={{
              backgroundColor: isWeightValid ? 'var(--nb-yellow)' : 'var(--nb-paper)',
              cursor: isWeightValid && !isSaving ? 'pointer' : 'not-allowed',
              opacity: isWeightValid ? 1 : 0.6,
              minHeight: '38px',
              padding: '0 18px',
            }}
            disabled={!isWeightValid || isSaving}
            onClick={() => onSaveAllWeights(criteria)}
            title={isWeightValid ? 'Simpan konfigurasi bobot ke backend server' : 'Total bobot harus berjumlah 1,00'}
          >
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Konfigurasi Bobot'}</span>
          </button>

          <button
            type="button"
            className="tf-action-btn"
            style={{ minHeight: '38px', padding: '0 14px' }}
            onClick={onResetWeights}
            title="Kembalikan ke bobot awal default"
          >
            <span>Reset Default</span>
          </button>
        </div>
      </div>

      {/* Table of Criteria (Zona C Padat Data) */}
      <div className="tf-table-card">
        <div className="tf-table-responsive">
          <table className="tf-table" style={{ minWidth: '820px' }}>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Kode</th>
                <th>Nama Kriteria</th>
                <th>Field Basis Data</th>
                <th>Tipe Kriteria</th>
                <th style={{ textAlign: 'right', width: '130px' }}>Bobot (w)</th>
                <th style={{ textAlign: 'center', width: '110px' }}>Persentase</th>
                <th style={{ width: '100px' }}>Status</th>
                <th style={{ textAlign: 'center', width: '130px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {criteria.map((c) => {
                const isBenefit = c.type === 'BENEFIT';
                const percent = Math.round(c.weight * 100);

                return (
                  <tr key={c.id}>
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
                        {c.id}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{c.name}</div>
                      {c.description && (
                        <div style={{ fontSize: '11px', color: 'var(--nb-text-muted)', marginTop: '2px' }}>
                          {c.description}
                        </div>
                      )}
                    </td>

                    <td>
                      <code style={{ fontSize: '11.5px', backgroundColor: 'var(--nb-paper)', padding: '2px 6px' }}>
                        {c.field}
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
                        <span>{c.type}</span>
                        <span style={{ fontSize: '10px' }}>
                          ({isBenefit ? 'Makin tinggi makin baik' : 'Makin rendah makin baik'})
                        </span>
                      </span>
                    </td>

                    <td className="tf-money">
                      <span style={{ fontSize: '14px' }}>{c.weight.toFixed(2)}</span>
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
                          backgroundColor: c.isActive ? 'var(--nb-green)' : 'var(--nb-paper)',
                          color: c.isActive ? 'var(--nb-white)' : 'var(--nb-text-muted)',
                          border: '1px solid var(--nb-black)',
                        }}
                      >
                        {c.isActive ? 'AKTIF' : 'NONAKTIF'}
                      </span>
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className="tf-action-btn"
                        onClick={() => onOpenEditModal(c)}
                        title={`Ubah bobot kriteria ${c.name}`}
                      >
                        <span>Ubah Bobot</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: 'var(--nb-paper)', fontWeight: 800 }}>
                <td colSpan={4} style={{ textAlign: 'right', textTransform: 'uppercase', padding: '12px 14px' }}>
                  Total Akumulasi Bobot Kriteria Aktif:
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
