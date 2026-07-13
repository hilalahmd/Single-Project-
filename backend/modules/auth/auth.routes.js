import express from 'express'
import { register, verifyOTP, login, logout, getMe , forgotPassword , resetPassword } from './auth.controller.js'
import { protect } from '../../middleware/authenticate.js'
import rateLimit from 'express-rate-limit'

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again later.' }
})

const router = express.Router()

router.post('/register', authLimiter, register)
router.post('/verify-otp', authLimiter, verifyOTP)
router.post('/login', authLimiter, login)
router.post('/logout', logout)
router.get('/me',protect,getMe)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)


export default router