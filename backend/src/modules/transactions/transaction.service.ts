import type { AuthenticatedUser } from '../../middlewares/auth.middleware.js'
import { AppError } from '../../utils/app-error.js'
import { userRepository, type UserRepository } from '../users/user.repository.js'
import { transactionRepository, type TransactionRepository } from './transaction.repository.js'
import type { GetMyTransactionsQuery } from './transaction.schema.js'

export class TransactionService {
  constructor(
    private transactionRepo: TransactionRepository = transactionRepository,
    private userRepo: UserRepository = userRepository,
  ) {}

  async getMyTransactions(authUser: AuthenticatedUser, query: GetMyTransactionsQuery) {
    const user = await this.userRepo.findBySupabaseId(authUser.id)
    if (!user) {
      throw new AppError(404, 'NOT_FOUND', 'Pengguna belum terdaftar di database sistem')
    }

    const { items, total } = await this.transactionRepo.findByUserId(user.id, query)

    return {
      items,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit) || 1,
      },
    }
  }
}

export const transactionService = new TransactionService()
