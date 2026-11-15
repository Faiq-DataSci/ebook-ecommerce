import type { NextFunction, Request, Response } from 'express'
import { describe, expect, it, vi } from 'vitest'
import { Prisma } from '../../src/generated/prisma/client.js'
import { errorHandler } from '../../src/middlewares/error.middleware.js'
import { AppError } from '../../src/utils/app-error.js'

function createMockResponse() {
  const json = vi.fn()
  const status = vi.fn(() => ({ json }))
  return {
    res: { status } as unknown as Response,
    status,
    json,
  }
}

describe('errorHandler middleware', () => {
  const req = {} as Request
  const next = vi.fn() as unknown as NextFunction

  it('formats AppError cleanly', () => {
    const { res, status, json } = createMockResponse()

    errorHandler(new AppError(403, 'FORBIDDEN', 'Akses ditolak'), req, res, next)

    expect(status).toHaveBeenCalledWith(403)
    expect(json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Akses ditolak',
      },
    })
  })

  it('maps Prisma P2002 to 409 CONFLICT without leaking DB details', () => {
    const { res, status, json } = createMockResponse()
    const err = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
      code: 'P2002',
      clientVersion: '7.10.1',
    })

    errorHandler(err, req, res, next)

    expect(status).toHaveBeenCalledWith(409)
    expect(json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'CONFLICT',
        message: 'Data sudah terdaftar atau duplikat',
      },
    })
  })

  it('maps Prisma P2025 to 404 NOT_FOUND', () => {
    const { res, status, json } = createMockResponse()
    const err = new Prisma.PrismaClientKnownRequestError('Record not found', {
      code: 'P2025',
      clientVersion: '7.10.1',
    })

    errorHandler(err, req, res, next)

    expect(status).toHaveBeenCalledWith(404)
    expect(json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Data yang diminta tidak ditemukan',
      },
    })
  })
})
