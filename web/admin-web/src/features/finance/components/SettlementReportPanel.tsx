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
      return <StatusBadge status="DITRANSFER (CAIR)" fill="#00B894" icon="check_circle" textColor="#FFFFFF" />
    case 'PROCESSING':
      return <StatusBadge status="PROSES BATCH" fill="#FFD23F" icon="pending" textColor="#000000" />
    case 'SCHEDULED':
      return <StatusBadge status="TERJADWAL" fill="#74B9FF" icon="schedule" textColor="#000000" />
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Escrow Bank Account Banner */}
      <div
        style={{
          padding: '16px 20px',
          border: '2.5px solid #000000',
          boxShadow: '4px 4px 0px #000000',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              backgroundColor: '#74B9FF',
              border: '2px solid #000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
            }}
          >
            🏦
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--nb-text-muted)' }}>
              REKENING PENAMPUNG SETTLEMENT RESMI
            </div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>
              Bank Central Asia (BCA) — 8820-192-331 (PT Buku Kita Digital)
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="material-symbols-outlined" style={{ color: '#00B894', fontSize: 20 }}>verified</span>
          <span style={{ fontSize: 12, fontWeight: 700 }}>Auto-Disbursement Midtrans Terhubung (H+1)</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="tf-table-card">
        <div className="tf-table-header">
          <div className="tf-table-title-row">
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>receipt</span>
            <span className="tf-table-title">Buku Besar Kas &amp; Batch Pencairan Dana</span>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>Status:</span>
            <select
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
                <th>Ref Batch</th>
                <th>Waktu Settlement</th>
                <th>Trx</th>
                <th>Gross Masuk</th>
                <th>Potongan MDR</th>
                <th>Net Ditransfer</th>
                <th>Rekening Tujuan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredSettlements.map((batch) => (
                <tr key={batch.id}>
                  <td className="tf-mono" style={{ fontWeight: 700 }}>
                    {batch.batchReference}
                  </td>
                  <td style={{ fontSize: 12 }}>{batch.date}</td>
                  <td style={{ fontWeight: 700 }}>{batch.orderCount} pesanan</td>
                  <td className="tf-money">{batch.totalGrossFormatted}</td>
                  <td className="tf-money" style={{ color: '#D63031' }}>
                    - {batch.gatewayMdrFeeFormatted}
                  </td>
                  <td className="tf-money" style={{ color: '#00B894', fontWeight: 800 }}>
                    {batch.netPayoutFormatted}
                  </td>
                  <td style={{ fontSize: 12 }}>
                    {batch.destinationBank}
                  </td>
                  <td>{renderSettlementStatusBadge(batch.status)}</td>
                  <td>
                    <button
                      type="button"
                      className="tf-action-btn"
                      style={{ padding: '4px 10px', fontSize: 12 }}
                      onClick={() => onSelectSettlement(batch)}
                      title="Lihat Rincian Batch"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>info</span>
                      <span>Rincian</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
