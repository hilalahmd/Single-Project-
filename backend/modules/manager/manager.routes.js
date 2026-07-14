import express from 'express'
import { protect } from '../../middleware/authenticate.js'
import { restrictTo } from '../../middleware/authorize.js'
import { 
  getAllManagers, 
  createManager, 
  updateManagerStatus, 
  deleteManager,
  getManagerDashboardStats,
  sendNotification,
  getMonitoredTrainers,
  getTrainerMonitorDetails
} from './manager.controller.js'

const router = express.Router()

router.get('/dashboard', protect, restrictTo('admin', 'manager'), getManagerDashboardStats)
router.post('/notify', protect, restrictTo('admin', 'manager'), sendNotification)
router.get('/trainers', protect, restrictTo('admin', 'manager'), getMonitoredTrainers)
router.get('/trainers/:id/monitor', protect, restrictTo('admin', 'manager'), getTrainerMonitorDetails)

router.get('/', protect, restrictTo('admin'), getAllManagers)
router.post('/', protect, restrictTo('admin'), createManager)
router.put('/:id', protect, restrictTo('admin'), updateManagerStatus)
router.delete('/:id', protect, restrictTo('admin'), deleteManager)

export default router
