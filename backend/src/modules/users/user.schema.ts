import { z } from 'zod'

export const syncUserSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Nama lengkap minimal 2 karakter')
      .max(120, 'Nama lengkap maksimal 120 karakter')
      .optional(),
    phone: z
      .string()
      .trim()
      .max(25, 'Nomor telepon maksimal 25 karakter')
      .nullable()
      .optional(),
  })
  .optional()

export const updateProfileSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Nama lengkap minimal 2 karakter')
      .max(120, 'Nama lengkap maksimal 120 karakter')
      .optional(),
    phone: z
      .string()
      .trim()
      .max(25, 'Nomor telepon maksimal 25 karakter')
      .nullable()
      .optional(),
  })
  .refine((data) => data.fullName !== undefined || data.phone !== undefined, {
    message: 'Minimal satu bidang (fullName atau phone) harus disediakan untuk pembaruan profil',
  })

export type SyncUserInput = z.infer<typeof syncUserSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
