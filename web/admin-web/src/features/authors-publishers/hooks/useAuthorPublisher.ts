import { useMemo, useState } from 'react'
import type { ToastMessage } from '../../../shared/components/ui'
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

const INITIAL_AUTHOR_FORM: AuthorFormData = {
  name: '',
  email: '',
  affiliation: '',
  bio: '',
  isActive: true,
}

const INITIAL_PUBLISHER_FORM: PublisherFormData = {
  name: '',
  city: '',
  website: '',
  contactEmail: '',
  description: '',
  isActive: true,
}

export function useAuthorPublisher() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('AUTHORS')

  const [authors, setAuthors] = useState<AuthorListItem[]>(MOCK_AUTHORS)
  const [authorFilters, setAuthorFilters] = useState<AuthorTableFilters>({
    search: '',
    status: 'ALL',
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    limit: 5,
  })

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

  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState<boolean>(false)
  const [editingAuthor, setEditingAuthor] = useState<AuthorListItem | null>(null)
  const [authorFormData, setAuthorFormData] = useState<AuthorFormData>(INITIAL_AUTHOR_FORM)
  const [authorErrors, setAuthorErrors] = useState<Record<string, string>>({})

  const [isPublisherModalOpen, setIsPublisherModalOpen] = useState<boolean>(false)
  const [editingPublisher, setEditingPublisher] = useState<PublisherListItem | null>(null)
  const [publisherFormData, setPublisherFormData] = useState<PublisherFormData>(
    INITIAL_PUBLISHER_FORM,
  )
  const [publisherErrors, setPublisherErrors] = useState<Record<string, string>>({})

  const [authorToDelete, setAuthorToDelete] = useState<AuthorListItem | null>(null)
  const [publisherToDelete, setPublisherToDelete] = useState<PublisherListItem | null>(null)

  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (type: 'success' | 'error' | 'info' | 'warning', text: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, type, text }])
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

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

  const handleOpenAddAuthor = () => {
    setEditingAuthor(null)
    setAuthorFormData({
      ...INITIAL_AUTHOR_FORM,
      name: 'DATA SIMULASI — ',
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

  const handleOpenAddPublisher = () => {
    setEditingPublisher(null)
    setPublisherFormData({
      ...INITIAL_PUBLISHER_FORM,
      name: 'DATA SIMULASI — ',
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

  const handleRefreshDirectory = (message: string) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      addToast('info', message)
    }, 400)
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

  return {
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
  }
}
