import express from 'express'
import { 
  generateFreeDietPlan, 
  analyzeFoodImage, 
  logMeal,
  getMealHistory 
} from './foodai.controller.js'
import { protect } from '../../middleware/authenticate.js'

const router = express.Router()

router.post('/generate-diet', protect, generateFreeDietPlan)
router.post('/analyze-image', protect, analyzeFoodImage)

// Puthiya routes (Meal Logging)
router.post('/log', protect, logMeal)
router.get('/history', protect, getMealHistory)

export default router
