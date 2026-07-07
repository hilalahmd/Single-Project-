import Plan from '../plans/plan.model.js'
import Workout from './workout.model.js'

// 1. Create a new plan with workouts (Trainer use cheyyunnathu)
export const createPlan = async (req, res) => {
  try {
    const { clientId, title, description, type, startDate, workouts } = req.body
    const trainerId = req.user.id // Token-il ninnum edukkunnu

    // Adhyam Plan create cheyyunnu
    const newPlan = await Plan.create({
      trainerId,
      clientId,
      title,
      description,
      type,
      startDate
    })

    // Plan-nu ullile workouts save cheyyunnu
    if (workouts && workouts.length > 0) {
      const workoutDocs = workouts.map(w => ({
        planId: newPlan._id,
        clientId,
        title: w.title,
        dayNumber: w.dayNumber,
        exercises: w.exercises
      }))
      await Workout.insertMany(workoutDocs) // Orupadu workouts orumichu save cheyyan
    }

    res.status(201).json({ success: true, message: 'Plan created successfully', planId: newPlan._id })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 2. Get today's workout for a client (Client Dashboard-il kanikkan)
export const getTodaysWorkout = async (req, res) => {
  try {
    const clientId = req.user.id
    
    // Client-nte active aayulla plan edukka
    const plan = await Plan.findOne({ clientId, isActive: true })
    if (!plan) return res.status(404).json({ success: false, message: 'No active plan found' })

    // Ee plan-il complete aavatha adhyathe workout edukka (Day 1, Day 2 order-il)
    const workout = await Workout.findOne({ planId: plan._id, isCompleted: false }).sort({ dayNumber: 1 })
    
    res.status(200).json({ success: true, data: workout })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 3. Toggle exercise done status (Client tick mark kodukkumbol)
export const toggleExerciseStatus = async (req, res) => {
  try {
    const { workoutId, exerciseId } = req.body
    
    const workout = await Workout.findById(workoutId)
    if (!workout) return res.status(404).json({ success: false, message: 'Workout not found' })

    // Aa specific exercise kandupidichu athinte status matti save cheyyunnu
    const exercise = workout.exercises.id(exerciseId)
    if (exercise) {
      exercise.isCompleted = !exercise.isCompleted
      await workout.save()
    }

    res.status(200).json({ success: true, data: workout })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
