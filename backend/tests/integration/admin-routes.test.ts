import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { app } from '../../src/app.js'
import * as supabaseConfig from '../../src/config/supabase.js'
import {
  adminRepository,
  resetActiveCriteriaStore,
} from '../../src/modules/admin/admin.repository.js'

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
  })
})
