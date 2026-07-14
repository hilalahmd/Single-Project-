import express from 'express'
import {getProfile,updateProfile,updateBodyMetrics,assignTrainer, logWeight} from './user.controller.js'
import {protect} from '../../middleware/authenticate.js'


const router = express.Router()


router.get('/profile',protect,getProfile)
router.put('/profile',protect,updateProfile)
router.put('/body-metrics',protect,updateBodyMetrics)
router.put('/assign-trainer',protect,assignTrainer)
router.post('/weight', protect, logWeight)


export default router  