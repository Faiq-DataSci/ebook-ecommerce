import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../../utils/app-error.js'
import { sendSuccess } from '../../utils/response.js'
import { userService } from './user.service.js'

export async function getMeController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHENTICATED', 'Token autentikasi diperlukan')
    }
    const user = await userService.getCurrentUser(req.user)
    sendSuccess(res, user, 200, undefined, 'Profil pengguna ditemukan')
  } catch (err) {
    next(err)
  }
}

export async function updateMeController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHENTICATED', 'Token autentikasi diperlukan')
    }
    const updated = await userService.updateProfile(req.user, req.body)
    sendSuccess(res, updated, 200, undefined, 'Profil berhasil diperbarui')
  } catch (err) {
    next(err)
  }
}
