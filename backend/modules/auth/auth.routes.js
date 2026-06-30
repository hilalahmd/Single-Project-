import express from 'express'
import { register, verifyOTP, login, logout, getMe , forgotPassword , resetPassword } from './auth.controller.js'
import { protect } from '../../middleware/authenticate.js'

const router = express.Router()

router.post('/register', register)
router.post('/verify-otp', verifyOTP)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me',protect,getMe)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)


export default router