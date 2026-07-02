import express from 'express'
import { getAllTrainers, approveTrainer } from './admin.controller.js'
import { protect } from '../../middleware/authenticate.js'
import { restrictTo } from '../../middleware/authorize.js'

const router = express.Router()

router.get('/trainers', protect, restrictTo('admin'), getAllTrainers)
router.put('/approve/:id', protect, restrictTo('admin'), approveTrainer)

export default router