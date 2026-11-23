import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../../utils/app-error.js'
import { sendSuccess } from '../../utils/response.js'
import type { GetMyTransactionsQuery } from './transaction.schema.js'
import { transactionService } from './transaction.service.js'

export async function getMyTransactionsController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHENTICATED', 'Token autentikasi diperlukan')
    }

    const query = req.query as unknown as GetMyTransactionsQuery
    const { items, meta } = await transactionService.getMyTransactions(req.user, query)
    sendSuccess(res, items, 200, meta, 'Riwayat transaksi berhasil diambil')
  } catch (err) {
    next(err)
  }
}
