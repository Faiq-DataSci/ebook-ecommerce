import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  CORS_ORIGINS: z.string().default('http://localhost:5173,http://localhost:5174'),
  DATABASE_URL: z.string().min(1).optional(),
  DIRECT_URL: z.string().min(1).optional(),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  SUPABASE_EBOOK_BUCKET: z.string().min(1).default('ebooks-private'),
  PAYMENT_GATEWAY_SERVER_KEY: z.string().min(1).optional(),
  PAYMENT_GATEWAY_WEBHOOK_SECRET: z.string().min(1).optional(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data
