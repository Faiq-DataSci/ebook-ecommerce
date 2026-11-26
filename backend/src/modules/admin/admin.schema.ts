import { z } from 'zod'

export const criterionWeightInputSchema = z.object({
  id: z.string().min(1, 'ID kriteria wajib diisi'),
  weight: z.number().gt(0, 'Bobot kriteria harus lebih besar dari 0'),
})

export const updateSawWeightsSchema = z.object({
  criteria: z
    .array(criterionWeightInputSchema)
    .min(1, 'Minimal 1 kriteria harus disertakan'),
})

export type UpdateSawWeightsInput = z.infer<typeof updateSawWeightsSchema>

// ==========================================
// Admin E-Book Schemas
// ==========================================
export const getAdminEbooksQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  search: z.string().trim().optional(),
  categoryId: z.string().uuid('ID kategori harus berupa UUID valid').optional(),
  status: z.enum(['ALL', 'AKTIF', 'ARSIP']).default('ALL'),
  sortBy: z.enum(['createdAt', 'title', 'price', 'salesCount']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export const createEbookSchema = z.object({
  categoryId: z.string().uuid('ID kategori harus berupa UUID valid'),
  title: z.string().trim().min(1, 'Judul e-book wajib diisi').max(200, 'Judul maksimal 200 karakter'),
  author: z.string().trim().min(1, 'Nama penulis wajib diisi').max(150, 'Nama penulis maksimal 150 karakter'),
  description: z.string().trim().min(1, 'Deskripsi e-book wajib diisi'),
  price: z.coerce.number().min(0, 'Harga e-book minimal 0'),
  coverUrl: z.string().optional().nullable(),
  storagePath: z.string().trim().min(1, 'Storage path naskah PDF privat wajib diisi').default('ebooks-private/default.pdf'),
  pageCount: z.coerce.number().int().positive().optional().nullable(),
  publishedYear: z.coerce.number().int().min(1900).max(2100).optional().nullable(),
  isActive: z.boolean().default(true),
})

export const updateEbookSchema = createEbookSchema.partial()

export const toggleEbookStatusSchema = z.object({
  isActive: z.boolean(),
})

export const adminEbookIdParamSchema = z.object({
  id: z.string().uuid('ID e-book harus berupa UUID valid'),
})

export type GetAdminEbooksQuery = z.infer<typeof getAdminEbooksQuerySchema>
export type CreateEbookInput = z.infer<typeof createEbookSchema>
export type UpdateEbookInput = z.infer<typeof updateEbookSchema>
export type ToggleEbookStatusInput = z.infer<typeof toggleEbookStatusSchema>
export type AdminEbookIdParam = z.infer<typeof adminEbookIdParamSchema>

