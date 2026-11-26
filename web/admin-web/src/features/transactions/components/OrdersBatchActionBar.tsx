interface OrdersBatchActionBarProps {
  selectedCount: number
  onExportSelected: () => void
  onClearSelection: () => void
}

export function OrdersBatchActionBar({
  selectedCount,
  onExportSelected,
  onClearSelection,
}: OrdersBatchActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="tf-batch-bar" role="toolbar" aria-label="Aksi Massal Pesanan">
      <div className="tf-batch-info">
        <span
          style={{
            backgroundColor: 'var(--nb-yellow)',
            color: 'var(--nb-black)',
            padding: '2px 8px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
          }}
        >
          {selectedCount}
        </span>
        <span>Pesanan Terpilih dari Tabel</span>
      </div>

      <div className="tf-batch-actions">
        <button
          type="button"
          className="tf-action-btn"
          style={{ backgroundColor: 'var(--nb-yellow)', color: 'var(--nb-black)' }}
          onClick={onExportSelected}
        >
          <span>Ekspor CSV Terpilih</span>
        </button>

        <button
          type="button"
          className="tf-action-btn"
          style={{ backgroundColor: 'transparent', color: 'var(--nb-white)', borderColor: 'var(--nb-white)' }}
          onClick={onClearSelection}
        >
          <span>Batalkan Pilihan</span>
        </button>
      </div>
    </div>
  )
}
