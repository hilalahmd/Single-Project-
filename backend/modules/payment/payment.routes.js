import express from 'express'
import { 
  createOrder, 
  verifyPayment, 
  getRazorpayKey,
  createTrainerSubscriptionOrder,
  verifyTrainerSubscription,
  getTrainerTransactions
} from './payment.controller.js'
import { protect, restrictTo } from '../../middleware/authenticate.js'

const router = express.Router()

router.post('/create-order', protect, createOrder)
router.post('/verify', protect, verifyPayment)
router.get('/key', protect, getRazorpayKey)

// Trainer Platform Subscription Routes
router.post('/trainer-subscription/create-order', protect, restrictTo('trainer', 'wellness_coach'), createTrainerSubscriptionOrder)
router.post('/trainer-subscription/verify', protect, restrictTo('trainer', 'wellness_coach'), verifyTrainerSubscription)
router.get('/trainer-transactions', protect, restrictTo('trainer', 'wellness_coach'), getTrainerTransactions)

export default router
