import { prisma } from '../../config/prisma.js'
import type { User, UserRole } from '../../generated/prisma/client.js'

export interface UpsertUserData {
  supabaseUserId: string
  email: string
  fullName?: string
  phone?: string | null
  role?: UserRole
}

export interface UpdateUserProfileData {
  fullName?: string
  phone?: string | null
}

export class UserRepository {
  async findBySupabaseId(supabaseUserId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { supabaseUserId },
    })
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    })
  }

  async upsertFromSupabase(data: UpsertUserData): Promise<User> {
    const fallbackName = data.fullName || data.email.split('@')[0] || 'User'
    return prisma.user.upsert({
      where: { supabaseUserId: data.supabaseUserId },
      update: {
        email: data.email,
        ...(data.fullName !== undefined ? { fullName: data.fullName } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
        ...(data.role !== undefined ? { role: data.role } : {}),
      },
      create: {
        supabaseUserId: data.supabaseUserId,
        email: data.email,
        fullName: fallbackName,
        phone: data.phone ?? null,
        role: data.role ?? 'CUSTOMER',
      },
    })
  }

  async updateProfile(id: string, data: UpdateUserProfileData): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        ...(data.fullName !== undefined ? { fullName: data.fullName } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
      },
    })
  }
}

export const userRepository = new UserRepository()
