import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import { app } from '../../src/app.js'
import * as supabaseConfig from '../../src/config/supabase.js'
import { userService } from '../../src/modules/users/user.service.js'

describe('Auth & User Routes Integration', () => {
  it('POST /api/v1/auth/sync returns 401 when no token is provided', async () => {
    const res = await request(app).post('/api/v1/auth/sync').send({})
    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
    expect(res.body.error.code).toBe('UNAUTHENTICATED')
  })

  it('GET /api/v1/users/me returns 401 when no token is provided', async () => {
    const res = await request(app).get('/api/v1/users/me')
    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
    expect(res.body.error.code).toBe('UNAUTHENTICATED')
  })

  it('PATCH /api/v1/users/me returns 401 when no token is provided', async () => {
    const res = await request(app).patch('/api/v1/users/me').send({ fullName: 'Budi' })
    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
    expect(res.body.error.code).toBe('UNAUTHENTICATED')
  })

  it('POST /api/v1/auth/sync successfully synchronizes authenticated user profile', async () => {
    const mockSupabaseAdmin = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'supa-user-123',
              email: 'budi@example.com',
              app_metadata: { role: 'CUSTOMER' },
            },
          },
          error: null,
        }),
      },
    }
    vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockSupabaseAdmin as any)

    const mockSyncedUser = {
      id: '00000000-0000-4000-8000-000000000099',
      supabaseUserId: 'supa-user-123',
      fullName: 'Budi Santoso',
      email: 'budi@example.com',
      phone: '081234567890',
      role: 'CUSTOMER' as const,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    vi.spyOn(userService, 'syncUser').mockResolvedValue(mockSyncedUser as any)

    const res = await request(app)
      .post('/api/v1/auth/sync')
      .set('Authorization', 'Bearer valid-test-token')
      .send({
        fullName: 'Budi Santoso',
        phone: '081234567890',
      })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.fullName).toBe('Budi Santoso')
    expect(res.body.message).toBe('Profil pengguna berhasil disinkronkan')
  })

  it('GET /api/v1/users/me returns profile for authenticated user', async () => {
    const mockSupabaseAdmin = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'supa-user-123',
              email: 'budi@example.com',
              app_metadata: { role: 'CUSTOMER' },
            },
          },
          error: null,
        }),
      },
    }
    vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockSupabaseAdmin as any)

    const mockProfile = {
      id: '00000000-0000-4000-8000-000000000099',
      supabaseUserId: 'supa-user-123',
      fullName: 'Budi Santoso',
      email: 'budi@example.com',
      phone: '081234567890',
      role: 'CUSTOMER' as const,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    vi.spyOn(userService, 'getCurrentUser').mockResolvedValue(mockProfile as any)

    const res = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', 'Bearer valid-test-token')

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.email).toBe('budi@example.com')
    expect(res.body.message).toBe('Profil pengguna ditemukan')
  })

  it('PATCH /api/v1/users/me validates request body and rejects empty payloads', async () => {
    const mockSupabaseAdmin = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'supa-user-123',
              email: 'budi@example.com',
              app_metadata: { role: 'CUSTOMER' },
            },
          },
          error: null,
        }),
      },
    }
    vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockSupabaseAdmin as any)

    const res = await request(app)
      .patch('/api/v1/users/me')
      .set('Authorization', 'Bearer valid-test-token')
      .send({})

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('PATCH /api/v1/users/me updates profile successfully when valid', async () => {
    const mockSupabaseAdmin = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'supa-user-123',
              email: 'budi@example.com',
              app_metadata: { role: 'CUSTOMER' },
            },
          },
          error: null,
        }),
      },
    }
    vi.spyOn(supabaseConfig, 'getSupabaseAdmin').mockReturnValue(mockSupabaseAdmin as any)

    const mockUpdatedUser = {
      id: '00000000-0000-4000-8000-000000000099',
      supabaseUserId: 'supa-user-123',
      fullName: 'Budi Santoso Diperbarui',
      email: 'budi@example.com',
      phone: '081299998888',
      role: 'CUSTOMER' as const,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    vi.spyOn(userService, 'updateProfile').mockResolvedValue(mockUpdatedUser as any)

    const res = await request(app)
      .patch('/api/v1/users/me')
      .set('Authorization', 'Bearer valid-test-token')
      .send({
        fullName: 'Budi Santoso Diperbarui',
        phone: '081299998888',
      })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.fullName).toBe('Budi Santoso Diperbarui')
    expect(res.body.message).toBe('Profil berhasil diperbarui')
  })
})
