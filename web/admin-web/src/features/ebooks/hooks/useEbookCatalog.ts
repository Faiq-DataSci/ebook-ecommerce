import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ToastMessage } from '../../../shared/components/ui'
import type { CategoryListItem } from '../../categories/types/category'
import {
  createAdminEbook,
  fetchAdminEbooks,
  fetchCategories,
  toggleAdminEbookStatus,
  updateAdminEbook,
  uploadAdminEbookCover,
  uploadAdminEbookPdf,
} from '../services/catalog.service'
import type {
  EbookFormData,
  EbookListItem,
  EbookTableFilters,
} from '../types/catalog'

interface UseEbookCatalogOptions {
  initialView?: 'LIST' | 'FORM'
  currentPath?: string
  onBreadcrumbChange?: (text: string) => void
  onNavigate?: (path: string) => void
}

const DEFAULT_FORM_DATA: EbookFormData = {
  categoryId: '',
  title: '',
  author: '',
  description: '',
  price: '75000',
  pageCount: '240',
  publishedYear: '2026',
  isActive: true,
  coverFileName: '',
  coverUrl: null,
  pdfFileName: '',
}

const SYNOPSIS_TEMPLATE = `Ringkasan Buku:\nBuku ini memberikan panduan komprehensif mengenai konsep fundamental, metodologi terkini, dan implementasi nyata di industri teknologi informasi modern.\n\nTarget Pembaca:\nPraktisi rekayasa perangkat lunak, mahasiswa ilmu komputer/sistem informasi, dan profesional yang ingin memperdalam kompetensi teknis.\n\nTopik Utama:\n1. Konsep & Arsitektur Inti\n2. Pola Desain & Praktik Terbaik\n3. Studi Kasus Implementasi Nyata`

export function useEbookCatalog({
  initialView = 'LIST',
  currentPath,
  onBreadcrumbChange,
  onNavigate,
}: UseEbookCatalogOptions) {
  const [viewMode, setViewMode] = useState<'LIST' | 'FORM'>(initialView)
  const [prevInitialView, setPrevInitialView] = useState(initialView)
  const [prevPath, setPrevPath] = useState(currentPath)
  const [displayMode, setDisplayMode] = useState<'TABLE' | 'GRID'>('TABLE')

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

  const [ebooks, setEbooks] = useState<EbookListItem[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [categories, setCategories] = useState<CategoryListItem[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [filters, setFilters] = useState<EbookTableFilters>({
    search: '',
    categoryId: '',
    status: 'ALL',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 6,
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [editingEbook, setEditingEbook] = useState<EbookListItem | null>(null)
  const [formData, setFormData] = useState<EbookFormData>(DEFAULT_FORM_DATA)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false)
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState<boolean>(false)
  const [ebookToToggleStatus, setEbookToToggleStatus] = useState<EbookListItem | null>(null)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback(
    (type: 'success' | 'error' | 'info' | 'warning', text: string) => {
      const id = `toast-${Date.now()}-${Math.random()}`
      setToasts((prev) => [...prev, { id, type, text }])
    },
    [],
  )

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const loadEbooks = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const res = await fetchAdminEbooks(filters)
      setEbooks(res.ebooks)
      setTotalCount(res.total)
      setTotalPages(res.totalPages)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Gagal memuat daftar e-book dari server backend.'
      setErrorMessage(message)
      setEbooks([])
      setTotalCount(0)
      setTotalPages(1)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    let active = true
    fetchCategories()
      .then((list) => {
        if (active) setCategories(list)
      })
      .catch((err) => {
        if (active) console.error('Gagal memuat kategori e-book:', err)
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true
    fetchAdminEbooks(filters)
      .then((res) => {
        if (active) {
          setEbooks(res.ebooks)
          setTotalCount(res.total)
          setTotalPages(res.totalPages)
          setErrorMessage(null)
        }
      })
      .catch((err) => {
        if (active) {
          const message =
            err instanceof Error
              ? err.message
              : 'Gagal memuat daftar e-book dari server backend.'
          setErrorMessage(message)
          setEbooks([])
          setTotalCount(0)
          setTotalPages(1)
        }
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [filters])

  const activeCount = useMemo(() => ebooks.filter((b) => b.isActive).length, [ebooks])
  const archiveCount = useMemo(() => ebooks.filter((b) => !b.isActive).length, [ebooks])

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

  const handleSort = (column: 'title' | 'price' | 'salesCount' | 'createdAt') => {
    setFilters((prev) => {
      if (prev.sortBy === column) {
        return { ...prev, sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc', page: 1 }
      }
      return { ...prev, sortBy: column, sortOrder: 'asc', page: 1 }
    })
  }

  const handleApplySynopsisTemplate = () => {
    setIsFormDirty(true)
    setFormData((prev) => ({ ...prev, description: SYNOPSIS_TEMPLATE }))
    addToast('info', 'Templat kerangka sinopsis berhasil diterapkan ke formulir.')
  }

  const handleOpenAdd = () => {
    const firstActiveCategory = categories.find((c) => c.isActive) ?? categories[0]
    setEditingEbook(null)
    setFormData({
      ...DEFAULT_FORM_DATA,
      categoryId: firstActiveCategory?.id || '',
    })
    setFormErrors({})
    setIsFormDirty(false)
    setViewMode('FORM')
    onNavigate?.('/admin/katalog/tambah')
    onBreadcrumbChange?.('KATALOG / TAMBAH E-BOOK')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
      coverFileName: ebook.coverUrl ? ebook.coverUrl.split('/').pop() || 'sampul-terpasang.png' : '',
      coverUrl: ebook.coverUrl ?? null,
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

  const handleDiscardForm = () => {
    setShowUnsavedConfirm(false)
    setIsFormDirty(false)
    setViewMode('LIST')
    setEditingEbook(null)
    onBreadcrumbChange?.('KATALOG / KOLEKSI E-BOOK')
  }

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
    try {
      if (editingEbook) {
        const res = await updateAdminEbook(editingEbook.id, formData)
        addToast('success', res.message)
      } else {
        const res = await createAdminEbook(formData)
        addToast('success', res.message)
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

  const handleCoverSelect = async (file: File) => {
    setIsSubmitting(true)
    try {
      const uploaded = await uploadAdminEbookCover(file)
      setIsFormDirty(true)
      setFormData((prev) => ({
        ...prev,
        coverFileName: uploaded.fileName,
        coverUrl: uploaded.coverUrl,
      }))
      addToast(
        'success',
        `Sampul "${uploaded.fileName}" berhasil diunggah ke Supabase Storage (${uploaded.bucket}).`,
      )
    } catch (uploadErr) {
      const msg =
        uploadErr instanceof Error
          ? uploadErr.message
          : 'Gagal mengunggah gambar sampul ke Supabase Storage.'
      addToast('error', msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCoverRemove = () => {
    setIsFormDirty(true)
    setFormData((prev) => ({ ...prev, coverFileName: '', coverUrl: null }))
  }

  const handlePdfSelect = async (file: File) => {
    setIsSubmitting(true)
    try {
      const uploaded = await uploadAdminEbookPdf(file)
      setIsFormDirty(true)
      setFormData((prev) => ({ ...prev, pdfFileName: uploaded.storagePath }))
      addToast(
        'success',
        `Berkas PDF "${uploaded.fileName}" berhasil diunggah ke bucket privat (${uploaded.bucket}).`,
      )
    } catch (uploadErr) {
      const msg =
        uploadErr instanceof Error
          ? uploadErr.message
          : 'Gagal mengunggah berkas PDF ke bucket privat.'
      addToast('error', msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePdfRemove = () => {
    setIsFormDirty(true)
    setFormData((prev) => ({ ...prev, pdfFileName: '' }))
  }

  const handleConfirmToggleStatus = async () => {
    if (!ebookToToggleStatus) return
    const newStatus = !ebookToToggleStatus.isActive
    try {
      const res = await toggleAdminEbookStatus(ebookToToggleStatus.id, newStatus)
      addToast('success', res.message)
      await loadEbooks()
    } catch (toggleErr) {
      const msg = toggleErr instanceof Error ? toggleErr.message : 'Gagal mengubah status e-book'
      addToast('error', msg)
    } finally {
      setEbookToToggleStatus(null)
    }
  }

  const handleRefreshList = () => {
    void loadEbooks().then(() => {
      addToast('info', 'Data koleksi e-book berhasil disegarkan.')
    })
  }

  return {
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
  }
}
