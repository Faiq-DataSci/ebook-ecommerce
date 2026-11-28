import { z } from 'zod'

export const internalPaymentWebhookSchema = z.object({
  externalRef: z.string().trim().min(1, 'externalRef wajib diisi'),
  status: z.enum([
    'VERIFIED',
    'PAID',
    'SETTLEMENT',
    'CAPTURED',
    'PENDING',
    'FAILED',
    'DENY',
    'CANCEL',
    'EXPIRED',
  ]),
  amount: z.union([
    z.string().regex(/^\d+(\.\d{1,2})?$/, 'Format amount tidak valid'),
    z.number().positive('Amount harus lebih besar dari 0'),
  ]),
  orderNumber: z.string().optional(),
})

export const xenditQrWebhookSchema = z.object({
  event: z.enum([
    'qr.payment',
    'qr_code.paid',
    'qr.payment.succeeded',
    'qr.payment.failed',
    'qr.payment.expired',
  ]),
  business_id: z.string().optional(),
  created: z.string().optional(),
  data: z.object({
    id: z.string().optional(),
    qr_id: z.string().optional(),
    reference_id: z.string().trim().min(1, 'reference_id wajib diisi'),
    status: z.string().trim().min(1, 'status wajib diisi'),
    amount: z.union([
      z.string().regex(/^\d+(\.\d{1,2})?$/, 'Format amount tidak valid'),
      z.number().positive('Amount harus lebih besar dari 0'),
    ]),
    currency: z.string().optional(),
  }),
})

export const paymentWebhookSchema = z.union([internalPaymentWebhookSchema, xenditQrWebhookSchema])

export type PaymentWebhookInput = z.infer<typeof internalPaymentWebhookSchema>
export type XenditQrWebhookInput = z.infer<typeof xenditQrWebhookSchema>
export type PaymentWebhookPayload = z.infer<typeof paymentWebhookSchema>

export function isXenditWebhookPayload(
  payload: PaymentWebhookPayload,
): payload is XenditQrWebhookInput {
  return 'event' in payload && 'data' in payload
}

export function normalizeWebhookPayload(payload: PaymentWebhookPayload): PaymentWebhookInput {
  if (!isXenditWebhookPayload(payload)) {
    return payload
  }

  const rawStatus = payload.data.status.toUpperCase()
  let mappedStatus: PaymentWebhookInput['status'] = 'PENDING'

  if (
    payload.event === 'qr_code.paid' ||
    payload.event === 'qr.payment.succeeded' ||
    ['SUCCEEDED', 'COMPLETED', 'PAID', 'SETTLEMENT'].includes(rawStatus)
  ) {
    mappedStatus = 'PAID'
  } else if (
    payload.event === 'qr.payment.failed' ||
    ['FAILED', 'CANCELLED', 'CANCELED', 'DENY'].includes(rawStatus)
  ) {
    mappedStatus = 'FAILED'
  } else if (
    payload.event === 'qr.payment.expired' ||
    ['EXPIRED', 'INACTIVE'].includes(rawStatus)
  ) {
    mappedStatus = 'EXPIRED'
  }

  return {
    externalRef: payload.data.reference_id,
    status: mappedStatus,
    amount: payload.data.amount,
  }
}
