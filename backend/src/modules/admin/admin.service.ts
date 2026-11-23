import { adminRepository, type AdminRepository } from './admin.repository.js'
import type { UpdateSawWeightsInput } from './admin.schema.js'

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
}

export const adminService = new AdminService()
