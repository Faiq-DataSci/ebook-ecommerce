import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../../utils/app-error.js'
import { sendSuccess } from '../../utils/response.js'
import type { EbookAccessParam } from './ebook-access.schema.js'
import { ebookAccessService } from './ebook-access.service.js'

export async function getSignedAccessUrlController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHENTICATED', 'Token autentikasi diperlukan')
    }
    const params = req.params as unknown as EbookAccessParam
    const result = await ebookAccessService.getSignedAccessUrl(req.user, params.id)
    sendSuccess(res, result, 200, undefined, 'Signed URL akses file e-book berhasil diterbitkan')
  } catch (err) {
    next(err)
  }
}
