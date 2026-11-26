import { useMemo, useState } from 'react'
import {
  CatalogKpiGrid,
  ConfirmDialog,
  SimulationBadge,
  Toast,
  type ToastMessage,
} from '../../../shared/components/ui'
import { AuthorFormModal } from '../components/AuthorFormModal'
import { AuthorTablePanel } from '../components/AuthorTablePanel'
import { PublisherFormModal } from '../components/PublisherFormModal'
import { PublisherTablePanel } from '../components/PublisherTablePanel'
import { MOCK_AUTHORS, MOCK_PUBLISHERS } from '../data/authorPublisherData'
import type {
  ActiveTab,
  AuthorFormData,
  AuthorListItem,
  AuthorTableFilters,
  PublisherFormData,
  PublisherListItem,
  PublisherTableFilters,
} from '../types/authorPublisher'

export function AuthorPublisherPage() {
  // Active Tab: 'AUTHORS' or 'PUBLISHERS' per design.md §5.5
  const [activeTab, setActiveTab] = useState<ActiveTab>('AUTHORS')

  // Authors State & Filters
  const [authors, setAuthors] = useState<AuthorListItem[]>(MOCK_AUTHORS)
  const [authorFilters, setAuthorFilters] = useState<AuthorTableFilters>({
    search: '',
    status: 'ALL',
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    limit: 5,
  })

  // Publishers State & Filters
  const [publishers, setPublishers] = useState<PublisherListItem[]>(MOCK_PUBLISHERS)
  const [publisherFilters, setPublisherFilters] = useState<PublisherTableFilters>({
    search: '',
    status: 'ALL',
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    limit: 5,
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Author Modal State
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState<boolean>(false)
  const [editingAuthor, setEditingAuthor] = useState<AuthorListItem | null>(null)
  const [authorFormData, setAuthorFormData] = useState<AuthorFormData>({
    name: '',
    email: '',
    affiliation: '',
    bio: '',
    isActive: true,
  })
  const [authorErrors, setAuthorErrors] = useState<Record<string, string>>({})

  // Publisher Modal State
  const [isPublisherModalOpen, setIsPublisherModalOpen] = useState<boolean>(false)
  const [editingPublisher, setEditingPublisher] = useState<PublisherListItem | null>(null)
  const [publisherFormData, setPublisherFormData] = useState<PublisherFormData>({
    name: '',
    city: '',
    website: '',
    contactEmail: '',
    description: '',
    isActive: true,
  })
  const [publisherErrors, setPublisherErrors] = useState<Record<string, string>>({})

  // Delete Confirm State
  const [authorToDelete, setAuthorToDelete] = useState<AuthorListItem | null>(null)
  const [publisherToDelete, setPublisherToDelete] = useState<PublisherListItem | null>(null)

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (type: 'success' | 'error' | 'info' | 'warning', text: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, type, text }])
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Filter & Sort Logic Penulis
  const filteredAuthors = useMemo(() => {
    let result = [...authors]

    if (authorFilters.search.trim()) {
      const q = authorFilters.search.toLowerCase()
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.affiliation.toLowerCase().includes(q),
      )
    }

    if (authorFilters.status !== 'ALL') {
      const activeBool = authorFilters.status === 'AKTIF'
      result = result.filter((a) => a.isActive === activeBool)
    }

    result.sort((a, b) => {
      let cmp = 0
      if (authorFilters.sortBy === 'name') {
        cmp = a.name.localeCompare(b.name)
      } else if (authorFilters.sortBy === 'ebookCount') {
        cmp = a.ebookCount - b.ebookCount
      } else if (authorFilters.sortBy === 'createdAt') {
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return authorFilters.sortOrder === 'asc' ? cmp : -cmp
    })

    return result
  }, [authors, authorFilters])

  const totalAuthorPages = Math.max(1, Math.ceil(filteredAuthors.length / authorFilters.limit))
  const paginatedAuthors = useMemo(() => {
    const start = (authorFilters.page - 1) * authorFilters.limit
    return filteredAuthors.slice(start, start + authorFilters.limit)
  }, [filteredAuthors, authorFilters.page, authorFilters.limit])

  // Filter & Sort Logic Penerbit
  const filteredPublishers = useMemo(() => {
    let result = [...publishers]

    if (publisherFilters.search.trim()) {
      const q = publisherFilters.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          (p.contactEmail && p.contactEmail.toLowerCase().includes(q)),
      )
    }

    if (publisherFilters.status !== 'ALL') {
      const activeBool = publisherFilters.status === 'AKTIF'
      result = result.filter((p) => p.isActive === activeBool)
    }

    result.sort((a, b) => {
      let cmp = 0
      if (publisherFilters.sortBy === 'name') {
        cmp = a.name.localeCompare(b.name)
      } else if (publisherFilters.sortBy === 'city') {
        cmp = a.city.localeCompare(b.city)
      } else if (publisherFilters.sortBy === 'ebookCount') {
        cmp = a.ebookCount - b.ebookCount
      } else if (publisherFilters.sortBy === 'createdAt') {
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return publisherFilters.sortOrder === 'asc' ? cmp : -cmp
    })

    return result
  }, [publishers, publisherFilters])

  const totalPublisherPages = Math.max(
    1,
    Math.ceil(filteredPublishers.length / publisherFilters.limit),
  )
  const paginatedPublishers = useMemo(() => {
    const start = (publisherFilters.page - 1) * publisherFilters.limit
    return filteredPublishers.slice(start, start + publisherFilters.limit)
  }, [filteredPublishers, publisherFilters.page, publisherFilters.limit])

  // Sorting Handlers
  const handleAuthorSort = (column: 'name' | 'ebookCount' | 'createdAt') => {
    setAuthorFilters((prev) => ({
      ...prev,
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handlePublisherSort = (column: 'name' | 'city' | 'ebookCount' | 'createdAt') => {
    setPublisherFilters((prev) => ({
      ...prev,
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }))
  }

  // Author Actions
  const handleOpenAddAuthor = () => {
    setEditingAuthor(null)
    setAuthorFormData({
      name: 'DATA SIMULASI — ',
      email: '',
      affiliation: '',
      bio: '',
      isActive: true,
    })
    setAuthorErrors({})
    setIsAuthorModalOpen(true)
  }

  const handleOpenEditAuthor = (author: AuthorListItem) => {
    setEditingAuthor(author)
    setAuthorFormData({
      name: author.name,
      email: author.email,
      affiliation: author.affiliation,
      bio: author.bio || '',
      isActive: author.isActive,
    })
    setAuthorErrors({})
    setIsAuthorModalOpen(true)
  }

  const handleSaveAuthor = (e: React.FormEvent) => {
    e.preventDefault()
    const errors: Record<string, string> = {}
    if (!authorFormData.name.trim()) errors.name = 'Nama penulis wajib diisi.'
    if (!authorFormData.email.trim()) {
      errors.email = 'Email kontak wajib diisi.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorFormData.email)) {
      errors.email = 'Format alamat email tidak valid.'
    }
    if (!authorFormData.affiliation.trim()) {
      errors.affiliation = 'Afiliasi atau keahlian wajib diisi.'
    }

    if (Object.keys(errors).length > 0) {
      setAuthorErrors(errors)
      return
    }

    if (editingAuthor) {
      setAuthors((prev) =>
        prev.map((a) =>
          a.id === editingAuthor.id
            ? {
                ...a,
                name: authorFormData.name.trim(),
                email: authorFormData.email.trim(),
                affiliation: authorFormData.affiliation.trim(),
                bio: authorFormData.bio.trim() || null,
                isActive: authorFormData.isActive,
              }
            : a,
        ),
      )
      addToast('success', `Profil penulis "${authorFormData.name}" berhasil diperbarui.`)
    } else {
      const newAuthor: AuthorListItem = {
        id: `auth-${Date.now()}`,
        name: authorFormData.name.trim(),
        email: authorFormData.email.trim(),
        affiliation: authorFormData.affiliation.trim(),
        bio: authorFormData.bio.trim() || null,
        ebookCount: 0,
        isActive: authorFormData.isActive,
        createdAt: new Date().toISOString(),
      }
      setAuthors((prev) => [newAuthor, ...prev])
      addToast('success', `Penulis baru "${authorFormData.name}" berhasil ditambahkan.`)
    }

    setIsAuthorModalOpen(false)
  }

  const handleConfirmDeleteAuthor = () => {
    if (!authorToDelete) return
    if (authorToDelete.ebookCount > 0) {
      addToast(
        'error',
        `Penulis tidak dapat dihapus karena memiliki ${authorToDelete.ebookCount} e-book terkait.`,
      )
      setAuthorToDelete(null)
      return
    }
    setAuthors((prev) => prev.filter((a) => a.id !== authorToDelete.id))
    addToast('success', `Penulis "${authorToDelete.name}" berhasil dihapus.`)
    setAuthorToDelete(null)
  }

  // Publisher Actions
  const handleOpenAddPublisher = () => {
    setEditingPublisher(null)
    setPublisherFormData({
      name: 'DATA SIMULASI — ',
      city: '',
      website: '',
      contactEmail: '',
      description: '',
      isActive: true,
    })
    setPublisherErrors({})
    setIsPublisherModalOpen(true)
  }

  const handleOpenEditPublisher = (publisher: PublisherListItem) => {
    setEditingPublisher(publisher)
    setPublisherFormData({
      name: publisher.name,
      city: publisher.city,
      website: publisher.website || '',
      contactEmail: publisher.contactEmail || '',
      description: publisher.description || '',
      isActive: publisher.isActive,
    })
    setPublisherErrors({})
    setIsPublisherModalOpen(true)
  }

  const handleSavePublisher = (e: React.FormEvent) => {
    e.preventDefault()
    const errors: Record<string, string> = {}
    if (!publisherFormData.name.trim()) errors.name = 'Nama penerbit wajib diisi.'
    if (!publisherFormData.city.trim()) errors.city = 'Kota domisili wajib diisi.'

    if (Object.keys(errors).length > 0) {
      setPublisherErrors(errors)
      return
    }

    if (editingPublisher) {
      setPublishers((prev) =>
        prev.map((p) =>
          p.id === editingPublisher.id
            ? {
                ...p,
                name: publisherFormData.name.trim(),
                city: publisherFormData.city.trim(),
                website: publisherFormData.website.trim() || null,
                contactEmail: publisherFormData.contactEmail.trim() || null,
                description: publisherFormData.description.trim() || null,
                isActive: publisherFormData.isActive,
              }
            : p,
        ),
      )
      addToast('success', `Data penerbit "${publisherFormData.name}" berhasil diperbarui.`)
    } else {
      const newPub: PublisherListItem = {
        id: `pub-${Date.now()}`,
        name: publisherFormData.name.trim(),
        city: publisherFormData.city.trim(),
        website: publisherFormData.website.trim() || null,
        contactEmail: publisherFormData.contactEmail.trim() || null,
        description: publisherFormData.description.trim() || null,
        ebookCount: 0,
        isActive: publisherFormData.isActive,
        createdAt: new Date().toISOString(),
      }
      setPublishers((prev) => [newPub, ...prev])
      addToast('success', `Penerbit baru "${publisherFormData.name}" berhasil ditambahkan.`)
    }

    setIsPublisherModalOpen(false)
  }

  const handleConfirmDeletePublisher = () => {
    if (!publisherToDelete) return
    if (publisherToDelete.ebookCount > 0) {
      addToast(
        'error',
        `Penerbit tidak dapat dihapus karena masih menerbitkan ${publisherToDelete.ebookCount} e-book.`,
      )
      setPublisherToDelete(null)
      return
    }
    setPublishers((prev) => prev.filter((p) => p.id !== publisherToDelete.id))
    addToast('success', `Penerbit "${publisherToDelete.name}" berhasil dihapus.`)
    setPublisherToDelete(null)
  }

  const summaryMetrics = useMemo(() => {
    const activeAuthors = authors.filter((a) => a.isActive).length
    const activePublishers = publishers.filter((p) => p.isActive).length
    const totalAuthorEbooks = authors.reduce((sum, a) => sum + a.ebookCount, 0)
    const totalPublisherEbooks = publishers.reduce((sum, p) => sum + p.ebookCount, 0)

    return {
      totalAuthors: authors.length,
      activeAuthors,
      inactiveAuthors: authors.length - activeAuthors,
      totalPublishers: publishers.length,
      activePublishers,
      inactivePublishers: publishers.length - activePublishers,
      totalActiveContributors: activeAuthors + activePublishers,
      totalAuthorEbooks,
      totalPublisherEbooks,
    }
  }, [authors, publishers])

  return (
    <>
      <Toast toasts={toasts} onDismiss={dismissToast} />

      <div className="catalog-page-container">
        {/* Page Header */}
        <div className="catalog-page-header">
          <div className="catalog-title-group">
            <div className="catalog-header-title-row">
              <h1 className="catalog-page-title">Penulis & Penerbit</h1>
              <SimulationBadge />
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
            <span>
              {activeTab === 'AUTHORS' ? 'Tambah Penulis' : 'Tambah Penerbit'}
            </span>
          </button>
        </div>

        {/* Ringkasan Metrik Penulis & Penerbit (Zona 2) */}
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

        {/* TAB 1: DIREKTORI PENULIS */}
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
            onRefresh={() => {
              setIsLoading(true)
              setTimeout(() => {
                setIsLoading(false)
                addToast('info', 'Data direktori penulis berhasil disegarkan.')
              }, 400)
            }}
          />
        )}

        {/* TAB 2: MITRA PENERBIT */}
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
            onRefresh={() => {
              setIsLoading(true)
              setTimeout(() => {
                setIsLoading(false)
                addToast('info', 'Data mitra penerbit berhasil disegarkan.')
              }, 400)
            }}
          />
        )}
      </div>

      {/* Modal Dialog Form Penulis */}
      <AuthorFormModal
        isOpen={isAuthorModalOpen}
        editingAuthor={editingAuthor}
        formData={authorFormData}
        errors={authorErrors}
        setFormData={setAuthorFormData}
        onClose={() => setIsAuthorModalOpen(false)}
        onSubmit={handleSaveAuthor}
      />

      {/* Modal Dialog Form Penerbit */}
      <PublisherFormModal
        isOpen={isPublisherModalOpen}
        editingPublisher={editingPublisher}
        formData={publisherFormData}
        errors={publisherErrors}
        setFormData={setPublisherFormData}
        onClose={() => setIsPublisherModalOpen(false)}
        onSubmit={handleSavePublisher}
      />

      {/* Dialog Konfirmasi Hapus Penulis */}
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
              <strong>Penulis tidak dapat dihapus:</strong> Penulis ini masih
              terkait dengan <strong>{authorToDelete?.ebookCount} e-book</strong> dalam
              katalog. Alihkan kepengarangan e-book tersebut sebelum menghapus profil.
            </div>
          </div>
        ) : (
          <p style={{ margin: 0 }}>
            Penulis ini tidak memiliki e-book terdaftar. Apakah Anda yakin ingin menghapus
            profil penulis ini secara permanen?
          </p>
        )}
      </ConfirmDialog>

      {/* Dialog Konfirmasi Hapus Penerbit */}
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
              <strong>Penerbit tidak dapat dihapus:</strong> Mitra penerbit ini masih
              menerbitkan <strong>{publisherToDelete?.ebookCount} e-book</strong> aktif.
            </div>
          </div>
        ) : (
          <p style={{ margin: 0 }}>
            Penerbit ini tidak memiliki naskah terbitan aktif. Apakah Anda yakin ingin
            menghapus mitra penerbit ini secara permanen?
          </p>
        )}
      </ConfirmDialog>
    </>
  )
}
