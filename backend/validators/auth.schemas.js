import { z } from 'zod'

/**
 * loginSchema — validates POST /auth/login request body.
 * Kept intentionally lenient per Risk 3:
 *   - TrainerLoginPage and LoginPage share the same endpoint.
 *   - We validate email format and non-empty password ONLY.
 *   - No password complexity rules here — those belong on register.
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required.' })
    .min(1, 'Email is required.')
    .email('Please enter a valid email address.'),

  password: z
    .string({ required_error: 'Password is required.' })
    .min(1, 'Password is required.'),
})

/**
 * registerSchema — validates POST /auth/register request body.
 * Standardized to 8-character minimum (matches frontend, fixes Risk 1).
 * Backend reads `name` from req.body — AuthContext maps fullName → name (Risk 2 preserved).
 */
export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required1.' })
    .min(2, 'Name must be at least  characters.')
    .max(60, 'Name must be under 60 characters.')
    .trim(),

  email: z
    .string({ required_error: 'Email is required.' })
    .min(1, 'Email is required.')
    .email('Please enter a valid email address.'),

  password: z
    .string({ required_error: 'Password is required.' })
    .min(8, 'Password must be at least 8 characters.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one number.'),

  // role is optional — defaults to 'user' in the controller
  role: z
    .enum(['user', 'trainer', 'wellness_coach', 'admin'])
    .optional(),
})