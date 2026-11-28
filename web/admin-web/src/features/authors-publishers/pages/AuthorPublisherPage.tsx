import {
  CatalogKpiGrid,
  ConfirmDialog,
  SimulationBadge,
  Toast,
} from '../../../shared/components/ui'
import { AuthorFormModal } from '../components/AuthorFormModal'
import { AuthorTablePanel } from '../components/AuthorTablePanel'
import { PublisherFormModal } from '../components/PublisherFormModal'
import { PublisherTablePanel } from '../components/PublisherTablePanel'
import { useAuthorPublisher } from '../hooks/useAuthorPublisher'

export function AuthorPublisherPage() {
  const {
    activeTab,
    setActiveTab,
    authors,
    authorFilters,
    setAuthorFilters,
    filteredAuthors,
    paginatedAuthors,
    totalAuthorPages,
    publishers,
    publisherFilters,
    setPublisherFilters,
    filteredPublishers,
    paginatedPublishers,
    totalPublisherPages,
    isLoading,
    isLiveFromDb,
    isAuthorModalOpen,
    setIsAuthorModalOpen,
    editingAuthor,
    authorFormData,
    setAuthorFormData,
    authorErrors,
    isPublisherModalOpen,
    setIsPublisherModalOpen,
    editingPublisher,
    publisherFormData,
    setPublisherFormData,
    publisherErrors,
    authorToDelete,
    setAuthorToDelete,
    publisherToDelete,
    setPublisherToDelete,
    toasts,
    dismissToast,
    summaryMetrics,
    handleAuthorSort,
    handlePublisherSort,
    handleOpenAddAuthor,
    handleOpenEditAuthor,
    handleSaveAuthor,
    handleConfirmDeleteAuthor,
    handleOpenAddPublisher,
    handleOpenEditPublisher,
    handleSavePublisher,
    handleConfirmDeletePublisher,
    handleRefreshDirectory,
  } = useAuthorPublisher()

  return (
    <>
      <Toast toasts={toasts} onDismiss={dismissToast} />

      <div className="catalog-page-container">
        <div className="catalog-page-header">
          <div className="catalog-title-group">
            <div className="catalog-header-title-row">
              <h1 className="catalog-page-title">Penulis & Penerbit</h1>
              {!isLiveFromDb && <SimulationBadge />}
            </div>
            <p className="catalog-page-subtitle">
              Direktori kontributor konten, lisensi kepengarangan, dan manajemen mitra penerbit buku.
            </p>
          </div>

          <button
            type="button"
            className="nb-btn catalog-primary-btn"
            onClick={activeTab === 'AUTHORS' ? handleOpenAddAuthor : handleOpenAddPublisher}
          >
            <span>{activeTab === 'AUTHORS' ? 'Tambah Penulis' : 'Tambah Penerbit'}</span>
          </button>
        </div>

        <CatalogKpiGrid
          ariaLabel="Ringkasan metrik penulis dan penerbit"
          isLoading={isLoading}
          items={[
            {
              id: 'ap-total-authors',
              label: 'Total Penulis',
              value: summaryMetrics.totalAuthors,
              unit: 'penulis',
              subtext: `${summaryMetrics.activeAuthors} aktif · ${summaryMetrics.inactiveAuthors} nonaktif`,
              tone: 'yellow',
              isSelected: activeTab === 'AUTHORS' && authorFilters.status === 'ALL',
              onClick: () => {
                setActiveTab('AUTHORS')
                setAuthorFilters((prev) => ({ ...prev, status: 'ALL', page: 1 }))
              },
            },
            {
              id: 'ap-total-publishers',
              label: 'Mitra Penerbit',
              value: summaryMetrics.totalPublishers,
              unit: 'penerbit',
              subtext: `${summaryMetrics.activePublishers} aktif · ${summaryMetrics.inactivePublishers} nonaktif`,
              tone: 'blue',
              isSelected: activeTab === 'PUBLISHERS' && publisherFilters.status === 'ALL',
              onClick: () => {
                setActiveTab('PUBLISHERS')
                setPublisherFilters((prev) => ({
                  ...prev,
                  status: 'ALL',
                  page: 1,
                }))
              },
            },
            {
              id: 'ap-active-contributors',
              label: 'Kontributor Aktif',
              value: summaryMetrics.totalActiveContributors,
              unit: 'entitas',
              subtext: `${summaryMetrics.activeAuthors} penulis & ${summaryMetrics.activePublishers} penerbit aktif`,
              tone: 'green',
              isSelected:
                (activeTab === 'AUTHORS' && authorFilters.status === 'AKTIF') ||
                (activeTab === 'PUBLISHERS' && publisherFilters.status === 'AKTIF'),
              onClick: () => {
                if (activeTab === 'AUTHORS') {
                  setAuthorFilters((prev) => ({
                    ...prev,
                    status: 'AKTIF',
                    page: 1,
                  }))
                } else {
                  setPublisherFilters((prev) => ({
                    ...prev,
                    status: 'AKTIF',
                    page: 1,
                  }))
                }
              },
            },
            {
              id: 'ap-linked-ebooks',
              label: 'E-Book Terhubung',
              value: summaryMetrics.totalAuthorEbooks,
              unit: 'judul',
              subtext: `${summaryMetrics.totalPublisherEbooks} judul terbitan mitra`,
              tone: 'muted',
            },
          ]}
        />

        {/* In-Page Tabs Bar (design.md §5.5) */}
        <div className="nb-page-tabs-bar" role="tablist" aria-label="Tab Penulis dan Penerbit">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'AUTHORS'}
            aria-controls="panel-authors"
            id="tab-authors"
            className={`nb-page-tab-btn ${activeTab === 'AUTHORS' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('AUTHORS')}
          >
            <span>Direktori Penulis</span>
            <span className="nb-page-tab-badge">{authors.length}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'PUBLISHERS'}
            aria-controls="panel-publishers"
            id="tab-publishers"
            className={`nb-page-tab-btn ${activeTab === 'PUBLISHERS' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('PUBLISHERS')}
          >
            <span>Mitra Penerbit</span>
            <span className="nb-page-tab-badge">{publishers.length}</span>
          </button>
        </div>

        {activeTab === 'AUTHORS' && (
          <AuthorTablePanel
            authors={authors}
            filteredAuthors={filteredAuthors}
            paginatedAuthors={paginatedAuthors}
            authorFilters={authorFilters}
            totalAuthorPages={totalAuthorPages}
            isLoading={isLoading}
            setAuthorFilters={setAuthorFilters}
            onSort={handleAuthorSort}
            onOpenAdd={handleOpenAddAuthor}
            onOpenEdit={handleOpenEditAuthor}
            onDelete={setAuthorToDelete}
            onRefresh={() =>
              handleRefreshDirectory('Data direktori penulis berhasil disegarkan.')
            }
          />
        )}

        {activeTab === 'PUBLISHERS' && (
          <PublisherTablePanel
            publishers={publishers}
            filteredPublishers={filteredPublishers}
            paginatedPublishers={paginatedPublishers}
            publisherFilters={publisherFilters}
            totalPublisherPages={totalPublisherPages}
            isLoading={isLoading}
            setPublisherFilters={setPublisherFilters}
            onSort={handlePublisherSort}
            onOpenAdd={handleOpenAddPublisher}
            onOpenEdit={handleOpenEditPublisher}
            onDelete={setPublisherToDelete}
            onRefresh={() => handleRefreshDirectory('Data mitra penerbit berhasil disegarkan.')}
          />
        )}
      </div>

      <AuthorFormModal
        isOpen={isAuthorModalOpen}
        editingAuthor={editingAuthor}
        formData={authorFormData}
        errors={authorErrors}
        setFormData={setAuthorFormData}
        onClose={() => setIsAuthorModalOpen(false)}
        onSubmit={handleSaveAuthor}
      />

      <PublisherFormModal
        isOpen={isPublisherModalOpen}
        editingPublisher={editingPublisher}
        formData={publisherFormData}
        errors={publisherErrors}
        setFormData={setPublisherFormData}
        onClose={() => setIsPublisherModalOpen(false)}
        onSubmit={handleSavePublisher}
      />

      <ConfirmDialog
        open={Boolean(authorToDelete)}
        title={`Hapus penulis "${authorToDelete?.name || ''}"?`}
        confirmLabel="Hapus Penulis"
        confirmVariant="danger"
        isConfirmDisabled={(authorToDelete?.ebookCount || 0) > 0}
        onConfirm={handleConfirmDeleteAuthor}
        onCancel={() => setAuthorToDelete(null)}
      >
        {(authorToDelete?.ebookCount || 0) > 0 ? (
          <div className="nb-form-error-box" style={{ padding: 12 }}>
            <div>
              <strong>Penulis tidak dapat dihapus:</strong> Penulis ini masih terkait dengan{' '}
              <strong>{authorToDelete?.ebookCount} e-book</strong> dalam katalog. Alihkan
              kepengarangan e-book tersebut sebelum menghapus profil.
            </div>
          </div>
        ) : (
          <p style={{ margin: 0 }}>
            Penulis ini tidak memiliki e-book terdaftar. Apakah Anda yakin ingin menghapus profil
            penulis ini secara permanen?
          </p>
        )}
      </ConfirmDialog>

      <ConfirmDialog
        open={Boolean(publisherToDelete)}
        title={`Hapus mitra penerbit "${publisherToDelete?.name || ''}"?`}
        confirmLabel="Hapus Penerbit"
        confirmVariant="danger"
        isConfirmDisabled={(publisherToDelete?.ebookCount || 0) > 0}
        onConfirm={handleConfirmDeletePublisher}
        onCancel={() => setPublisherToDelete(null)}
      >
        {(publisherToDelete?.ebookCount || 0) > 0 ? (
          <div className="nb-form-error-box" style={{ padding: 12 }}>
            <div>
              <strong>Penerbit tidak dapat dihapus:</strong> Mitra penerbit ini masih menerbitkan{' '}
              <strong>{publisherToDelete?.ebookCount} e-book</strong> aktif.
            </div>
          </div>
        ) : (
          <p style={{ margin: 0 }}>
            Penerbit ini tidak memiliki naskah terbitan aktif. Apakah Anda yakin ingin menghapus
            mitra penerbit ini secara permanen?
          </p>
        )}
      </ConfirmDialog>
    </>
  )
}
