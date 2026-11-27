// Tipe data Domain Katalog & Produk (Admin Web)

export type EbookStatus = 'AKTIF' | 'ARSIP'

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
  storagePath?: string | null
  description?: string | null
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
  coverUrl?: string | null
  pdfFileName?: string
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
