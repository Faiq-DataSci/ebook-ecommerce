import { describe, expect, it, vi } from 'vitest'
import type { AuthenticatedUser } from '../../src/middlewares/auth.middleware.js'
import type { UserRepository } from '../../src/modules/users/user.repository.js'
import { UserService } from '../../src/modules/users/user.service.js'
import { AppError } from '../../src/utils/app-error.js'

describe('UserService Unit Tests', () => {
  const mockAuthUser: AuthenticatedUser = {
    id: 'supabase-user-001',
    email: 'customer@example.com',
    role: 'CUSTOMER',
  }

  const mockDbUser = {
    id: '00000000-0000-4000-8000-000000000001',
    supabaseUserId: 'supabase-user-001',
    fullName: 'DATA SIMULASI - Customer',
    email: 'customer@example.com',
    phone: '08123456789',
    role: 'CUSTOMER' as const,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('syncUser successfully creates or updates user and returns record', async () => {
    const mockRepo: Partial<UserRepository> = {
      upsertFromSupabase: vi.fn().mockResolvedValue(mockDbUser),
    }

    const service = new UserService(mockRepo as UserRepository)
    const result = await service.syncUser(mockAuthUser, {
      fullName: 'DATA SIMULASI - Customer',
      phone: '08123456789',
    })

    expect(mockRepo.upsertFromSupabase).toHaveBeenCalledWith({
      supabaseUserId: 'supabase-user-001',
      email: 'customer@example.com',
      fullName: 'DATA SIMULASI - Customer',
      phone: '08123456789',
      role: 'CUSTOMER',
    })
    expect(result).toEqual(mockDbUser)
  })

  it('syncUser throws 403 if user account is deactivated', async () => {
    const inactiveUser = { ...mockDbUser, isActive: false }
    const mockRepo: Partial<UserRepository> = {
      upsertFromSupabase: vi.fn().mockResolvedValue(inactiveUser),
    }

    const service = new UserService(mockRepo as UserRepository)

    await expect(service.syncUser(mockAuthUser)).rejects.toThrow(AppError)
    await expect(service.syncUser(mockAuthUser)).rejects.toMatchObject({
      statusCode: 403,
      code: 'FORBIDDEN',
    })
  })

  it('getCurrentUser returns user profile when user exists and is active', async () => {
    const mockRepo: Partial<UserRepository> = {
      findBySupabaseId: vi.fn().mockResolvedValue(mockDbUser),
    }

    const service = new UserService(mockRepo as UserRepository)
    const result = await service.getCurrentUser(mockAuthUser)

    expect(mockRepo.findBySupabaseId).toHaveBeenCalledWith('supabase-user-001')
    expect(result).toEqual(mockDbUser)
  })

  it('getCurrentUser throws 404 when user is not found in database', async () => {
    const mockRepo: Partial<UserRepository> = {
      findBySupabaseId: vi.fn().mockResolvedValue(null),
    }

    const service = new UserService(mockRepo as UserRepository)

    await expect(service.getCurrentUser(mockAuthUser)).rejects.toMatchObject({
      statusCode: 404,
      code: 'NOT_FOUND',
    })
  })

  it('getCurrentUser throws 403 when user is deactivated', async () => {
    const inactiveUser = { ...mockDbUser, isActive: false }
    const mockRepo: Partial<UserRepository> = {
      findBySupabaseId: vi.fn().mockResolvedValue(inactiveUser),
    }

    const service = new UserService(mockRepo as UserRepository)

    await expect(service.getCurrentUser(mockAuthUser)).rejects.toMatchObject({
      statusCode: 403,
      code: 'FORBIDDEN',
    })
  })

  it('updateProfile updates fullName and phone of existing user', async () => {
    const updatedUser = {
      ...mockDbUser,
      fullName: 'Nama Baru',
      phone: '08999999999',
    }

    const mockRepo: Partial<UserRepository> = {
      findBySupabaseId: vi.fn().mockResolvedValue(mockDbUser),
      updateProfile: vi.fn().mockResolvedValue(updatedUser),
    }

    const service = new UserService(mockRepo as UserRepository)
    const result = await service.updateProfile(mockAuthUser, {
      fullName: 'Nama Baru',
      phone: '08999999999',
    })

    expect(mockRepo.updateProfile).toHaveBeenCalledWith(mockDbUser.id, {
      fullName: 'Nama Baru',
      phone: '08999999999',
    })
    expect(result.fullName).toBe('Nama Baru')
    expect(result.phone).toBe('08999999999')
  })
})
