import express from 'express'
import { 
  getTrainers, 
  getTrainerById, 
  registerTrainer, 
  updateTrainerProfile 
} from './trainer.controller.js'
import { protect } from '../../middleware/authenticate.js'
import { restrictTo } from '../../middleware/authorize.js'

const router = express.Router()

// Public routes — no login needed
// GET /api/trainers → get all approved trainers
// GET /api/trainers?language=Malayalam → filter by language
router.get('/', getTrainers)

// GET /api/trainers/:id → get single trainer profile
router.get('/:id', getTrainerById)

// Protected routes — login + role check needed
// POST /api/trainers/register → trainer creates their profile
router.post('/register', protect, restrictTo('trainer', 'wellness_coach'), registerTrainer)

// PUT /api/trainers/profile → trainer updates their profile
router.put('/profile', protect, restrictTo('trainer', 'wellness_coach'), updateTrainerProfile)

export default router