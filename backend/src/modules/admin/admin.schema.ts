import { z } from 'zod'

export const criterionWeightInputSchema = z.object({
  id: z.string().min(1, 'ID kriteria wajib diisi'),
  weight: z.number().gt(0, 'Bobot kriteria harus lebih besar dari 0'),
})

export const updateSawWeightsSchema = z.object({
  criteria: z
    .array(criterionWeightInputSchema)
    .min(1, 'Minimal 1 kriteria harus disertakan'),
})

export type UpdateSawWeightsInput = z.infer<typeof updateSawWeightsSchema>
