import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CatalogKpiGrid,
  ConfirmDialog,
  EmptyState,
  SimulationBadge,
  TableSkeleton,
  Toast,
  type ToastMessage,
} from '../../../shared/components/ui'
import { MOCK_CATEGORIES } from '../../categories/data/categoryData'
import type { CategoryListItem } from '../../categories/types/category'
import { EbookCardGrid } from '../components/EbookCardGrid'
import { EbookForm } from '../components/EbookForm'
import { EbookTable } from '../components/EbookTable'
import { EbookToolbar } from '../components/EbookToolbar'
import { MOCK_EBOOKS } from '../data/catalogData'
import {
  createAdminEbook,
  fetchAdminEbooks,
  fetchCategories,
  toggleAdminEbookStatus,
  updateAdminEbook,
} from '../services/catalog.service'
import type {
  EbookFormData,
  EbookListItem,
  EbookTableFilters,
} from '../types/catalog'

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
  // Mode: 'LIST' or 'FORM'
  const [viewMode, setViewMode] = useState<'LIST' | 'FORM'>(initialView)
  const [prevInitialView, setPrevInitialView] = useState(initialView)
  const [prevPath, setPrevPath] = useState(currentPath)
  const [displayMode, setDisplayMode] = useState<'TABLE' | 'GRID'>('TABLE')

  // Adjust state during render when props change (official React pattern)
  if (initialView !== prevInitialView) {
    setPrevInitialView(initialView)
    setViewMode(initialView)
  }

  if (currentPath !== prevPath) {
    setPrevPath(currentPath)
    if (currentPath === '/admin/katalog/tambah') {
      setViewMode('FORM')
    } else if (currentPath === '/admin/katalog/ebook') {
      setViewMode('LIST')
    }
  }

  useEffect(() => {
    if (currentPath === '/admin/katalog/tambah') {
      onBreadcrumbChange?.('KATALOG / TAMBAH E-BOOK')
    } else if (currentPath === '/admin/katalog/ebook') {
      onBreadcrumbChange?.('KATALOG / KOLEKSI E-BOOK')
    }
  }, [currentPath, onBreadcrumbChange])

  // E-book Collection & Master State
  const [ebooks, setEbooks] = useState<EbookListItem[]>(MOCK_EBOOKS)
  const [totalCount, setTotalCount] = useState<number>(MOCK_EBOOKS.length)
  const [totalPages, setTotalPages] = useState<number>(Math.ceil(MOCK_EBOOKS.length / 6))
  const [isSimulationData, setIsSimulationData] = useState<boolean>(true)
  const [categories, setCategories] = useState<CategoryListItem[]>(MOCK_CATEGORIES)
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

  // Fetch e-books from backend or simulation fallback
  const loadEbooks = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetchAdminEbooks(filters)
      setEbooks(res.ebooks)
      setTotalCount(res.total)
      setTotalPages(res.totalPages)
      setIsSimulationData(res.isSimulation)
    } catch (err) {
      console.error('Gagal memuat katalog e-book:', err)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  // Load categories on initial mount
  useEffect(() => {
    let active = true
    fetchCategories().then((res) => {
      if (active && res.categories.length > 0) {
        setCategories(res.categories)
      }
    })
    return () => {
      active = false
    }
  }, [])

  // Load e-books reactively whenever filters change
  useEffect(() => {
    let active = true
    void fetchAdminEbooks(filters)
      .then((res) => {
        if (active) {
          setEbooks(res.ebooks)
          setTotalCount(res.total)
          setTotalPages(res.totalPages)
          setIsSimulationData(res.isSimulation)
        }
      })
      .catch((err) => {
        if (active) {
          console.error('Gagal memuat katalog e-book:', err)
        }
      })

    return () => {
      active = false
    }
  }, [filters])

  const activeCount = useMemo(() => ebooks.filter((b) => b.isActive).length, [ebooks])
  const archiveCount = useMemo(() => ebooks.filter((b) => !b.isActive).length, [ebooks])

  // Form State
  const [editingEbook, setEditingEbook] = useState<EbookListItem | null>(null)
  const [formData, setFormData] = useState<EbookFormData>({
    categoryId: categories[0]?.id || MOCK_CATEGORIES[0]?.id || '',
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

  const handleApplySynopsisTemplate = () => {
    const template = `Ringkasan Buku:\nBuku ini memberikan panduan komprehensif mengenai konsep fundamental, metodologi terkini, dan implementasi nyata di industri teknologi informasi modern.\n\nTarget Pembaca:\nPraktisi rekayasa perangkat lunak, mahasiswa ilmu komputer/sistem informasi, dan profesional yang ingin memperdalam kompetensi teknis.\n\nTopik Utama:\n1. Konsep & Arsitektur Inti\n2. Pola Desain & Praktik Terbaik\n3. Studi Kasus Implementasi Nyata`
    setIsFormDirty(true)
    setFormData((prev) => ({ ...prev, description: template }))
    addToast('info', 'Templat kerangka sinopsis berhasil diterapkan ke formulir.')
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
    return categories.find((c) => c.id === filters.categoryId)
  }, [categories, filters.categoryId])

  // Sorting Handler
  const handleSort = (column: 'title' | 'price' | 'salesCount' | 'createdAt') => {
    setFilters((prev) => {
      if (prev.sortBy === column) {
        return {
          ...prev,
          sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
          page: 1,
        }
      }
      return {
        ...prev,
        sortBy: column,
        sortOrder: 'asc',
        page: 1,
      }
    })
  }

  // Open Form for Adding New E-book
  const handleOpenAdd = () => {
    setEditingEbook(null)
    setFormData({
      categoryId: categories[0]?.id || MOCK_CATEGORIES[0]?.id || '',
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
    onNavigate?.('/admin/katalog/tambah')
    onBreadcrumbChange?.('KATALOG / TAMBAH E-BOOK')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Open Form for Editing Existing E-book
  const handleOpenEdit = (ebook: EbookListItem) => {
    setEditingEbook(ebook)
    setFormData({
      categoryId: ebook.categoryId,
      title: ebook.title,
      author: ebook.author,
      description:
        ebook.description ||
        `Deskripsi lengkap untuk e-book ${ebook.title}. Membahas studi kasus praktis dan penerapan teruji.`,
      price: ebook.priceNumeric.toString(),
      pageCount: ebook.pageCount ? ebook.pageCount.toString() : '200',
      publishedYear: ebook.publishedYear ? ebook.publishedYear.toString() : '2025',
      isActive: ebook.isActive,
      coverFileName: ebook.coverUrl ? 'sampul-terpasang.png' : '',
      pdfFileName: ebook.storagePath
        ? ebook.storagePath.replace('ebooks-private/', '')
        : 'naskah-digital-privat.pdf',
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
      onNavigate?.('/admin/katalog/ebook')
      onBreadcrumbChange?.('KATALOG / KOLEKSI E-BOOK')
    }
  }

  // Save Form Handler
  const handleSaveEbook = async (e: React.FormEvent) => {
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
    const categoryObj = categories.find((c) => c.id === formData.categoryId)
    const categoryName = categoryObj
      ? categoryObj.name.replace('DATA SIMULASI — ', '')
      : 'Umum'

    try {
      if (editingEbook) {
        const res = await updateAdminEbook(editingEbook.id, formData, categoryName)
        addToast(
          'success',
          res.isSimulation
            ? `[DATA SIMULASI] E-book "${formData.title}" berhasil diperbarui di katalog.`
            : `E-book "${formData.title}" berhasil diperbarui di backend PostgreSQL.`,
        )
      } else {
        const res = await createAdminEbook(formData, categoryName)
        addToast(
          'success',
          res.isSimulation
            ? `[DATA SIMULASI] E-book baru "${formData.title}" berhasil disimpan.`
            : `E-book baru "${formData.title}" berhasil disimpan ke backend PostgreSQL.`,
        )
      }

      await loadEbooks()
      setIsFormDirty(false)
      setViewMode('LIST')
      setEditingEbook(null)
      onNavigate?.('/admin/katalog/ebook')
      onBreadcrumbChange?.('KATALOG / KOLEKSI E-BOOK')
    } catch (saveErr) {
      const msg = saveErr instanceof Error ? saveErr.message : 'Gagal menyimpan e-book'
      addToast('error', msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Toggle Archive / Unarchive Handler
  const handleConfirmToggleStatus = async () => {
    if (!ebookToToggleStatus) return

    const newStatus = !ebookToToggleStatus.isActive
    try {
      const res = await toggleAdminEbookStatus(ebookToToggleStatus.id, newStatus)
      addToast(
        'success',
        res.isSimulation
          ? newStatus
            ? `[DATA SIMULASI] E-book "${ebookToToggleStatus.title}" berhasil diaktifkan kembali.`
            : `[DATA SIMULASI] E-book "${ebookToToggleStatus.title}" berhasil diarsipkan.`
          : newStatus
            ? `E-book "${ebookToToggleStatus.title}" berhasil diaktifkan kembali di etalase publik.`
            : `E-book "${ebookToToggleStatus.title}" berhasil diarsipkan dari etalase publik.`,
      )
      await loadEbooks()
    } catch (toggleErr) {
      const msg = toggleErr instanceof Error ? toggleErr.message : 'Gagal mengubah status e-book'
      addToast('error', msg)
    } finally {
      setEbookToToggleStatus(null)
    }
  }

  return (
    <>
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* MODE 1: DAFTAR TABEL KOLEKSI E-BOOK (Zona C) */}
      {viewMode === 'LIST' && (
        <div className="catalog-page-container">
          <div className="catalog-page-header">
            <div className="catalog-title-group">
              <div className="catalog-header-title-row">
                <h1 className="catalog-page-title">Koleksi E-Book</h1>
                {isSimulationData ? (
                  <SimulationBadge />
                ) : (
                  <span
                    className="nb-simulation-badge"
                    style={{ backgroundColor: '#D1FAE5', color: '#065F46', borderColor: '#065F46' }}
                    title="Terhubung langsung dengan backend API PostgreSQL"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                      cloud_done
                    </span>
                    <span>API LIVE</span>
                  </span>
                )}
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

          {/* Ringkasan Metrik Koleksi E-Book (Zona 2) */}
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
                icon: 'menu_book',
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
                icon: 'storefront',
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
                icon: 'archive',
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
                icon: 'lock',
                tone: 'blue',
              },
            ]}
          />

          {/* Toolbar (Pencarian, Filter Status & Kategori, Tampilan Grid/Tabel) */}
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
            onRefresh={() => {
              loadEbooks().then(() => {
                addToast('info', 'Data koleksi e-book berhasil disegarkan.')
              })
            }}
          />

          {/* Content (Skeleton / Empty / Grid / Table) */}
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
              icon="menu_book"
              actionLabel="+ Tambah E-Book Pertama"
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

      {/* MODE 2: FORM TAMBAH / UBAH E-BOOK */}
      {viewMode === 'FORM' && (
        <EbookForm
          editingEbook={editingEbook}
          formData={formData}
          formErrors={formErrors}
          categories={categories}
          isSubmitting={isSubmitting}
          isFormDirty={isFormDirty}
          isSimulationData={isSimulationData}
          setFormData={setFormData}
          setIsFormDirty={setIsFormDirty}
          onApplySynopsisTemplate={handleApplySynopsisTemplate}
          onCancel={handleCancelForm}
          onSubmit={handleSaveEbook}
          onCoverSelect={(file) => {
            setIsFormDirty(true)
            setFormData((prev) => ({ ...prev, coverFileName: file.name }))
            addToast('info', `Sampul "${file.name}" siap diunggah.`)
          }}
          onCoverRemove={() => {
            setIsFormDirty(true)
            setFormData((prev) => ({ ...prev, coverFileName: '' }))
          }}
          onPdfSelect={(file) => {
            setIsFormDirty(true)
            setFormData((prev) => ({ ...prev, pdfFileName: file.name }))
            addToast('info', `Berkas PDF "${file.name}" siap disimpan di bucket privat.`)
          }}
          onPdfRemove={() => {
            setIsFormDirty(true)
            setFormData((prev) => ({ ...prev, pdfFileName: '' }))
          }}
        />
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
