import express from 'express';
import { protect } from '../../middleware/authenticate.js';
import { logProgress, getProgressHistory } from './progress.controller.js';

const router = express.Router();

// Ithu POST /api/progress/ enna URL-lekku form data ayakkumbol work aavum (Save cheyyan)
router.post('/', protect, logProgress);

// Ithu GET /api/progress/ enna URL vilikkumbol work aavum (History edukkan)
router.get('/', protect, getProgressHistory);

export default router;
