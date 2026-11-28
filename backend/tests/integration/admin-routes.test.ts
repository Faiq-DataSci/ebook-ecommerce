import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { app } from '../../src/app.js'
import { prisma } from '../../src/config/prisma.js'
import * as supabaseConfig from '../../src/config/supabase.js'
import {
  adminRepository,
  resetActiveCriteriaStore,
} from '../../src/modules/admin/admin.repository.js'
import { AppError } from '../../src/utils/app-error.js'

const mockAdminSupabase = {
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: {
        user: {
          id: 'admin-user-uuid',
          email: 'admin@ebookstore.com',
          app_metadata: { role: 'ADMIN' },
        },
      },
      error: null,
    }),
  },
}

const mockCustomerSupabase = {
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: {
        user: {
          id: 'customer-user-uuid',
          email: 'customer@ebookstore.com',
          app_metadata: { role: 'CUSTOMER' },
        },
      },
      error: null,
    }),
  },
}

describe('Admin Routes Integration Tests (/api/v1/admin)', () => {
  beforeEach(() => {
    resetActiveCriteriaStore()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    resetActiveCriteriaStore()
  })

  describe('Authentication & Authorization Guards', () => {
    it('returns 401 UNAUTHENTICATED when Authorization header is absent', async () => {
      const res = await request(app).get('/api/v1/admin/ping')

      expect(res.status).toBe(401)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('UNAUTHENTICATED')
    })

    it('returns 403 FORBIDDEN when user has role CUSTOMER', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockCustomerSupabase as any)

      const res = await request(app)
        .get('/api/v1/admin/ping')
        .set('Authorization', 'Bearer customer-token')

      expect(res.status).toBe(403)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('FORBIDDEN')
    })

    it('returns 200 when authenticated with role ADMIN on /api/v1/admin/ping', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)

      const res = await request(app)
        .get('/api/v1/admin/ping')
        .set('Authorization', 'Bearer admin-token')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toEqual({ pong: true })
    })
  })

  describe('GET /api/v1/admin/dashboard', () => {
    it('returns 401 when unauthenticated', async () => {
      const res = await request(app).get('/api/v1/admin/dashboard')

      expect(res.status).toBe(401)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('UNAUTHENTICATED')
    })

    it('returns 403 when accessed by CUSTOMER role', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockCustomerSupabase as any)

      const res = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Authorization', 'Bearer customer-token')

      expect(res.status).toBe(403)
      expect(res.body.success).toBe(false)
    })

    it('returns aggregate metrics when accessed by ADMIN role', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)
      vi.spyOn(adminRepository, 'getDashboardSummary').mockResolvedValue({
        totalRevenue: 2450000,
        ordersCount: {
          PENDING: 3,
          PAID: 15,
          FAILED: 1,
          EXPIRED: 2,
          CANCELLED: 0,
          total: 21,
        },
        activeEbooksCount: 12,
        activeCustomersCount: 28,
      })

      const res = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Authorization', 'Bearer admin-token')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.totalRevenue).toBe(2450000)
      expect(res.body.data.ordersCount.PAID).toBe(15)
      expect(res.body.data.ordersCount.total).toBe(21)
      expect(res.body.data.activeEbooksCount).toBe(12)
      expect(res.body.data.activeCustomersCount).toBe(28)
      expect(res.body.message).toBe('Ringkasan statistik dashboard berhasil dimuat')
    })
  })

  describe('GET /api/v1/admin/saw/weights', () => {
    it('returns 401 when unauthenticated', async () => {
      const res = await request(app).get('/api/v1/admin/saw/weights')

      expect(res.status).toBe(401)
      expect(res.body.success).toBe(false)
    })

    it('returns active criteria and weights when accessed by ADMIN role', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)

      const res = await request(app)
        .get('/api/v1/admin/saw/weights')
        .set('Authorization', 'Bearer admin-token')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(Array.isArray(res.body.data.criteria)).toBe(true)
      expect(res.body.data.criteria).toHaveLength(3)

      const c1 = res.body.data.criteria.find((c: any) => c.id === 'C1')
      const c2 = res.body.data.criteria.find((c: any) => c.id === 'C2')
      const c3 = res.body.data.criteria.find((c: any) => c.id === 'C3')

      expect(c1.weight).toBe(0.4)
      expect(c2.weight).toBe(0.35)
      expect(c3.weight).toBe(0.25)
      expect(res.body.data.updatedAt).toBeDefined()
    })
  })

  describe('PUT /api/v1/admin/saw/weights', () => {
    it('returns 401 when unauthenticated', async () => {
      const res = await request(app)
        .put('/api/v1/admin/saw/weights')
        .send({ criteria: [{ id: 'C1', weight: 0.5 }] })

      expect(res.status).toBe(401)
    })

    it('returns 400 VALIDATION_ERROR when criteria array is empty or weight is non-positive', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)

      const resEmpty = await request(app)
        .put('/api/v1/admin/saw/weights')
        .set('Authorization', 'Bearer admin-token')
        .send({ criteria: [] })

      expect(resEmpty.status).toBe(400)
      expect(resEmpty.body.error.code).toBe('VALIDATION_ERROR')

      const resNegative = await request(app)
        .put('/api/v1/admin/saw/weights')
        .set('Authorization', 'Bearer admin-token')
        .send({ criteria: [{ id: 'C1', weight: -0.1 }] })

      expect(resNegative.status).toBe(400)
      expect(resNegative.body.error.code).toBe('VALIDATION_ERROR')
    })

    it('returns 400 SAW_CONFIGURATION_INVALID when total weights do not equal 1.0', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)

      // Total = 0.5 + 0.35 + 0.25 = 1.1 != 1.0
      const res = await request(app)
        .put('/api/v1/admin/saw/weights')
        .set('Authorization', 'Bearer admin-token')
        .send({
          criteria: [
            { id: 'C1', weight: 0.5 },
          ],
        })

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('SAW_CONFIGURATION_INVALID')
      expect(res.body.error.message).toContain('Total bobot kriteria SAW harus sama dengan 1.0')
    })

    it('returns 200 and updates active SAW criteria when weights are valid and sum to 1.0', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)

      // Total = 0.3 + 0.5 + 0.2 = 1.0
      const res = await request(app)
        .put('/api/v1/admin/saw/weights')
        .set('Authorization', 'Bearer admin-token')
        .send({
          criteria: [
            { id: 'C1', weight: 0.3 },
            { id: 'C2', weight: 0.5 },
            { id: 'C3', weight: 0.2 },
          ],
        })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.message).toBe('Bobot kriteria SAW berhasil diperbarui')

      const c1 = res.body.data.criteria.find((c: any) => c.id === 'C1')
      const c2 = res.body.data.criteria.find((c: any) => c.id === 'C2')
      const c3 = res.body.data.criteria.find((c: any) => c.id === 'C3')

      expect(c1.weight).toBe(0.3)
      expect(c2.weight).toBe(0.5)
      expect(c3.weight).toBe(0.2)

      // Verifikasi bahwa GET berikutnya langsung membaca bobot yang baru
      const getRes = await request(app)
        .get('/api/v1/admin/saw/weights')
        .set('Authorization', 'Bearer admin-token')

      expect(getRes.status).toBe(200)
      const getC1 = getRes.body.data.criteria.find((c: any) => c.id === 'C1')
      expect(getC1.weight).toBe(0.3)
    })

    it('returns 200 when bulk replacing criteria with added fields and inactive criterion', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)

      const res = await request(app)
        .put('/api/v1/admin/saw/weights')
        .set('Authorization', 'Bearer admin-token')
        .send({
          replaceAll: true,
          criteria: [
            { id: 'C1', name: 'Harga Kompetitif', field: 'price', type: 'COST', weight: 0.3, isActive: true },
            { id: 'C2', name: 'Rating Pembaca', field: 'ratingAvg', type: 'BENEFIT', weight: 0.3, isActive: true },
            { id: 'C3', name: 'Volume Penjualan', field: 'salesCount', type: 'BENEFIT', weight: 0.25, isActive: true },
            { id: 'C4', name: 'Ketebalan Halaman', field: 'pageCount', type: 'BENEFIT', weight: 0.15, isActive: true },
            { id: 'C5', name: 'Tahun Terbit', field: 'publishedYear', type: 'BENEFIT', weight: 0, isActive: false },
          ],
        })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.criteria).toHaveLength(5)
      expect(res.body.data.criteria.find((c: any) => c.id === 'C4')).toMatchObject({
        name: 'Ketebalan Halaman',
        field: 'pageCount',
        type: 'BENEFIT',
        weight: 0.15,
        isActive: true,
      })
      expect(res.body.data.criteria.find((c: any) => c.id === 'C5')).toMatchObject({
        field: 'publishedYear',
        weight: 0,
        isActive: false,
      })
    })

    it('returns 400 SAW_CONFIGURATION_INVALID when bulk replace has duplicate criterion IDs', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)

      const res = await request(app)
        .put('/api/v1/admin/saw/weights')
        .set('Authorization', 'Bearer admin-token')
        .send({
          replaceAll: true,
          criteria: [
            { id: 'C1', name: 'Harga', field: 'price', type: 'COST', weight: 0.5, isActive: true },
            { id: 'c1', name: 'Rating', field: 'ratingAvg', type: 'BENEFIT', weight: 0.5, isActive: true },
          ],
        })

      expect(res.status).toBe(400)
      expect(res.body.error.code).toBe('SAW_CONFIGURATION_INVALID')
      expect(res.body.error.message).toContain('duplikat')
    })
  })

  describe('Admin E-Books Management Endpoints', () => {
    it('returns 200 with list of ebooks on GET /api/v1/admin/ebooks', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)
      vi.spyOn(adminRepository, 'findAdminEbooks').mockResolvedValueOnce({
        items: [
          {
            id: 'ebk-test-uuid',
            categoryId: 'cat-test-uuid',
            title: 'Buku Uji Admin',
            author: 'Penulis Uji',
            description: 'Deskripsi uji',
            price: 50000 as any,
            coverUrl: null,
            storagePath: 'ebooks-private/test.pdf',
            pageCount: 200,
            publishedYear: 2025,
            ratingAvg: 4.5 as any,
            salesCount: 10,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            category: { id: 'cat-test-uuid', name: 'Rekayasa', slug: 'rekayasa' },
          },
        ],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
      } as any)

      const res = await request(app)
        .get('/api/v1/admin/ebooks?page=1&limit=10&status=ALL')
        .set('Authorization', 'Bearer admin-token')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.length).toBe(1)
      expect(res.body.data[0].title).toBe('Buku Uji Admin')
    })

    it('returns 201 when creating new ebook on POST /api/v1/admin/ebooks', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)
      const mockCreated = {
        id: 'ebk-new-uuid',
        categoryId: 'a0000000-0000-4000-8000-000000000001',
        title: 'Buku Baru Sukses',
        author: 'Penulis Baru',
        description: 'Deskripsi lengkap buku',
        price: 75000 as any,
        coverUrl: 'https://example.com/cover.png',
        storagePath: 'ebooks-private/buku.pdf',
        pageCount: 240,
        publishedYear: 2025,
        ratingAvg: 0 as any,
        salesCount: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: { id: 'a0000000-0000-4000-8000-000000000001', name: 'Rekayasa', slug: 'rekayasa' },
      }
      vi.spyOn(adminRepository, 'createEbook').mockResolvedValueOnce(mockCreated as any)

      const res = await request(app)
        .post('/api/v1/admin/ebooks')
        .set('Authorization', 'Bearer admin-token')
        .send({
          categoryId: 'a0000000-0000-4000-8000-000000000001',
          title: 'Buku Baru Sukses',
          author: 'Penulis Baru',
          description: 'Deskripsi lengkap buku',
          price: 75000,
          coverUrl: 'https://example.com/cover.png',
          storagePath: 'ebooks-private/buku.pdf',
          pageCount: 240,
          publishedYear: 2025,
          isActive: true,
        })

      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data.title).toBe('Buku Baru Sukses')
      expect(res.body.message).toContain('berhasil disimpan')
    })

    it('returns 200 when updating ebook on PUT /api/v1/admin/ebooks/:id', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)
      vi.spyOn(adminRepository, 'updateEbook').mockResolvedValueOnce({
        id: 'a0000000-0000-4000-8000-000000000002',
        title: 'Judul Diperbarui',
        price: 90000 as any,
      } as any)

      const res = await request(app)
        .put('/api/v1/admin/ebooks/a0000000-0000-4000-8000-000000000002')
        .set('Authorization', 'Bearer admin-token')
        .send({ title: 'Judul Diperbarui', price: 90000 })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.title).toBe('Judul Diperbarui')
    })

    it('returns 200 when toggling status on PATCH /api/v1/admin/ebooks/:id/status', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)
      vi.spyOn(adminRepository, 'toggleEbookStatus').mockResolvedValueOnce({
        id: 'a0000000-0000-4000-8000-000000000002',
        isActive: false,
      } as any)

      const res = await request(app)
        .patch('/api/v1/admin/ebooks/a0000000-0000-4000-8000-000000000002/status')
        .set('Authorization', 'Bearer admin-token')
        .send({ isActive: false })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.isActive).toBe(false)
      expect(res.body.message).toContain('diarsipkan')
    })
  })

  describe('Admin Categories CRUD Endpoints', () => {
    it('returns 200 with list of categories on GET /api/v1/admin/categories', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)
      vi.spyOn(adminRepository, 'findAdminCategories').mockResolvedValueOnce({
        items: [
          {
            id: 'a0000000-0000-4000-8000-000000000010',
            name: 'Teknologi',
            slug: 'teknologi',
            description: 'Buku seputar teknologi dan rekayasa perangkat lunak',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            _count: { ebooks: 5 },
          },
        ],
        meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
      } as any)

      const res = await request(app)
        .get('/api/v1/admin/categories?page=1&limit=20&status=ALL')
        .set('Authorization', 'Bearer admin-token')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveLength(1)
      expect(res.body.data[0].slug).toBe('teknologi')
      expect(res.body.data[0]._count.ebooks).toBe(5)
    })

    it('returns 201 when creating category on POST /api/v1/admin/categories', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)
      vi.spyOn(adminRepository, 'createCategory').mockResolvedValueOnce({
        id: 'a0000000-0000-4000-8000-000000000011',
        name: 'Kecerdasan Buatan',
        slug: 'kecerdasan-buatan',
        description: 'E-book AI dan Machine Learning',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { ebooks: 0 },
      } as any)

      const res = await request(app)
        .post('/api/v1/admin/categories')
        .set('Authorization', 'Bearer admin-token')
        .send({
          name: 'Kecerdasan Buatan',
          description: 'E-book AI dan Machine Learning',
        })

      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data.slug).toBe('kecerdasan-buatan')
    })

    it('returns 200 when updating category on PUT /api/v1/admin/categories/:id', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)
      vi.spyOn(adminRepository, 'updateCategory').mockResolvedValueOnce({
        id: 'a0000000-0000-4000-8000-000000000011',
        name: 'AI & Data Science',
        slug: 'ai-data-science',
        isActive: true,
        _count: { ebooks: 2 },
      } as any)

      const res = await request(app)
        .put('/api/v1/admin/categories/a0000000-0000-4000-8000-000000000011')
        .set('Authorization', 'Bearer admin-token')
        .send({ name: 'AI & Data Science', slug: 'ai-data-science' })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.name).toBe('AI & Data Science')
    })

    it('returns 200 when toggling status on PATCH /api/v1/admin/categories/:id/status', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)
      vi.spyOn(adminRepository, 'toggleCategoryStatus').mockResolvedValueOnce({
        id: 'a0000000-0000-4000-8000-000000000011',
        isActive: false,
      } as any)

      const res = await request(app)
        .patch('/api/v1/admin/categories/a0000000-0000-4000-8000-000000000011/status')
        .set('Authorization', 'Bearer admin-token')
        .send({ isActive: false })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.isActive).toBe(false)
      expect(res.body.message).toContain('diarsipkan')
    })

    it('returns 200 when updating category on PATCH /api/v1/admin/categories/:id', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)
      vi.spyOn(adminRepository, 'updateCategory').mockResolvedValueOnce({
        id: 'a0000000-0000-4000-8000-000000000011',
        name: 'Rekayasa Data',
        slug: 'rekayasa-data',
        isActive: true,
        _count: { ebooks: 0 },
      } as any)

      const res = await request(app)
        .patch('/api/v1/admin/categories/a0000000-0000-4000-8000-000000000011')
        .set('Authorization', 'Bearer admin-token')
        .send({ name: 'Rekayasa Data', slug: 'rekayasa-data' })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.slug).toBe('rekayasa-data')
    })

    it('returns 401 when deleting category without token and 403 for CUSTOMER role', async () => {
      const unauthRes = await request(app).delete(
        '/api/v1/admin/categories/a0000000-0000-4000-8000-000000000011',
      )
      expect(unauthRes.status).toBe(401)
      expect(unauthRes.body.error.code).toBe('UNAUTHENTICATED')

      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockCustomerSupabase as any)
      const forbiddenRes = await request(app)
        .delete('/api/v1/admin/categories/a0000000-0000-4000-8000-000000000011')
        .set('Authorization', 'Bearer customer-token')
      expect(forbiddenRes.status).toBe(403)
      expect(forbiddenRes.body.error.code).toBe('FORBIDDEN')
    })

    it('returns 400 when deleting category with invalid UUID', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)

      const res = await request(app)
        .delete('/api/v1/admin/categories/bukan-uuid')
        .set('Authorization', 'Bearer admin-token')

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('VALIDATION_ERROR')
    })

    it('returns 409 CONFLICT when deleting category that is still referenced by e-books', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)
      vi.spyOn(prisma.category, 'findUnique').mockResolvedValueOnce({
        id: 'a0000000-0000-4000-8000-000000000010',
        name: 'Teknologi',
        slug: 'teknologi',
        description: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)
      vi.spyOn(prisma.ebook, 'count').mockResolvedValueOnce(3)

      const res = await request(app)
        .delete('/api/v1/admin/categories/a0000000-0000-4000-8000-000000000010')
        .set('Authorization', 'Bearer admin-token')

      expect(res.status).toBe(409)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('CONFLICT')
      expect(res.body.error.message).toContain('3 e-book')
    })

    it('returns 404 NOT_FOUND when deleting non-existent category', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)
      vi.spyOn(prisma.category, 'findUnique').mockResolvedValueOnce(null)

      const res = await request(app)
        .delete('/api/v1/admin/categories/a0000000-0000-4000-8000-000000000099')
        .set('Authorization', 'Bearer admin-token')

      expect(res.status).toBe(404)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('NOT_FOUND')
    })

    it('returns 200 when deleting unused category on DELETE /api/v1/admin/categories/:id', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)
      const categoryRecord = {
        id: 'a0000000-0000-4000-8000-000000000012',
        name: 'Kategori Kosong',
        slug: 'kategori-kosong',
        description: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      vi.spyOn(prisma.category, 'findUnique').mockResolvedValueOnce(categoryRecord as any)
      vi.spyOn(prisma.ebook, 'count').mockResolvedValueOnce(0)
      vi.spyOn(prisma.category, 'delete').mockResolvedValueOnce(categoryRecord as any)

      const res = await request(app)
        .delete('/api/v1/admin/categories/a0000000-0000-4000-8000-000000000012')
        .set('Authorization', 'Bearer admin-token')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.id).toBe(categoryRecord.id)
    })
  })

  describe('Admin E-Books PATCH & Soft-Delete Archive + Public Visibility', () => {
    it('returns 200 on PATCH /api/v1/admin/ebooks/:id and rejects price < 0 with 400', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)

      const badRes = await request(app)
        .patch('/api/v1/admin/ebooks/b0000000-0000-4000-8000-000000000001')
        .set('Authorization', 'Bearer admin-token')
        .send({ price: -5000 })

      expect(badRes.status).toBe(400)
      expect(badRes.body.error.code).toBe('VALIDATION_ERROR')

      vi.spyOn(adminRepository, 'updateEbook').mockResolvedValueOnce({
        id: 'b0000000-0000-4000-8000-000000000001',
        title: 'Judul Revisi PATCH',
        price: '85000.00',
        isActive: true,
      } as any)

      const okRes = await request(app)
        .patch('/api/v1/admin/ebooks/b0000000-0000-4000-8000-000000000001')
        .set('Authorization', 'Bearer admin-token')
        .send({ title: 'Judul Revisi PATCH', price: 85000 })

      expect(okRes.status).toBe(200)
      expect(okRes.body.success).toBe(true)
      expect(okRes.body.data.title).toBe('Judul Revisi PATCH')
    })

    it('soft-deletes (archives) e-book on DELETE /api/v1/admin/ebooks/:id and returns 404 when missing', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)

      vi.spyOn(adminRepository, 'archiveEbook').mockResolvedValueOnce({
        id: 'b0000000-0000-4000-8000-000000000001',
        title: 'E-Book Diarsipkan',
        isActive: false,
      } as any)

      const okRes = await request(app)
        .delete('/api/v1/admin/ebooks/b0000000-0000-4000-8000-000000000001')
        .set('Authorization', 'Bearer admin-token')

      expect(okRes.status).toBe(200)
      expect(okRes.body.success).toBe(true)
      expect(okRes.body.data.isActive).toBe(false)

      vi.spyOn(adminRepository, 'archiveEbook').mockRejectedValueOnce(
        new AppError(404, 'NOT_FOUND', 'E-book tidak ditemukan'),
      )

      const missingRes = await request(app)
        .delete('/api/v1/admin/ebooks/b0000000-0000-4000-8000-000000000099')
        .set('Authorization', 'Bearer admin-token')

      expect(missingRes.status).toBe(404)
      expect(missingRes.body.error.code).toBe('NOT_FOUND')
    })

    it('makes category and e-book created by admin immediately visible on public GET without storagePath', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)

      const createdCategory = {
        id: 'c0000000-0000-4000-8000-000000000001',
        name: 'Sistem Informasi',
        slug: 'sistem-informasi',
        description: 'Kategori uji sinkronisasi publik',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const createdEbook = {
        id: 'd0000000-0000-4000-8000-000000000001',
        categoryId: createdCategory.id,
        title: 'Arsitektur Enterprise Modern',
        author: 'Tim Akademik',
        description: 'Panduan lengkap arsitektur sistem informasi',
        price: '99000.00',
        coverUrl: null,
        storagePath: 'ebooks-private/secret-enterprise.pdf',
        pageCount: 250,
        publishedYear: 2026,
        ratingAvg: '0.00',
        salesCount: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          id: createdCategory.id,
          name: createdCategory.name,
          slug: createdCategory.slug,
        },
      }

      // Simulasi shared DB table via Prisma spies
      const categoryTable: Array<typeof createdCategory> = []
      const ebookTable: Array<typeof createdEbook> = []

      vi.spyOn(prisma.category, 'findFirst').mockResolvedValueOnce(null)
      vi.spyOn(prisma.category, 'create').mockImplementationOnce((async () => {
        categoryTable.push(createdCategory)
        return { ...createdCategory, _count: { ebooks: 0 } }
      }) as any)
      vi.spyOn(prisma.category, 'findUnique').mockResolvedValueOnce(createdCategory as any)
      vi.spyOn(prisma.ebook, 'create').mockImplementationOnce((async () => {
        ebookTable.push(createdEbook)
        return createdEbook
      }) as any)

      vi.spyOn(prisma.category, 'findMany').mockImplementationOnce((async () => {
        return categoryTable.filter((c) => c.isActive)
      }) as any)
      vi.spyOn(prisma.ebook, 'findMany').mockImplementationOnce((async (args: any) => {
        // Pastikan query publik memakai select tanpa storagePath dan filter isActive=true
        expect(args.where.isActive).toBe(true)
        expect(args.select.storagePath).toBeUndefined()
        return ebookTable
          .filter((b) => b.isActive)
          .map(({ storagePath: _hidden, ...publicDto }) => publicDto)
      }) as any)
      vi.spyOn(prisma.ebook, 'count').mockImplementationOnce((async () => {
        return ebookTable.filter((b) => b.isActive).length
      }) as any)

      // 1. Admin POST kategori
      const postCat = await request(app)
        .post('/api/v1/admin/categories')
        .set('Authorization', 'Bearer admin-token')
        .send({ name: 'Sistem Informasi', description: 'Kategori uji sinkronisasi publik' })
      expect(postCat.status).toBe(201)

      // 2. Admin POST e-book
      const postBook = await request(app)
        .post('/api/v1/admin/ebooks')
        .set('Authorization', 'Bearer admin-token')
        .send({
          categoryId: createdCategory.id,
          title: 'Arsitektur Enterprise Modern',
          author: 'Tim Akademik',
          description: 'Panduan lengkap arsitektur sistem informasi',
          price: 99000,
          storagePath: 'ebooks-private/secret-enterprise.pdf',
        })
      expect(postBook.status).toBe(201)
      expect(postBook.body.data.storagePath).toBe('ebooks-private/secret-enterprise.pdf')

      // 3. Publik GET /api/v1/categories langsung membaca kategori baru
      const pubCats = await request(app).get('/api/v1/categories')
      expect(pubCats.status).toBe(200)
      expect(pubCats.body.data).toHaveLength(1)
      expect(pubCats.body.data[0].slug).toBe('sistem-informasi')

      // 4. Publik GET /api/v1/ebooks langsung membaca e-book baru TANPA storagePath
      const pubBooks = await request(app).get('/api/v1/ebooks')
      expect(pubBooks.status).toBe(200)
      expect(pubBooks.body.data).toHaveLength(1)
      expect(pubBooks.body.data[0].title).toBe('Arsitektur Enterprise Modern')
      expect(pubBooks.body.data[0].storagePath).toBeUndefined()
    })
  })

  describe('Admin E-Book Multipart PDF Upload (/api/v1/admin/ebooks/upload-pdf)', () => {
    it('rejects non-PDF upload with 400 VALIDATION_ERROR', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)

      const res = await request(app)
        .post('/api/v1/admin/ebooks/upload-pdf')
        .set('Authorization', 'Bearer admin-token')
        .attach('pdfFile', Buffer.from('plain text file'), {
          filename: 'catatan.txt',
          contentType: 'text/plain',
        })

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('VALIDATION_ERROR')
    })

    it('rejects fake PDF without %PDF- magic header with 400 VALIDATION_ERROR', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)

      const res = await request(app)
        .post('/api/v1/admin/ebooks/upload-pdf')
        .set('Authorization', 'Bearer admin-token')
        .attach('pdfFile', Buffer.from('not-a-real-pdf'), {
          filename: 'palsu.pdf',
          contentType: 'application/pdf',
        })

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('VALIDATION_ERROR')
    })

    it('uploads valid PDF to private Supabase Storage bucket and returns storagePath (201)', async () => {
      const uploadMock = vi.fn().mockResolvedValue({
        data: { path: 'ebooks/1795700000000-test-buku-contoh.pdf' },
        error: null,
      })
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue({
        ...mockAdminSupabase,
        storage: {
          from: vi.fn().mockReturnValue({ upload: uploadMock }),
        },
      } as any)

      const res = await request(app)
        .post('/api/v1/admin/ebooks/upload-pdf')
        .set('Authorization', 'Bearer admin-token')
        .attach('pdfFile', Buffer.from('%PDF-1.4\n%Valid Dummy PDF\n%%EOF'), {
          filename: 'Buku Contoh.pdf',
          contentType: 'application/pdf',
        })

      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data.storagePath).toBe('ebooks/1795700000000-test-buku-contoh.pdf')
      expect(res.body.data.bucket).toBe('ebooks-private')
      expect(uploadMock).toHaveBeenCalledTimes(1)
    })

    it('supports multipart/form-data directly on POST /api/v1/admin/ebooks', async () => {
      const uploadMock = vi.fn().mockResolvedValue({
        data: { path: 'ebooks/1795700000001-direct-multipart.pdf' },
        error: null,
      })
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue({
        ...mockAdminSupabase,
        storage: {
          from: vi.fn().mockReturnValue({ upload: uploadMock }),
        },
      } as any)
      vi.spyOn(adminRepository, 'createEbook').mockResolvedValueOnce({
        id: 'e0000000-0000-4000-8000-000000000001',
        title: 'E-Book Multipart Langsung',
        storagePath: 'ebooks/1795700000001-direct-multipart.pdf',
        isActive: true,
      } as any)

      const res = await request(app)
        .post('/api/v1/admin/ebooks')
        .set('Authorization', 'Bearer admin-token')
        .field('categoryId', 'a0000000-0000-4000-8000-000000000010')
        .field('title', 'E-Book Multipart Langsung')
        .field('author', 'Tim Penguji')
        .field('description', 'Deskripsi multipart upload')
        .field('price', '70000')
        .field('isActive', 'true')
        .attach('pdfFile', Buffer.from('%PDF-1.4\n%Multipart Ebook\n%%EOF'), {
          filename: 'direct-multipart.pdf',
          contentType: 'application/pdf',
        })

      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data.storagePath).toBe('ebooks/1795700000001-direct-multipart.pdf')
      expect(uploadMock).toHaveBeenCalledTimes(1)
    })

    it('returns 400 when POST /api/v1/admin/ebooks/upload-cover has no coverFile', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)

      const res = await request(app)
        .post('/api/v1/admin/ebooks/upload-cover')
        .set('Authorization', 'Bearer admin-token')

      expect(res.status).toBe(400)
      expect(res.body.error.code).toBe('VALIDATION_ERROR')
    })

    it('returns 201 and public coverUrl when uploading valid PNG to POST /api/v1/admin/ebooks/upload-cover', async () => {
      const uploadMock = vi.fn().mockResolvedValue({
        data: { path: 'covers/1795700000002-cover-buku.png' },
        error: null,
      })
      const getPublicUrlMock = vi.fn().mockReturnValue({
        data: {
          publicUrl:
            'https://example.supabase.co/storage/v1/object/public/ebook-covers/covers/1795700000002-cover-buku.png',
        },
      })
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue({
        ...mockAdminSupabase,
        storage: {
          from: vi.fn().mockReturnValue({
            upload: uploadMock,
            getPublicUrl: getPublicUrlMock,
          }),
        },
      } as any)

      // Valid minimal PNG header (89 50 4E 47 0D 0A 1A 0A + padding >= 12 bytes)
      const validPngBuffer = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
      ])

      const res = await request(app)
        .post('/api/v1/admin/ebooks/upload-cover')
        .set('Authorization', 'Bearer admin-token')
        .attach('coverFile', validPngBuffer, {
          filename: 'Cover Buku.png',
          contentType: 'image/png',
        })

      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data.coverUrl).toContain('ebook-covers/covers/1795700000002-cover-buku.png')
      expect(res.body.data.fileName).toBe('cover-buku.png')
      expect(uploadMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('Admin Customers Management Endpoints (/api/v1/admin/customers)', () => {
    it('returns 200 with customers list and summary on GET /api/v1/admin/customers', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)
      vi.spyOn(adminRepository, 'findAdminCustomers').mockResolvedValueOnce({
        data: {
          items: [
            {
              id: 'c0000000-0000-4000-8000-000000000001',
              fullName: 'Rina Kartika',
              email: 'rina@example.com',
              phone: '081234560001',
              role: 'CUSTOMER',
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              ordersCount: 2,
              paidOrdersCount: 2,
              totalSpent: 195000,
              ownedEbooksCount: 2,
              activeAccessCount: 2,
              orders: [],
              ebookAccesses: [],
            },
          ],
          summary: {
            totalCustomers: 1,
            activeCustomers: 1,
            inactiveCustomers: 0,
            newCustomersLast30Days: 1,
          },
        },
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
      })

      const res = await request(app)
        .get('/api/v1/admin/customers?page=1&limit=10')
        .set('Authorization', 'Bearer admin-token')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.items).toHaveLength(1)
      expect(res.body.data.summary.activeCustomers).toBe(1)
    })

    it('returns 200 with customer detail on GET /api/v1/admin/customers/:id', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)
      vi.spyOn(adminRepository, 'findAdminCustomerById').mockResolvedValueOnce({
        id: 'c0000000-0000-4000-8000-000000000001',
        fullName: 'Rina Kartika',
        email: 'rina@example.com',
        phone: null,
        role: 'CUSTOMER',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ordersCount: 1,
        paidOrdersCount: 1,
        totalSpent: 75000,
        ownedEbooksCount: 1,
        activeAccessCount: 1,
        orders: [],
        ebookAccesses: [],
      })

      const res = await request(app)
        .get('/api/v1/admin/customers/c0000000-0000-4000-8000-000000000001')
        .set('Authorization', 'Bearer admin-token')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.email).toBe('rina@example.com')
    })

    it('returns 200 when toggling customer status on PATCH /api/v1/admin/customers/:id/status', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)
      vi.spyOn(adminRepository, 'toggleCustomerStatus').mockResolvedValueOnce({
        id: 'c0000000-0000-4000-8000-000000000001',
        fullName: 'Rina Kartika',
        email: 'rina@example.com',
        phone: null,
        role: 'CUSTOMER',
        isActive: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ordersCount: 0,
        paidOrdersCount: 0,
        totalSpent: 0,
        ownedEbooksCount: 0,
        activeAccessCount: 0,
        orders: [],
        ebookAccesses: [],
      })

      const res = await request(app)
        .patch('/api/v1/admin/customers/c0000000-0000-4000-8000-000000000001/status')
        .set('Authorization', 'Bearer admin-token')
        .send({ isActive: false })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.isActive).toBe(false)
      expect(res.body.message).toContain('dinonaktifkan')
    })
  })

  describe('Admin Orders, Payments & E-Book Access Management', () => {
    it('returns 200 with paginated orders on GET /api/v1/admin/orders', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)
      vi.spyOn(adminRepository, 'findAdminOrders').mockResolvedValueOnce({
        items: [
          {
            id: 'd0000000-0000-4000-8000-000000000001',
            orderNumber: 'ORD-20261127-001',
            customerId: 'c0000000-0000-4000-8000-000000000001',
            customerName: 'Rina Kartika',
            customerEmail: 'rina@example.com',
            customerPhone: '081234567890',
            totalAmount: 120000,
            status: 'PAID',
            paymentMethod: 'QRIS',
            paymentGatewayRef: 'MID-TRX-001',
            paymentExpiresAt: new Date().toISOString(),
            paidAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            transactionCode: 'TRX-001',
            ebookAccessGranted: true,
            ebookAccessRevoked: false,
            accessCount: 1,
            rawWebhookPayload: null,
            items: [
              {
                ebookId: 'e0000000-0000-4000-8000-000000000001',
                title: 'Arsitektur Backend Modern',
                author: 'Budi Santoso',
                coverUrl: null,
                price: 120000,
              },
            ],
          },
        ],
        meta: { page: 1, limit: 50, total: 1, totalPages: 1 },
      })

      const res = await request(app)
        .get('/api/v1/admin/orders')
        .set('Authorization', 'Bearer admin-token')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveLength(1)
      expect(res.body.data[0].orderNumber).toBe('ORD-20261127-001')
    })

    it('returns 200 with payment audit records on GET /api/v1/admin/payments', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)
      vi.spyOn(adminRepository, 'findAdminPayments').mockResolvedValueOnce({
        items: [
          {
            id: 'p0000000-0000-4000-8000-000000000001',
            paymentCode: 'TRX-001',
            orderNumber: 'ORD-20261127-001',
            customerName: 'Rina Kartika',
            customerEmail: 'rina@example.com',
            provider: 'xendit',
            paymentMethod: 'QRIS',
            amount: 120000,
            status: 'VERIFIED',
            externalRef: 'MID-TRX-001',
            signatureVerified: true,
            receivedAt: new Date().toISOString(),
            rawWebhookPayload: { order_id: 'ORD-20261127-001' },
          },
        ],
        meta: { page: 1, limit: 50, total: 1, totalPages: 1 },
      })

      const res = await request(app)
        .get('/api/v1/admin/payments')
        .set('Authorization', 'Bearer admin-token')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveLength(1)
      expect(res.body.data[0].paymentCode).toBe('TRX-001')
    })

    it('returns 200 when revoking ebook access on PATCH /api/v1/admin/orders/:id/access', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)
      vi.spyOn(adminRepository, 'toggleOrderAccess').mockResolvedValueOnce({
        id: 'd0000000-0000-4000-8000-000000000001',
        orderNumber: 'ORD-20261127-001',
        customerId: 'c0000000-0000-4000-8000-000000000001',
        customerName: 'Rina Kartika',
        customerEmail: 'rina@example.com',
        customerPhone: null,
        totalAmount: 120000,
        status: 'PAID',
        paymentMethod: 'QRIS',
        paymentGatewayRef: 'MID-TRX-001',
        paymentExpiresAt: new Date().toISOString(),
        paidAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        transactionCode: 'TRX-001',
        ebookAccessGranted: true,
        ebookAccessRevoked: true,
        accessCount: 1,
        rawWebhookPayload: null,
        items: [],
      })

      const res = await request(app)
        .patch('/api/v1/admin/orders/d0000000-0000-4000-8000-000000000001/access')
        .set('Authorization', 'Bearer admin-token')
        .send({ isRevoked: true })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.ebookAccessRevoked).toBe(true)
      expect(res.body.message).toContain('dicabut')
    })

    it('returns 400 VALIDATION_ERROR for invalid UUID on PATCH /api/v1/admin/orders/:id/access', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)

      const res = await request(app)
        .patch('/api/v1/admin/orders/not-a-uuid/access')
        .set('Authorization', 'Bearer admin-token')
        .send({ isRevoked: true })

      expect(res.status).toBe(400)
      expect(res.body.error.code).toBe('VALIDATION_ERROR')
    })

    it('returns 200 with order details on GET /api/v1/admin/orders/:id', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)
      vi.spyOn(adminRepository, 'findAdminOrderById').mockResolvedValueOnce({
        id: 'd0000000-0000-4000-8000-000000000001',
        orderNumber: 'ORD-20261127-001',
        customerId: 'c0000000-0000-4000-8000-000000000001',
        customerName: 'Rina Kartika',
        customerEmail: 'rina@example.com',
        customerPhone: null,
        totalAmount: 120000,
        status: 'PAID',
        paymentMethod: 'QRIS',
        paymentGatewayRef: 'MID-TRX-001',
        paymentExpiresAt: new Date().toISOString(),
        paidAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        transactionCode: 'TRX-001',
        ebookAccessGranted: true,
        ebookAccessRevoked: false,
        accessCount: 1,
        rawWebhookPayload: null,
        items: [],
        payments: [
          {
            id: 'e0000000-0000-4000-8000-000000000001',
            provider: 'xendit',
            paymentMethod: 'QRIS',
            amount: 120000,
            status: 'VERIFIED',
            externalRef: 'MID-TRX-001',
            expiresAt: null,
            paidAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          },
        ],
        ebookAccesses: [
          {
            id: 'f0000000-0000-4000-8000-000000000001',
            ebookId: 'b0000000-0000-4000-8000-000000000001',
            grantedAt: new Date().toISOString(),
            isRevoked: false,
          },
        ],
      })

      const res = await request(app)
        .get('/api/v1/admin/orders/d0000000-0000-4000-8000-000000000001')
        .set('Authorization', 'Bearer admin-token')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.orderNumber).toBe('ORD-20261127-001')
      expect(res.body.data.payments).toHaveLength(1)
      expect(res.body.data.ebookAccesses).toHaveLength(1)
    })

    it('returns 404 ORDER_NOT_FOUND when order does not exist on GET /api/v1/admin/orders/:id', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)
      vi.spyOn(adminRepository, 'findAdminOrderById').mockRejectedValueOnce(
        new AppError(404, 'ORDER_NOT_FOUND', 'Pesanan tidak ditemukan'),
      )

      const res = await request(app)
        .get('/api/v1/admin/orders/d0000000-0000-4000-8000-000000000099')
        .set('Authorization', 'Bearer admin-token')

      expect(res.status).toBe(404)
      expect(res.body.error.code).toBe('ORDER_NOT_FOUND')
    })

    it('returns 200 with paginated transactions on GET /api/v1/admin/transactions', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)
      vi.spyOn(adminRepository, 'findAdminTransactions').mockResolvedValueOnce({
        items: [
          {
            id: 'a1000000-0000-4000-8000-000000000001',
            transactionCode: 'TRX-20261127-001',
            orderId: 'd0000000-0000-4000-8000-000000000001',
            orderNumber: 'ORD-20261127-001',
            orderStatus: 'PAID',
            paymentId: 'e0000000-0000-4000-8000-000000000001',
            paymentProvider: 'xendit',
            paymentMethod: 'QRIS',
            paymentRef: 'MID-TRX-001',
            customerId: 'c0000000-0000-4000-8000-000000000001',
            customerName: 'Rina Kartika',
            customerEmail: 'rina@example.com',
            amount: 120000,
            recordedAt: new Date().toISOString(),
            paidAt: new Date().toISOString(),
            items: [
              {
                ebookId: 'b0000000-0000-4000-8000-000000000001',
                title: 'Arsitektur Web Skala Besar',
                unitPrice: 120000,
              },
            ],
          },
        ],
        meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
      })

      const res = await request(app)
        .get('/api/v1/admin/transactions?startDate=2026-11-01&endDate=2026-11-30')
        .set('Authorization', 'Bearer admin-token')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveLength(1)
      expect(res.body.data[0].transactionCode).toBe('TRX-20261127-001')
      expect(res.body.meta.total).toBe(1)
    })

    it('returns 200 with sales report on GET /api/v1/admin/reports/sales', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)
      vi.spyOn(adminRepository, 'getAdminSalesReport').mockResolvedValueOnce({
        period: { startDate: '2026-11-01', endDate: '2026-11-30', groupBy: 'day' },
        summary: {
          totalRevenue: 240000,
          totalTransactions: 2,
          averageOrderValue: 120000,
        },
        series: [{ period: '2026-11-27', revenue: 240000, transactionsCount: 2 }],
        topEbooks: [
          {
            ebookId: 'b0000000-0000-4000-8000-000000000001',
            title: 'Arsitektur Web Skala Besar',
            categoryName: 'Teknologi',
            unitsSold: 2,
            revenue: 240000,
          },
        ],
      })

      const res = await request(app)
        .get('/api/v1/admin/reports/sales?startDate=2026-11-01&endDate=2026-11-30&groupBy=day')
        .set('Authorization', 'Bearer admin-token')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.summary.totalRevenue).toBe(240000)
      expect(res.body.data.series).toHaveLength(1)
      expect(res.body.data.topEbooks).toHaveLength(1)
    })

    it('returns 400 VALIDATION_ERROR for invalid groupBy on GET /api/v1/admin/reports/sales', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)

      const res = await request(app)
        .get('/api/v1/admin/reports/sales?groupBy=year')
        .set('Authorization', 'Bearer admin-token')

      expect(res.status).toBe(400)
      expect(res.body.error.code).toBe('VALIDATION_ERROR')
    })

    it('returns 200 when revoking access by ID on PATCH /api/v1/admin/accesses/:id', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)
      vi.spyOn(adminRepository, 'toggleAccessById').mockResolvedValueOnce({
        id: 'f0000000-0000-4000-8000-000000000001',
        userId: 'c0000000-0000-4000-8000-000000000001',
        customerName: 'Rina Kartika',
        customerEmail: 'rina@example.com',
        ebookId: 'b0000000-0000-4000-8000-000000000001',
        ebookTitle: 'Arsitektur Web Skala Besar',
        orderId: 'd0000000-0000-4000-8000-000000000001',
        orderNumber: 'ORD-20261127-001',
        grantedAt: new Date().toISOString(),
        isRevoked: true,
      })

      const res = await request(app)
        .patch('/api/v1/admin/accesses/f0000000-0000-4000-8000-000000000001')
        .set('Authorization', 'Bearer admin-token')
        .send({ isRevoked: true })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.isRevoked).toBe(true)
      expect(res.body.message).toContain('dicabut')
    })

    it('returns 400 VALIDATION_ERROR for invalid UUID on PATCH /api/v1/admin/accesses/:id', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAdminSupabase as any)

      const res = await request(app)
        .patch('/api/v1/admin/accesses/not-a-uuid')
        .set('Authorization', 'Bearer admin-token')
        .send({ isRevoked: true })

      expect(res.status).toBe(400)
      expect(res.body.error.code).toBe('VALIDATION_ERROR')
    })
  })
})
