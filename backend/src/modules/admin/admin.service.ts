import { adminRepository, type AdminRepository } from './admin.repository.js'
import type {
  CreateCategoryInput,
  CreateEbookInput,
  GetAdminCategoriesQuery,
  GetAdminCustomersQuery,
  GetAdminEbooksQuery,
  GetAdminOrdersQuery,
  GetAdminPaymentsQuery,
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
    return this.repo.updateActiveSawCriteria(input.criteria, input.replaceAll)
  }

  async getAdminEbooks(query: GetAdminEbooksQuery) {
    return this.repo.findAdminEbooks(query)
  }

  async createEbook(input: CreateEbookInput) {
    return this.repo.createEbook(input)
  }

  async updateEbook(id: string, input: UpdateEbookInput) {
    return this.repo.updateEbook(id, input)
  }

  async toggleEbookStatus(id: string, isActive: boolean) {
    return this.repo.toggleEbookStatus(id, isActive)
  }

  async archiveEbook(id: string) {
    return this.repo.archiveEbook(id)
  }

  async getAdminCategories(query: GetAdminCategoriesQuery) {
    return this.repo.findAdminCategories(query)
  }

  async createCategory(input: CreateCategoryInput) {
    return this.repo.createCategory(input)
  }

  async updateCategory(id: string, input: UpdateCategoryInput) {
    return this.repo.updateCategory(id, input)
  }

  async toggleCategoryStatus(id: string, isActive: boolean) {
    return this.repo.toggleCategoryStatus(id, isActive)
  }

  async deleteCategory(id: string) {
    return this.repo.deleteCategory(id)
  }

  async getAdminCustomers(query: GetAdminCustomersQuery) {
    return this.repo.findAdminCustomers(query)
  }

  async getAdminCustomerById(id: string) {
    return this.repo.findAdminCustomerById(id)
  }

  async toggleCustomerStatus(id: string, isActive: boolean) {
    return this.repo.toggleCustomerStatus(id, isActive)
  }

  async getAdminOrders(query: GetAdminOrdersQuery) {
    return this.repo.findAdminOrders(query)
  }

  async getAdminPayments(query: GetAdminPaymentsQuery) {
    return this.repo.findAdminPayments(query)
  }

  async toggleOrderAccess(orderId: string, isRevoked: boolean, actorUserId?: string) {
    return this.repo.toggleOrderAccess(orderId, isRevoked, actorUserId)
  }
}

export const adminService = new AdminService()

