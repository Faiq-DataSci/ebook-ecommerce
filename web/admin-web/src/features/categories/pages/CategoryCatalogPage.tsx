import { useMemo, useState } from 'react'
import {
  ConfirmDialog,
  EmptyState,
  FilterChipGroup,
  Pagination,
  SearchInput,
  SimulationBadge,
  StatusBadge,
  TableSkeleton,
  Toast,
  type ToastMessage,
  ToggleSwitch,
} from '../../../shared/components/ui'
import { MOCK_CATEGORIES } from '../../ebooks/data/catalogData'
import type {
  CategoryFormData,
  CategoryListItem,
  CategoryStatus,
  CategoryTableFilters,
} from '../../ebooks/types/catalog'

export function CategoryCatalogPage() {
  // State Data & Filter
  const [categories, setCategories] = useState<CategoryListItem[]>(MOCK_CATEGORIES)
  const [filters, setFilters] = useState<CategoryTableFilters>({
    search: '',
    status: 'ALL',
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    limit: 6,
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Dialog State
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
  const [editingCategory, setEditingCategory] = useState<CategoryListItem | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    isActive: true,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Delete Dialog State
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryListItem | null>(null)

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (type: 'success' | 'error' | 'info' | 'warning', text: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, type, text }])
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Filter & Sort Logic
  const filteredCategories = useMemo(() => {
    let result = [...categories]

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q)),
      )
    }

    if (filters.status !== 'ALL') {
      const activeBool = filters.status === 'AKTIF'
      result = result.filter((c) => c.isActive === activeBool)
    }

    result.sort((a, b) => {
      let cmp = 0
      if (filters.sortBy === 'name') {
        cmp = a.name.localeCompare(b.name)
      } else if (filters.sortBy === 'slug') {
        cmp = a.slug.localeCompare(b.slug)
      } else if (filters.sortBy === 'ebookCount') {
        cmp = a.ebookCount - b.ebookCount
      } else if (filters.sortBy === 'createdAt') {
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return filters.sortOrder === 'asc' ? cmp : -cmp
    })

    return result
  }, [categories, filters])

  // Pagination Slice
  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / filters.limit))
  const paginatedCategories = useMemo(() => {
    const start = (filters.page - 1) * filters.limit
    return filteredCategories.slice(start, start + filters.limit)
  }, [filteredCategories, filters.page, filters.limit])

  // Sorting Handler
  const handleSort = (column: 'name' | 'slug' | 'ebookCount' | 'createdAt') => {
    setFilters((prev) => {
      if (prev.sortBy === column) {
        return {
          ...prev,
          sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
        }
      }
      return {
        ...prev,
        sortBy: column,
        sortOrder: 'asc',
      }
    })
  }

  // Auto-slug helper
  const handleNameChange = (newName: string) => {
    const isCreating = !editingCategory
    const generatedSlug = newName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')

    setFormData((prev) => ({
      ...prev,
      name: newName,
      slug: isCreating ? generatedSlug : prev.slug,
    }))

    if (formErrors.name) {
      setFormErrors((prev) => ({ ...prev, name: '' }))
    }
  }

  // Open Add Dialog
  const handleOpenAdd = () => {
    setEditingCategory(null)
    setFormData({
      name: 'DATA SIMULASI — ',
      slug: '',
      description: '',
      isActive: true,
    })
    setFormErrors({})
    setIsFormOpen(true)
  }

  // Open Edit Dialog
  const handleOpenEdit = (item: CategoryListItem) => {
    setEditingCategory(item)
    setFormData({
      name: item.name,
      slug: item.slug,
      description: item.description || '',
      isActive: item.isActive,
    })
    setFormErrors({})
    setIsFormOpen(true)
  }

  // Save Category Handler
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault()

    const errors: Record<string, string> = {}
    if (!formData.name.trim()) {
      errors.name = 'Nama kategori wajib diisi.'
    }
    if (!formData.slug.trim()) {
      errors.slug = 'Slug kategori wajib diisi.'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    if (editingCategory) {
      // Update
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                name: formData.name.trim(),
                slug: formData.slug.trim(),
                description: formData.description.trim() || null,
                isActive: formData.isActive,
              }
            : c,
        ),
      )
      addToast('success', `Kategori "${formData.name}" berhasil diperbarui.`)
    } else {
      // Create
      const newCat: CategoryListItem = {
        id: `cat-${Date.now()}`,
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || null,
        isActive: formData.isActive,
        ebookCount: 0,
        createdAt: new Date().toISOString(),
      }
      setCategories((prev) => [newCat, ...prev])
      addToast('success', `Kategori "${formData.name}" berhasil ditambahkan.`)
    }

    setIsFormOpen(false)
  }

  // Delete Category Handler
  const handleConfirmDelete = () => {
    if (!categoryToDelete) return

    if (categoryToDelete.ebookCount > 0) {
      addToast(
        'error',
        `Kategori tidak dapat dihapus karena masih digunakan oleh ${categoryToDelete.ebookCount} e-book.`,
      )
      setCategoryToDelete(null)
      return
    }

    setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id))
    addToast('success', `Kategori "${categoryToDelete.name}" berhasil dihapus.`)
    setCategoryToDelete(null)
  }

  return (
    <>
      <Toast toasts={toasts} onDismiss={dismissToast} />

      <div className="catalog-page-container">
        {/* Page Header */}
        <div className="catalog-page-header">
          <div className="catalog-title-group">
            <div className="catalog-header-title-row">
              <h1 className="catalog-page-title">Kategori & Tag</h1>
              <SimulationBadge />
            </div>
            <p className="catalog-page-subtitle">
              Kelola taksonomi, label klasifikasi, dan status aktivasi kategori e-book.
            </p>
          </div>

          <button
            type="button"
            className="nb-btn catalog-primary-btn"
            onClick={handleOpenAdd}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              add_circle
            </span>
            <span>+ Tambah Kategori</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="catalog-filter-bar">
          <div className="catalog-filter-left">
            <SearchInput
              value={filters.search}
              onChange={(search) =>
                setFilters((prev) => ({ ...prev, search, page: 1 }))
              }
              onClear={() => setFilters((prev) => ({ ...prev, search: '', page: 1 }))}
              placeholder="Cari nama, slug, atau deskripsi..."
              ariaLabel="Cari kategori"
            />

            <FilterChipGroup
              label="Status:"
              icon="tune"
              value={filters.status}
              onChange={(val) =>
                setFilters((prev) => ({
                  ...prev,
                  status: val as 'ALL' | CategoryStatus,
                  page: 1,
                }))
              }
              options={[
                {
                  value: 'ALL',
                  label: 'Semua Status',
                  count: categories.length,
                  icon: 'apps',
                  activeBg: 'var(--nb-yellow)',
                },
                {
                  value: 'AKTIF',
                  label: 'Aktif',
                  count: categories.filter((c) => c.isActive).length,
                  icon: 'check_circle',
                  activeBg: 'var(--nb-green)',
                },
                {
                  value: 'NONAKTIF',
                  label: 'Nonaktif',
                  count: categories.filter((c) => !c.isActive).length,
                  icon: 'do_not_disturb_on',
                  activeBg: 'var(--nb-muted)',
                },
              ]}
            />
          </div>

          <div className="catalog-filter-right">
            <button
              type="button"
              className="nb-btn nb-page-btn"
              onClick={() => {
                setIsLoading(true)
                setTimeout(() => {
                  setIsLoading(false)
                  addToast('info', 'Data kategori berhasil disegarkan.')
                }, 400)
              }}
              title="Segarkan data tabel"
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                refresh
              </span>
            </button>
          </div>
        </div>

        {/* Active Filter Strip */}
        {(filters.search || filters.status !== 'ALL') && (
          <div className="nb-active-filter-strip">
            <div className="nb-active-tags">
              <span style={{ fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                Filter Aktif:
              </span>
              {filters.search && (
                <span className="nb-active-tag-badge">
                  <span>Cari: &ldquo;{filters.search}&rdquo;</span>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    onClick={() => setFilters((prev) => ({ ...prev, search: '', page: 1 }))}
                    aria-label="Hapus filter pencarian"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.status !== 'ALL' && (
                <span className="nb-active-tag-badge">
                  <span>Status: {filters.status === 'AKTIF' ? 'Aktif' : 'Nonaktif'}</span>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    onClick={() => setFilters((prev) => ({ ...prev, status: 'ALL', page: 1 }))}
                    aria-label="Hapus filter status"
                  >
                    ×
                  </button>
                </span>
              )}
              <span style={{ color: 'var(--nb-text-muted)', fontSize: 12 }}>
                (Ditemukan {filteredCategories.length} kategori)
              </span>
            </div>

            <button
              type="button"
              className="nb-btn nb-reset-filters-btn"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  search: '',
                  status: 'ALL',
                  page: 1,
                }))
              }
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                close
              </span>
              <span>Reset Filter</span>
            </button>
          </div>
        )}

        {/* Table Content */}
        {isLoading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : filteredCategories.length === 0 ? (
          <EmptyState
            title="Tidak Ada Kategori Ditemukan"
            description={
              filters.search || filters.status !== 'ALL'
                ? 'Tidak ada kategori yang cocok dengan filter pencarian saat ini.'
                : 'Belum ada kategori e-book yang tersimpan. Tambahkan kategori baru sekarang.'
            }
            icon="category"
            actionLabel="+ Tambah Kategori Pertama"
            onAction={handleOpenAdd}
          />
        ) : (
          <div className="nb-table-container">
            <table className="nb-table">
              <caption className="visually-hidden">Daftar Kategori E-Book</caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="is-sortable"
                    onClick={() => handleSort('name')}
                    aria-sort={
                      filters.sortBy === 'name'
                        ? filters.sortOrder === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    <div className="nb-th-inner">
                      <span>Nama Kategori</span>
                      <span className="material-symbols-outlined nb-sort-icon">
                        {filters.sortBy === 'name'
                          ? filters.sortOrder === 'asc'
                            ? 'arrow_upward'
                            : 'arrow_downward'
                          : 'unfold_more'}
                      </span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="is-sortable"
                    onClick={() => handleSort('slug')}
                    aria-sort={
                      filters.sortBy === 'slug'
                        ? filters.sortOrder === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    <div className="nb-th-inner">
                      <span>Slug</span>
                      <span className="material-symbols-outlined nb-sort-icon">
                        {filters.sortBy === 'slug'
                          ? filters.sortOrder === 'asc'
                            ? 'arrow_upward'
                            : 'arrow_downward'
                          : 'unfold_more'}
                      </span>
                    </div>
                  </th>
                  <th scope="col">Deskripsi</th>
                  <th
                    scope="col"
                    className="is-sortable"
                    onClick={() => handleSort('ebookCount')}
                    aria-sort={
                      filters.sortBy === 'ebookCount'
                        ? filters.sortOrder === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    <div className="nb-th-inner">
                      <span>Jumlah E-Book</span>
                      <span className="material-symbols-outlined nb-sort-icon">
                        {filters.sortBy === 'ebookCount'
                          ? filters.sortOrder === 'asc'
                            ? 'arrow_upward'
                            : 'arrow_downward'
                          : 'unfold_more'}
                      </span>
                    </div>
                  </th>
                  <th scope="col">Status</th>
                  <th scope="col" style={{ width: 100 }}>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedCategories.map((cat) => (
                  <tr key={cat.id}>
                    <td data-label="Nama Kategori">
                      <span className="font-heading" style={{ fontWeight: 700 }}>
                        {cat.name}
                      </span>
                    </td>
                    <td data-label="Slug" className="nb-td-mono">
                      {cat.slug}
                    </td>
                    <td data-label="Deskripsi">
                      {cat.description ? (
                        <span
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {cat.description}
                        </span>
                      ) : (
                        <span className="nb-td-muted-italic">—</span>
                      )}
                    </td>
                    <td
                      data-label="Jumlah E-Book"
                      className="nb-td-mono nb-td-right"
                      style={{ fontWeight: 700 }}
                    >
                      {cat.ebookCount}
                    </td>
                    <td data-label="Status">
                      {cat.isActive ? (
                        <StatusBadge
                          status="Aktif"
                          fill="var(--nb-green)"
                          icon="check_circle"
                        />
                      ) : (
                        <StatusBadge
                          status="Nonaktif"
                          fill="var(--nb-muted)"
                          icon="do_not_disturb_on"
                        />
                      )}
                    </td>
                    <td data-label="Aksi">
                      <div className="nb-action-btn-group">
                        <button
                          type="button"
                          className="nb-btn nb-table-action-btn"
                          onClick={() => handleOpenEdit(cat)}
                          aria-label={`Ubah kategori ${cat.name}`}
                          title="Ubah kategori"
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: 18 }}
                            aria-hidden="true"
                          >
                            edit
                          </span>
                        </button>
                        <button
                          type="button"
                          className="nb-btn nb-table-action-btn is-danger"
                          onClick={() => setCategoryToDelete(cat)}
                          aria-label={`Hapus kategori ${cat.name}`}
                          title="Hapus kategori"
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: 18 }}
                            aria-hidden="true"
                          >
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              totalItems={filteredCategories.length}
              pageSize={filters.limit}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
              labelItemName="kategori"
            />
          </div>
        )}
      </div>

      {/* Dialog Tambah / Ubah Kategori (Modal Zona C) */}
      {isFormOpen && (
        <div
          className="nb-dialog-scrim"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsFormOpen(false)
          }}
        >
          <div
            className="nb-dialog-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-dialog-title"
          >
            <div className="nb-dialog-header">
              <h2 id="category-dialog-title" className="nb-dialog-title">
                {editingCategory ? 'Ubah Kategori' : 'Tambah Kategori Baru'}
              </h2>
              <button
                type="button"
                className="nb-icon-btn nb-btn"
                onClick={() => setIsFormOpen(false)}
                aria-label="Tutup form dialog"
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  close
                </span>
              </button>
            </div>

            <form onSubmit={handleSaveCategory}>
              <div className="nb-dialog-body">
                <div className="nb-form-field">
                  <label htmlFor="cat-name-input" className="nb-form-label">
                    Nama Kategori <span style={{ color: 'var(--nb-pink)' }}>*</span>
                  </label>
                  <input
                    id="cat-name-input"
                    type="text"
                    maxLength={100}
                    className="nb-form-input"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Contoh: Sains Data & AI"
                    autoFocus
                  />
                  {formErrors.name && (
                    <div className="nb-form-error-box" role="alert">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 16 }}
                        aria-hidden="true"
                      >
                        error
                      </span>
                      <span>{formErrors.name}</span>
                    </div>
                  )}
                </div>

                <div className="nb-form-field">
                  <label htmlFor="cat-slug-input" className="nb-form-label">
                    Slug Kategori <span style={{ color: 'var(--nb-pink)' }}>*</span>
                  </label>
                  <input
                    id="cat-slug-input"
                    type="text"
                    maxLength={120}
                    className="nb-form-input font-mono-nb"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="sains-data-ai"
                  />
                  <span className="nb-form-hint">
                    Format identifier URL unik (hanya huruf kecil, angka, dan tanda hubung).
                  </span>
                  {formErrors.slug && (
                    <div className="nb-form-error-box" role="alert">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 16 }}
                        aria-hidden="true"
                      >
                        error
                      </span>
                      <span>{formErrors.slug}</span>
                    </div>
                  )}
                </div>

                <div className="nb-form-field">
                  <label htmlFor="cat-desc-input" className="nb-form-label">
                    Deskripsi Singkat (Opsional)
                  </label>
                  <textarea
                    id="cat-desc-input"
                    className="nb-form-textarea"
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Penjelasan ringkas cakupan materi e-book di bawah kategori ini..."
                  />
                </div>

                <div className="nb-form-field">
                  <label className="nb-form-label">Status Aktivasi</label>
                  <ToggleSwitch
                    checked={formData.isActive}
                    onChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isActive: checked }))
                    }
                    activeLabel="Kategori Aktif"
                    inactiveLabel="Kategori Nonaktif"
                  />
                </div>
              </div>

              <div className="nb-dialog-footer">
                <button
                  type="button"
                  className="nb-btn nb-dialog-btn-secondary"
                  onClick={() => setIsFormOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="nb-btn nb-dialog-btn-primary"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dialog Konfirmasi Hapus Kategori */}
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
          <div className="nb-form-error-box" style={{ padding: 12 }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 20 }}
              aria-hidden="true"
            >
              block
            </span>
            <div>
              <strong>Kategori tidak dapat dihapus:</strong> Kategori ini masih
              digunakan oleh <strong>{categoryToDelete?.ebookCount} e-book</strong> aktif.
              Pindahkan atau arsipkan e-book tersebut sebelum menghapus kategori.
            </div>
          </div>
        ) : (
          <p style={{ margin: 0 }}>
            Kategori ini tidak sedang dipakai oleh e-book manapun. Apakah Anda yakin
            ingin menghapus kategori ini secara permanen dari basis data?
          </p>
        )}
      </ConfirmDialog>
    </>
  )
}
