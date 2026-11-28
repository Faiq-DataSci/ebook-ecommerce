import {
  invalidateAuthCache,
  invalidateCatalogAndSawCache,
} from '../../utils/ttl-cache.js'
import { adminRepository, type AdminRepository } from './admin.repository.js'
import type {
  CreateCategoryInput,
  CreateEbookInput,
  GetAdminCategoriesQuery,
  GetAdminCustomersQuery,
  GetAdminEbooksQuery,
  GetAdminOrdersQuery,
  GetAdminPaymentsQuery,
  GetAdminSalesReportQuery,
  GetAdminTransactionsQuery,
  UpdateCategoryInput,
  UpdateEbookInput,
  UpdateSawWeightsInput,
} from './admin.schema.js'

export class AdminService {
  constructor(private repo: AdminRepository = adminRepository) {}

  async getDashboardSummary() {
    return this.repo.getDashboardSummary()
  }

  async getActiveSawWeights() {
    return this.repo.getActiveSawCriteria()
  }

  async updateSawWeights(input: UpdateSawWeightsInput) {
    const res = await this.repo.updateActiveSawCriteria(input.criteria, input.replaceAll)
    invalidateCatalogAndSawCache()
    return res
  }

  async getAdminEbooks(query: GetAdminEbooksQuery) {
    return this.repo.findAdminEbooks(query)
  }

  async createEbook(input: CreateEbookInput) {
    const res = await this.repo.createEbook(input)
    invalidateCatalogAndSawCache()
    return res
  }

  async updateEbook(id: string, input: UpdateEbookInput) {
    const res = await this.repo.updateEbook(id, input)
    invalidateCatalogAndSawCache()
    return res
  }

  async toggleEbookStatus(id: string, isActive: boolean) {
    const res = await this.repo.toggleEbookStatus(id, isActive)
    invalidateCatalogAndSawCache()
    return res
  }

  async archiveEbook(id: string) {
    const res = await this.repo.archiveEbook(id)
    invalidateCatalogAndSawCache()
    return res
  }

  async getAdminCategories(query: GetAdminCategoriesQuery) {
    return this.repo.findAdminCategories(query)
  }

  async createCategory(input: CreateCategoryInput) {
    const res = await this.repo.createCategory(input)
    invalidateCatalogAndSawCache()
    return res
  }

  async updateCategory(id: string, input: UpdateCategoryInput) {
    const res = await this.repo.updateCategory(id, input)
    invalidateCatalogAndSawCache()
    return res
  }

  async toggleCategoryStatus(id: string, isActive: boolean) {
    const res = await this.repo.toggleCategoryStatus(id, isActive)
    invalidateCatalogAndSawCache()
    return res
  }

  async deleteCategory(id: string) {
    const res = await this.repo.deleteCategory(id)
    invalidateCatalogAndSawCache()
    return res
  }

  async getAdminCustomers(query: GetAdminCustomersQuery) {
    return this.repo.findAdminCustomers(query)
  }

  async getAdminCustomerById(id: string) {
    return this.repo.findAdminCustomerById(id)
  }

  async toggleCustomerStatus(id: string, isActive: boolean) {
    const res = await this.repo.toggleCustomerStatus(id, isActive)
    invalidateAuthCache()
    return res
  }

  async getAdminOrders(query: GetAdminOrdersQuery) {
    return this.repo.findAdminOrders(query)
  }

  async getAdminOrderById(orderId: string) {
    return this.repo.findAdminOrderById(orderId)
  }

  async getAdminPayments(query: GetAdminPaymentsQuery) {
    return this.repo.findAdminPayments(query)
  }

  async getAdminTransactions(query: GetAdminTransactionsQuery) {
    return this.repo.findAdminTransactions(query)
  }

  async getAdminSalesReport(query: GetAdminSalesReportQuery) {
    return this.repo.getAdminSalesReport(query)
  }

  async toggleOrderAccess(orderId: string, isRevoked: boolean, actorUserId?: string) {
    return this.repo.toggleOrderAccess(orderId, isRevoked, actorUserId)
  }

  async toggleAccessById(accessId: string, isRevoked: boolean, actorUserId?: string) {
    return this.repo.toggleAccessById(accessId, isRevoked, actorUserId)
  }
}

export const adminService = new AdminService()

