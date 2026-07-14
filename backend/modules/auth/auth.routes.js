import express from 'express'
import { register, verifyOTP, login, logout, getMe, forgotPassword, resetPassword } from './auth.controller.js'
import { protect } from '../../middleware/authenticate.js'
import rateLimit from 'express-rate-limit'

// Rate limiter for login/register — prevents brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Tightened from 20 to 10 — still generous for legitimate users
  message: { message: 'Too many requests from this IP, please try again later.' }
})

// Rate limiter for password reset — prevents email flooding / user enumeration abuse
const passwordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // Max 5 reset attempts per hour per IP
  message: { message: 'Too many password reset requests. Please try again in an hour.' }
})

const router = express.Router()

router.post('/register', authLimiter, register)
router.post('/verify-otp', authLimiter, verifyOTP)
router.post('/login', authLimiter, login)
router.post('/logout', logout)
router.get('/me', protect, getMe)
router.post('/forgot-password', passwordLimiter, forgotPassword)
router.post('/reset-password', passwordLimiter, resetPassword)

export default router