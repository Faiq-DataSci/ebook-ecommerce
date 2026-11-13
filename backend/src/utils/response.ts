import type { Response } from 'express';

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: Record<string, unknown>,
): void {
  const payload: ApiSuccessResponse<T> = meta
    ? { success: true, data, meta }
    : { success: true, data };
  res.status(statusCode).json(payload);
}
