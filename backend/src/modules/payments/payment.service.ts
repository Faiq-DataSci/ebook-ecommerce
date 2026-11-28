import crypto from 'node:crypto'
import { env } from '../../config/env.js'
import { prisma } from '../../config/prisma.js'
import { AppError } from '../../utils/app-error.js'
import type { PaymentWebhookInput } from './payment.schema.js'

export class PaymentService {
  verifyWebhookSignature(
    signatureHeader: string | undefined,
    rawBody: Buffer | string | undefined,
    secretOverride?: string,
  ): boolean {
    const secret =
      secretOverride ||
      process.env.PAYMENT_GATEWAY_WEBHOOK_SECRET ||
      env.PAYMENT_GATEWAY_WEBHOOK_SECRET ||
      env.PAYMENT_GATEWAY_SERVER_KEY

    // If secret is not configured in development or test, allow if signatureHeader is provided
    if (!secret) {
      if (env.NODE_ENV !== 'production') {
        return Boolean(signatureHeader)
      }
      return false
    }

    if (!signatureHeader) {
      return false
    }

    const bodyContent = typeof rawBody === 'string' ? rawBody : rawBody?.toString('utf8') || ''
    const expected = crypto.createHmac('sha512', secret).update(bodyContent).digest('hex')

    if (signatureHeader.length !== expected.length) {
      return false
    }

    return crypto.timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(expected))
  }

  verifyXenditCallbackToken(
    callbackToken: string | undefined,
    secretOverride?: string,
  ): boolean {
    const expectedToken =
      secretOverride ||
      process.env.PAYMENT_GATEWAY_WEBHOOK_SECRET ||
      env.PAYMENT_GATEWAY_WEBHOOK_SECRET

    if (!expectedToken) {
      if (env.NODE_ENV !== 'production') {
        return Boolean(callbackToken)
      }
      return false
    }

    if (!callbackToken) {
      return false
    }

    if (callbackToken.length !== expectedToken.length) {
      return false
    }

    return crypto.timingSafeEqual(Buffer.from(callbackToken), Buffer.from(expectedToken))
  }

  async processWebhook(payload: PaymentWebhookInput) {
    const payment = await prisma.payment.findUnique({
      where: { externalRef: payload.externalRef },
      include: {
        order: {
          include: {
            items: true,
          },
        },
      },
    })

    if (!payment || !payment.order) {
      throw new AppError(404, 'PAYMENT_NOT_FOUND', 'Data pembayaran tidak ditemukan')
    }

    // Idempotency: if payment is already in final state, respond gracefully without re-mutating
    if (['VERIFIED', 'FAILED', 'EXPIRED'].includes(payment.status)) {
      return {
        processed: false,
        idempotentReplay: true,
        status: payment.status,
        message: 'DUPLICATE_WEBHOOK: Notifikasi pembayaran sudah diproses sebelumnya',
      }
    }

    // Verify amount match
    const payloadAmount = Number(payload.amount).toFixed(2)
    const paymentAmount = Number(payment.amount).toFixed(2)
    if (payloadAmount !== paymentAmount) {
      throw new AppError(
        400,
        'PAYMENT_AMOUNT_MISMATCH',
        `Nominal webhook (${payloadAmount}) tidak sesuai dengan tagihan pesanan (${paymentAmount})`,
      )
    }

    const isPaid = ['VERIFIED', 'PAID', 'SETTLEMENT', 'CAPTURED'].includes(payload.status)
    const isFailed = ['FAILED', 'DENY', 'CANCEL'].includes(payload.status)
    const isExpired = payload.status === 'EXPIRED'

    if (isPaid) {
      return prisma.$transaction(async (tx) => {
        const now = new Date()

        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: 'VERIFIED',
            paidAt: now,
          },
        })

        await tx.order.update({
          where: { id: payment.order.id },
          data: {
            status: 'PAID',
          },
        })

        await tx.transaction.create({
          data: {
            orderId: payment.order.id,
            paymentId: payment.id,
            userId: payment.order.userId,
            transactionCode: `TRX-${payment.order.orderNumber}`,
            amount: payment.amount,
            recordedAt: now,
          },
        })

        for (const item of payment.order.items) {
          await tx.ebookAccess.upsert({
            where: {
              userId_ebookId: {
                userId: payment.order.userId,
                ebookId: item.ebookId,
              },
            },
            update: {
              isRevoked: false,
              orderId: payment.order.id,
              grantedAt: now,
            },
            create: {
              userId: payment.order.userId,
              ebookId: item.ebookId,
              orderId: payment.order.id,
              isRevoked: false,
              grantedAt: now,
            },
          })

          await tx.ebook.update({
            where: { id: item.ebookId },
            data: {
              salesCount: {
                increment: 1,
              },
            },
          })
        }

        return {
          processed: true,
          status: 'VERIFIED',
          message: 'Pembayaran berhasil diverifikasi dan hak akses e-book telah diberikan',
        }
      })
    }

    if (isFailed) {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'FAILED' },
        }),
        prisma.order.update({
          where: { id: payment.order.id },
          data: { status: 'FAILED' },
        }),
      ])

      return {
        processed: true,
        status: 'FAILED',
        message: 'Pembayaran ditandai gagal',
      }
    }

    if (isExpired) {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'EXPIRED' },
        }),
        prisma.order.update({
          where: { id: payment.order.id },
          data: { status: 'EXPIRED' },
        }),
      ])

      return {
        processed: true,
        status: 'EXPIRED',
        message: 'Pembayaran ditandai kedaluwarsa',
      }
    }

    return {
      processed: false,
      status: payment.status,
      message: 'Status pembayaran dalam antrean',
    }
  }
}

export const paymentService = new PaymentService()
