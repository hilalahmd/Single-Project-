import express from 'express'
import { generateFreeDietPlan, analyzeFoodImage, analyzeTransformation } from './foodai.controller.js'
import { protect } from '../../middleware/authenticate.js'

const router = express.Router()

router.post('/generate-diet', protect, generateFreeDietPlan)
router.post('/analyze-image', protect, analyzeFoodImage)
router.post('/analyze-transformation', protect, analyzeTransformation)

export default router