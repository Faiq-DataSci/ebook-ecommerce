import type {
  CreateCategoryInput,
  CreateEbookInput,
  CriterionWeightInput,
  GetAdminCategoriesQuery,
  GetAdminCustomersQuery,
  GetAdminEbooksQuery,
  GetAdminOrdersQuery,
  GetAdminPaymentsQuery,
  GetAdminSalesReportQuery,
  GetAdminTransactionsQuery,
  UpdateCategoryInput,
  UpdateEbookInput,
} from './admin.schema.js'
import {
  createAdminCategoryRecord,
  deleteAdminCategoryRecord,
  findAdminCategoryRecords,
  toggleAdminCategoryStatusRecord,
  updateAdminCategoryRecord,
} from './repositories/admin-category.repository.js'
import {
  findAdminCustomerByIdRecord,
  findAdminCustomerRecords,
  toggleAdminCustomerStatusRecord,
} from './repositories/admin-customer.repository.js'
import {
  type DashboardSummary,
  getDashboardSummaryRecord,
} from './repositories/admin-dashboard.repository.js'
import {
  createAdminEbookRecord,
  findAdminEbookRecords,
  toggleAdminEbookStatusRecord,
  updateAdminEbookRecord,
} from './repositories/admin-ebook.repository.js'
import {
  getActiveSawCriteriaRecords,
  resetActiveCriteriaStore,
  updateActiveSawCriteriaRecords,
} from './repositories/admin-saw.repository.js'
import {
  findAdminOrderByIdRecord,
  findAdminOrderRecords,
  findAdminPaymentRecords,
  findAdminTransactionRecords,
  getAdminSalesReportRecord,
  toggleAdminAccessByIdRecord,
  toggleAdminOrderAccessRecord,
} from './repositories/admin-transaction.repository.js'

export { resetActiveCriteriaStore }

export class AdminRepository {
  async getDashboardSummary(): Promise<DashboardSummary> {
    return getDashboardSummaryRecord()
  }

  async getActiveSawCriteria() {
    return getActiveSawCriteriaRecords()
  }

  async updateActiveSawCriteria(updates: CriterionWeightInput[], replaceAll = false) {
    return updateActiveSawCriteriaRecords(updates, replaceAll)
  }

  async findAdminEbooks(query: GetAdminEbooksQuery) {
    return findAdminEbookRecords(query)
  }

  async createEbook(data: CreateEbookInput) {
    return createAdminEbookRecord(data)
  }

  async updateEbook(id: string, data: UpdateEbookInput) {
    return updateAdminEbookRecord(id, data)
  }

  async toggleEbookStatus(id: string, isActive: boolean) {
    return toggleAdminEbookStatusRecord(id, isActive)
  }

  async archiveEbook(id: string) {
    return this.toggleEbookStatus(id, false)
  }

  async findAdminCategories(query: GetAdminCategoriesQuery) {
    return findAdminCategoryRecords(query)
  }

  async createCategory(data: CreateCategoryInput) {
    return createAdminCategoryRecord(data)
  }

  async updateCategory(id: string, data: UpdateCategoryInput) {
    return updateAdminCategoryRecord(id, data)
  }

  async toggleCategoryStatus(id: string, isActive: boolean) {
    return toggleAdminCategoryStatusRecord(id, isActive)
  }

  async deleteCategory(id: string) {
    return deleteAdminCategoryRecord(id)
  }

  async findAdminCustomers(query: GetAdminCustomersQuery) {
    return findAdminCustomerRecords(query)
  }

  async findAdminCustomerById(id: string) {
    return findAdminCustomerByIdRecord(id)
  }

  async toggleCustomerStatus(id: string, isActive: boolean) {
    return toggleAdminCustomerStatusRecord(id, isActive)
  }

  async findAdminOrders(query: GetAdminOrdersQuery) {
    return findAdminOrderRecords(query)
  }

  async findAdminOrderById(orderId: string) {
    return findAdminOrderByIdRecord(orderId)
  }

  async findAdminPayments(query: GetAdminPaymentsQuery) {
    return findAdminPaymentRecords(query)
  }

  async findAdminTransactions(query: GetAdminTransactionsQuery) {
    return findAdminTransactionRecords(query)
  }

  async getAdminSalesReport(query: GetAdminSalesReportQuery) {
    return getAdminSalesReportRecord(query)
  }

  async toggleOrderAccess(orderId: string, isRevoked: boolean, actorUserId?: string) {
    return toggleAdminOrderAccessRecord(orderId, isRevoked, actorUserId)
  }

  async toggleAccessById(accessId: string, isRevoked: boolean, actorUserId?: string) {
    return toggleAdminAccessByIdRecord(accessId, isRevoked, actorUserId)
  }
}

export const adminRepository = new AdminRepository()
