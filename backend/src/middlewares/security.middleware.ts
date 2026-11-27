import type { NextFunction, Request, Response } from 'express'

const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

function stripDangerousKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripDangerousKeys)
  }

  if (value !== null && typeof value === 'object') {
    const clean: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (FORBIDDEN_KEYS.has(key)) {
        continue
      }
      clean[key] = stripDangerousKeys(val)
    }
    return clean
  }

  return value
}

/**
 * Mencegah serangan prototype pollution dengan menghapus key berbahaya pada JSON body.
 */
export function sanitizeRequestBody(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (req.body && typeof req.body === 'object') {
    req.body = stripDangerousKeys(req.body)
  }
  next()
}

/**
 * Memastikan respons sensitif (admin, auth, profil, pembayaran) tidak pernah di-cache proxy/browser.
 */
export function noStoreCacheHeaders(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  next()
}
