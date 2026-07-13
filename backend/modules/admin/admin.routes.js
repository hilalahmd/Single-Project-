import express from 'express'
import { 
  getAllTrainers, approveTrainer, rejectTrainer, suspendTrainer, 
  getAdminDashboardStats, getAllUsers, getPendingPayouts,
  getAllManagers, createManager, updateManagerStatus, deleteManager
} from './admin.controller.js'
import { protect } from '../../middleware/authenticate.js'
import { restrictTo } from '../../middleware/authorize.js'

const router = express.Router()

router.get('/trainers', protect, restrictTo('admin'), getAllTrainers)
router.put('/trainers/:id/approve', protect, restrictTo('admin'), approveTrainer)
router.put('/trainers/:id/reject', protect, restrictTo('admin'), rejectTrainer)
router.put('/trainers/:id/suspend', protect, restrictTo('admin'), suspendTrainer)
router.get('/dashboard', protect, restrictTo('admin'), getAdminDashboardStats)
router.get('/users', protect, restrictTo('admin'), getAllUsers)
router.get('/payouts', protect, restrictTo('admin'), getPendingPayouts)

// Manager routes
router.get('/managers', protect, restrictTo('admin'), getAllManagers)
router.post('/managers', protect, restrictTo('admin'), createManager)
router.put('/managers/:id', protect, restrictTo('admin'), updateManagerStatus)
router.delete('/managers/:id', protect, restrictTo('admin'), deleteManager)

export default router