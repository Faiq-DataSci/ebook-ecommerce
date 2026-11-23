// Tipe data Domain Penulis & Penerbit (Admin Web)
// Sesuai design.md Zona C dan konvensi proyek

export type AuthorStatus = 'AKTIF' | 'NONAKTIF'
export type PublisherStatus = 'AKTIF' | 'NONAKTIF'

export type ActiveTab = 'AUTHORS' | 'PUBLISHERS'

export interface AuthorListItem {
  id: string
  name: string // DATA SIMULASI
  email: string
  affiliation: string // institusi, keahlian, atau gelar
  bio: string | null
  ebookCount: number
  isActive: boolean
  createdAt: string
}

export interface AuthorFormData {
  name: string
  email: string
  affiliation: string
  bio: string
  isActive: boolean
}

export interface PublisherListItem {
  id: string
  name: string // DATA SIMULASI
  city: string
  website: string | null
  contactEmail: string | null
  description: string | null
  ebookCount: number
  isActive: boolean
  createdAt: string
}

export interface PublisherFormData {
  name: string
  city: string
  website: string
  contactEmail: string
  description: string
  isActive: boolean
}

export interface AuthorTableFilters {
  search: string
  status: 'ALL' | AuthorStatus
  sortBy: 'name' | 'ebookCount' | 'createdAt'
  sortOrder: 'asc' | 'desc'
  page: number
  limit: number
}

export interface PublisherTableFilters {
  search: string
  status: 'ALL' | PublisherStatus
  sortBy: 'name' | 'city' | 'ebookCount' | 'createdAt'
  sortOrder: 'asc' | 'desc'
  page: number
  limit: number
}
