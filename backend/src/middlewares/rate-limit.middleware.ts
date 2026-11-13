import rateLimit from 'express-rate-limit'

/**
 * Stricter rate limiter for authentication and payment endpoints.
 */
export const sensitiveEndpointLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Terlalu banyak permintaan, silakan coba lagi nanti',
    },
  },
})
