interface SawWeightSummaryBarProps {
  isBulkEditing: boolean;
  isWeightValid: boolean;
  validationErrorsCount: number;
  activeCount: number;
  totalWeight: number;
  weightDiff: number;
  canSave: boolean;
  isSaving: boolean;
  onEnterBulkEdit: () => void;
  onAddCriterion: () => void;
  onSaveViewWeights: () => void;
  onResetWeights: () => void;
  onDistributeEvenly: () => void;
  onSaveBulk: () => void;
  onCancelBulkEdit: () => void;
}

export function SawWeightSummaryBar({
  isBulkEditing,
  isWeightValid,
  validationErrorsCount,
  activeCount,
  totalWeight,
  weightDiff,
  canSave,
  isSaving,
  onEnterBulkEdit,
  onAddCriterion,
  onSaveViewWeights,
  onResetWeights,
  onDistributeEvenly,
  onSaveBulk,
  onCancelBulkEdit,
}: SawWeightSummaryBarProps) {
  const isAllValid = isWeightValid && validationErrorsCount === 0;

  return (
    <div
      className="spk-weight-summer-card"
      style={{
        padding: '16px 20px',
        backgroundColor: isAllValid ? '#E6FCF5' : '#FFF5F5',
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
            backgroundColor: isAllValid ? 'var(--nb-green)' : 'var(--nb-pink)',
            color: isAllValid ? 'var(--nb-black)' : 'var(--nb-white)',
            border: '2px solid var(--nb-black)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '18px',
            fontWeight: 900,
            flexShrink: 0,
          }}
        >
          {isAllValid ? '✔' : '✕'}
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 800 }}>
            {isAllValid
              ? `Total Bobot Aktif: 1,00 (${activeCount} Kriteria Aktif — VALID)`
              : `Total Bobot Aktif: ${totalWeight.toFixed(2)} (${
                  weightDiff > 0
                    ? `Kurang ${weightDiff.toFixed(2)}`
                    : weightDiff < 0
                      ? `Lebih ${Math.abs(weightDiff).toFixed(2)}`
                      : 'Periksa isian kriteria'
                })`}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--nb-text-muted)', marginTop: '2px' }}>
            {isBulkEditing
              ? 'Mode Edit Banyak aktif: ubah nama, field, tipe, bobot, status, atau tambah/hapus kriteria sekaligus.'
              : 'Klik "Edit Banyak Kriteria" untuk mengubah banyak kriteria sekaligus, atau "+ Tambah Kriteria" untuk menambah kriteria baru.'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        {!isBulkEditing ? (
          <>
            <button
              type="button"
              className="tf-action-btn"
              style={{
                backgroundColor: 'var(--nb-lavender)',
                color: 'var(--nb-black)',
                minHeight: '38px',
                padding: '0 14px',
              }}
              onClick={onEnterBulkEdit}
              title="Edit semua kriteria dan bobot sekaligus di dalam tabel"
            >
              <span>Edit Banyak Kriteria</span>
            </button>

            <button
              type="button"
              className="tf-action-btn"
              style={{
                backgroundColor: 'var(--nb-white)',
                minHeight: '38px',
                padding: '0 14px',
              }}
              onClick={onAddCriterion}
              title="Tambah baris kriteria SAW baru"
            >
              <span>+ Tambah Kriteria</span>
            </button>

            <button
              type="button"
              className="tf-action-btn"
              style={{
                backgroundColor: canSave ? 'var(--nb-yellow)' : 'var(--nb-paper)',
                cursor: canSave ? 'pointer' : 'not-allowed',
                opacity: canSave ? 1 : 0.6,
                minHeight: '38px',
                padding: '0 16px',
              }}
              disabled={!canSave}
              onClick={onSaveViewWeights}
              title={
                canSave
                  ? 'Simpan konfigurasi bobot ke backend server'
                  : 'Total bobot kriteria aktif harus berjumlah 1,00'
              }
            >
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Konfigurasi'}</span>
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
          </>
        ) : (
          <>
            <button
              type="button"
              className="tf-action-btn"
              style={{
                backgroundColor: 'var(--nb-white)',
                minHeight: '38px',
                padding: '0 14px',
              }}
              onClick={onAddCriterion}
              title="Tambah kriteria baru ke daftar edit"
            >
              <span>+ Tambah Kriteria</span>
            </button>

            <button
              type="button"
              className="tf-action-btn"
              style={{
                backgroundColor: 'var(--nb-paper)',
                minHeight: '38px',
                padding: '0 14px',
              }}
              onClick={onDistributeEvenly}
              disabled={activeCount === 0}
              title="Bagi rata bobot 1,00 ke semua kriteria aktif"
            >
              <span>Bagi Rata Bobot</span>
            </button>

            <button
              type="button"
              className="tf-action-btn"
              style={{
                backgroundColor: canSave ? 'var(--nb-yellow)' : 'var(--nb-paper)',
                cursor: canSave ? 'pointer' : 'not-allowed',
                opacity: canSave ? 1 : 0.6,
                minHeight: '38px',
                padding: '0 16px',
              }}
              disabled={!canSave}
              onClick={onSaveBulk}
              title={
                canSave
                  ? 'Simpan seluruh perubahan kriteria & bobot ke server'
                  : 'Lengkapi semua kriteria & pastikan total bobot aktif = 1,00'
              }
            >
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua Kriteria'}</span>
            </button>

            <button
              type="button"
              className="tf-action-btn"
              style={{ minHeight: '38px', padding: '0 14px' }}
              onClick={onCancelBulkEdit}
              title="Batalkan perubahan dan kembali ke mode lihat"
            >
              <span>Batal Edit</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
