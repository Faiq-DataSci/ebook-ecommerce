import type { AuthenticatedUser } from '../../middlewares/auth.middleware.js'
import { AppError } from '../../utils/app-error.js'
import { userRepository, type UserRepository } from './user.repository.js'
import type { SyncUserInput, UpdateProfileInput } from './user.schema.js'

export class UserService {
  constructor(private userRepo: UserRepository = userRepository) {}

  async syncUser(authUser: AuthenticatedUser, input?: SyncUserInput) {
    const user = await this.userRepo.upsertFromSupabase({
      supabaseUserId: authUser.id,
      email: authUser.email,
      fullName: input?.fullName,
      phone: input?.phone,
      role: authUser.role,
    })

    if (!user.isActive) {
      throw new AppError(403, 'FORBIDDEN', 'Akun pengguna telah dinonaktifkan')
    }

    return user
  }

  async getCurrentUser(authUser: AuthenticatedUser) {
    const user = await this.userRepo.findBySupabaseId(authUser.id)
    if (!user) {
      throw new AppError(404, 'NOT_FOUND', 'Profil pengguna belum disinkronkan ke database')
    }

    if (!user.isActive) {
      throw new AppError(403, 'FORBIDDEN', 'Akun pengguna telah dinonaktifkan')
    }

    return user
  }

  async updateProfile(authUser: AuthenticatedUser, input: UpdateProfileInput) {
    const existing = await this.getCurrentUser(authUser)
    return this.userRepo.updateProfile(existing.id, input)
  }
}

export const userService = new UserService()
