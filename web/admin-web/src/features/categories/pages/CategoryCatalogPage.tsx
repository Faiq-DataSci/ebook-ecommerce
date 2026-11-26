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
    deleteCategory,
    dismissToast,
  } = useCategoryDirectory()

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
  const [editingCategory, setEditingCategory] =
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
    (data: CategoryFormData) => {
      if (editingCategory) {
        updateCategory(editingCategory.id, data)
      } else {
        createCategory(data)
      }
      setIsFormOpen(false)
      setEditingCategory(null)
    },
    [editingCategory, updateCategory, createCategory],
  )

  const handleConfirmDelete = useCallback(() => {
    if (!categoryToDelete) return
    deleteCategory(categoryToDelete)
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
          onAddClick={handleOpenAdd}
        />

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
        open={Boolean(categoryToDelete)}
        title={`Hapus kategori "${categoryToDelete?.name || ''}"?`}
        confirmLabel="Hapus Kategori"
        confirmVariant="danger"
        isConfirmDisabled={(categoryToDelete?.ebookCount || 0) > 0}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCategoryToDelete(null)}
      >
        {(categoryToDelete?.ebookCount || 0) > 0 ? (
          <div className="nb-form-error-box nb-confirm-guard-box" role="alert">
            <div>
              <strong>Kategori tidak dapat dihapus:</strong> Kategori ini masih
              dipakai oleh{' '}
              <strong>{categoryToDelete?.ebookCount} e-book</strong>. Pindahkan
              atau arsipkan e-book tersebut sebelum menghapus kategori.
            </div>
          </div>
        ) : (
          <p className="nb-confirm-copy">
            Kategori ini tidak sedang dipakai oleh e-book manapun. Menghapus
            kategori akan menghilangkan data ini dari daftar kategori.
          </p>
        )}
      </ConfirmDialog>
    </>
  )
}
