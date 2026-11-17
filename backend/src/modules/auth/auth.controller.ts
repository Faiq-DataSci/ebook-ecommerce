import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../../utils/app-error.js'
import { sendSuccess } from '../../utils/response.js'
import { userService } from '../users/user.service.js'

export async function syncAuthController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHENTICATED', 'Token autentikasi diperlukan')
    }
    const user = await userService.syncUser(req.user, req.body)
    sendSuccess(res, user, 200, undefined, 'Profil pengguna berhasil disinkronkan')
  } catch (err) {
    next(err)
  }
}
