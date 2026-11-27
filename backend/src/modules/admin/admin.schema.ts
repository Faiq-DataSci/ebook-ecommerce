import { z } from 'zod'

export const SAW_ALLOWED_FIELDS = [
  'price',
  'ratingAvg',
  'salesCount',
  'pageCount',
  'publishedYear',
] as const

export type SawAllowedField = (typeof SAW_ALLOWED_FIELDS)[number]

export const criterionWeightInputSchema = z
  .object({
    id: z.string().trim().min(1, 'ID kriteria wajib diisi').max(20, 'ID kriteria maksimal 20 karakter'),
    name: z
      .string()
      .trim()
      .min(1, 'Nama kriteria wajib diisi')
      .max(100, 'Nama kriteria maksimal 100 karakter')
      .optional(),
    field: z.enum(SAW_ALLOWED_FIELDS).optional(),
    type: z.enum(['BENEFIT', 'COST']).optional(),
    weight: z
      .number()
      .min(0, 'Bobot kriteria tidak boleh bernilai negatif')
      .max(1, 'Bobot kriteria maksimal 1.0'),
    isActive: z.boolean().optional(),
    description: z.string().trim().max(300, 'Deskripsi kriteria maksimal 300 karakter').optional(),
  })
  .refine(
    (item) => {
      if (item.isActive === false) return item.weight >= 0
      return item.weight > 0
    },
    {
      message: 'Bobot kriteria aktif harus lebih besar dari 0',
      path: ['weight'],
    },
  )

export const updateSawWeightsSchema = z.object({
  replaceAll: z.boolean().optional(),
  criteria: z
    .array(criterionWeightInputSchema)
    .min(1, 'Minimal 1 kriteria harus disertakan')
    .max(20, 'Maksimal 20 kriteria SAW'),
})

export type CriterionWeightInput = z.infer<typeof criterionWeightInputSchema>
export type UpdateSawWeightsInput = z.infer<typeof updateSawWeightsSchema>

// Admin E-Book Schemas
export const getAdminEbooksQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  search: z.string().trim().optional(),
  categoryId: z.string().uuid('ID kategori harus berupa UUID valid').optional(),
  status: z.enum(['ALL', 'AKTIF', 'ARSIP']).default('ALL'),
  sortBy: z.enum(['createdAt', 'title', 'price', 'salesCount']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

const booleanFromForm = z.preprocess((val) => {
  if (typeof val === 'boolean') return val
  if (typeof val === 'string') {
    const lower = val.trim().toLowerCase()
    if (lower === 'true' || lower === '1') return true
    if (lower === 'false' || lower === '0') return false
  }
  return val
}, z.boolean())

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
  isActive: booleanFromForm.default(true),
})

export const updateEbookSchema = createEbookSchema.partial()

export const toggleEbookStatusSchema = z.object({
  isActive: z.boolean(),
})

export const adminEbookIdParamSchema = z.object({
  id: z.string().uuid('ID e-book harus berupa UUID valid'),
})

// Admin Categories CRUD Schemas
export const getAdminCategoriesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  search: z.string().trim().optional(),
  status: z.enum(['ALL', 'AKTIF', 'ARSIP']).default('ALL'),
})

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nama kategori wajib diisi')
    .max(100, 'Nama kategori maksimal 100 karakter'),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug kategori hanya boleh huruf kecil, angka, dan tanda hubung')
    .max(120, 'Slug kategori maksimal 120 karakter')
    .optional(),
  description: z.string().trim().max(500, 'Deskripsi kategori maksimal 500 karakter').optional().nullable(),
  isActive: z.boolean().default(true),
})

export const updateCategorySchema = createCategorySchema.partial()

export const toggleCategoryStatusSchema = z.object({
  isActive: z.boolean(),
})

export const adminCategoryIdParamSchema = z.object({
  id: z.string().uuid('ID kategori harus berupa UUID valid'),
})

// Admin Customers / Users Management Schemas
export const getAdminCustomersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  search: z.string().trim().optional(),
  status: z.enum(['ALL', 'ACTIVE', 'INACTIVE']).default('ALL'),
  role: z.enum(['ALL', 'CUSTOMER', 'ADMIN']).default('ALL'),
  sortBy: z.enum(['fullName', 'createdAt', 'totalSpent', 'isActive']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export const adminCustomerIdParamSchema = z.object({
  id: z.string().uuid('ID pelanggan harus berupa UUID valid'),
})

export const toggleCustomerStatusSchema = z.object({
  isActive: z.boolean(),
})

// Admin Orders, Payments & E-Book Access Schemas
export const getAdminOrdersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  search: z.string().trim().optional(),
  status: z
    .enum(['ALL', 'PENDING', 'PAID', 'FAILED', 'EXPIRED', 'CANCELLED'])
    .default('ALL'),
})

export const getAdminPaymentsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  search: z.string().trim().optional(),
  status: z
    .enum(['ALL', 'PENDING', 'VERIFIED', 'FAILED', 'EXPIRED'])
    .default('ALL'),
})

export const adminOrderIdParamSchema = z.object({
  id: z.string().uuid('ID pesanan harus berupa UUID valid'),
})

export const toggleOrderAccessSchema = z.object({
  isRevoked: z.boolean(),
})

const optionalDateString = z
  .string()
  .trim()
  .refine((val) => !Number.isNaN(Date.parse(val)), 'Format tanggal tidak valid (gunakan ISO YYYY-MM-DD)')
  .optional()

export const getAdminTransactionsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  startDate: optionalDateString,
  endDate: optionalDateString,
})

export const getAdminSalesReportQuerySchema = z.object({
  startDate: optionalDateString,
  endDate: optionalDateString,
  groupBy: z.enum(['day', 'month']).default('day'),
})

export const adminAccessIdParamSchema = z.object({
  id: z.string().uuid('ID hak akses e-book harus berupa UUID valid'),
})

export const toggleAccessByIdSchema = z.object({
  isRevoked: z.boolean(),
})

export type GetAdminEbooksQuery = z.infer<typeof getAdminEbooksQuerySchema>
export type CreateEbookInput = z.infer<typeof createEbookSchema>
export type UpdateEbookInput = z.infer<typeof updateEbookSchema>
export type ToggleEbookStatusInput = z.infer<typeof toggleEbookStatusSchema>
export type AdminEbookIdParam = z.infer<typeof adminEbookIdParamSchema>

export type GetAdminCategoriesQuery = z.infer<typeof getAdminCategoriesQuerySchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type ToggleCategoryStatusInput = z.infer<typeof toggleCategoryStatusSchema>
export type AdminCategoryIdParam = z.infer<typeof adminCategoryIdParamSchema>

export type GetAdminCustomersQuery = z.infer<typeof getAdminCustomersQuerySchema>
export type AdminCustomerIdParam = z.infer<typeof adminCustomerIdParamSchema>
export type ToggleCustomerStatusInput = z.infer<typeof toggleCustomerStatusSchema>

export type GetAdminOrdersQuery = z.infer<typeof getAdminOrdersQuerySchema>
export type GetAdminPaymentsQuery = z.infer<typeof getAdminPaymentsQuerySchema>
export type AdminOrderIdParam = z.infer<typeof adminOrderIdParamSchema>
export type ToggleOrderAccessInput = z.infer<typeof toggleOrderAccessSchema>

export type GetAdminTransactionsQuery = z.infer<typeof getAdminTransactionsQuerySchema>
export type GetAdminSalesReportQuery = z.infer<typeof getAdminSalesReportQuerySchema>
export type AdminAccessIdParam = z.infer<typeof adminAccessIdParamSchema>
export type ToggleAccessByIdInput = z.infer<typeof toggleAccessByIdSchema>

