import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import { app } from '../../src/app.js'
import * as supabaseConfig from '../../src/config/supabase.js'
import { transactionService } from '../../src/modules/transactions/transaction.service.js'

const mockSupabaseAdmin = {
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: {
        user: {
          id: 'supa-customer-123',
          email: 'customer@example.com',
          app_metadata: { role: 'CUSTOMER' },
        },
      },
      error: null,
    }),
  },
}

describe('Transaction Routes Integration', () => {
  it('returns 401 when the customer is unauthenticated', async () => {
    const res = await request(app).get('/api/v1/transactions/my')

    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
    expect(res.body.error.code).toBe('UNAUTHENTICATED')
  })

  it('returns 400 when the date range is invalid', async () => {
    vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockSupabaseAdmin as any)

    const res = await request(app)
      .get('/api/v1/transactions/my?startDate=2026-11-23T00:00:00.000Z&endDate=2026-11-22T00:00:00.000Z')
      .set('Authorization', 'Bearer valid-test-token')

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('returns only the authenticated customer transaction history', async () => {
    vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockSupabaseAdmin as any)
    const getMyTransactions = vi.spyOn(transactionService, 'getMyTransactions').mockResolvedValue({
      items: [
        {
          id: '00000000-0000-4000-8000-000000000301',
          transactionCode: 'TRX-DATA-SIMULASI-001',
          amount: '75000.00',
          recordedAt: new Date('2026-11-23T08:00:00.000Z'),
          order: { orderNumber: 'ORD-DATA-SIMULASI-001', items: [] },
          payment: { status: 'VERIFIED' },
        },
      ],
      meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
    } as any)

    const res = await request(app)
      .get('/api/v1/transactions/my?limit=20')
      .set('Authorization', 'Bearer valid-test-token')

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveLength(1)
    expect(res.body.data[0].transactionCode).toBe('TRX-DATA-SIMULASI-001')
    expect(res.body.meta).toEqual({ page: 1, limit: 20, total: 1, totalPages: 1 })
    expect(getMyTransactions).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'supa-customer-123', role: 'CUSTOMER' }),
      expect.objectContaining({ page: 1, limit: 20 }),
    )
  })
})
