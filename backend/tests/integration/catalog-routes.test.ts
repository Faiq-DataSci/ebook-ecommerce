import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import { app } from '../../src/app.js'
import { catalogService } from '../../src/modules/catalog/catalog.service.js'

describe('Catalog Routes Integration Tests', () => {
  const mockCategories = [
    {
      id: '00000000-0000-4000-8000-000000000001',
      name: 'Teknologi',
      slug: 'teknologi',
      description: 'Kategori teknologi',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  const mockEbook = {
    id: '00000000-0000-4000-8000-000000000010',
    categoryId: '00000000-0000-4000-8000-000000000001',
    title: 'DATA SIMULASI - Arsitektur Backend Modern',
    author: 'Faiq Pratama',
    description: 'Deskripsi buku simulasi',
    price: '75000.00',
    coverUrl: 'https://example.com/cover.png',
    pageCount: 300,
    publishedYear: 2026,
    ratingAvg: '4.80',
    salesCount: 150,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      id: '00000000-0000-4000-8000-000000000001',
      name: 'Teknologi',
      slug: 'teknologi',
    },
  }

  it('GET /api/v1/categories returns list of active categories', async () => {
    vi.spyOn(catalogService, 'getCategories').mockResolvedValue(mockCategories as any)

    const res = await request(app).get('/api/v1/categories')

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data).toHaveLength(1)
    expect(res.body.data[0].name).toBe('Teknologi')
  })

  it('GET /api/v1/ebooks returns paginated list of ebooks', async () => {
    vi.spyOn(catalogService, 'getEbooks').mockResolvedValue({
      items: [mockEbook],
      meta: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    } as any)

    const res = await request(app).get('/api/v1/ebooks?page=1&limit=10')

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveLength(1)
    expect(res.body.meta.total).toBe(1)
    // CRITICAL: verify storagePath is never exposed
    expect(res.body.data[0].storagePath).toBeUndefined()
  })

  it('GET /api/v1/ebooks rejects invalid page/limit query parameters with 400', async () => {
    const res = await request(app).get('/api/v1/ebooks?page=-5')

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('GET /api/v1/ebooks/:id returns single ebook detail', async () => {
    vi.spyOn(catalogService, 'getEbookDetail').mockResolvedValue(mockEbook as any)

    const res = await request(app).get('/api/v1/ebooks/00000000-0000-4000-8000-000000000010')

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.title).toBe('DATA SIMULASI - Arsitektur Backend Modern')
    // CRITICAL: verify storagePath is never exposed
    expect(res.body.data.storagePath).toBeUndefined()
  })

  it('GET /api/v1/ebooks/:id rejects non-UUID id with 400', async () => {
    const res = await request(app).get('/api/v1/ebooks/invalid-uuid')

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })
})
