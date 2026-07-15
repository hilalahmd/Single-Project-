import express from 'express';
import { protect } from '../../middleware/authenticate.js';
import { restrictTo } from '../../middleware/authorize.js';
import { logProgress, getProgressHistory, getClientProgress } from './progress.controller.js';

const router = express.Router();

// Ithu POST /api/progress/ enna URL-lekku form data ayakkumbol work aavum (Save cheyyan)
router.post('/', protect, logProgress);

// Ithu GET /api/progress/ enna URL vilikkumbol work aavum (History edukkan)
router.get('/', protect, getProgressHistory);

// Trainer viewing client progress
router.get('/:clientId', protect, restrictTo('trainer', 'wellness_coach', 'admin'), getClientProgress);

export default router;
