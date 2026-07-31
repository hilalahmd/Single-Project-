import express from 'express'
import { register, verifyOTP, login, logout, getMe, forgotPassword, resetPassword } from './auth.controller.js'
import { protect } from '../../middleware/authenticate.js'
import rateLimit from 'express-rate-limit'
import validateRequest from '../../validators/validateRequest.js'
import { loginSchema, registerSchema } from '../../validators/auth.schemas.js'

// Rate limiter for login/register — prevents brute-force attacks
// Development-il 100 requests allow cheyyunnu, production-il 10 mathram
const isDev = process.env.NODE_ENV !== 'production'
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 100 : 10, // Dev: 100, Prod: 10 — dev-il testing easy aavaan
  message: { message: 'Too many requests from this IP, please try again later.' }
})

// Rate limiter for password reset — prevents email flooding / user enumeration abuse
const passwordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // Max 5 reset attempts per hour per IP
  message: { message: 'Too many password reset requests. Please try again in an hour.' }
})

const router = express.Router()

router.post('/register', authLimiter, validateRequest(registerSchema), register)
router.post('/verify-otp', authLimiter, verifyOTP)
router.post('/login', authLimiter, validateRequest(loginSchema), login)
router.post('/logout', logout)
router.get('/me', protect, getMe)
router.post('/forgot-password', passwordLimiter, forgotPassword)
router.post('/reset-password', passwordLimiter, resetPassword)

export default router