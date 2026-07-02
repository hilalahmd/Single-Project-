import express from 'express'
import { 
  getTrainers, 
  getTrainerById, 
  registerTrainer, 
  updateTrainerProfile,
  getMyTrainerProfile
} from './trainer.controller.js'
import { protect } from '../../middleware/authenticate.js'
import { restrictTo } from '../../middleware/authorize.js'

const router = express.Router()


router.get('/', getTrainers)


router.get('/me/profile', protect, restrictTo('trainer', 'wellness_coach'), getMyTrainerProfile)


router.get('/:id', getTrainerById)


router.post('/register', protect, restrictTo('trainer', 'wellness_coach'), registerTrainer)


router.put('/profile', protect, restrictTo('trainer', 'wellness_coach'), updateTrainerProfile)

export default router