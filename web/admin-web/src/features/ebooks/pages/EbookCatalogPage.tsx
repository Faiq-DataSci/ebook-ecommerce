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
import { PrivateAssetUploader } from '../components/PrivateAssetUploader'
import { MOCK_CATEGORIES, MOCK_EBOOKS } from '../data/catalogData'
import type {
  EbookFormData,
  EbookListItem,
  EbookStatus,
  EbookTableFilters,
} from '../types/catalog'

const getCategoryMeta = (slug?: string) => {
  switch (slug) {
    case 'rekayasa-perangkat-lunak':
      return { icon: 'code', activeBg: 'var(--nb-blue)' }
    case 'sains-data-kecerdasan-buatan':
      return { icon: 'psychology', activeBg: 'var(--nb-lavender)' }
    case 'basis-data-cloud':
      return { icon: 'database', activeBg: '#FEF3C7' }
    case 'keamanan-siber':
      return { icon: 'security', activeBg: '#E0F2FE' }
    case 'desain-ui-ux':
      return { icon: 'palette', activeBg: '#D1FAE5' }
    default:
      return { icon: 'folder', activeBg: 'var(--nb-muted)' }
  }
}

interface EbookCatalogPageProps {
  onBreadcrumbChange?: (text: string) => void
}

export function EbookCatalogPage({
  onBreadcrumbChange,
}: EbookCatalogPageProps) {
  // Mode: 'LIST' or 'FORM'
  const [viewMode, setViewMode] = useState<'LIST' | 'FORM'>('LIST')

  // E-book Collection State
  const [ebooks, setEbooks] = useState<EbookListItem[]>(MOCK_EBOOKS)
  const [filters, setFilters] = useState<EbookTableFilters>({
    search: '',
    categoryId: '',
    status: 'ALL',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 6,
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Form State
  const [editingEbook, setEditingEbook] = useState<EbookListItem | null>(null)
  const [formData, setFormData] = useState<EbookFormData>({
    categoryId: MOCK_CATEGORIES[0]?.id || '',
    title: '',
    author: '',
    description: '',
    price: '75000',
    pageCount: '240',
    publishedYear: '2025',
    isActive: true,
    coverFileName: '',
    pdfFileName: '',
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false)
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState<boolean>(false)

  // Archive / Status Toggle Dialog
  const [ebookToToggleStatus, setEbookToToggleStatus] = useState<EbookListItem | null>(null)

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (type: 'success' | 'error' | 'info' | 'warning', text: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, type, text }])
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Count categories from actual ebooks list
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    ebooks.forEach((b) => {
      counts[b.categoryId] = (counts[b.categoryId] || 0) + 1
    })
    return counts
  }, [ebooks])

  const selectedCategoryObj = useMemo(() => {
    if (!filters.categoryId) return null
    return MOCK_CATEGORIES.find((c) => c.id === filters.categoryId)
  }, [filters.categoryId])

  // Filter & Sort Logic
  const filteredEbooks = useMemo(() => {
    let result = [...ebooks]

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.categoryName.toLowerCase().includes(q),
      )
    }

    if (filters.categoryId) {
      result = result.filter((b) => b.categoryId === filters.categoryId)
    }

    if (filters.status !== 'ALL') {
      const activeBool = filters.status === 'AKTIF'
      result = result.filter((b) => b.isActive === activeBool)
    }

    result.sort((a, b) => {
      let cmp = 0
      if (filters.sortBy === 'title') {
        cmp = a.title.localeCompare(b.title)
      } else if (filters.sortBy === 'price') {
        cmp = a.priceNumeric - b.priceNumeric
      } else if (filters.sortBy === 'salesCount') {
        cmp = a.salesCount - b.salesCount
      } else if (filters.sortBy === 'createdAt') {
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return filters.sortOrder === 'asc' ? cmp : -cmp
    })

    return result
  }, [ebooks, filters])

  // Pagination Slice
  const totalPages = Math.max(1, Math.ceil(filteredEbooks.length / filters.limit))
  const paginatedEbooks = useMemo(() => {
    const start = (filters.page - 1) * filters.limit
    return filteredEbooks.slice(start, start + filters.limit)
  }, [filteredEbooks, filters.page, filters.limit])

  // Format IDR Helper
  const formatRupiah = (val: string | number) => {
    const num = typeof val === 'string' ? parseInt(val.replace(/\D/g, ''), 10) : val
    if (isNaN(num)) return 'Rp 0'
    return `Rp ${num.toLocaleString('id-ID')}`
  }

  // Sorting Handler
  const handleSort = (column: 'title' | 'price' | 'salesCount' | 'createdAt') => {
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

  // Open Form for Adding New E-book
  const handleOpenAdd = () => {
    setEditingEbook(null)
    setFormData({
      categoryId: MOCK_CATEGORIES[0]?.id || '',
      title: 'DATA SIMULASI — ',
      author: 'DATA SIMULASI — ',
      description: '',
      price: '75000',
      pageCount: '240',
      publishedYear: '2025',
      isActive: true,
      coverFileName: '',
      pdfFileName: '',
    })
    setFormErrors({})
    setIsFormDirty(false)
    setViewMode('FORM')
    onBreadcrumbChange?.('KATALOG / KOLEKSI E-BOOK / TAMBAH E-BOOK')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Open Form for Editing Existing E-book
  const handleOpenEdit = (ebook: EbookListItem) => {
    setEditingEbook(ebook)
    setFormData({
      categoryId: ebook.categoryId,
      title: ebook.title,
      author: ebook.author,
      description: `Deskripsi lengkap untuk e-book ${ebook.title}. Membahas studi kasus praktis dan penerapan teruji.`,
      price: ebook.priceNumeric.toString(),
      pageCount: ebook.pageCount ? ebook.pageCount.toString() : '200',
      publishedYear: ebook.publishedYear ? ebook.publishedYear.toString() : '2025',
      isActive: ebook.isActive,
      coverFileName: ebook.coverUrl ? 'sampul-terpasang.png' : '',
      pdfFileName: 'naskah-digital-privat.pdf',
    })
    setFormErrors({})
    setIsFormDirty(false)
    setViewMode('FORM')
    onBreadcrumbChange?.('KATALOG / KOLEKSI E-BOOK / UBAH E-BOOK')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Cancel Form Handling (with guard)
  const handleCancelForm = () => {
    if (isFormDirty) {
      setShowUnsavedConfirm(true)
    } else {
      setViewMode('LIST')
      setEditingEbook(null)
      onBreadcrumbChange?.('KATALOG / KOLEKSI E-BOOK')
    }
  }

  // Save Form Handler
  const handleSaveEbook = (e: React.FormEvent) => {
    e.preventDefault()

    const errors: Record<string, string> = {}
    if (!formData.title.trim()) errors.title = 'Judul e-book wajib diisi.'
    if (!formData.author.trim()) errors.author = 'Nama penulis wajib diisi.'
    if (!formData.categoryId) errors.categoryId = 'Kategori wajib dipilih.'
    if (!formData.description.trim()) errors.description = 'Deskripsi e-book wajib diisi.'
    if (!formData.price.trim() || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      errors.price = 'Harga wajib diisi dengan angka valid minimal 0.'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      addToast('error', 'Silakan periksa kembali kolom yang bertanda error.')
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      const priceNum = parseInt(formData.price, 10) || 0
      const categoryObj = MOCK_CATEGORIES.find((c) => c.id === formData.categoryId)
      const categoryName = categoryObj
        ? categoryObj.name.replace('DATA SIMULASI — ', '')
        : 'Umum'

      if (editingEbook) {
        // Update
        setEbooks((prev) =>
          prev.map((item) =>
            item.id === editingEbook.id
              ? {
                  ...item,
                  title: formData.title.trim(),
                  author: formData.author.trim(),
                  categoryId: formData.categoryId,
                  categoryName,
                  price: formatRupiah(priceNum),
                  priceNumeric: priceNum,
                  pageCount: formData.pageCount ? parseInt(formData.pageCount, 10) : null,
                  publishedYear: formData.publishedYear
                    ? parseInt(formData.publishedYear, 10)
                    : null,
                  isActive: formData.isActive,
                }
              : item,
          ),
        )
        addToast('success', `E-book "${formData.title}" berhasil diperbarui.`)
      } else {
        // Create
        const newEbook: EbookListItem = {
          id: `ebk-${Date.now()}`,
          title: formData.title.trim(),
          author: formData.author.trim(),
          categoryId: formData.categoryId,
          categoryName,
          price: formatRupiah(priceNum),
          priceNumeric: priceNum,
          ratingAvg: 'Belum ada rating',
          salesCount: 0,
          pageCount: formData.pageCount ? parseInt(formData.pageCount, 10) : null,
          publishedYear: formData.publishedYear
            ? parseInt(formData.publishedYear, 10)
            : new Date().getFullYear(),
          isActive: formData.isActive,
          coverUrl: null,
          createdAt: new Date().toISOString(),
        }
        setEbooks((prev) => [newEbook, ...prev])
        addToast('success', `E-book baru "${formData.title}" berhasil disimpan.`)
      }

      setIsSubmitting(false)
      setIsFormDirty(false)
      setViewMode('LIST')
      setEditingEbook(null)
      onBreadcrumbChange?.('KATALOG / KOLEKSI E-BOOK')
    }, 400)
  }

  // Toggle Archive / Unarchive Handler
  const handleConfirmToggleStatus = () => {
    if (!ebookToToggleStatus) return

    const newStatus = !ebookToToggleStatus.isActive
    setEbooks((prev) =>
      prev.map((b) =>
        b.id === ebookToToggleStatus.id ? { ...b, isActive: newStatus } : b,
      ),
    )

    addToast(
      'success',
      newStatus
        ? `E-book "${ebookToToggleStatus.title}" berhasil diaktifkan kembali.`
        : `E-book "${ebookToToggleStatus.title}" berhasil diarsipkan.`,
    )
    setEbookToToggleStatus(null)
  }

  return (
    <>
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* ===================================================================
          MODE 1: DAFTAR TABEL KOLEKSI E-BOOK (Zona C)
          =================================================================== */}
      {viewMode === 'LIST' && (
        <div className="catalog-page-container">
          {/* Page Header */}
          <div className="catalog-page-header">
            <div className="catalog-title-group">
              <div className="catalog-header-title-row">
                <h1 className="catalog-page-title">Koleksi E-Book</h1>
                <SimulationBadge />
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
              <span className="material-symbols-outlined" aria-hidden="true">
                add_circle
              </span>
              <span>+ Tambah E-Book</span>
            </button>
          </div>

          {/* Filter Bar (Pencarian & Status) */}
          <div className="catalog-filter-bar">
            <div className="catalog-filter-left">
              <SearchInput
                value={filters.search}
                onChange={(search) =>
                  setFilters((prev) => ({ ...prev, search, page: 1 }))
                }
                onClear={() =>
                  setFilters((prev) => ({ ...prev, search: '', page: 1 }))
                }
                placeholder="Cari judul atau penulis..."
                ariaLabel="Cari e-book"
              />

              <FilterChipGroup
                label="Status:"
                icon="tune"
                value={filters.status}
                onChange={(val) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: val as 'ALL' | EbookStatus,
                    page: 1,
                  }))
                }
                options={[
                  {
                    value: 'ALL',
                    label: 'Semua Status',
                    count: ebooks.length,
                    icon: 'apps',
                    activeBg: 'var(--nb-yellow)',
                  },
                  {
                    value: 'AKTIF',
                    label: 'Aktif',
                    count: ebooks.filter((b) => b.isActive).length,
                    icon: 'check_circle',
                    activeBg: 'var(--nb-green)',
                  },
                  {
                    value: 'ARSIP',
                    label: 'Arsip',
                    count: ebooks.filter((b) => !b.isActive).length,
                    icon: 'archive',
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
                    addToast('info', 'Data koleksi e-book berhasil disegarkan.')
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

          {/* Interactive Category Filter Shelf */}
          <div className="catalog-category-shelf">
            <FilterChipGroup
              label="Kategori:"
              icon="category"
              value={filters.categoryId}
              onChange={(categoryId) =>
                setFilters((prev) => ({ ...prev, categoryId, page: 1 }))
              }
              options={[
                {
                  value: '',
                  label: 'Semua Kategori',
                  count: ebooks.length,
                  icon: 'auto_awesome',
                  activeBg: 'var(--nb-yellow)',
                },
                ...MOCK_CATEGORIES.map((c) => {
                  const meta = getCategoryMeta(c.slug)
                  return {
                    value: c.id,
                    label: c.name.replace('DATA SIMULASI — ', ''),
                    count: categoryCounts[c.id] || 0,
                    icon: meta.icon,
                    activeBg: meta.activeBg,
                  }
                }),
              ]}
            />
          </div>

          {/* Active Filter Strip */}
          {(filters.search || filters.categoryId || filters.status !== 'ALL') && (
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

                {selectedCategoryObj && (
                  <span className="nb-active-tag-badge">
                    <span>
                      Kategori: {selectedCategoryObj.name.replace('DATA SIMULASI — ', '')}
                    </span>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      onClick={() => setFilters((prev) => ({ ...prev, categoryId: '', page: 1 }))}
                      aria-label="Hapus filter kategori"
                    >
                      ×
                    </button>
                  </span>
                )}

                {filters.status !== 'ALL' && (
                  <span className="nb-active-tag-badge">
                    <span>Status: {filters.status === 'AKTIF' ? 'Aktif' : 'Arsip'}</span>
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
                  (Ditemukan {filteredEbooks.length} e-book)
                </span>
              </div>

              <button
                type="button"
                className="nb-btn nb-reset-filters-btn"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    search: '',
                    categoryId: '',
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
            <TableSkeleton rows={6} cols={7} />
          ) : filteredEbooks.length === 0 ? (
            <EmptyState
              title="Tidak Ada E-Book Ditemukan"
              description={
                filters.search || filters.categoryId || filters.status !== 'ALL'
                  ? 'Tidak ada e-book yang cocok dengan kombinasi filter dan pencarian saat ini.'
                  : 'Belum ada data e-book pada katalog. Tambahkan e-book pertama Anda sekarang.'
              }
              icon="menu_book"
              actionLabel="+ Tambah E-Book Pertama"
              onAction={handleOpenAdd}
            />
          ) : (
            <div className="nb-table-container">
              <table className="nb-table">
                <caption className="visually-hidden">Daftar Koleksi E-Book Toko</caption>
                <thead>
                  <tr>
                    <th scope="col" style={{ width: 60, textAlign: 'center' }}>
                      Sampul
                    </th>
                    <th
                      scope="col"
                      className="is-sortable"
                      onClick={() => handleSort('title')}
                      aria-sort={
                        filters.sortBy === 'title'
                          ? filters.sortOrder === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                    >
                      <div className="nb-th-inner">
                        <span>Judul & Penulis</span>
                        <span className="material-symbols-outlined nb-sort-icon">
                          {filters.sortBy === 'title'
                            ? filters.sortOrder === 'asc'
                              ? 'arrow_upward'
                              : 'arrow_downward'
                            : 'unfold_more'}
                        </span>
                      </div>
                    </th>
                    <th scope="col">Kategori</th>
                    <th
                      scope="col"
                      className="is-sortable"
                      style={{ textAlign: 'right' }}
                      onClick={() => handleSort('price')}
                      aria-sort={
                        filters.sortBy === 'price'
                          ? filters.sortOrder === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                    >
                      <div className="nb-th-inner" style={{ justifyContent: 'flex-end' }}>
                        <span>Harga</span>
                        <span className="material-symbols-outlined nb-sort-icon">
                          {filters.sortBy === 'price'
                            ? filters.sortOrder === 'asc'
                              ? 'arrow_upward'
                              : 'arrow_downward'
                            : 'unfold_more'}
                        </span>
                      </div>
                    </th>
                    <th scope="col" style={{ width: 110, textAlign: 'center' }}>
                      Rating
                    </th>
                    <th
                      scope="col"
                      className="is-sortable"
                      style={{ textAlign: 'right', width: 100 }}
                      onClick={() => handleSort('salesCount')}
                      aria-sort={
                        filters.sortBy === 'salesCount'
                          ? filters.sortOrder === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                    >
                      <div className="nb-th-inner" style={{ justifyContent: 'flex-end' }}>
                        <span>Terjual</span>
                        <span className="material-symbols-outlined nb-sort-icon">
                          {filters.sortBy === 'salesCount'
                            ? filters.sortOrder === 'asc'
                              ? 'arrow_upward'
                              : 'arrow_downward'
                            : 'unfold_more'}
                        </span>
                      </div>
                    </th>
                    <th scope="col" style={{ width: 110 }}>
                      Status
                    </th>
                    <th scope="col" style={{ width: 90 }}>
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEbooks.map((book) => {
                    const initials = book.title
                      .replace('DATA SIMULASI — ', '')
                      .slice(0, 2)
                      .toUpperCase()

                    return (
                      <tr key={book.id}>
                        <td data-label="Sampul" className="nb-td-cover">
                          {book.coverUrl ? (
                            <img
                              src={book.coverUrl}
                              alt={`Sampul ${book.title}`}
                              className="nb-cover-thumb"
                            />
                          ) : (
                            <div
                              className="nb-cover-placeholder"
                              title="Sampul belum diunggah"
                            >
                              {initials}
                            </div>
                          )}
                        </td>
                        <td data-label="Judul & Penulis" className="nb-td-title">
                          <div className="nb-ebook-title-text">{book.title}</div>
                          <div
                            style={{
                              fontSize: 13,
                              color: 'var(--nb-text-muted)',
                              marginTop: 2,
                            }}
                          >
                            {book.author}
                          </div>
                        </td>
                        <td data-label="Kategori">
                          {(() => {
                            const cat = MOCK_CATEGORIES.find((c) => c.id === book.categoryId)
                            const meta = getCategoryMeta(cat?.slug)
                            return (
                              <span
                                className="nb-category-chip"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 5,
                                  backgroundColor: meta.activeBg,
                                }}
                              >
                                <span
                                  className="material-symbols-outlined"
                                  style={{ fontSize: 14 }}
                                  aria-hidden="true"
                                >
                                  {meta.icon}
                                </span>
                                <span>{book.categoryName}</span>
                              </span>
                            )
                          })()}
                        </td>
                        <td
                          data-label="Harga"
                          className="nb-td-mono nb-td-right"
                          style={{ fontWeight: 700 }}
                        >
                          {book.price}
                        </td>
                        <td
                          data-label="Rating"
                          style={{ textAlign: 'center' }}
                          className="nb-td-mono"
                        >
                          {book.ratingAvg === 'Belum ada rating' ? (
                            <span className="nb-td-muted-italic">Belum ada rating</span>
                          ) : (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 3,
                                fontWeight: 700,
                              }}
                            >
                              <span
                                className="material-symbols-outlined"
                                style={{
                                  fontSize: 16,
                                  color: 'var(--nb-black)',
                                  fontVariationSettings: "'FILL' 1",
                                }}
                                aria-hidden="true"
                              >
                                star
                              </span>
                              <span>{book.ratingAvg}</span>
                            </span>
                          )}
                        </td>
                        <td
                          data-label="Terjual"
                          className="nb-td-mono nb-td-right"
                          style={{ fontWeight: 700 }}
                        >
                          {book.salesCount}
                        </td>
                        <td data-label="Status">
                          {book.isActive ? (
                            <StatusBadge
                              status="Aktif"
                              fill="var(--nb-green)"
                              icon="check_circle"
                            />
                          ) : (
                            <StatusBadge
                              status="Arsip"
                              fill="var(--nb-muted)"
                              icon="archive"
                            />
                          )}
                        </td>
                        <td data-label="Aksi">
                          <div className="nb-action-btn-group">
                            <button
                              type="button"
                              className="nb-btn nb-table-action-btn"
                              onClick={() => handleOpenEdit(book)}
                              aria-label={`Ubah e-book ${book.title}`}
                              title="Ubah data e-book"
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
                              className={`nb-btn nb-table-action-btn ${
                                book.isActive ? 'is-danger' : ''
                              }`}
                              onClick={() => setEbookToToggleStatus(book)}
                              aria-label={
                                book.isActive
                                  ? `Arsipkan e-book ${book.title}`
                                  : `Aktifkan e-book ${book.title}`
                              }
                              title={
                                book.isActive
                                  ? 'Arsipkan e-book'
                                  : 'Aktifkan kembali e-book'
                              }
                            >
                              <span
                                className="material-symbols-outlined"
                                style={{ fontSize: 18 }}
                                aria-hidden="true"
                              >
                                {book.isActive ? 'archive' : 'unarchive'}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              <Pagination
                currentPage={filters.page}
                totalPages={totalPages}
                totalItems={filteredEbooks.length}
                pageSize={filters.limit}
                onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
                labelItemName="e-book"
              />
            </div>
          )}
        </div>
      )}

      {/* ===================================================================
          MODE 2: FORM TAMBAH / UBAH E-BOOK (Halaman Penuh Zona C)
          =================================================================== */}
      {viewMode === 'FORM' && (
        <form onSubmit={handleSaveEbook} className="catalog-page-container">
          <div className="catalog-page-header">
            <div className="catalog-title-group">
              <div className="catalog-header-title-row">
                <h1 className="catalog-page-title">
                  {editingEbook ? 'Ubah Informasi E-Book' : 'Tambah E-Book Baru'}
                </h1>
                <SimulationBadge />
              </div>
              <p className="catalog-page-subtitle">
                Isi rincian buku, unggah sampul publik, dan amankan berkas naskah PDF
                ke bucket privat.
              </p>
            </div>

            <button
              type="button"
              className="nb-btn nb-dialog-btn-secondary"
              onClick={handleCancelForm}
            >
              ← Kembali ke Daftar
            </button>
          </div>

          {/* Section 1: Metadata Dasar */}
          <div className="nb-form-card">
            <h2 className="nb-form-section-title">1. Metadata Katalog</h2>

            <div className="nb-form-grid-2">
              <div className="nb-form-field">
                <label htmlFor="form-category-select" className="nb-form-label">
                  Kategori E-Book <span style={{ color: 'var(--nb-pink)' }}>*</span>
                </label>
                <select
                  id="form-category-select"
                  className="nb-form-select font-heading"
                  style={{ fontWeight: 600 }}
                  value={formData.categoryId}
                  onChange={(e) => {
                    setIsFormDirty(true)
                    setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
                  }}
                >
                  {MOCK_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name.replace('DATA SIMULASI — ', '')}
                    </option>
                  ))}
                </select>
                {formErrors.categoryId && (
                  <div className="nb-form-error-box" role="alert">
                    <span>{formErrors.categoryId}</span>
                  </div>
                )}
              </div>

              <div className="nb-form-field">
                <label htmlFor="form-author-input" className="nb-form-label">
                  Nama Penulis / Kontributor <span style={{ color: 'var(--nb-pink)' }}>*</span>
                </label>
                <input
                  id="form-author-input"
                  type="text"
                  maxLength={150}
                  className="nb-form-input"
                  value={formData.author}
                  onChange={(e) => {
                    setIsFormDirty(true)
                    setFormData((prev) => ({ ...prev, author: e.target.value }))
                  }}
                  placeholder="Contoh: Dr. Hendra Pratama"
                />
                {formErrors.author && (
                  <div className="nb-form-error-box" role="alert">
                    <span>{formErrors.author}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="nb-form-field">
              <label htmlFor="form-title-input" className="nb-form-label">
                Judul Lengkap E-Book <span style={{ color: 'var(--nb-pink)' }}>*</span>
              </label>
              <input
                id="form-title-input"
                type="text"
                maxLength={200}
                className="nb-form-input font-heading"
                style={{ fontWeight: 700 }}
                value={formData.title}
                onChange={(e) => {
                  setIsFormDirty(true)
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }}
                placeholder="Contoh: Arsitektur Microservices Berbasis Event"
              />
              {formErrors.title && (
                <div className="nb-form-error-box" role="alert">
                  <span>{formErrors.title}</span>
                </div>
              )}
            </div>

            <div className="nb-form-field">
              <label htmlFor="form-desc-textarea" className="nb-form-label">
                Sinopsis & Deskripsi Buku <span style={{ color: 'var(--nb-pink)' }}>*</span>
              </label>
              <textarea
                id="form-desc-textarea"
                className="nb-form-textarea"
                rows={4}
                value={formData.description}
                onChange={(e) => {
                  setIsFormDirty(true)
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }}
                placeholder="Jelaskan garis besar pembahasan buku, target pembaca, dan daftar topik utama..."
              />
              {formErrors.description && (
                <div className="nb-form-error-box" role="alert">
                  <span>{formErrors.description}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Penetapan Harga & Spesifikasi */}
          <div className="nb-form-card">
            <h2 className="nb-form-section-title">2. Harga, Spesifikasi, & Status</h2>

            <div className="nb-form-grid-2">
              <div className="nb-form-field">
                <label htmlFor="form-price-input" className="nb-form-label">
                  Harga Jual Satuan (Rupiah) <span style={{ color: 'var(--nb-pink)' }}>*</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    id="form-price-input"
                    type="number"
                    min="0"
                    step="1000"
                    className="nb-form-input font-mono-nb"
                    style={{ flex: 1 }}
                    value={formData.price}
                    onChange={(e) => {
                      setIsFormDirty(true)
                      setFormData((prev) => ({ ...prev, price: e.target.value }))
                    }}
                    placeholder="75000"
                  />
                  <div
                    className="nb-status-badge font-mono-nb"
                    style={{
                      backgroundColor: 'var(--nb-yellow)',
                      height: 46,
                      padding: '0 12px',
                    }}
                  >
                    {formatRupiah(formData.price)}
                  </div>
                </div>
                {formErrors.price && (
                  <div className="nb-form-error-box" role="alert">
                    <span>{formErrors.price}</span>
                  </div>
                )}
              </div>

              <div className="nb-form-field">
                <label htmlFor="form-pages-input" className="nb-form-label">
                  Jumlah Halaman Naskah
                </label>
                <input
                  id="form-pages-input"
                  type="number"
                  min="1"
                  className="nb-form-input font-mono-nb"
                  value={formData.pageCount}
                  onChange={(e) => {
                    setIsFormDirty(true)
                    setFormData((prev) => ({ ...prev, pageCount: e.target.value }))
                  }}
                  placeholder="240"
                />
              </div>
            </div>

            <div className="nb-form-grid-2">
              <div className="nb-form-field">
                <label htmlFor="form-year-input" className="nb-form-label">
                  Tahun Terbit Publikasi
                </label>
                <input
                  id="form-year-input"
                  type="number"
                  min="1900"
                  max="2030"
                  className="nb-form-input font-mono-nb"
                  value={formData.publishedYear}
                  onChange={(e) => {
                    setIsFormDirty(true)
                    setFormData((prev) => ({ ...prev, publishedYear: e.target.value }))
                  }}
                  placeholder="2025"
                />
              </div>

              <div className="nb-form-field">
                <label className="nb-form-label">Status Penjualan Katalog</label>
                <ToggleSwitch
                  checked={formData.isActive}
                  onChange={(checked) => {
                    setIsFormDirty(true)
                    setFormData((prev) => ({ ...prev, isActive: checked }))
                  }}
                  activeLabel="Toko Publik (Aktif)"
                  inactiveLabel="Disimpan Sebagai Draf/Arsip (Nonaktif)"
                />
                <span className="nb-form-hint">
                  E-book nonaktif tidak muncul di etalase pembeli tetapi riwayat akses tetap aman.
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Berkas Digital & Aset */}
          <div className="nb-form-card">
            <h2 className="nb-form-section-title">3. Berkas Digital & Aset Penyimpanan</h2>

            <div className="nb-form-grid-2">
              {/* Uploader Sampul Publik */}
              <PrivateAssetUploader
                label="Unggah Sampul E-Book (Publik)"
                accept="image/jpeg,image/png,image/webp"
                maxSizeMB={2}
                isPrivate={false}
                icon="image"
                hint="Format JPEG, PNG, atau WebP. Maksimal 2 MB."
                fileName={formData.coverFileName}
                onFileSelect={(file) => {
                  setIsFormDirty(true)
                  setFormData((prev) => ({ ...prev, coverFileName: file.name }))
                  addToast('info', `File sampul "${file.name}" siap diunggah.`)
                }}
                onFileRemove={() => {
                  setIsFormDirty(true)
                  setFormData((prev) => ({ ...prev, coverFileName: '' }))
                }}
              />

              {/* Uploader PDF Privat */}
              <PrivateAssetUploader
                label="Unggah Naskah PDF E-Book (Bucket Privat)"
                accept=".pdf"
                maxSizeMB={50}
                isPrivate={true}
                icon="picture_as_pdf"
                hint="Format PDF dokumen resmi saja. Maksimal 50 MB."
                fileName={formData.pdfFileName}
                onFileSelect={(file) => {
                  setIsFormDirty(true)
                  setFormData((prev) => ({ ...prev, pdfFileName: file.name }))
                  addToast('info', `File PDF privat "${file.name}" siap dienkripsi dan diunggah.`)
                }}
                onFileRemove={() => {
                  setIsFormDirty(true)
                  setFormData((prev) => ({ ...prev, pdfFileName: '' }))
                }}
              />
            </div>
          </div>

          {/* Sticky Bottom Action Bar (design.md §10.4) */}
          <div className="nb-sticky-bottom-bar">
            <div className="nb-sticky-actions-left">
              {isFormDirty && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--nb-orange)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    warning
                  </span>
                  Ada perubahan formulir yang belum disimpan
                </span>
              )}
            </div>

            <div className="nb-sticky-actions-right">
              <button
                type="button"
                className="nb-btn nb-dialog-btn-secondary"
                onClick={handleCancelForm}
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                type="submit"
                className="nb-btn nb-dialog-btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 18, animation: 'nb-pulse 0.5s infinite alternate' }}
                      aria-hidden="true"
                    >
                      hourglass_top
                    </span>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 18 }}
                      aria-hidden="true"
                    >
                      save
                    </span>
                    <span>Simpan E-Book</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Dialog Konfirmasi Toggle Arsip / Aktif E-Book */}
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

      {/* Dialog Konfirmasi Buang Perubahan Belum Disimpan */}
      <ConfirmDialog
        open={showUnsavedConfirm}
        title="Tinggalkan formulir tanpa menyimpan?"
        confirmLabel="Ya, Buang Perubahan"
        confirmVariant="danger"
        onConfirm={() => {
          setShowUnsavedConfirm(false)
          setIsFormDirty(false)
          setViewMode('LIST')
          setEditingEbook(null)
          onBreadcrumbChange?.('KATALOG / KOLEKSI E-BOOK')
        }}
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
