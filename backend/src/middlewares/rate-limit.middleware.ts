import rateLimit from 'express-rate-limit'
import { env } from '../config/env.js'

const skipInTest = () => env.NODE_ENV === 'test'

/**
 * General API rate limiter for all /api/v1 endpoints.
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInTest,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi nanti',
    },
  },
})

/**
 * Stricter rate limiter for authentication, payment, and admin endpoints.
 */
export const sensitiveEndpointLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInTest,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Terlalu banyak permintaan, silakan coba lagi nanti',
    },
  },
})
