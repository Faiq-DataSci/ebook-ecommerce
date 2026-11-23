import { z } from 'zod'

export const getMyTransactionsQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(20),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  })
  .refine(
    (query) => !query.startDate || !query.endDate || query.startDate <= query.endDate,
    {
      message: 'startDate tidak boleh lebih besar dari endDate',
      path: ['endDate'],
    },
  )

export type GetMyTransactionsQuery = z.infer<typeof getMyTransactionsQuerySchema>
