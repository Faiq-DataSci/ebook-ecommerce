import { StatusBadge } from '../../../shared/components/ui'
import type { SettlementRecord } from '../../transactions/types/transactionFinance'

interface SettlementReportPanelProps {
  settlements: SettlementRecord[]
  settlementFilter: 'ALL' | 'SETTLED' | 'PROCESSING'
  setSettlementFilter: (filter: 'ALL' | 'SETTLED' | 'PROCESSING') => void
  onSelectSettlement: (batch: SettlementRecord) => void
}

function renderSettlementStatusBadge(status: SettlementRecord['status']) {
  switch (status) {
    case 'SETTLED':
      return <StatusBadge status="Ditransfer (Cair)" fill="var(--nb-green)" textColor="var(--nb-black)" />
    case 'PROCESSING':
      return <StatusBadge status="Proses Batch" fill="var(--nb-orange)" textColor="var(--nb-black)" />
    case 'SCHEDULED':
      return <StatusBadge status="Terjadwal" fill="var(--nb-blue)" textColor="var(--nb-black)" />
  }
}

export function SettlementReportPanel({
  settlements,
  settlementFilter,
  setSettlementFilter,
  onSelectSettlement,
}: SettlementReportPanelProps) {
  const filteredSettlements = settlements.filter((s) => {
    if (settlementFilter === 'ALL') return true
    return s.status === settlementFilter
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Escrow Bank Account Banner */}
      <section className="tf-escrow-banner" aria-label="Rekening Penampung Settlement Resmi">
        <div className="tf-escrow-info">
          <span className="tf-escrow-label">Rekening Penampung Settlement Resmi</span>
          <div className="tf-escrow-account">
            Bank Central Asia (BCA)
            <span className="tf-escrow-account-no">8820-192-331</span>
            <span>(PT Buku Kita Digital)</span>
          </div>
        </div>

        <span className="tf-escrow-status-badge">
          Auto-Disbursement Xendit Terhubung (H+1)
        </span>
      </section>

      {/* Table Card */}
      <section className="tf-table-card" aria-label="Buku Besar Kas dan Batch Pencairan Dana">
        <div className="tf-table-header">
          <div className="tf-table-title-row">
            <h3 className="tf-table-title">Buku Besar Kas &amp; Batch Pencairan Dana</h3>
          </div>

          {/* Status Filter */}
          <div className="tf-table-filter-group">
            <label htmlFor="settlement-status-filter" className="tf-table-filter-label">
              Status:
            </label>
            <select
              id="settlement-status-filter"
              value={settlementFilter}
              onChange={(e) => setSettlementFilter(e.target.value as 'ALL' | 'SETTLED' | 'PROCESSING')}
              className="tf-filter-select"
            >
              <option value="ALL">Semua Batch</option>
              <option value="SETTLED">Sudah Cair (Settled)</option>
              <option value="PROCESSING">Sedang Diproses</option>
            </select>
          </div>
        </div>

        <div className="tf-table-responsive">
          <table className="tf-data-table">
            <thead>
              <tr>
                <th scope="col">Ref Batch</th>
                <th scope="col">Waktu Settlement</th>
                <th scope="col" className="is-right">Trx</th>
                <th scope="col" className="is-right">Gross Masuk</th>
                <th scope="col" className="is-right">Potongan MDR</th>
                <th scope="col" className="is-right">Net Ditransfer</th>
                <th scope="col">Rekening Tujuan</th>
                <th scope="col">Status</th>
                <th scope="col" className="is-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredSettlements.map((batch) => (
                <tr key={batch.id}>
                  <td className="tf-mono">{batch.batchReference}</td>
                  <td className="tf-td-muted">{batch.date}</td>
                  <td className="tf-money">{batch.orderCount} pesanan</td>
                  <td className="tf-money">{batch.totalGrossFormatted}</td>
                  <td className="tf-money">- {batch.gatewayMdrFeeFormatted}</td>
                  <td className="tf-money">{batch.netPayoutFormatted}</td>
                  <td>{batch.destinationBank}</td>
                  <td>{renderSettlementStatusBadge(batch.status)}</td>
                  <td className="tf-td-center">
                    <button
                      type="button"
                      className="tf-action-btn"
                      onClick={() => onSelectSettlement(batch)}
                      title="Lihat Rincian Batch"
                    >
                      Rincian
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
