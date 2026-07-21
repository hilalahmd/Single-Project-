import express from 'express'
import { protect } from '../../middleware/authenticate.js'
import {
  getMyNotifications,
  markAllAsRead,
  markAsRead
} from './notification.controller.js'

const router = express.Router()

router.get('/', protect, getMyNotifications)
router.put('/read-all', protect, markAllAsRead)
router.put('/:id/read', protect, markAsRead)

export default router
