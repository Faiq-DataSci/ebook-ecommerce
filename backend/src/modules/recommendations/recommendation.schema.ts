import { z } from 'zod'

export const getSawRecommendationsQuerySchema = z.object({
  categoryId: z.string().uuid({ message: 'categoryId harus berupa UUID valid' }).optional(),
  limit: z.coerce
    .number()
    .int({ message: 'limit harus berupa bilangan bulat' })
    .min(1, { message: 'limit minimal 1' })
    .max(20, { message: 'limit maksimal 20' })
    .default(5),
})

export type GetSawRecommendationsQuery = z.infer<typeof getSawRecommendationsQuerySchema>
