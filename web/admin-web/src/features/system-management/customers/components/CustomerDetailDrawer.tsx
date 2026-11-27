import { useEffect, useRef } from 'react'
import { SimulationBadge, StatusBadge } from '../../../../shared/components/ui'
import { formatRupiah } from '../../../../shared/utils/formatters'
import type { CustomerRecord } from '../types/customer.types'
import { formatIndonesianDateTime } from '../utils/customer.utils'

interface CustomerDetailDrawerProps {
  customer: CustomerRecord | null
  isLoadingDetail: boolean
  isSimulation: boolean
  isMutating: boolean
  onClose: () => void
  onRequestToggleStatus: (customer: CustomerRecord) => void
}

function getOrderStatusFill(status: string): string {
  switch (status) {
    case 'PAID':
      return 'var(--nb-green)'
    case 'PENDING':
      return 'var(--nb-orange)'
    case 'FAILED':
    case 'EXPIRED':
    case 'CANCELLED':
      return 'var(--nb-pink)'
    default:
      return 'var(--nb-muted)'
  }
}

export function CustomerDetailDrawer({
  customer,
  isLoadingDetail,
  isSimulation,
  isMutating,
  onClose,
  onRequestToggleStatus,
}: CustomerDetailDrawerProps) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!customer) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    closeBtnRef.current?.focus()
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [customer, onClose])

  if (!customer) return null

  return (
    <div
      className="sys-drawer-scrim"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <aside
        className="sys-drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-detail-title"
      >
        <header className="sys-drawer-header">
          <div>
            <h2 id="customer-detail-title" className="sys-drawer-title">
              Detail Pelanggan &amp; Akun
            </h2>
            <p className="sys-drawer-subtitle">
              {customer.fullName} · {customer.email}
            </p>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            className="sys-btn sys-btn-sm nb-btn"
            onClick={onClose}
            aria-label="Tutup panel detail pelanggan"
          >
            Tutup
          </button>
        </header>

        <div className="sys-drawer-body">
          {isSimulation && (
            <div className="sys-banner is-warning">
              <div className="sys-banner-body">
                <div className="sys-header-meta">
                  <SimulationBadge compact />
                </div>
                <p className="sys-banner-text">
                  Detail ini berasal dari mode DATA SIMULASI lokal. Data produksi
                  akan tampil otomatis setelah endpoint backend{' '}
                  <code>GET /api/v1/admin/customers/:id</code> tersedia.
                </p>
              </div>
            </div>
          )}

          {isLoadingDetail ? (
            <div className="sys-detail-section" aria-busy="true">
              <div className="nb-skeleton-block" style={{ height: 20, width: '50%' }} />
              <div className="nb-skeleton-block is-delay-1" style={{ height: 48, width: '100%' }} />
              <div className="nb-skeleton-block is-delay-2" style={{ height: 48, width: '100%' }} />
            </div>
          ) : (
            <>
              {/* Identitas & Informasi Akun */}
              <section className="sys-detail-section">
                <h3 className="sys-section-heading">Identitas &amp; Informasi Akun</h3>
                <div className="sys-detail-grid">
                  <div className="sys-detail-field">
                    <span className="sys-detail-label">Nama Lengkap</span>
                    <span className="sys-detail-value">{customer.fullName}</span>
                  </div>
                  <div className="sys-detail-field">
                    <span className="sys-detail-label">Email</span>
                    <span className="sys-detail-value">{customer.email}</span>
                  </div>
                  <div className="sys-detail-field">
                    <span className="sys-detail-label">Nomor Telepon</span>
                    <span className="sys-detail-value">
                      {customer.phone ?? 'Belum diisi'}
                    </span>
                  </div>
                  <div className="sys-detail-field">
                    <span className="sys-detail-label">Peran Sistem</span>
                    <span className="sys-detail-value">{customer.role}</span>
                  </div>
                  <div className="sys-detail-field">
                    <span className="sys-detail-label">Status Akun</span>
                    <div style={{ marginTop: 2 }}>
                      {customer.isActive ? (
                        <StatusBadge status="Aktif" fill="var(--nb-green)" />
                      ) : (
                        <StatusBadge status="Nonaktif" fill="var(--nb-muted)" />
                      )}
                    </div>
                  </div>
                  <div className="sys-detail-field">
                    <span className="sys-detail-label">Tanggal Pendaftaran</span>
                    <span className="sys-detail-value font-mono-nb">
                      {formatIndonesianDateTime(customer.createdAt)}
                    </span>
                  </div>
                  <div className="sys-detail-field">
                    <span className="sys-detail-label">Pembaruan Terakhir</span>
                    <span className="sys-detail-value font-mono-nb">
                      {formatIndonesianDateTime(customer.updatedAt)}
                    </span>
                  </div>
                  <div className="sys-detail-field">
                    <span className="sys-detail-label">ID Pengguna</span>
                    <span className="sys-detail-value font-mono-nb">{customer.id}</span>
                  </div>
                </div>
              </section>

              {/* Ringkasan Riwayat Pembelian */}
              <section className="sys-detail-section">
                <h3 className="sys-section-heading">Ringkasan Riwayat Pembelian</h3>
                <div className="sys-detail-grid">
                  <div className="sys-detail-field">
                    <span className="sys-detail-label">Total Belanja Lunas</span>
                    <span className="sys-detail-value font-mono-nb">
                      {formatRupiah(customer.totalSpent)}
                    </span>
                  </div>
                  <div className="sys-detail-field">
                    <span className="sys-detail-label">Jumlah Pesanan</span>
                    <span className="sys-detail-value font-mono-nb">
                      {customer.ordersCount} total ({customer.paidOrdersCount} lunas)
                    </span>
                  </div>
                </div>

                {customer.orders && customer.orders.length > 0 ? (
                  <div className="sys-list-stack">
                    {customer.orders.map((order) => (
                      <div key={order.id} className="sys-list-item">
                        <div>
                          <div className="sys-customer-name font-mono-nb">
                            {order.orderNumber}
                          </div>
                          <div className="sys-customer-sub">
                            {formatIndonesianDateTime(order.createdAt)} ·{' '}
                            {order.itemCount} item
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div className="font-mono-nb" style={{ fontWeight: 700 }}>
                            {formatRupiah(order.totalAmount)}
                          </div>
                          <div style={{ marginTop: 4 }}>
                            <StatusBadge
                              status={order.status}
                              fill={getOrderStatusFill(order.status)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="sys-page-desc">
                    Belum ada riwayat pesanan yang tercatat untuk akun ini.
                  </p>
                )}
              </section>

              {/* Daftar E-Book & Hak Akses EbookAccess */}
              <section className="sys-detail-section">
                <h3 className="sys-section-heading">
                  E-Book Dimiliki &amp; Hak Akses Digital (EbookAccess)
                </h3>
                {customer.ebookAccesses && customer.ebookAccesses.length > 0 ? (
                  <div className="sys-list-stack">
                    {customer.ebookAccesses.map((access) => (
                      <div key={access.id} className="sys-list-item">
                        <div>
                          <div className="sys-customer-name">{access.ebookTitle}</div>
                          <div className="sys-customer-sub">
                            {access.ebookAuthor} · Pesanan{' '}
                            <span className="font-mono-nb">{access.orderNumber}</span>
                          </div>
                          <div className="sys-customer-sub">
                            Diberikan: {formatIndonesianDateTime(access.grantedAt)}
                          </div>
                        </div>
                        <div>
                          {access.isRevoked ? (
                            <StatusBadge status="Dicabut" fill="var(--nb-pink)" />
                          ) : (
                            <StatusBadge status="Aktif" fill="var(--nb-green)" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="sys-page-desc">
                    Pelanggan ini belum memiliki hak akses e-book digital.
                  </p>
                )}
              </section>

              {/* Catatan Keamanan Kredensial */}
              <section className="sys-security-note" aria-label="Kebijakan privasi kredensial">
                <strong>Batasan Keamanan Kredensial:</strong> Kata sandi, hash kata
                sandi, maupun token sesi autentikasi pelanggan tidak pernah ditampilkan
                atau dapat diakses oleh administrator.
              </section>
            </>
          )}
        </div>

        <footer className="sys-drawer-footer">
          <button
            type="button"
            className="sys-btn nb-btn"
            onClick={onClose}
          >
            Tutup Panel
          </button>

          <button
            type="button"
            className={`sys-btn nb-btn ${
              customer.isActive ? 'sys-btn-danger' : 'sys-btn-success'
            }`}
            disabled={isMutating}
            onClick={() => onRequestToggleStatus(customer)}
          >
            {isMutating
              ? 'Memproses...'
              : customer.isActive
              ? 'Nonaktifkan Akun'
              : 'Aktifkan Akun'}
          </button>
        </footer>
      </aside>
    </div>
  )
}
