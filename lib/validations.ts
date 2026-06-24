import { z } from 'zod'

export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address.').max(254),
})

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.').max(100).trim(),
  email: z.string().email('Please enter a valid email address.').max(254),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters.')
    .max(2000, 'Message must not exceed 2000 characters.')
    .trim(),
})

export type NewsletterInput = z.infer<typeof newsletterSchema>
export type ContactInput = z.infer<typeof contactSchema>
