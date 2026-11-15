import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { app } from '../src/app.js'

describe('Backend Foundation Health & Auth Guard', () => {
  it('GET /api/v1/health returns 200 OK', async () => {
    const response = await request(app).get('/api/v1/health')

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.status).toBe('ok')
  })

  it('GET /api/v1/admin/ping without token returns 401 UNAUTHENTICATED', async () => {
    const response = await request(app).get('/api/v1/admin/ping')

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
    expect(response.body.error.code).toBe('UNAUTHENTICATED')
  })

  it('GET /api/v1/non-existent returns 404 NOT_FOUND JSON', async () => {
    const response = await request(app).get('/api/v1/non-existent')

    expect(response.status).toBe(404)
    expect(response.body.success).toBe(false)
    expect(response.body.error.code).toBe('NOT_FOUND')
  })
})
