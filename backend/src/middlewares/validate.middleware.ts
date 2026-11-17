import type { NextFunction, Request, Response } from 'express'
import type { ZodTypeAny } from 'zod'

interface ValidationSchemas {
  body?: ZodTypeAny
  query?: ZodTypeAny
  params?: ZodTypeAny
}

/**
 * Validates HTTP body, query, and params against Zod schemas before reaching controllers.
 */
export function validate(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body)
      }
      if (schemas.query) {
        const parsedQuery = schemas.query.parse(req.query)
        Object.defineProperty(req, 'query', {
          value: parsedQuery,
          writable: true,
          configurable: true,
          enumerable: true,
        })
      }
      if (schemas.params) {
        const parsedParams = schemas.params.parse(req.params)
        Object.defineProperty(req, 'params', {
          value: parsedParams,
          writable: true,
          configurable: true,
          enumerable: true,
        })
      }
      next()
    } catch (err) {
      next(err)
    }
  }
}
