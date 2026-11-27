import type { Request } from 'express'
import { env } from '../config/env.js'
import { prisma } from '../config/prisma.js'
import type { Prisma } from '../generated/prisma/client.js'

export interface SecurityAuditPayload {
  action: string
  entityType: string
  entityId?: string | null
  actorSupabaseId?: string | null
  req?: Request
  metadata?: Record<string, unknown>
}

/**
 * Mencatat kejadian keamanan dan mutasi administratif sensitif ke tabel `audit_logs`
 * tanpa pernah menyimpan token, password, atau kredensial rahasia.
 */
export function recordSecurityEvent(payload: SecurityAuditPayload): void {
  const safeMeta: Record<string, unknown> = {
    ...(payload.metadata ?? {}),
    ...(payload.req
      ? {
          method: payload.req.method,
          path: payload.req.originalUrl || payload.req.path,
          ip: payload.req.ip ?? 'unknown',
          userAgent: String(payload.req.headers['user-agent'] ?? '').slice(0, 180),
        }
      : {}),
  }

  // Jangan tulis ke DB live saat test otomatis
  if (env.NODE_ENV === 'test') {
    return
  }

  void (async () => {
    try {
      let actorId: string | null = null
      if (payload.actorSupabaseId) {
        const user = await prisma.user.findUnique({
          where: { supabaseUserId: payload.actorSupabaseId },
          select: { id: true },
        })
        actorId = user?.id ?? null
      }

      await prisma.auditLog.create({
        data: {
          actorId,
          action: payload.action.slice(0, 100),
          entityType: payload.entityType.slice(0, 60),
          entityId: payload.entityId ? payload.entityId.slice(0, 100) : null,
          metadata: safeMeta as Prisma.InputJsonValue,
        },
      })
    } catch {
      // Fail-safe: kegagalan audit log tidak boleh menjatuhkan respons API utama
    }
  })()
}
