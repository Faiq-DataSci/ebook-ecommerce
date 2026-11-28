import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from '../generated/prisma/client.js'
import { env } from './env.js'

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10_000,
})

const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({
  adapter,
})

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect()
  await pool.end()
}
