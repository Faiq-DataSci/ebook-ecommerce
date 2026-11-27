import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { app } from '../../src/app.js'
import { sanitizeRequestBody } from '../../src/middlewares/security.middleware.js'

describe('Security Hardening & Defense-in-Depth', () => {
  it('sets strict security headers and removes X-Powered-By', async () => {
    const res = await request(app).get('/api/v1/health')

    expect(res.status).toBe(200)
    expect(res.headers['x-powered-by']).toBeUndefined()
    expect(res.headers['x-frame-options']).toBe('DENY')
    expect(res.headers['x-content-type-options']).toBe('nosniff')
    expect(res.headers['referrer-policy']).toBe('no-referrer')
  })

  it('sets Cache-Control: no-store on sensitive admin routes', async () => {
    const res = await request(app).get('/api/v1/admin/ping')

    expect(res.status).toBe(401)
    expect(res.headers['cache-control']).toContain('no-store')
  })

  it('strips prototype pollution keys (__proto__, constructor, prototype) from request bodies', () => {
    const malicious = JSON.parse(
      '{"name":"Safe","__proto__":{"isAdmin":true},"nested":{"constructor":"bad","ok":1}}',
    )
    const req = { body: malicious } as any
    let nextCalled = false

    sanitizeRequestBody(req, {} as any, () => {
      nextCalled = true
    })

    expect(nextCalled).toBe(true)
    expect(req.body.name).toBe('Safe')
    expect(Object.prototype.hasOwnProperty.call(req.body, '__proto__')).toBe(false)
    expect(Object.prototype.hasOwnProperty.call(req.body.nested, 'constructor')).toBe(false)
    expect(req.body.nested.ok).toBe(1)
  })
})
