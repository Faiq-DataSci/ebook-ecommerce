import { adminRepository, type AdminRepository } from './admin.repository.js'
import type {
  CreateEbookInput,
  GetAdminEbooksQuery,
  UpdateEbookInput,
  UpdateSawWeightsInput,
} from './admin.schema.js'

export class AdminService {
  constructor(private repo: AdminRepository = adminRepository) {}

  async getDashboardSummary() {
    return this.repo.getDashboardSummary()
  }

  getActiveSawWeights() {
    return this.repo.getActiveSawCriteria()
  }

  updateSawWeights(input: UpdateSawWeightsInput) {
    return this.repo.updateActiveSawCriteria(input.criteria)
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
}

export const adminService = new AdminService()

