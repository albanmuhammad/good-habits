import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email wajib diisi.')
    .email('Email tidak valid.'),
  password: z
    .string()
    .min(1, 'Password wajib diisi.')
    .min(6, 'Password minimal 6 karakter.'),
})
export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = loginSchema.extend({
  // override ulang rule password (boleh sama dengan loginSchema)
  password: z
    .string()
    .min(1, 'Password wajib diisi.')
    .min(6, 'Password minimal 6 karakter.'),
  confirmPassword: z
    .string()
    .min(1, 'Konfirmasi password wajib diisi.')
    .min(6, 'Konfirmasi password minimal 6 karakter.'),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['confirmPassword'],
      message: 'Konfirmasi password tidak cocok.',
    })
  }
})
export type RegisterFormValues = z.infer<typeof registerSchema>
