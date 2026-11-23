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
import { MOCK_AUTHORS, MOCK_PUBLISHERS } from '../data/authorPublisherData'
import type {
  ActiveTab,
  AuthorFormData,
  AuthorListItem,
  AuthorStatus,
  AuthorTableFilters,
  PublisherFormData,
  PublisherListItem,
  PublisherStatus,
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

  // =========================================================================
  // Authors Filter & Sort Logic
  // =========================================================================
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

  // =========================================================================
  // Publishers Filter & Sort Logic
  // =========================================================================
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

  // Author Modal Handlers
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

  // Publisher Modal Handlers
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
            <span className="material-symbols-outlined" aria-hidden="true">
              add_circle
            </span>
            <span>
              {activeTab === 'AUTHORS' ? '+ Tambah Penulis' : '+ Tambah Penerbit'}
            </span>
          </button>
        </div>

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
            <span className="material-symbols-outlined" aria-hidden="true">
              person
            </span>
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
            <span className="material-symbols-outlined" aria-hidden="true">
              domain
            </span>
            <span>Mitra Penerbit</span>
            <span className="nb-page-tab-badge">{publishers.length}</span>
          </button>
        </div>

        {/* ===================================================================
            TAB 1: DIREKTORI PENULIS
            =================================================================== */}
        {activeTab === 'AUTHORS' && (
          <div
            id="panel-authors"
            role="tabpanel"
            aria-labelledby="tab-authors"
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {/* Filter Bar Penulis */}
            <div className="catalog-filter-bar">
              <div className="catalog-filter-left">
                <SearchInput
                  value={authorFilters.search}
                  onChange={(search) =>
                    setAuthorFilters((prev) => ({ ...prev, search, page: 1 }))
                  }
                  onClear={() =>
                    setAuthorFilters((prev) => ({ ...prev, search: '', page: 1 }))
                  }
                  placeholder="Cari nama, afiliasi, atau email..."
                  ariaLabel="Cari penulis"
                />

                <FilterChipGroup
                  label="Status:"
                  icon="tune"
                  value={authorFilters.status}
                  onChange={(val) =>
                    setAuthorFilters((prev) => ({
                      ...prev,
                      status: val as 'ALL' | AuthorStatus,
                      page: 1,
                    }))
                  }
                  options={[
                    {
                      value: 'ALL',
                      label: 'Semua Status',
                      count: authors.length,
                      icon: 'apps',
                      activeBg: 'var(--nb-yellow)',
                    },
                    {
                      value: 'AKTIF',
                      label: 'Aktif',
                      count: authors.filter((a) => a.isActive).length,
                      icon: 'check_circle',
                      activeBg: 'var(--nb-green)',
                    },
                    {
                      value: 'NONAKTIF',
                      label: 'Nonaktif',
                      count: authors.filter((a) => !a.isActive).length,
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
                      addToast('info', 'Data direktori penulis berhasil disegarkan.')
                    }, 400)
                  }}
                  title="Segarkan data tabel penulis"
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    refresh
                  </span>
                </button>
              </div>
            </div>

            {/* Active Filter Strip Penulis */}
            {(authorFilters.search || authorFilters.status !== 'ALL') && (
              <div className="nb-active-filter-strip">
                <div className="nb-active-tags">
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                    Filter Aktif:
                  </span>
                  {authorFilters.search && (
                    <span className="nb-active-tag-badge">
                      <span>Cari: &ldquo;{authorFilters.search}&rdquo;</span>
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        onClick={() =>
                          setAuthorFilters((prev) => ({ ...prev, search: '', page: 1 }))
                        }
                        aria-label="Hapus filter pencarian"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {authorFilters.status !== 'ALL' && (
                    <span className="nb-active-tag-badge">
                      <span>
                        Status: {authorFilters.status === 'AKTIF' ? 'Aktif' : 'Nonaktif'}
                      </span>
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        onClick={() =>
                          setAuthorFilters((prev) => ({ ...prev, status: 'ALL', page: 1 }))
                        }
                        aria-label="Hapus filter status"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  <span style={{ color: 'var(--nb-text-muted)', fontSize: 12 }}>
                    (Ditemukan {filteredAuthors.length} penulis)
                  </span>
                </div>

                <button
                  type="button"
                  className="nb-btn nb-reset-filters-btn"
                  onClick={() =>
                    setAuthorFilters((prev) => ({
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

            {/* Tabel Penulis */}
            {isLoading ? (
              <TableSkeleton rows={5} cols={6} />
            ) : filteredAuthors.length === 0 ? (
              <EmptyState
                title="Tidak Ada Penulis Ditemukan"
                description={
                  authorFilters.search || authorFilters.status !== 'ALL'
                    ? 'Tidak ada profil penulis yang cocok dengan kriteria pencarian.'
                    : 'Belum ada profil penulis terdaftar. Tambahkan penulis pertama sekarang.'
                }
                icon="person"
                actionLabel="+ Tambah Penulis Pertama"
                onAction={handleOpenAddAuthor}
              />
            ) : (
              <div className="nb-table-container">
                <table className="nb-table">
                  <caption className="visually-hidden">Daftar Penulis Buku Digital</caption>
                  <thead>
                    <tr>
                      <th scope="col" style={{ width: 60, textAlign: 'center' }}>
                        Profil
                      </th>
                      <th
                        scope="col"
                        className="is-sortable"
                        onClick={() => handleAuthorSort('name')}
                        aria-sort={
                          authorFilters.sortBy === 'name'
                            ? authorFilters.sortOrder === 'asc'
                              ? 'ascending'
                              : 'descending'
                            : 'none'
                        }
                      >
                        <div className="nb-th-inner">
                          <span>Nama Penulis</span>
                          <span className="material-symbols-outlined nb-sort-icon">
                            {authorFilters.sortBy === 'name'
                              ? authorFilters.sortOrder === 'asc'
                                ? 'arrow_upward'
                                : 'arrow_downward'
                              : 'unfold_more'}
                          </span>
                        </div>
                      </th>
                      <th scope="col">Afiliasi & Keahlian</th>
                      <th scope="col">Email Kontak</th>
                      <th
                        scope="col"
                        className="is-sortable"
                        style={{ textAlign: 'right', width: 120 }}
                        onClick={() => handleAuthorSort('ebookCount')}
                        aria-sort={
                          authorFilters.sortBy === 'ebookCount'
                            ? authorFilters.sortOrder === 'asc'
                              ? 'ascending'
                              : 'descending'
                            : 'none'
                        }
                      >
                        <div className="nb-th-inner" style={{ justifyContent: 'flex-end' }}>
                          <span>E-Book Ditulis</span>
                          <span className="material-symbols-outlined nb-sort-icon">
                            {authorFilters.sortBy === 'ebookCount'
                              ? authorFilters.sortOrder === 'asc'
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
                    {paginatedAuthors.map((author) => {
                      const cleanName = author.name.replace('DATA SIMULASI — ', '')
                      const initials = cleanName.slice(0, 2).toUpperCase()

                      return (
                        <tr key={author.id}>
                          <td data-label="Profil" style={{ textAlign: 'center', width: 60 }}>
                            <div className="nb-entity-avatar is-author">{initials}</div>
                          </td>
                          <td data-label="Nama Penulis">
                            <span className="font-heading" style={{ fontWeight: 700 }}>
                              {author.name}
                            </span>
                            {author.bio && (
                              <div
                                style={{
                                  fontSize: 12,
                                  color: 'var(--nb-text-muted)',
                                  marginTop: 2,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                {author.bio}
                              </div>
                            )}
                          </td>
                          <td data-label="Afiliasi & Keahlian">{author.affiliation}</td>
                          <td data-label="Email Kontak" className="nb-td-mono">
                            {author.email}
                          </td>
                          <td
                            data-label="E-Book Ditulis"
                            className="nb-td-mono nb-td-right"
                            style={{ fontWeight: 700 }}
                          >
                            {author.ebookCount}
                          </td>
                          <td data-label="Status">
                            {author.isActive ? (
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
                                onClick={() => handleOpenEditAuthor(author)}
                                aria-label={`Ubah profil ${author.name}`}
                                title="Ubah data penulis"
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
                                onClick={() => setAuthorToDelete(author)}
                                aria-label={`Hapus profil ${author.name}`}
                                title="Hapus profil penulis"
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
                      )
                    })}
                  </tbody>
                </table>

                <Pagination
                  currentPage={authorFilters.page}
                  totalPages={totalAuthorPages}
                  totalItems={filteredAuthors.length}
                  pageSize={authorFilters.limit}
                  onPageChange={(page) => setAuthorFilters((prev) => ({ ...prev, page }))}
                  labelItemName="penulis"
                />
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 2: MITRA PENERBIT
            =================================================================== */}
        {activeTab === 'PUBLISHERS' && (
          <div
            id="panel-publishers"
            role="tabpanel"
            aria-labelledby="tab-publishers"
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {/* Filter Bar Penerbit */}
            <div className="catalog-filter-bar">
              <div className="catalog-filter-left">
                <SearchInput
                  value={publisherFilters.search}
                  onChange={(search) =>
                    setPublisherFilters((prev) => ({ ...prev, search, page: 1 }))
                  }
                  onClear={() =>
                    setPublisherFilters((prev) => ({ ...prev, search: '', page: 1 }))
                  }
                  placeholder="Cari nama penerbit atau kota..."
                  ariaLabel="Cari penerbit"
                />

                <FilterChipGroup
                  label="Status:"
                  icon="tune"
                  value={publisherFilters.status}
                  onChange={(val) =>
                    setPublisherFilters((prev) => ({
                      ...prev,
                      status: val as 'ALL' | PublisherStatus,
                      page: 1,
                    }))
                  }
                  options={[
                    {
                      value: 'ALL',
                      label: 'Semua Status',
                      count: publishers.length,
                      icon: 'apps',
                      activeBg: 'var(--nb-yellow)',
                    },
                    {
                      value: 'AKTIF',
                      label: 'Aktif',
                      count: publishers.filter((p) => p.isActive).length,
                      icon: 'check_circle',
                      activeBg: 'var(--nb-green)',
                    },
                    {
                      value: 'NONAKTIF',
                      label: 'Nonaktif',
                      count: publishers.filter((p) => !p.isActive).length,
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
                      addToast('info', 'Data mitra penerbit berhasil disegarkan.')
                    }, 400)
                  }}
                  title="Segarkan data tabel penerbit"
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    refresh
                  </span>
                </button>
              </div>
            </div>

            {/* Active Filter Strip Penerbit */}
            {(publisherFilters.search || publisherFilters.status !== 'ALL') && (
              <div className="nb-active-filter-strip">
                <div className="nb-active-tags">
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                    Filter Aktif:
                  </span>
                  {publisherFilters.search && (
                    <span className="nb-active-tag-badge">
                      <span>Cari: &ldquo;{publisherFilters.search}&rdquo;</span>
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        onClick={() =>
                          setPublisherFilters((prev) => ({ ...prev, search: '', page: 1 }))
                        }
                        aria-label="Hapus filter pencarian"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {publisherFilters.status !== 'ALL' && (
                    <span className="nb-active-tag-badge">
                      <span>
                        Status: {publisherFilters.status === 'AKTIF' ? 'Aktif' : 'Nonaktif'}
                      </span>
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        onClick={() =>
                          setPublisherFilters((prev) => ({ ...prev, status: 'ALL', page: 1 }))
                        }
                        aria-label="Hapus filter status"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  <span style={{ color: 'var(--nb-text-muted)', fontSize: 12 }}>
                    (Ditemukan {filteredPublishers.length} penerbit)
                  </span>
                </div>

                <button
                  type="button"
                  className="nb-btn nb-reset-filters-btn"
                  onClick={() =>
                    setPublisherFilters((prev) => ({
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

            {/* Tabel Penerbit */}
            {isLoading ? (
              <TableSkeleton rows={5} cols={6} />
            ) : filteredPublishers.length === 0 ? (
              <EmptyState
                title="Tidak Ada Penerbit Ditemukan"
                description={
                  publisherFilters.search || publisherFilters.status !== 'ALL'
                    ? 'Tidak ada mitra penerbit yang cocok dengan filter saat ini.'
                    : 'Belum ada data penerbit terdaftar. Tambahkan mitra penerbit baru sekarang.'
                }
                icon="domain"
                actionLabel="+ Tambah Penerbit Pertama"
                onAction={handleOpenAddPublisher}
              />
            ) : (
              <div className="nb-table-container">
                <table className="nb-table">
                  <caption className="visually-hidden">Daftar Mitra Penerbit E-Book</caption>
                  <thead>
                    <tr>
                      <th scope="col" style={{ width: 60, textAlign: 'center' }}>
                        Logo
                      </th>
                      <th
                        scope="col"
                        className="is-sortable"
                        onClick={() => handlePublisherSort('name')}
                        aria-sort={
                          publisherFilters.sortBy === 'name'
                            ? publisherFilters.sortOrder === 'asc'
                              ? 'ascending'
                              : 'descending'
                            : 'none'
                        }
                      >
                        <div className="nb-th-inner">
                          <span>Nama Penerbit</span>
                          <span className="material-symbols-outlined nb-sort-icon">
                            {publisherFilters.sortBy === 'name'
                              ? publisherFilters.sortOrder === 'asc'
                                ? 'arrow_upward'
                                : 'arrow_downward'
                              : 'unfold_more'}
                          </span>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="is-sortable"
                        onClick={() => handlePublisherSort('city')}
                        aria-sort={
                          publisherFilters.sortBy === 'city'
                            ? publisherFilters.sortOrder === 'asc'
                              ? 'ascending'
                              : 'descending'
                            : 'none'
                        }
                      >
                        <div className="nb-th-inner">
                          <span>Kota Asal</span>
                          <span className="material-symbols-outlined nb-sort-icon">
                            {publisherFilters.sortBy === 'city'
                              ? publisherFilters.sortOrder === 'asc'
                                ? 'arrow_upward'
                                : 'arrow_downward'
                              : 'unfold_more'}
                          </span>
                        </div>
                      </th>
                      <th scope="col">Website & Kontak</th>
                      <th
                        scope="col"
                        className="is-sortable"
                        style={{ textAlign: 'right', width: 130 }}
                        onClick={() => handlePublisherSort('ebookCount')}
                        aria-sort={
                          publisherFilters.sortBy === 'ebookCount'
                            ? publisherFilters.sortOrder === 'asc'
                              ? 'ascending'
                              : 'descending'
                            : 'none'
                        }
                      >
                        <div className="nb-th-inner" style={{ justifyContent: 'flex-end' }}>
                          <span>E-Book Terbitan</span>
                          <span className="material-symbols-outlined nb-sort-icon">
                            {publisherFilters.sortBy === 'ebookCount'
                              ? publisherFilters.sortOrder === 'asc'
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
                    {paginatedPublishers.map((pub) => {
                      const cleanName = pub.name.replace('DATA SIMULASI — ', '')
                      const initials = cleanName.slice(0, 2).toUpperCase()

                      return (
                        <tr key={pub.id}>
                          <td data-label="Logo" style={{ textAlign: 'center', width: 60 }}>
                            <div className="nb-entity-avatar is-publisher">{initials}</div>
                          </td>
                          <td data-label="Nama Penerbit">
                            <span className="font-heading" style={{ fontWeight: 700 }}>
                              {pub.name}
                            </span>
                            {pub.description && (
                              <div
                                style={{
                                  fontSize: 12,
                                  color: 'var(--nb-text-muted)',
                                  marginTop: 2,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                {pub.description}
                              </div>
                            )}
                          </td>
                          <td data-label="Kota Asal">{pub.city}</td>
                          <td data-label="Website & Kontak" className="nb-td-mono">
                            {pub.website ? (
                              <a
                                href={pub.website}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: 'var(--nb-focus)', textDecoration: 'underline' }}
                              >
                                {pub.website.replace('https://', '')}
                              </a>
                            ) : pub.contactEmail ? (
                              pub.contactEmail
                            ) : (
                              <span className="nb-td-muted-italic">—</span>
                            )}
                          </td>
                          <td
                            data-label="E-Book Terbitan"
                            className="nb-td-mono nb-td-right"
                            style={{ fontWeight: 700 }}
                          >
                            {pub.ebookCount}
                          </td>
                          <td data-label="Status">
                            {pub.isActive ? (
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
                                onClick={() => handleOpenEditPublisher(pub)}
                                aria-label={`Ubah penerbit ${pub.name}`}
                                title="Ubah data penerbit"
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
                                onClick={() => setPublisherToDelete(pub)}
                                aria-label={`Hapus penerbit ${pub.name}`}
                                title="Hapus mitra penerbit"
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
                      )
                    })}
                  </tbody>
                </table>

                <Pagination
                  currentPage={publisherFilters.page}
                  totalPages={totalPublisherPages}
                  totalItems={filteredPublishers.length}
                  pageSize={publisherFilters.limit}
                  onPageChange={(page) => setPublisherFilters((prev) => ({ ...prev, page }))}
                  labelItemName="penerbit"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===================================================================
          MODAL DIALOG: TAMBAH / UBAH PENULIS (Zona C)
          =================================================================== */}
      {isAuthorModalOpen && (
        <div
          className="nb-dialog-scrim"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAuthorModalOpen(false)
          }}
        >
          <div
            className="nb-dialog-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="author-dialog-title"
          >
            <div className="nb-dialog-header">
              <h2 id="author-dialog-title" className="nb-dialog-title">
                {editingAuthor ? 'Ubah Profil Penulis' : 'Tambah Penulis Baru'}
              </h2>
              <button
                type="button"
                className="nb-icon-btn nb-btn"
                onClick={() => setIsAuthorModalOpen(false)}
                aria-label="Tutup form penulis"
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  close
                </span>
              </button>
            </div>

            <form onSubmit={handleSaveAuthor}>
              <div className="nb-dialog-body">
                <div className="nb-form-field">
                  <label htmlFor="auth-name-input" className="nb-form-label">
                    Nama Lengkap & Gelar <span style={{ color: 'var(--nb-pink)' }}>*</span>
                  </label>
                  <input
                    id="auth-name-input"
                    type="text"
                    maxLength={120}
                    className="nb-form-input"
                    value={authorFormData.name}
                    onChange={(e) =>
                      setAuthorFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Contoh: Dr. Hendra Pratama"
                    autoFocus
                  />
                  {authorErrors.name && (
                    <div className="nb-form-error-box" role="alert">
                      <span>{authorErrors.name}</span>
                    </div>
                  )}
                </div>

                <div className="nb-form-field">
                  <label htmlFor="auth-email-input" className="nb-form-label">
                    Email Kontak Resmi <span style={{ color: 'var(--nb-pink)' }}>*</span>
                  </label>
                  <input
                    id="auth-email-input"
                    type="email"
                    maxLength={150}
                    className="nb-form-input font-mono-nb"
                    value={authorFormData.email}
                    onChange={(e) =>
                      setAuthorFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="hendra@instansi.ac.id"
                  />
                  {authorErrors.email && (
                    <div className="nb-form-error-box" role="alert">
                      <span>{authorErrors.email}</span>
                    </div>
                  )}
                </div>

                <div className="nb-form-field">
                  <label htmlFor="auth-affiliation-input" className="nb-form-label">
                    Afiliasi / Bidang Keahlian <span style={{ color: 'var(--nb-pink)' }}>*</span>
                  </label>
                  <input
                    id="auth-affiliation-input"
                    type="text"
                    maxLength={150}
                    className="nb-form-input"
                    value={authorFormData.affiliation}
                    onChange={(e) =>
                      setAuthorFormData((prev) => ({
                        ...prev,
                        affiliation: e.target.value,
                      }))
                    }
                    placeholder="Contoh: Institut Teknologi Rekayasa Sistem"
                  />
                  {authorErrors.affiliation && (
                    <div className="nb-form-error-box" role="alert">
                      <span>{authorErrors.affiliation}</span>
                    </div>
                  )}
                </div>

                <div className="nb-form-field">
                  <label htmlFor="auth-bio-input" className="nb-form-label">
                    Biografi Singkat (Opsional)
                  </label>
                  <textarea
                    id="auth-bio-input"
                    className="nb-form-textarea"
                    rows={3}
                    value={authorFormData.bio}
                    onChange={(e) =>
                      setAuthorFormData((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    placeholder="Latar belakang pengalaman kepengarangan dan fokus riset..."
                  />
                </div>

                <div className="nb-form-field">
                  <label className="nb-form-label">Status Penulis</label>
                  <ToggleSwitch
                    checked={authorFormData.isActive}
                    onChange={(checked) =>
                      setAuthorFormData((prev) => ({ ...prev, isActive: checked }))
                    }
                    activeLabel="Penulis Aktif"
                    inactiveLabel="Penulis Nonaktif"
                  />
                </div>
              </div>

              <div className="nb-dialog-footer">
                <button
                  type="button"
                  className="nb-btn nb-dialog-btn-secondary"
                  onClick={() => setIsAuthorModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="nb-btn nb-dialog-btn-primary">
                  Simpan Penulis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL DIALOG: TAMBAH / UBAH PENERBIT (Zona C)
          =================================================================== */}
      {isPublisherModalOpen && (
        <div
          className="nb-dialog-scrim"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsPublisherModalOpen(false)
          }}
        >
          <div
            className="nb-dialog-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="publisher-dialog-title"
          >
            <div className="nb-dialog-header">
              <h2 id="publisher-dialog-title" className="nb-dialog-title">
                {editingPublisher ? 'Ubah Mitra Penerbit' : 'Tambah Penerbit Baru'}
              </h2>
              <button
                type="button"
                className="nb-icon-btn nb-btn"
                onClick={() => setIsPublisherModalOpen(false)}
                aria-label="Tutup form penerbit"
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  close
                </span>
              </button>
            </div>

            <form onSubmit={handleSavePublisher}>
              <div className="nb-dialog-body">
                <div className="nb-form-field">
                  <label htmlFor="pub-name-input" className="nb-form-label">
                    Nama Penerbit / Imprint <span style={{ color: 'var(--nb-pink)' }}>*</span>
                  </label>
                  <input
                    id="pub-name-input"
                    type="text"
                    maxLength={150}
                    className="nb-form-input"
                    value={publisherFormData.name}
                    onChange={(e) =>
                      setPublisherFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Contoh: Pustaka Sains Komputasi"
                    autoFocus
                  />
                  {publisherErrors.name && (
                    <div className="nb-form-error-box" role="alert">
                      <span>{publisherErrors.name}</span>
                    </div>
                  )}
                </div>

                <div className="nb-form-field">
                  <label htmlFor="pub-city-input" className="nb-form-label">
                    Kota Domisili / Kantor Pusat <span style={{ color: 'var(--nb-pink)' }}>*</span>
                  </label>
                  <input
                    id="pub-city-input"
                    type="text"
                    maxLength={100}
                    className="nb-form-input"
                    value={publisherFormData.city}
                    onChange={(e) =>
                      setPublisherFormData((prev) => ({ ...prev, city: e.target.value }))
                    }
                    placeholder="Contoh: Bandung"
                  />
                  {publisherErrors.city && (
                    <div className="nb-form-error-box" role="alert">
                      <span>{publisherErrors.city}</span>
                    </div>
                  )}
                </div>

                <div className="nb-form-grid-2">
                  <div className="nb-form-field">
                    <label htmlFor="pub-website-input" className="nb-form-label">
                      Situs Web Resmi
                    </label>
                    <input
                      id="pub-website-input"
                      type="url"
                      className="nb-form-input font-mono-nb"
                      value={publisherFormData.website}
                      onChange={(e) =>
                        setPublisherFormData((prev) => ({
                          ...prev,
                          website: e.target.value,
                        }))
                      }
                      placeholder="https://penerbit.id"
                    />
                  </div>

                  <div className="nb-form-field">
                    <label htmlFor="pub-email-input" className="nb-form-label">
                      Email Layanan Redaksi
                    </label>
                    <input
                      id="pub-email-input"
                      type="email"
                      className="nb-form-input font-mono-nb"
                      value={publisherFormData.contactEmail}
                      onChange={(e) =>
                        setPublisherFormData((prev) => ({
                          ...prev,
                          contactEmail: e.target.value,
                        }))
                      }
                      placeholder="redaksi@penerbit.id"
                    />
                  </div>
                </div>

                <div className="nb-form-field">
                  <label htmlFor="pub-desc-input" className="nb-form-label">
                    Deskripsi Singkat Penerbit
                  </label>
                  <textarea
                    id="pub-desc-input"
                    className="nb-form-textarea"
                    rows={3}
                    value={publisherFormData.description}
                    onChange={(e) =>
                      setPublisherFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Cakupan publikasi, reputasi buku teknis, dan mitra institusi..."
                  />
                </div>

                <div className="nb-form-field">
                  <label className="nb-form-label">Status Kemitraan</label>
                  <ToggleSwitch
                    checked={publisherFormData.isActive}
                    onChange={(checked) =>
                      setPublisherFormData((prev) => ({ ...prev, isActive: checked }))
                    }
                    activeLabel="Penerbit Aktif"
                    inactiveLabel="Penerbit Nonaktif"
                  />
                </div>
              </div>

              <div className="nb-dialog-footer">
                <button
                  type="button"
                  className="nb-btn nb-dialog-btn-secondary"
                  onClick={() => setIsPublisherModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="nb-btn nb-dialog-btn-primary">
                  Simpan Penerbit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 20 }}
              aria-hidden="true"
            >
              block
            </span>
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
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 20 }}
              aria-hidden="true"
            >
              block
            </span>
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
