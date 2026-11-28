import request from 'supertest'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { app } from '../../src/app.js'
import { createXenditDynamicQris } from '../../src/integrations/payment/xendit.client.js'
import {
  normalizeWebhookPayload,
  paymentWebhookSchema,
} from '../../src/modules/payments/payment.schema.js'
import { PaymentService, paymentService } from '../../src/modules/payments/payment.service.js'
import { AppError } from '../../src/utils/app-error.js'

describe('Xendit QRIS Adapter & Webhook Support', () => {
  const originalServerKey = process.env.PAYMENT_GATEWAY_SERVER_KEY
  const originalBaseUrl = process.env.PAYMENT_GATEWAY_BASE_URL
  const originalWebhookSecret = process.env.PAYMENT_GATEWAY_WEBHOOK_SECRET

  afterEach(() => {
    vi.restoreAllMocks()
    process.env.PAYMENT_GATEWAY_SERVER_KEY = originalServerKey
    process.env.PAYMENT_GATEWAY_BASE_URL = originalBaseUrl
    process.env.PAYMENT_GATEWAY_WEBHOOK_SECRET = originalWebhookSecret
  })

  it('createXenditDynamicQris sends Basic Auth + api-version 2022-07-31 and returns qrString', async () => {
    process.env.PAYMENT_GATEWAY_SERVER_KEY = 'xnd_development_test_key_123'
    process.env.PAYMENT_GATEWAY_BASE_URL = 'https://api.xendit.co'

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        id: 'qr_test_001',
        reference_id: 'PAY-ORD-001',
        qr_string: '00020101021226660014ID.XENDIT.TEST',
        status: 'ACTIVE',
        amount: 75000,
        currency: 'IDR',
        channel_code: 'ID_QRIS',
        expires_at: '2026-11-29T10:00:00.000Z',
      }),
    } as Response)

    const result = await createXenditDynamicQris({
      referenceId: 'PAY-ORD-001',
      amount: 75000,
      expiresAt: new Date('2026-11-29T10:00:00.000Z'),
    })

    expect(result.qrId).toBe('qr_test_001')
    expect(result.qrString).toBe('00020101021226660014ID.XENDIT.TEST')
    expect(result.channelCode).toBe('ID_QRIS')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.xendit.co/qr_codes',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'api-version': '2022-07-31',
          Authorization: `Basic ${Buffer.from('xnd_development_test_key_123:').toString('base64')}`,
        }),
      }),
    )
  })

  it('createXenditDynamicQris throws 502 AppError when Xendit returns error', async () => {
    process.env.PAYMENT_GATEWAY_SERVER_KEY = 'xnd_development_invalid'
    process.env.PAYMENT_GATEWAY_BASE_URL = 'https://api.xendit.co'

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({
        error_code: 'INVALID_API_KEY',
        message: 'API key is invalid',
      }),
    } as Response)

    await expect(
      createXenditDynamicQris({
        referenceId: 'PAY-ORD-ERR',
        amount: 15000,
      }),
    ).rejects.toThrow(AppError)
  })

  it('verifyXenditCallbackToken validates exact timing-safe token match', () => {
    const service = new PaymentService()
    const secret = 'xendit-callback-token-secret-2026'

    expect(service.verifyXenditCallbackToken(secret, secret)).toBe(true)
    expect(service.verifyXenditCallbackToken('wrong-token', secret)).toBe(false)
    expect(service.verifyXenditCallbackToken(undefined, secret)).toBe(false)
  })

  it('normalizes Xendit qr_code.paid webhook payload to internal PAID format', () => {
    const parsed = paymentWebhookSchema.parse({
      event: 'qr_code.paid',
      business_id: 'biz-123',
      data: {
        id: 'qr_123',
        reference_id: 'PAY-ORD-2026-01',
        status: 'COMPLETED',
        amount: 50000,
        currency: 'IDR',
      },
    })

    const normalized = normalizeWebhookPayload(parsed)
    expect(normalized).toEqual({
      externalRef: 'PAY-ORD-2026-01',
      status: 'PAID',
      amount: 50000,
    })
  })

  it('POST /api/v1/payments/webhook rejects invalid x-callback-token with 401', async () => {
    process.env.PAYMENT_GATEWAY_WEBHOOK_SECRET = 'expected-xendit-token'

    const res = await request(app)
      .post('/api/v1/payments/webhook')
      .set('x-callback-token', 'wrong-xendit-token')
      .send({
        event: 'qr_code.paid',
        data: {
          reference_id: 'PAY-ORD-2026-01',
          status: 'COMPLETED',
          amount: 50000,
        },
      })

    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
    expect(res.body.error.code).toBe('WEBHOOK_SIGNATURE_INVALID')
  })

  it('POST /api/v1/payments/webhook accepts valid Xendit QRIS callback and processes payment', async () => {
    process.env.PAYMENT_GATEWAY_WEBHOOK_SECRET = 'expected-xendit-token'

    const processSpy = vi.spyOn(paymentService, 'processWebhook').mockResolvedValue({
      processed: true,
      status: 'VERIFIED',
      message: 'Pembayaran berhasil diverifikasi dan hak akses e-book telah diberikan',
    })

    const res = await request(app)
      .post('/api/v1/payments/webhook')
      .set('x-callback-token', 'expected-xendit-token')
      .send({
        event: 'qr_code.paid',
        data: {
          id: 'qr_abc123',
          reference_id: 'PAY-ORD-2026-99',
          status: 'COMPLETED',
          amount: 75000,
          currency: 'IDR',
        },
      })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.status).toBe('VERIFIED')
    expect(processSpy).toHaveBeenCalledWith({
      externalRef: 'PAY-ORD-2026-99',
      status: 'PAID',
      amount: 75000,
    })
  })
})
