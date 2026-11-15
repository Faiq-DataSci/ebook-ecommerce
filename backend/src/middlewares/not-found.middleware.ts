import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../utils/app-error.js'

/**
 * Fallback middleware for unmatched routes returning standardized JSON 404 errors.
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(404, 'NOT_FOUND', `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`))
}
