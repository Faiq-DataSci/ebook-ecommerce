import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import { app } from '../../src/app.js'
import * as supabaseConfig from '../../src/config/supabase.js'
import { ebookAccessService } from '../../src/modules/ebook-access/ebook-access.service.js'
import { orderService } from '../../src/modules/orders/order.service.js'
import { paymentService } from '../../src/modules/payments/payment.service.js'

describe('Order, Payment & Access URL Routes Integration', () => {
  const mockAuthAdmin = {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: {
            id: 'supa-user-123',
            email: 'customer@example.com',
            app_metadata: { role: 'CUSTOMER' },
          },
        },
        error: null,
      }),
    },
  }

  // Orders endpoints
  describe('POST /api/v1/orders', () => {
    it('returns 401 when not authenticated', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .send({ ebookIds: ['00000000-0000-4000-8000-000000000001'] })

      expect(res.status).toBe(401)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('UNAUTHENTICATED')
    })

    it('returns 400 when ebookIds array is empty', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAuthAdmin as any)

      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', 'Bearer valid-test-token')
        .send({ ebookIds: [] })

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('VALIDATION_ERROR')
    })

    it('returns 201 with created order and payment on success', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAuthAdmin as any)
      vi.spyOn(orderService, 'createOrder').mockResolvedValue({
        order: {
          id: '00000000-0000-4000-8000-000000000111',
          orderNumber: 'ORD-20261117-001',
          totalAmount: '75000.00',
          status: 'PENDING',
        },
        payment: {
          id: '00000000-0000-4000-8000-000000000222',
          externalRef: 'PAY-ORD-20261117-001',
          amount: '75000.00',
          status: 'PENDING',
        },
      } as any)

      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', 'Bearer valid-test-token')
        .send({ ebookIds: ['00000000-0000-4000-8000-000000000001'] })

      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data.order.orderNumber).toBe('ORD-20261117-001')
      expect(res.body.data.payment.externalRef).toBe('PAY-ORD-20261117-001')
    })
  })

  describe('GET /api/v1/orders/me', () => {
    it('returns 401 when not authenticated', async () => {
      const res = await request(app).get('/api/v1/orders/me')
      expect(res.status).toBe(401)
      expect(res.body.success).toBe(false)
    })

    it('returns 200 with list of user orders', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAuthAdmin as any)
      vi.spyOn(orderService, 'getMyOrders').mockResolvedValue({
        items: [
          {
            id: '00000000-0000-4000-8000-000000000111',
            orderNumber: 'ORD-20261117-001',
            totalAmount: '75000.00',
            status: 'PAID',
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      } as any)

      const res = await request(app)
        .get('/api/v1/orders/me')
        .set('Authorization', 'Bearer valid-test-token')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveLength(1)
      expect(res.body.meta.total).toBe(1)
    })
  })

  describe('GET /api/v1/orders/:id', () => {
    it('returns 400 when order id is not a valid UUID', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAuthAdmin as any)

      const res = await request(app)
        .get('/api/v1/orders/not-a-valid-uuid')
        .set('Authorization', 'Bearer valid-test-token')

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('VALIDATION_ERROR')
    })

    it('returns 200 with order detail when valid UUID provided', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAuthAdmin as any)
      vi.spyOn(orderService, 'getOrderById').mockResolvedValue({
        id: '00000000-0000-4000-8000-000000000111',
        orderNumber: 'ORD-20261117-001',
        totalAmount: '75000.00',
        status: 'PAID',
        items: [],
      } as any)

      const res = await request(app)
        .get('/api/v1/orders/00000000-0000-4000-8000-000000000111')
        .set('Authorization', 'Bearer valid-test-token')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.orderNumber).toBe('ORD-20261117-001')
    })
  })

  // Payments Webhook endpoint
  describe('POST /api/v1/payments/webhook', () => {
    it('returns 401 when signature verification fails', async () => {
      vi.spyOn(paymentService, 'verifyWebhookSignature').mockReturnValue(false)

      const res = await request(app)
        .post('/api/v1/payments/webhook')
        .send({
          externalRef: 'PAY-123',
          amount: 50000,
          status: 'PAID',
        })

      expect(res.status).toBe(401)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('WEBHOOK_SIGNATURE_INVALID')
    })

    it('returns 400 when payload schema validation fails', async () => {
      const res = await request(app)
        .post('/api/v1/payments/webhook')
        .send({
          // missing externalRef and invalid status
          amount: 'not-a-number',
        })

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('VALIDATION_ERROR')
    })

    it('returns 200 when webhook signature is valid and payload is processed', async () => {
      vi.spyOn(paymentService, 'verifyWebhookSignature').mockReturnValue(true)
      vi.spyOn(paymentService, 'processWebhook').mockResolvedValue({
        processed: true,
        status: 'VERIFIED',
        message: 'Pembayaran berhasil diverifikasi dan akses e-book telah diberikan',
      } as any)

      const res = await request(app)
        .post('/api/v1/payments/webhook')
        .set('x-webhook-signature', 'valid-hmac-sha512')
        .send({
          externalRef: 'PAY-123',
          amount: 50000,
          status: 'SETTLEMENT',
        })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.status).toBe('VERIFIED')
      expect(res.body.data.processed).toBe(true)
    })
  })

  // Access URL endpoint
  describe('GET /api/v1/ebooks/:id/access-url', () => {
    it('returns 401 when unauthenticated', async () => {
      const res = await request(app).get(
        '/api/v1/ebooks/00000000-0000-4000-8000-000000000055/access-url',
      )
      expect(res.status).toBe(401)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('UNAUTHENTICATED')
    })

    it('returns 400 when ebook id is not a valid UUID', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAuthAdmin as any)

      const res = await request(app)
        .get('/api/v1/ebooks/invalid-uuid/access-url')
        .set('Authorization', 'Bearer valid-test-token')

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('VALIDATION_ERROR')
    })

    it('returns 200 with signed URL when user has valid access', async () => {
      vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockAuthAdmin as any)
      vi.spyOn(ebookAccessService, 'getSignedAccessUrl').mockResolvedValue({
        ebookId: '00000000-0000-4000-8000-000000000055',
        title: 'DATA SIMULASI - Ebook TypeScript',
        signedUrl: 'https://supabase.co/storage/v1/object/sign/ebook-files/file.pdf?token=xyz',
        expiresInSeconds: 300,
      } as any)

      const res = await request(app)
        .get('/api/v1/ebooks/00000000-0000-4000-8000-000000000055/access-url')
        .set('Authorization', 'Bearer valid-test-token')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.signedUrl).toContain('token=xyz')
      expect(res.body.data.expiresInSeconds).toBe(300)
    })
  })
})
