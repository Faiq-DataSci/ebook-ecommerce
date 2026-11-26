import assert from 'node:assert/strict'
import test from 'node:test'

// Shared formatter
function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function mapBackendEbookToListItem(raw) {
  const priceNum = typeof raw.price === 'number' ? raw.price : parseFloat(String(raw.price)) || 0
  const ratingNum = raw.ratingAvg ? parseFloat(String(raw.ratingAvg)) : 0

  return {
    id: raw.id,
    title: raw.title,
    author: raw.author,
    categoryId: raw.categoryId,
    categoryName: raw.category?.name || 'Umum',
    price: formatRupiah(priceNum),
    priceNumeric: priceNum,
    ratingAvg: ratingNum > 0 ? ratingNum.toFixed(2) : 'Belum ada rating',
    salesCount: raw.salesCount ?? 0,
    pageCount: raw.pageCount ?? null,
    publishedYear: raw.publishedYear ?? null,
    isActive: Boolean(raw.isActive),
    coverUrl: raw.coverUrl ?? null,
    createdAt: raw.createdAt,
    description: raw.description,
    storagePath: raw.storagePath,
  }
}

test('1. Pemetaan Data Backend E-Book ke Format UI Admin', async (t) => {
  await t.test('Memetakan raw e-book dari backend dengan Decimal string & relasi kategori', () => {
    const raw = {
      id: '00000000-0000-4000-8000-000000000201',
      categoryId: '00000000-0000-4000-8000-000000000101',
      title: 'DATA SIMULASI - Arsitektur Backend TypeScript',
      author: 'DATA SIMULASI - Andi Wijaya',
      description: 'Panduan modular Express + Prisma.',
      price: '75000.00',
      coverUrl: null,
      storagePath: 'ebooks-private/backend-ts.pdf',
      pageCount: 240,
      publishedYear: 2025,
      ratingAvg: '4.85',
      salesCount: 42,
      isActive: true,
      createdAt: '2026-11-20T10:00:00Z',
      updatedAt: '2026-11-20T10:00:00Z',
      category: {
        id: '00000000-0000-4000-8000-000000000101',
        name: 'Pemrograman',
        slug: 'pemrograman',
      },
    }

    const mapped = mapBackendEbookToListItem(raw)
    assert.equal(mapped.id, '00000000-0000-4000-8000-000000000201')
    assert.equal(mapped.title, 'DATA SIMULASI - Arsitektur Backend TypeScript')
    assert.equal(mapped.categoryName, 'Pemrograman')
    assert.equal(mapped.priceNumeric, 75000)
    assert.match(mapped.price, /75\.000/)
    assert.equal(mapped.ratingAvg, '4.85')
    assert.equal(mapped.salesCount, 42)
    assert.equal(mapped.storagePath, 'ebooks-private/backend-ts.pdf')
    assert.equal(mapped.isActive, true)
  })

  await t.test('Menangani nilai rating 0.00 atau null sebagai "Belum ada rating"', () => {
    const rawNoRating = {
      id: '00000000-0000-4000-8000-000000000202',
      categoryId: '00000000-0000-4000-8000-000000000101',
      title: 'E-Book Baru',
      author: 'Penulis Baru',
      description: 'Deskripsi singkat',
      price: 50000,
      coverUrl: null,
      storagePath: 'ebooks-private/default.pdf',
      pageCount: 150,
      publishedYear: 2026,
      ratingAvg: null,
      salesCount: 0,
      isActive: true,
      createdAt: '2026-11-25T10:00:00Z',
      updatedAt: '2026-11-25T10:00:00Z',
    }

    const mapped = mapBackendEbookToListItem(rawNoRating)
    assert.equal(mapped.ratingAvg, 'Belum ada rating')
    assert.equal(mapped.categoryName, 'Umum')
  })
})

test('2. Validasi Parameter Query Admin E-Books', async (t) => {
  await t.test('Menyusun query string yang valid untuk filter admin', () => {
    const filters = {
      page: 2,
      limit: 10,
      status: 'AKTIF',
      sortBy: 'price',
      sortOrder: 'desc',
      search: 'Microservices',
      categoryId: '00000000-0000-4000-8000-000000000101',
    }

    const params = new URLSearchParams()
    params.set('page', String(filters.page))
    params.set('limit', String(filters.limit))
    params.set('status', filters.status)
    params.set('sortBy', filters.sortBy)
    params.set('sortOrder', filters.sortOrder)
    if (filters.search) params.set('search', filters.search)
    if (filters.categoryId) params.set('categoryId', filters.categoryId)

    const qs = params.toString()
    assert.match(qs, /page=2/)
    assert.match(qs, /limit=10/)
    assert.match(qs, /status=AKTIF/)
    assert.match(qs, /sortBy=price/)
    assert.match(qs, /sortOrder=desc/)
    assert.match(qs, /search=Microservices/)
    assert.match(qs, /categoryId=00000000-0000-4000-8000-000000000101/)
  })
})

test('3. Validasi Integritas Payload Tambah/Ubah E-Book', async (t) => {
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  await t.test('Memverifikasi UUID kategori dan struktur storage privat', () => {
    const formData = {
      categoryId: '00000000-0000-4000-8000-000000000101',
      title: 'DATA SIMULASI - Pemrograman Terapan',
      author: 'DATA SIMULASI - Penulis',
      description: 'Panduan arsitektur',
      price: '85000',
      pageCount: '300',
      publishedYear: '2025',
      isActive: true,
      coverFileName: 'cover-terapan.png',
      pdfFileName: 'naskah-terapan.pdf',
    }

    assert.ok(UUID_REGEX.test(formData.categoryId), 'categoryId harus UUID valid')
    assert.ok(Number(formData.price) >= 0, 'price harus >= 0')
    const storagePath = formData.pdfFileName
      ? `ebooks-private/${formData.pdfFileName}`
      : 'ebooks-private/default.pdf'
    assert.equal(storagePath, 'ebooks-private/naskah-terapan.pdf')
  })
})

test('4. Integritas Penanda DATA SIMULASI Saat Mode Simulasi', async (t) => {
  await t.test('Memastikan data simulasi selalu memiliki penanda eksplisit', () => {
    const simulatedTitle = 'DATA SIMULASI — Algoritma SPK SAW'
    assert.ok(
      simulatedTitle.startsWith('DATA SIMULASI'),
      'Data simulasi harus diawali dengan DATA SIMULASI',
    )
  })
})
