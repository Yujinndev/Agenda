import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().email({
    message: 'Email is invalid',
  }),
  password: z.string().min(8, {
    message: 'Password must contain at least 8 character(s)',
  }),
})

export const registerUserSchema = z.object({
  firstName: z.string().min(1, {
    message: 'First Name is required',
  }),
  lastName: z.string().min(1, {
    message: 'Last Name is required',
  }),
  middleName: z.string().optional(),
  email: z.string().email({
    message: 'Email is invalid',
  }),
  password: z.string().min(8, {
    message: 'Password must contain at least 8 character(s)',
  }),
})
