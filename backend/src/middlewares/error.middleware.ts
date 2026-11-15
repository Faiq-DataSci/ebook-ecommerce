import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '../generated/prisma/client.js'
import { AppError } from '../utils/app-error.js'

/**
 * Global Express error handler returning sanitized JSON responses
 * without leaking stack traces or internal database details.
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

  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Format JSON pada request body tidak valid',
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

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: 'Data sudah terdaftar atau duplikat',
        },
      })
      return
    }

    if (err.code === 'P2003') {
      res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: 'Operasi ditolak karena data masih direferensikan oleh entitas lain',
        },
      })
      return
    }

    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Data yang diminta tidak ditemukan',
        },
      })
      return
    }
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
