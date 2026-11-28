import 'dotenv/config'
import { z } from 'zod'

const envSchema = z
  .object({
    PORT: z.coerce.number().int().positive().default(3000),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    CORS_ORIGINS: z.string().default('http://localhost:5173,http://localhost:5174'),
    DATABASE_URL: z.string().min(1).optional(),
    DIRECT_URL: z.string().min(1).optional(),
    SUPABASE_URL: z.string().url().optional(),
    SUPABASE_ANON_KEY: z.string().min(1).optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
    SUPABASE_EBOOK_BUCKET: z.string().min(1).default('ebooks-private'),
    SUPABASE_COVER_BUCKET: z.string().min(1).default('ebook-covers'),
    PAYMENT_GATEWAY_PROVIDER: z.enum(['xendit']).default('xendit'),
    PAYMENT_GATEWAY_IS_PRODUCTION: z.preprocess((val) => {
      if (typeof val === 'boolean') {
        return val
      }
      if (typeof val === 'string') {
        const normalized = val.trim().toLowerCase()
        if (normalized === 'true' || normalized === '1') {
          return true
        }
        if (normalized === 'false' || normalized === '0' || normalized === '') {
          return false
        }
      }
      return val
    }, z.boolean()).default(false),
    PAYMENT_GATEWAY_BASE_URL: z.string().url().optional(),
    PAYMENT_GATEWAY_SERVER_KEY: z.string().min(1).optional(),
    PAYMENT_GATEWAY_WEBHOOK_SECRET: z.string().min(1).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV !== 'production') {
      return
    }

    const requiredInProduction: Array<keyof typeof data> = [
      'DATABASE_URL',
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'PAYMENT_GATEWAY_SERVER_KEY',
    ]

    for (const key of requiredInProduction) {
      if (!data[key]) {
        ctx.addIssue({
          code: 'custom',
          path: [key],
          message: `${key} wajib diisi pada mode production`,
        })
      }
    }
  })

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data
