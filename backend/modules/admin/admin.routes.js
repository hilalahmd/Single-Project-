import express from 'express'
import { 
  getAllTrainers, approveTrainer, rejectTrainer, suspendTrainer, 
  getAdminDashboardStats, getAllUsers, getPendingPayouts, suspendUser, deleteUser,
  getAdminRevenueStats
} from './admin.controller.js'
import { getAuditLogs } from './audit.controller.js'
import { protect } from '../../middleware/authenticate.js'
import { restrictTo } from '../../middleware/authorize.js'

const router = express.Router()

router.get('/trainers', protect, restrictTo('admin', 'manager'), getAllTrainers)
router.put('/trainers/:id/approve', protect, restrictTo('admin', 'manager'), approveTrainer)
router.put('/trainers/:id/reject', protect, restrictTo('admin', 'manager'), rejectTrainer)
router.put('/trainers/:id/suspend', protect, restrictTo('admin', 'manager'), suspendTrainer)
router.get('/dashboard', protect, restrictTo('admin'), getAdminDashboardStats)
router.get('/users', protect, restrictTo('admin', 'manager'), getAllUsers)
router.put('/users/:id/suspend', protect, restrictTo('admin', 'manager'), suspendUser)
router.delete('/users/:id', protect, restrictTo('admin'), deleteUser)
router.get('/payouts', protect, restrictTo('admin'), getPendingPayouts)
router.get('/audit-logs', protect, restrictTo('admin', 'manager'), getAuditLogs)
router.get('/revenue', protect, restrictTo('admin', 'manager'), getAdminRevenueStats)

export default router