import type { CategoryListItem, CategoryOption } from '../types/category'

export const MOCK_CATEGORIES: CategoryListItem[] = [
  {
    id: '00000000-0000-4000-8000-000000000101',
    name: 'DATA SIMULASI — Rekayasa Perangkat Lunak',
    slug: 'rekayasa-perangkat-lunak',
    description:
      'Buku panduan desain arsitektur, clean code, dan metodologi agile modern.',
    isActive: true,
    ebookCount: 4,
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: '00000000-0000-4000-8000-000000000102',
    name: 'DATA SIMULASI — Sains Data & Kecerdasan Buatan',
    slug: 'sains-data-kecerdasan-buatan',
    description:
      'Statistika terapan, machine learning, deep learning, dan sistem rekomendasi.',
    isActive: true,
    ebookCount: 3,
    createdAt: '2026-01-12T09:30:00Z',
  },
  {
    id: '00000000-0000-4000-8000-000000000103',
    name: 'DATA SIMULASI — Basis Data & Cloud',
    slug: 'basis-data-cloud',
    description:
      'Optimasi query PostgreSQL, arsitektur serverless, dan penyimpanan terdistribusi.',
    isActive: true,
    ebookCount: 3,
    createdAt: '2026-01-15T11:00:00Z',
  },
  {
    id: '00000000-0000-4000-8000-000000000104',
    name: 'DATA SIMULASI — Keamanan Siber',
    slug: 'keamanan-siber',
    description:
      'Analisis kerentanan aplikasi web, enkripsi data, dan mitigasi kebocoran kredensial.',
    isActive: true,
    ebookCount: 2,
    createdAt: '2026-01-18T14:15:00Z',
  },
  {
    id: '00000000-0000-4000-8000-000000000105',
    name: 'DATA SIMULASI — Desain UI/UX & Interaksi Manusia',
    slug: 'desain-ui-ux',
    description:
      'Eksplorasi neubrutalism, aksesibilitas WCAG, micro-interaction, dan design system.',
    isActive: false,
    ebookCount: 1,
    createdAt: '2026-01-20T16:45:00Z',
  },
  {
    id: '00000000-0000-4000-8000-000000000106',
    name: 'DATA SIMULASI — Kategori Arsip Tanpa Produk',
    slug: 'kategori-arsip-kosong',
    description:
      'Kategori simulasi tanpa keterkaitan produk untuk verifikasi alur hapus kategori.',
    isActive: false,
    ebookCount: 0,
    createdAt: '2026-02-01T10:00:00Z',
  },
]

export const MOCK_CATEGORY_OPTIONS: CategoryOption[] = MOCK_CATEGORIES.map(
  (category) => ({
    id: category.id,
    name: category.name,
  }),
)
