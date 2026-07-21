import express from 'express'
import { protect, restrictTo } from '../../middleware/authenticate.js'
import {
  requestPayout,
  getTrainerPayouts,
  getAllPayouts,
  processPayout
} from './payout.controller.js'

const router = express.Router()

// Trainer Routes
router.post('/request', protect, restrictTo('trainer', 'wellness_coach'), requestPayout)
router.get('/my-payouts', protect, restrictTo('trainer', 'wellness_coach'), getTrainerPayouts)

// Admin Routes
router.get('/all', protect, restrictTo('admin'), getAllPayouts)
router.patch('/:id/process', protect, restrictTo('admin'), processPayout)

export default router
