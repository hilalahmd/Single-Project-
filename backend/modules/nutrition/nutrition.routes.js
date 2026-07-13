import express from 'express';
import { protect } from '../../middleware/authenticate.js';
import { getLogByDate, addMealItem, updateWater, updateWaterGoal } from './nutrition.controller.js';

const router = express.Router();

router.use(protect);

router.get('/:date', getLogByDate);
router.post('/:date/meal/:mealIndex', addMealItem);
router.put('/:date/water', updateWater);
router.put('/:date/water-goal', updateWaterGoal);

export default router;
