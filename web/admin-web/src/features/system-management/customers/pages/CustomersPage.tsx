import { useState } from 'react'
import {
  ConfirmDialog,
  SimulationBadge,
  Toast,
} from '../../../../shared/components/ui'
import { CustomerDetailDrawer } from '../components/CustomerDetailDrawer'
import { CustomerSummaryCards } from '../components/CustomerSummaryCards'
import { CustomerTable } from '../components/CustomerTable'
import { CustomerToolbar } from '../components/CustomerToolbar'
import { useCustomers } from '../hooks/useCustomers'
import type { CustomerRecord } from '../types/customer.types'

export function CustomersPage() {
  const {
    filters,
    items,
    total,
    totalPages,
    summary,
    liveDashboardActiveCount,
    source,
    errorMessage,
    isLoading,
    isSimulationMode,
    selectedCustomer,
    isLoadingDetail,
    isMutating,
    toasts,
    setSearch,
    setStatus,
    setRole,
    setPage,
    handleSort,
    resetFilters,
    loadCustomers,
    enableSimulationPreview,
    exitSimulationPreview,
    openCustomerDetail,
    closeCustomerDetail,
    toggleCustomerStatus,
    dismissToast,
  } = useCustomers()

  const [pendingStatusTarget, setPendingStatusTarget] =
    useState<CustomerRecord | null>(null)

  const hasActiveFilters =
    Boolean(filters.search.trim()) ||
    filters.status !== 'ALL' ||
    filters.role !== 'ALL'

  const handleConfirmStatusToggle = async () => {
    if (!pendingStatusTarget) return
    const target = pendingStatusTarget
    setPendingStatusTarget(null)
    await toggleCustomerStatus(target)
  }

  return (
    <div className="sys-page">
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Header Halaman */}
      <header className="sys-page-header">
        <div className="sys-header-copy">
          <div className="sys-header-meta">
            <span className="sys-tag">MANAJEMEN SISTEM</span>
            <span className="sys-tag is-muted">ZONA C: DATA PADAT</span>
            {source === 'LIVE' && (
              <span className="sys-tag is-success">DATA BACKEND AKTIF</span>
            )}
            {source === 'SIMULATION' && <SimulationBadge compact />}
          </div>
          <h1 className="sys-page-title">Pelanggan &amp; User</h1>
          <p className="sys-page-desc">
            Kelola informasi akun pelanggan dan pantau aktivitas pengguna yang
            terdaftar pada sistem.
          </p>
        </div>

        <div className="sys-header-actions">
          {isSimulationMode && (
            <button
              type="button"
              className="sys-btn nb-btn"
              onClick={exitSimulationPreview}
            >
              Coba Koneksi Backend
            </button>
          )}
          <button
            type="button"
            className="sys-btn sys-btn-primary nb-btn"
            disabled={isLoading}
            onClick={() => void loadCustomers()}
          >
            {isLoading ? 'Memuat...' : 'Segarkan Data'}
          </button>
        </div>
      </header>

      {/* Banner Status Mode Simulasi */}
      {source === 'SIMULATION' && (
        <section className="sys-banner is-warning" role="status">
          <div className="sys-banner-body">
            <h2 className="sys-banner-title">
              DATA SIMULASI — Pratinjau Antarmuka Lokal
            </h2>
            <p className="sys-banner-text">
              Data yang ditampilkan saat ini adalah contoh simulasi berdasarkan
              struktur tabel <code>users</code>, <code>orders</code>, dan{' '}
              <code>ebook_accesses</code>. Perubahan status akun pada mode ini
              tidak disimpan ke database backend.
            </p>
          </div>
          <div className="sys-banner-actions">
            <button
              type="button"
              className="sys-btn sys-btn-sm nb-btn"
              onClick={exitSimulationPreview}
            >
              Kembali ke Mode Backend
            </button>
          </div>
        </section>
      )}

      {/* Ringkasan KPI (hanya data tersedia dari backend atau berlabel DATA SIMULASI) */}
      <CustomerSummaryCards
        summary={summary}
        liveDashboardActiveCount={liveDashboardActiveCount}
        activeStatus={filters.status}
        isLoading={isLoading}
        isSimulation={source === 'SIMULATION'}
        onSelectStatus={setStatus}
      />

      {/* Error State jika endpoint backend belum tersedia / gagal */}
      {!isLoading && source === 'UNAVAILABLE' ? (
        <section
          className="sys-banner is-error"
          role="alert"
          aria-label="Kesalahan memuat data pelanggan"
        >
          <div className="sys-banner-body">
            <h2 className="sys-banner-title">
              Data pelanggan belum dapat dimuat dari backend
            </h2>
            <p className="sys-banner-text">
              {errorMessage ||
                'Server backend tidak mengembalikan daftar pelanggan.'}{' '}
              Periksa apakah server backend berjalan dan endpoint{' '}
              <code>GET /api/v1/admin/customers</code> sudah tersedia.
            </p>
          </div>
          <div className="sys-banner-actions">
            <button
              type="button"
              className="sys-btn sys-btn-primary nb-btn"
              onClick={() => void loadCustomers()}
            >
              Coba Lagi
            </button>
            <button
              type="button"
              className="sys-btn nb-btn"
              onClick={enableSimulationPreview}
            >
              Pratinjau DATA SIMULASI
            </button>
          </div>
        </section>
      ) : (
        <>
          <CustomerToolbar
            filters={filters}
            totalMatched={total}
            isDisabled={isLoading}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onRoleChange={setRole}
            onResetFilters={resetFilters}
            onRefresh={() => void loadCustomers()}
          />

          <CustomerTable
            customers={items}
            filters={filters}
            totalItems={total}
            totalPages={totalPages}
            isLoading={isLoading}
            isMutating={isMutating}
            hasActiveFilters={hasActiveFilters}
            onSort={handleSort}
            onPageChange={setPage}
            onResetFilters={resetFilters}
            onViewDetail={(c) => void openCustomerDetail(c)}
            onRequestToggleStatus={setPendingStatusTarget}
          />
        </>
      )}

      {/* Panel Detail Pelanggan */}
      <CustomerDetailDrawer
        customer={selectedCustomer}
        isLoadingDetail={isLoadingDetail}
        isSimulation={source === 'SIMULATION'}
        isMutating={isMutating}
        onClose={closeCustomerDetail}
        onRequestToggleStatus={setPendingStatusTarget}
      />

      {/* Dialog Konfirmasi Perubahan Status Akun */}
      <ConfirmDialog
        open={Boolean(pendingStatusTarget)}
        title={
          pendingStatusTarget?.isActive
            ? `Nonaktifkan akun "${pendingStatusTarget.fullName}"?`
            : `Aktifkan kembali akun "${pendingStatusTarget?.fullName ?? ''}"?`
        }
        confirmLabel={
          isMutating
            ? 'Memproses...'
            : pendingStatusTarget?.isActive
            ? 'Ya, Nonaktifkan Akun'
            : 'Ya, Aktifkan Akun'
        }
        cancelLabel="Batal"
        confirmVariant={pendingStatusTarget?.isActive ? 'danger' : 'primary'}
        isConfirmDisabled={isMutating}
        onConfirm={() => void handleConfirmStatusToggle()}
        onCancel={() => setPendingStatusTarget(null)}
      >
        <p style={{ margin: '0 0 10px', fontSize: 14, lineHeight: 1.55 }}>
          {pendingStatusTarget?.isActive
            ? 'Menonaktifkan akun akan memblokir akses masuk pengguna dan mencegah permintaan Signed URL untuk membaca e-book. Riwayat pesanan dan transaksi lama tetap tersimpan aman di database.'
            : 'Mengaktifkan kembali akun akan memulihkan hak masuk pengguna sesuai peran yang terdaftar di backend.'}
        </p>
        {source === 'SIMULATION' && (
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>
            Catatan: Anda sedang berada pada mode DATA SIMULASI. Perubahan ini
            hanya berlaku secara lokal di browser.
          </p>
        )}
      </ConfirmDialog>
    </div>
  )
}
