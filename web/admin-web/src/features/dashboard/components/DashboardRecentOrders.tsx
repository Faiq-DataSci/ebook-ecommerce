import type { TransactionRecord, TransactionStatus } from '../types/dashboard'

interface DashboardRecentOrdersProps {
  visibleTransactions: TransactionRecord[]
  searchQuery: string
  filteredTransactionsCount: number
  totalRecordCount: number
  safePage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function getStatusBadgeClass(status: TransactionStatus): string {
  switch (status) {
    case 'LUNAS':
      return 'status-badge lunas'
    case 'MENUNGGU':
      return 'status-badge menunggu'
    case 'KEDALUWARSA':
      return 'status-badge kedaluwarsa'
  }
}

export function DashboardRecentOrders({
  visibleTransactions,
  searchQuery,
  filteredTransactionsCount,
  totalRecordCount,
  safePage,
  totalPages,
  onPageChange,
}: DashboardRecentOrdersProps) {
  return (
    <div className="transactions-card">
      <div className="transactions-header">
        <div className="transactions-title-group">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 24 }}
            aria-hidden="true"
          >
            receipt
          </span>
          <h2 className="transactions-heading">
            Live Stream Transaksi Terbaru
          </h2>
        </div>

        <div className="transactions-sync-status">
          <span className="status-square-dot" aria-hidden="true" />
          <span>Realtime Auto-Sync</span>
        </div>
      </div>

      <div className="table-scroll-wrap">
        <table className="nb-table">
          <thead>
            <tr>
              <th scope="col">Kode Transaksi</th>
              <th scope="col">Judul E-Book</th>
              <th scope="col">Pelanggan</th>
              <th scope="col">Metode</th>
              <th scope="col" style={{ textAlign: 'right' }}>
                Nominal
              </th>
              <th scope="col" style={{ textAlign: 'center' }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleTransactions.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: 'center',
                    padding: '24px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                  }}
                >
                  Tidak ada transaksi yang cocok dengan pencarian &ldquo;
                  {searchQuery}&rdquo;.
                </td>
              </tr>
            ) : (
              visibleTransactions.map((trx) => (
                <tr key={trx.code}>
                  <td className="td-code">{trx.code}</td>
                  <td className="td-book-title">{trx.bookTitle}</td>
                  <td>
                    <div className="td-customer">
                      <span className="td-customer-name">
                        {trx.customerName}
                      </span>
                      <span className="td-customer-email">
                        {trx.customerEmail}
                      </span>
                    </div>
                  </td>
                  <td className="td-method">{trx.paymentMethod}</td>
                  <td className="td-amount">{trx.amount}</td>
                  <td className="td-status">
                    <span className={getStatusBadgeClass(trx.status)}>
                      {trx.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="transactions-footer">
        <span>
          Menampilkan {visibleTransactions.length} dari{' '}
          {searchQuery.trim() ? filteredTransactionsCount : totalRecordCount}{' '}
          pesanan
        </span>

        <div
          className="pagination-group"
          role="navigation"
          aria-label="Paginasi Transaksi"
        >
          <button
            type="button"
            className="page-btn nb-btn"
            disabled={safePage <= 1}
            onClick={() => onPageChange(Math.max(1, safePage - 1))}
          >
            &lt; PREV
          </button>
          {[1, 2, 3].map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              className={`page-btn nb-btn ${
                safePage === pageNum ? 'is-active' : ''
              }`}
              aria-current={safePage === pageNum ? 'page' : undefined}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </button>
          ))}
          <button
            type="button"
            className="page-btn nb-btn"
            disabled={safePage >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
          >
            NEXT &gt;
          </button>
        </div>
      </div>
    </div>
  )
}
