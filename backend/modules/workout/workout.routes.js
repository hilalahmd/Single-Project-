import express from 'express'
import { createPlan, getTodaysWorkout, toggleExerciseStatus } from './workout.controller.js'
import { protect } from '../../middleware/authenticate.js'
import { restrictTo } from '../../middleware/authorize.js'

const router = express.Router()

// Ee routes access cheyyan user login aayirikkanam
router.use(protect)

// 1. Trainer-ku mathram plan create cheyyan ulla API
// POST http://localhost:5000/api/workouts/plan
router.post('/plan', restrictTo('trainer', 'admin'), createPlan)

// 2. Client-nu avarude inathe workout edukkaan ulla API
// GET http://localhost:5000/api/workouts/today
router.get('/today', restrictTo('client', 'user'), getTodaysWorkout)

// 3. Client oru exercise "done" aakkan ulla API
// PATCH http://localhost:5000/api/workouts/toggle-exercise
router.patch('/toggle-exercise', restrictTo('client', 'user'), toggleExerciseStatus)

export default router
