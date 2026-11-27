import { useCallback, useRef, useState } from 'react'
import { ConfirmDialog, Toast } from '../../../shared/components/ui'
import { CategoryFormDialog } from '../components/CategoryFormDialog'
import { CategoryPageHeader } from '../components/CategoryPageHeader'
import { CategorySummaryCards } from '../components/CategorySummaryCards'
import { CategoryTable } from '../components/CategoryTable'
import { CategoryToolbar } from '../components/CategoryToolbar'
import { useCategoryDirectory } from '../hooks/useCategoryDirectory'
import type { CategoryFormData, CategoryListItem } from '../types/category'

export function CategoryCatalogPage() {
  const addButtonRef = useRef<HTMLButtonElement | null>(null)
  const {
    categories,
    filters,
    isLoading,
    errorMessage,
    toasts,
    filteredTotal,
    paginatedCategories,
    totalPages,
    currentPage,
    statusCounts,
    summaryMetrics,
    setSearch,
    setStatus,
    resetFilters,
    handleSort,
    setPage,
    refreshCategories,
    createCategory,
    updateCategory,
    toggleCategoryStatus,
    deleteCategory,
    dismissToast,
  } = useCategoryDirectory()

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
  const [editingCategory, setEditingCategory] =
    useState<CategoryListItem | null>(null)
  const [categoryToToggle, setCategoryToToggle] =
    useState<CategoryListItem | null>(null)
  const [categoryToDelete, setCategoryToDelete] =
    useState<CategoryListItem | null>(null)

  const handleOpenAdd = useCallback(() => {
    setEditingCategory(null)
    setIsFormOpen(true)
  }, [])

  const handleOpenEdit = useCallback((category: CategoryListItem) => {
    setEditingCategory(category)
    setIsFormOpen(true)
  }, [])

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false)
    setEditingCategory(null)
  }, [])

  const handleSaveCategory = useCallback(
    async (data: CategoryFormData) => {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data)
      } else {
        await createCategory(data)
      }
      setIsFormOpen(false)
      setEditingCategory(null)
    },
    [editingCategory, updateCategory, createCategory],
  )

  const handleConfirmToggleStatus = useCallback(async () => {
    if (!categoryToToggle) return
    await toggleCategoryStatus(categoryToToggle)
    setCategoryToToggle(null)
  }, [categoryToToggle, toggleCategoryStatus])

  const handleConfirmDelete = useCallback(async () => {
    if (!categoryToDelete) return
    await deleteCategory(categoryToDelete)
    setCategoryToDelete(null)
  }, [categoryToDelete, deleteCategory])

  const hasActiveFilters =
    Boolean(filters.search.trim()) || filters.status !== 'ALL'

  return (
    <>
      <Toast toasts={toasts} onDismiss={dismissToast} />

      <div className="catalog-page-container">
        <CategoryPageHeader
          addButtonRef={addButtonRef}
          isSimulation={false}
          onAddClick={handleOpenAdd}
        />

        {errorMessage && (
          <section className="sys-banner is-error" role="alert">
            <div className="sys-banner-body">
              <h2 className="sys-banner-title">
                Gagal memuat daftar kategori dari backend
              </h2>
              <p className="sys-banner-text">{errorMessage}</p>
            </div>
            <div className="sys-banner-actions">
              <button
                type="button"
                className="sys-btn sys-btn-primary nb-btn"
                onClick={refreshCategories}
              >
                Coba Lagi
              </button>
            </div>
          </section>
        )}

        <CategorySummaryCards
          metrics={summaryMetrics}
          activeStatus={filters.status}
          isLoading={isLoading}
          onSelectStatus={setStatus}
        />

        <CategoryToolbar
          filters={filters}
          statusCounts={statusCounts}
          filteredTotal={filteredTotal}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onResetFilters={resetFilters}
          onRefresh={refreshCategories}
        />

        <CategoryTable
          categories={paginatedCategories}
          isLoading={isLoading}
          hasActiveFilters={hasActiveFilters}
          filters={filters}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredTotal}
          onSort={handleSort}
          onPageChange={setPage}
          onEdit={handleOpenEdit}
          onToggleStatus={setCategoryToToggle}
          onDelete={setCategoryToDelete}
          onAddFirst={handleOpenAdd}
        />
      </div>

      <CategoryFormDialog
        open={isFormOpen}
        category={editingCategory}
        existingCategories={categories}
        onSubmit={handleSaveCategory}
        onClose={handleCloseForm}
      />

      <ConfirmDialog
        open={Boolean(categoryToToggle)}
        title={
          categoryToToggle?.isActive
            ? `Arsipkan kategori "${categoryToToggle?.name || ''}"?`
            : `Aktifkan kembali kategori "${categoryToToggle?.name || ''}"?`
        }
        confirmLabel={
          categoryToToggle?.isActive ? 'Arsipkan Kategori' : 'Aktifkan Kategori'
        }
        confirmVariant={categoryToToggle?.isActive ? 'danger' : 'primary'}
        onConfirm={handleConfirmToggleStatus}
        onCancel={() => setCategoryToToggle(null)}
      >
        {categoryToToggle?.isActive ? (
          <p className="nb-confirm-copy">
            Mengarsipkan kategori ini akan menyembunyikan kategori beserta{' '}
            <strong>{categoryToToggle.ebookCount} e-book</strong> di dalamnya
            dari katalog Web Pengunjung dan Aplikasi Mobile tanpa menghapus data
            riwayat pembelian.
          </p>
        ) : (
          <p className="nb-confirm-copy">
            Mengaktifkan kembali kategori ini akan menampilkannya kembali di
            katalog publik Web Pengunjung dan Aplikasi Mobile.
          </p>
        )}
      </ConfirmDialog>

      <ConfirmDialog
        open={Boolean(categoryToDelete)}
        title={`Hapus permanen kategori "${categoryToDelete?.name || ''}"?`}
        confirmLabel="Hapus Kategori"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setCategoryToDelete(null)}
      >
        <p className="nb-confirm-copy">
          Tindakan ini akan menghapus kategori secara permanen dari database
          PostgreSQL. Jika kategori masih digunakan oleh e-book (
          <strong>{categoryToDelete?.ebookCount ?? 0} e-book</strong>), server
          akan menolak penghapusan dengan kode konflik 409.
        </p>
      </ConfirmDialog>
    </>
  )
}
