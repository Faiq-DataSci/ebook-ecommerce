import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  API_PREFIX: z.string().min(1).default('/api/v1'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL wajib diisi'),
  DIRECT_URL: z.string().min(1).optional(),
  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET wajib diisi'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET wajib diisi'),
  SUPABASE_URL: z.string().url('SUPABASE_URL harus berupa URL valid'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY wajib diisi'),
  SUPABASE_STORAGE_BUCKET: z.string().min(1, 'SUPABASE_STORAGE_BUCKET wajib diisi'),
  ADMIN_WEB_ORIGIN: z.string().min(1).default('http://localhost:5173'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Konfigurasi environment tidak valid:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
