import express from 'express'
import { 
  getTrainers, 
  getTrainerById, 
  completeTrainerRegistration, 
  updateTrainerProfile,
  getMyTrainerProfile,
  getMyClients,
  resubmitTrainerRegistration,
  getTrainerDashboardStats,
  getUnreadMessages,
  getTrainerEarnings,
  addReview
} from './trainer.controller.js'
import { protect } from '../../middleware/authenticate.js'
import { restrictTo } from '../../middleware/authorize.js'
import { upload } from '../../middleware/upload.js'
import rateLimit from 'express-rate-limit'

const trainerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many requests, please try again later.' }
})

const router = express.Router()


router.get('/', getTrainers)


router.get('/me/profile', protect, restrictTo('trainer', 'wellness_coach'), getMyTrainerProfile)

// Ithu POST/PUT onnum alla, data edukkan aayathu kondu GET aanu
router.get('/clients', protect, restrictTo('trainer', 'wellness_coach'), getMyClients)
// GET http://localhost:5000/api/trainers/dashboard-stats
// Dashboard stats edukkaan (Active clients count etc.)
router.get('/dashboard-stats', protect, restrictTo('trainer', 'wellness_coach'), getTrainerDashboardStats)

// GET http://localhost:5000/api/trainers/unread-messages
router.get('/unread-messages', protect, restrictTo('trainer', 'wellness_coach'), getUnreadMessages)

router.get('/:id', getTrainerById)


// Complete registration with file uploads
router.post(
  '/complete-registration', 
  trainerLimiter,
  protect, 
  restrictTo('trainer', 'wellness_coach'), 
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'certifications', maxCount: 5 }
  ]),
  completeTrainerRegistration
)


router.get('/earnings', protect, restrictTo('trainer'), getTrainerEarnings)


// Resubmit application
router.put(
  '/resubmit',
  trainerLimiter,
  protect, 
  restrictTo('trainer', 'wellness_coach'), 
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'certifications', maxCount: 5 }
  ]),
  resubmitTrainerRegistration
)


router.put('/profile', protect, restrictTo('trainer', 'wellness_coach'), updateTrainerProfile)

router.post('/:id/review', protect, restrictTo('user'), addReview)

export default router