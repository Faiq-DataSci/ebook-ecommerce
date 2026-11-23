// Tipe data Domain Katalog & Produk (Admin Web)
// Sesuai model Prisma Ebook & Category dan spesifikasi design.md Zona C

export type EbookStatus = 'AKTIF' | 'ARSIP'

export type CategoryStatus = 'AKTIF' | 'NONAKTIF'

export interface EbookListItem {
  id: string
  title: string // DATA SIMULASI
  author: string // DATA SIMULASI
  categoryId: string
  categoryName: string
  price: string // Format "Rp 75.000" untuk tampilan
  priceNumeric: number // Nilai numerik untuk sorting
  ratingAvg: string // "4.80" atau "Belum ada rating"
  salesCount: number
  pageCount: number | null
  publishedYear: number | null
  isActive: boolean
  coverUrl: string | null
  createdAt: string // ISO string untuk sorting
}

export interface EbookFormData {
  categoryId: string
  title: string
  author: string
  description: string
  price: string // format input "75000"
  pageCount: string
  publishedYear: string
  isActive: boolean
  coverFileName?: string
  pdfFileName?: string
}

export interface CategoryListItem {
  id: string
  name: string // DATA SIMULASI
  slug: string
  description: string | null
  isActive: boolean
  ebookCount: number // Jumlah e-book berelasi untuk proteksi hapus
  createdAt: string
}

export interface CategoryFormData {
  name: string
  slug: string
  description: string
  isActive: boolean
}

export interface EbookTableFilters {
  search: string
  categoryId: string // '' = semua
  status: 'ALL' | EbookStatus
  sortBy: 'title' | 'price' | 'salesCount' | 'createdAt'
  sortOrder: 'asc' | 'desc'
  page: number
  limit: number
}

export interface CategoryTableFilters {
  search: string
  status: 'ALL' | CategoryStatus
  sortBy: 'name' | 'slug' | 'ebookCount' | 'createdAt'
  sortOrder: 'asc' | 'desc'
  page: number
  limit: number
}

export interface CategoryOption {
  id: string
  name: string
}
