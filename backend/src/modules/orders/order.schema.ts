import { z } from 'zod'

export const createOrderSchema = z.object({
  ebookIds: z
    .array(z.string().uuid('ID e-book harus berupa UUID valid'))
    .min(1, 'Minimal satu e-book harus dipilih untuk membuat pesanan'),
})

export const getOrdersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  status: z.enum(['PENDING', 'PAID', 'FAILED', 'EXPIRED', 'CANCELLED']).optional(),
})

export const orderIdParamSchema = z.object({
  id: z.string().uuid('ID pesanan harus berupa UUID valid'),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type GetOrdersQuery = z.infer<typeof getOrdersQuerySchema>
export type OrderIdParam = z.infer<typeof orderIdParamSchema>
