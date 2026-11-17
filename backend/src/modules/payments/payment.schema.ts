import { z } from 'zod'

export const paymentWebhookSchema = z.object({
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

export type PaymentWebhookInput = z.infer<typeof paymentWebhookSchema>
