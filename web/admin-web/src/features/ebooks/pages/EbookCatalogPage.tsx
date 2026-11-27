import {
  CatalogKpiGrid,
  ConfirmDialog,
  EmptyState,
  TableSkeleton,
  Toast,
} from '../../../shared/components/ui'
import { EbookCardGrid } from '../components/EbookCardGrid'
import { EbookForm } from '../components/EbookForm'
import { EbookTable } from '../components/EbookTable'
import { EbookToolbar } from '../components/EbookToolbar'
import { useEbookCatalog } from '../hooks/useEbookCatalog'

interface EbookCatalogPageProps {
  initialView?: 'LIST' | 'FORM'
  currentPath?: string
  onBreadcrumbChange?: (text: string) => void
  onNavigate?: (path: string) => void
}

export function EbookCatalogPage({
  initialView = 'LIST',
  currentPath,
  onBreadcrumbChange,
  onNavigate,
}: EbookCatalogPageProps) {
  const {
    viewMode,
    displayMode,
    setDisplayMode,
    ebooks,
    totalCount,
    totalPages,
    categories,
    errorMessage,
    filters,
    setFilters,
    isLoading,
    activeCount,
    archiveCount,
    categoryCounts,
    selectedCategoryObj,
    editingEbook,
    formData,
    setFormData,
    formErrors,
    isSubmitting,
    isFormDirty,
    setIsFormDirty,
    showUnsavedConfirm,
    setShowUnsavedConfirm,
    ebookToToggleStatus,
    setEbookToToggleStatus,
    toasts,
    dismissToast,
    loadEbooks,
    handleSort,
    handleApplySynopsisTemplate,
    handleOpenAdd,
    handleOpenEdit,
    handleCancelForm,
    handleDiscardForm,
    handleSaveEbook,
    handleCoverSelect,
    handleCoverRemove,
    handlePdfSelect,
    handlePdfRemove,
    handleConfirmToggleStatus,
    handleRefreshList,
  } = useEbookCatalog({
    initialView,
    currentPath,
    onBreadcrumbChange,
    onNavigate,
  })

  return (
    <>
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {viewMode === 'LIST' && (
        <div className="catalog-page-container">
          <div className="catalog-page-header">
            <div className="catalog-title-group">
              <div className="catalog-header-title-row">
                <h1 className="catalog-page-title">Koleksi E-Book</h1>
                <span
                  className="nb-simulation-badge"
                  style={{
                    backgroundColor: errorMessage ? 'var(--nb-pink)' : 'var(--nb-green)',
                    color: 'var(--nb-black)',
                    borderColor: 'var(--nb-black)',
                  }}
                  title="Terhubung langsung dengan backend API PostgreSQL"
                >
                  <span>{errorMessage ? 'BACKEND ERROR' : 'API LIVE'}</span>
                </span>
              </div>
              <p className="catalog-page-subtitle">
                Inventaris master buku digital, status penjualan, dan manajemen aset bucket privat.
              </p>
            </div>

            <button
              type="button"
              className="nb-btn catalog-primary-btn"
              onClick={handleOpenAdd}
            >
              <span>Tambah E-Book</span>
            </button>
          </div>

          {errorMessage && (
            <section className="sys-banner is-error" role="alert">
              <div className="sys-banner-body">
                <h2 className="sys-banner-title">
                  Gagal memuat koleksi e-book dari backend
                </h2>
                <p className="sys-banner-text">{errorMessage}</p>
              </div>
              <div className="sys-banner-actions">
                <button
                  type="button"
                  className="sys-btn sys-btn-primary nb-btn"
                  onClick={() => void loadEbooks()}
                >
                  Coba Lagi
                </button>
              </div>
            </section>
          )}

          <CatalogKpiGrid
            ariaLabel="Ringkasan metrik koleksi e-book"
            isLoading={isLoading}
            items={[
              {
                id: 'ebook-total',
                label: 'Total Koleksi',
                value: totalCount,
                unit: 'e-book',
                subtext: 'Judul buku terdaftar di katalog',
                tone: 'yellow',
                isSelected: filters.status === 'ALL',
                onClick: () =>
                  setFilters((prev) => ({ ...prev, status: 'ALL', page: 1 })),
              },
              {
                id: 'ebook-active',
                label: 'Katalog Publik',
                value: activeCount,
                unit: 'aktif',
                subtext: 'Aktif di etalase pembeli',
                tone: 'green',
                isSelected: filters.status === 'AKTIF',
                onClick: () =>
                  setFilters((prev) => ({ ...prev, status: 'AKTIF', page: 1 })),
              },
              {
                id: 'ebook-archive',
                label: 'Arsip Digital',
                value: archiveCount,
                unit: 'arsip',
                subtext: 'Nonaktif / simpanan draf',
                tone: 'muted',
                isSelected: filters.status === 'ARSIP',
                onClick: () =>
                  setFilters((prev) => ({ ...prev, status: 'ARSIP', page: 1 })),
              },
              {
                id: 'ebook-private-storage',
                label: 'Storage Privat',
                value: '100% Aman',
                subtext: 'Akses PDF via Signed URL berumur pendek',
                tone: 'blue',
              },
            ]}
          />

          <EbookToolbar
            filters={filters}
            categories={categories}
            totalCount={totalCount}
            activeCount={activeCount}
            archiveCount={archiveCount}
            categoryCounts={categoryCounts}
            selectedCategoryObj={selectedCategoryObj}
            displayMode={displayMode}
            setDisplayMode={setDisplayMode}
            setFilters={setFilters}
            onRefresh={handleRefreshList}
          />

          {isLoading ? (
            <TableSkeleton rows={6} cols={7} />
          ) : totalCount === 0 ? (
            <EmptyState
              title="Tidak Ada E-Book Ditemukan"
              description={
                filters.search || filters.categoryId || filters.status !== 'ALL'
                  ? 'Tidak ada e-book yang cocok dengan kombinasi filter dan pencarian saat ini.'
                  : 'Belum ada data e-book pada katalog. Tambahkan e-book pertama Anda sekarang.'
              }
              actionLabel="Tambah E-Book Pertama"
              onAction={handleOpenAdd}
            />
          ) : displayMode === 'GRID' ? (
            <EbookCardGrid
              ebooks={ebooks}
              categories={categories}
              filters={filters}
              totalPages={totalPages}
              totalCount={totalCount}
              onEdit={handleOpenEdit}
              onToggleStatus={setEbookToToggleStatus}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            />
          ) : (
            <EbookTable
              ebooks={ebooks}
              categories={categories}
              filters={filters}
              totalPages={totalPages}
              totalCount={totalCount}
              onSort={handleSort}
              onEdit={handleOpenEdit}
              onToggleStatus={setEbookToToggleStatus}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            />
          )}
        </div>
      )}

      {viewMode === 'FORM' && (
        <EbookForm
          editingEbook={editingEbook}
          formData={formData}
          formErrors={formErrors}
          categories={categories}
          isSubmitting={isSubmitting}
          isFormDirty={isFormDirty}
          isSimulationData={false}
          setFormData={setFormData}
          setIsFormDirty={setIsFormDirty}
          onApplySynopsisTemplate={handleApplySynopsisTemplate}
          onCancel={handleCancelForm}
          onSubmit={handleSaveEbook}
          onCoverSelect={handleCoverSelect}
          onCoverRemove={handleCoverRemove}
          onPdfSelect={handlePdfSelect}
          onPdfRemove={handlePdfRemove}
        />
      )}

      <ConfirmDialog
        open={Boolean(ebookToToggleStatus)}
        title={
          ebookToToggleStatus?.isActive
            ? `Arsipkan e-book "${ebookToToggleStatus.title}"?`
            : `Aktifkan kembali e-book "${ebookToToggleStatus?.title}"?`
        }
        confirmLabel={
          ebookToToggleStatus?.isActive ? 'Arsipkan E-Book' : 'Aktifkan E-Book'
        }
        confirmVariant={ebookToToggleStatus?.isActive ? 'danger' : 'primary'}
        onConfirm={handleConfirmToggleStatus}
        onCancel={() => setEbookToToggleStatus(null)}
      >
        <p style={{ margin: 0 }}>
          {ebookToToggleStatus?.isActive
            ? 'Mengarsipkan e-book akan menyembunyikannya dari katalog toko publik. Pengguna yang sudah membeli e-book ini tetap memiliki hak akses penuh membaca di perpustakaan digital.'
            : 'Mengaktifkan kembali e-book akan mempublikasikan ulang buku ini ke dalam etalase toko dan perhitungan SPK rekomendasi pelanggan.'}
        </p>
      </ConfirmDialog>

      <ConfirmDialog
        open={showUnsavedConfirm}
        title="Tinggalkan formulir tanpa menyimpan?"
        confirmLabel="Ya, Buang Perubahan"
        confirmVariant="danger"
        onConfirm={handleDiscardForm}
        onCancel={() => setShowUnsavedConfirm(false)}
      >
        <p style={{ margin: 0 }}>
          Perubahan yang Anda masukkan pada formulir e-book ini belum disimpan ke basis
          data. Jika keluar sekarang, seluruh input yang baru diubah akan hilang.
        </p>
      </ConfirmDialog>
    </>
  )
}
