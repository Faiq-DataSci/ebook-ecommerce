import crypto from 'node:crypto'
import { describe, expect, it, vi } from 'vitest'
import { prisma } from '../../src/config/prisma.js'
import { PaymentService } from '../../src/modules/payments/payment.service.js'
import { AppError } from '../../src/utils/app-error.js'

describe('PaymentService Unit Tests', () => {
  const service = new PaymentService()

  it('verifyWebhookSignature validates correct HMAC SHA512 signature', () => {
    const rawBody = JSON.stringify({ externalRef: 'PAY-123', amount: 50000, status: 'PAID' })
    const secret = 'test-payment-webhook-secret-32-chars-long'
    const validSignature = crypto.createHmac('sha512', secret).update(rawBody).digest('hex')

    const isValid = service.verifyWebhookSignature(validSignature, rawBody, secret)
    expect(isValid).toBe(true)

    const isTampered = service.verifyWebhookSignature('invalid-tampered-signature-hex', rawBody, secret)
    expect(isTampered).toBe(false)
  })

  it('processWebhook throws 404 when payment is not found', async () => {
    vi.spyOn(prisma.payment, 'findUnique').mockResolvedValue(null)

    await expect(
      service.processWebhook({
        externalRef: 'PAY-NONEXISTENT',
        amount: 50000,
        status: 'PAID',
        signature: 'valid-sig',
      }),
    ).rejects.toThrow(AppError)
  })

  it('processWebhook gracefully handles idempotent replay when payment is already verified', async () => {
    vi.spyOn(prisma.payment, 'findUnique').mockResolvedValue({
      id: 'pay-001',
      orderId: 'ord-001',
      externalRef: 'PAY-ALREADY-PAID',
      amount: 50000 as any,
      status: 'VERIFIED',
      order: {
        id: 'ord-001',
        userId: 'usr-001',
        orderNumber: 'ORD-001',
        items: [],
      },
    } as any)

    const result = await service.processWebhook({
      externalRef: 'PAY-ALREADY-PAID',
      amount: 50000,
      status: 'PAID',
      signature: 'valid-sig',
    })

    expect(result.processed).toBe(false)
    expect(result.idempotentReplay).toBe(true)
    expect(result.status).toBe('VERIFIED')
  })

  it('processWebhook throws 400 when webhook amount mismatches payment amount', async () => {
    vi.spyOn(prisma.payment, 'findUnique').mockResolvedValue({
      id: 'pay-001',
      orderId: 'ord-001',
      externalRef: 'PAY-MISMATCH',
      amount: 50000 as any,
      status: 'PENDING',
      order: {
        id: 'ord-001',
        userId: 'usr-001',
        orderNumber: 'ORD-001',
        items: [],
      },
    } as any)

    await expect(
      service.processWebhook({
        externalRef: 'PAY-MISMATCH',
        amount: 25000, // Mismatched amount
        status: 'PAID',
        signature: 'valid-sig',
      }),
    ).rejects.toThrow('tidak sesuai dengan tagihan pesanan')
  })

  it('processWebhook updates order to PAID and grants ebook access when status is PAID', async () => {
    const mockOrderItems = [
      { id: 'item-1', orderId: 'ord-001', ebookId: 'ebk-001', unitPrice: 50000 as any },
    ]

    vi.spyOn(prisma.payment, 'findUnique').mockResolvedValue({
      id: 'pay-001',
      orderId: 'ord-001',
      externalRef: 'PAY-SUCCESS',
      amount: 50000 as any,
      status: 'PENDING',
      order: {
        id: 'ord-001',
        userId: 'usr-001',
        orderNumber: 'ORD-001',
        items: mockOrderItems,
      },
    } as any)

    const mockTx = {
      payment: { update: vi.fn().mockResolvedValue({}) },
      order: { update: vi.fn().mockResolvedValue({}) },
      transaction: { create: vi.fn().mockResolvedValue({}) },
      ebookAccess: { upsert: vi.fn().mockResolvedValue({}) },
      ebook: { update: vi.fn().mockResolvedValue({}) },
    }

    vi.spyOn(prisma, '$transaction').mockImplementation(async (cb: any) => {
      return cb(mockTx)
    })

    const result = await service.processWebhook({
      externalRef: 'PAY-SUCCESS',
      amount: 50000,
      status: 'PAID',
      signature: 'valid-sig',
    })

    expect(result.processed).toBe(true)
    expect(result.status).toBe('VERIFIED')
    expect(mockTx.payment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'pay-001' },
        data: expect.objectContaining({ status: 'VERIFIED' }),
      }),
    )
    expect(mockTx.order.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'ord-001' },
        data: { status: 'PAID' },
      }),
    )
    expect(mockTx.ebookAccess.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_ebookId: { userId: 'usr-001', ebookId: 'ebk-001' } },
      }),
    )
    expect(mockTx.ebook.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'ebk-001' },
        data: { salesCount: { increment: 1 } },
      }),
    )
  })

  it('processWebhook marks order FAILED when webhook status is FAILED', async () => {
    vi.spyOn(prisma.payment, 'findUnique').mockResolvedValue({
      id: 'pay-002',
      orderId: 'ord-002',
      externalRef: 'PAY-FAIL',
      amount: 75000 as any,
      status: 'PENDING',
      order: {
        id: 'ord-002',
        userId: 'usr-001',
        orderNumber: 'ORD-002',
        items: [],
      },
    } as any)

    const paymentUpdateSpy = vi.spyOn(prisma.payment, 'update').mockResolvedValue({} as any)
    const orderUpdateSpy = vi.spyOn(prisma.order, 'update').mockResolvedValue({} as any)

    vi.spyOn(prisma, '$transaction').mockImplementation(async (arg: any) => {
      if (typeof arg === 'function') {
        return arg({ payment: prisma.payment, order: prisma.order })
      }
      return Promise.all(arg)
    })

    const result = await service.processWebhook({
      externalRef: 'PAY-FAIL',
      amount: 75000,
      status: 'FAILED',
      signature: 'valid-sig',
    })

    expect(result.processed).toBe(true)
    expect(result.status).toBe('FAILED')
    expect(paymentUpdateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'pay-002' },
        data: { status: 'FAILED' },
      }),
    )
    expect(orderUpdateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'ord-002' },
        data: { status: 'FAILED' },
      }),
    )
  })
})
