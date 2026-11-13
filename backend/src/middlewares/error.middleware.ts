import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../utils/app-error.js'

/**
 * Global Express error handler that returns sanitized error responses
 * without leaking stack traces or database details to clients.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Input tidak valid',
        details: err.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
    })
    return
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    })
    return
  }

  console.error('Unhandled server error:', err)
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Terjadi kesalahan internal pada server',
    },
  })
}
