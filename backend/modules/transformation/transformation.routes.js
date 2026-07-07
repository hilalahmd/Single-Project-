import express from 'express'
import { protect } from '../../middleware/authenticate.js'
import { analyzeTransformation, generateTransformationImage } from './transformation.controller.js'

const router = express.Router()

// Route: POST /api/transformation/analyze
router.post('/analyze', protect, analyzeTransformation)

// Puththiya Route: POST /api/transformation/generate-image
router.post('/generate-image', protect, generateTransformationImage)

export default router
