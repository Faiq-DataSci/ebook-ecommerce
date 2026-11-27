import type { NextFunction, Request, Response } from 'express'
import { env } from '../config/env.js'
import { prisma } from '../config/prisma.js'
import { getSupabaseAdmin } from '../config/supabase.js'
import { AppError } from '../utils/app-error.js'
import { recordSecurityEvent } from '../utils/audit-logger.js'

export type UserRole = 'CUSTOMER' | 'ADMIN'

export interface AuthenticatedUser {
  id: string
  email: string
  role: UserRole
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser
    }
  }
}

/**
 * Verifies the Bearer token against Supabase Auth and attaches the user context.
 */
export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new AppError(401, 'UNAUTHENTICATED', 'Token autentikasi diperlukan'))
    return
  }

  const token = authHeader.slice('Bearer '.length).trim()
  if (!token) {
    next(new AppError(401, 'UNAUTHENTICATED', 'Token autentikasi tidak valid'))
    return
  }

  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      recordSecurityEvent({
        action: 'AUTH_INVALID_TOKEN',
        entityType: 'Auth',
        req,
      })
      next(new AppError(401, 'UNAUTHENTICATED', 'Sesi tidak valid atau kedaluwarsa'))
      return
    }

    // Kill-switch akun: tolak segera apabila akun dinonaktifkan di database (isActive = false)
    if (env.NODE_ENV !== 'test') {
      const dbUser = await prisma.user.findUnique({
        where: { supabaseUserId: data.user.id },
        select: { isActive: true },
      })
      if (dbUser && !dbUser.isActive) {
        recordSecurityEvent({
          action: 'AUTH_BLOCKED_INACTIVE_USER',
          entityType: 'User',
          actorSupabaseId: data.user.id,
          req,
        })
        next(new AppError(403, 'FORBIDDEN', 'Akun dinonaktifkan oleh administrator'))
        return
      }
    }

    const rawRole = data.user.app_metadata?.role
    const role: UserRole = rawRole === 'ADMIN' ? 'ADMIN' : 'CUSTOMER'

    req.user = {
      id: data.user.id,
      email: data.user.email ?? '',
      role,
    }
    next()
  } catch (err) {
    next(err)
  }
}

/**
 * Enforces role-based authorization on protected routes.
 */
export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(401, 'UNAUTHENTICATED', 'Autentikasi diperlukan'))
      return
    }

    if (!allowedRoles.includes(req.user.role)) {
      recordSecurityEvent({
        action: 'AUTH_ROLE_FORBIDDEN',
        entityType: 'Authorization',
        actorSupabaseId: req.user.id,
        req,
        metadata: { actualRole: req.user.role, allowedRoles },
      })
      next(new AppError(403, 'FORBIDDEN', 'Anda tidak memiliki hak akses'))
      return
    }

    next()
  }
}
