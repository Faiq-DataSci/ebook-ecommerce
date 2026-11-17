import { z } from 'zod'

export const ebookAccessParamSchema = z.object({
  id: z.string().uuid('ID e-book harus berupa UUID valid'),
})

export type EbookAccessParam = z.infer<typeof ebookAccessParamSchema>
