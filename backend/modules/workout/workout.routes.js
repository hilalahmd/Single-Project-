import express from 'express'
import { createPlan, getTrainerAssignedPlans, getTrainerAssignedDietPlans, getTodaysWorkout, toggleExerciseStatus, toggleMealStatus, getFullPlan, getClientPlan } from './workout.controller.js'
import { protect } from '../../middleware/authenticate.js'
import { restrictTo } from '../../middleware/authorize.js'

const router = express.Router()

// Ee routes access cheyyan user login aayirikkanam
router.use(protect)

// 1. Trainer-ku mathram plan create cheyyan ulla API
// POST http://localhost:5000/api/workouts/plan
router.post('/plan', restrictTo('trainer', 'wellness_coach', 'admin'), createPlan)

// 2. Trainer-ku client-nte plan view/fetch cheyyan ulla API
router.get('/plan/:clientId', restrictTo('trainer', 'wellness_coach', 'admin'), getClientPlan)

// 3. Client-nu avarude inathe workout edukkaan ulla API
// GET http://localhost:5000/api/workouts/today
router.get('/today', restrictTo('client', 'user'), getTodaysWorkout)

// 4. Client oru exercise "done" aakkan ulla API
// PATCH http://localhost:5000/api/workouts/toggle-exercise
router.patch('/toggle-exercise', restrictTo('client', 'user'), toggleExerciseStatus)

// 5. Client oru meal "done" aakkan ulla API
router.patch('/toggle-meal', restrictTo('client', 'user'), toggleMealStatus)

// Client-nu full plan edukkaan ulla API
router.get('/my-plan', restrictTo('client', 'user'), getFullPlan)

// Trainer — all assigned workout plans
router.get('/my-assigned-plans', restrictTo('trainer', 'wellness_coach', 'admin'), getTrainerAssignedPlans)

// Trainer — all assigned diet plans
router.get('/my-assigned-diet-plans', restrictTo('trainer', 'wellness_coach', 'admin'), getTrainerAssignedDietPlans)


export default router
