import { z } from 'zod'

export const getEbooksQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  search: z.string().trim().optional(),
  categoryId: z.string().uuid('ID kategori harus berupa UUID valid').optional(),
  sortBy: z.enum(['newest', 'price_asc', 'price_desc', 'popular', 'rating']).default('newest'),
})

export const ebookIdParamSchema = z.object({
  id: z.string().uuid('ID e-book harus berupa UUID valid'),
})

export type GetEbooksQuery = z.infer<typeof getEbooksQuerySchema>
export type EbookIdParam = z.infer<typeof ebookIdParamSchema>
