import type { Response } from 'express'

export interface ApiSuccessResponse<T> {
  success: true
  message?: string
  data: T
  meta?: Record<string, unknown>
}

/**
 * Sends a standardized JSON success envelope while omitting undefined optional fields.
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: Record<string, unknown>,
  message?: string,
): void {
  const payload: ApiSuccessResponse<T> = {
    success: true,
    ...(message !== undefined ? { message } : {}),
    data,
    ...(meta !== undefined ? { meta } : {}),
  }
  res.status(statusCode).json(payload)
}
