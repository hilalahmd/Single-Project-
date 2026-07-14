import Plan from '../plans/plan.model.js'
import Workout from './workout.model.js'
import Diet from '../plans/diet.model.js'
import Trainer from '../trainers/trainer.model.js'
import User from '../users/user.model.js'

/**
 * createPlan — trainer creates a training plan for a client.
 * Validates required fields before writing to the DB.
 */
export const createPlan = async (req, res) => {
  try {
    const { clientId, title, description, type, startDate, workouts, nutritionTargets } = req.body
    const trainerId = req.user._id

    // Validate required fields — Mongoose 'required' returns raw 500 without this
    if (!clientId || !title || !type || !startDate) {
      return res.status(400).json({ success: false, message: 'clientId, title, type, and startDate are required.' })
    }

    // Deactivate any existing active plans for this client
    await Plan.updateMany({ clientId, isActive: true }, { $set: { isActive: false } })

    const newPlan = await Plan.create({
      trainerId,
      clientId,
      title,
      description,
      type,
      startDate,
      nutritionTargets
    })

    if (workouts && workouts.length > 0) {
      const workoutDocs = workouts.map(w => ({
        planId: newPlan._id,
        clientId,
        title: w.title,
        dayNumber: w.dayNumber,
        exercises: w.exercises
      }))
      await Workout.insertMany(workoutDocs)
    }

    if (req.body.diets && req.body.diets.length > 0) {
      const dietDocs = req.body.diets.map(d => ({
        planId: newPlan._id,
        clientId,
        title: d.title,
        dayNumber: d.dayNumber,
        meals: d.meals
      }))
      await Diet.insertMany(dietDocs)
    }

    res.status(201).json({ success: true, message: 'Plan created successfully', planId: newPlan._id })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 2. Get today's workout for a client (Client Dashboard-il kanikkan)
export const getTodaysWorkout = async (req, res) => {
  try {
    const clientId = req.user._id
    
    // Client-nte active aayulla plan edukka
    const plan = await Plan.findOne({ clientId, isActive: true })
    if (!plan) return res.status(404).json({ success: false, message: 'No active plan found' })

    // Ee plan-il complete aavatha adhyathe workout edukka (Day 1, Day 2 order-il)
    const workout = await Workout.findOne({ planId: plan._id, isCompleted: false }).sort({ dayNumber: 1 })
    
    // Find the corresponding diet day (same dayNumber)
    let diet = null
    if (workout) {
      diet = await Diet.findOne({ planId: plan._id, dayNumber: workout.dayNumber })
    }
    
    res.status(200).json({ success: true, data: workout, diet: diet, plan: plan })
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
      
      // Update workout overall completion status
      const allCompleted = workout.exercises.every(ex => ex.isCompleted)
      workout.isCompleted = allCompleted
      
      await workout.save()
    }

    res.status(200).json({ success: true, data: workout })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 4. Toggle meal done status (Client diet checkmark)
export const toggleMealStatus = async (req, res) => {
  try {
    const { dietId, mealId } = req.body
    
    const diet = await Diet.findById(dietId)
    if (!diet) return res.status(404).json({ success: false, message: 'Diet not found' })

    const meal = diet.meals.id(mealId)
    if (meal) {
      meal.isCompleted = !meal.isCompleted
      // Update overall diet completion if needed
      diet.isCompleted = diet.meals.every(m => m.isCompleted)
      await diet.save()
    }

    res.status(200).json({ success: true, data: diet })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}



// Client-nu full plan edukkaan ulla API (Client dashboard)
export const getFullPlan = async (req, res) => {
  try {
    const clientId = req.user._id;
    const plan = await Plan.findOne({ clientId, isActive: true }).sort({ createdAt: -1 });
    
    if (!plan) return res.status(200).json({ success: true, plan: null, workouts: [], diets: [] });

    // Ee plan-ile ella workouts-um edukkunnu
    const workouts = await Workout.find({ planId: plan._id }).sort({ dayNumber: 1 });
    
    // Diets edukkunnu
    const diets = await Diet.find({ planId: plan._id }).sort({ dayNumber: 1 });

    res.status(200).json({ success: true, plan, workouts, diets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * getClientPlan — trainer views a specific client's active plan.
 * SECURITY: verifies the trainer actually has this client assigned,
 * preventing horizontal privilege escalation (trainer A viewing trainer B's client).
 */
export const getClientPlan = async (req, res) => {
  try {
    const { clientId } = req.params;
    const trainerId = req.user._id

    // Verify this client is actually assigned to the requesting trainer
    // WHY: without this check, any trainer could view any client's plan by guessing a clientId
    const trainerProfile = await Trainer.findOne({ userId: trainerId }).select('_id').lean()
    if (!trainerProfile) {
      return res.status(403).json({ success: false, message: 'Trainer profile not found.' })
    }
    const client = await User.findById(clientId).select('assignedTrainer').lean()
    if (!client || client.assignedTrainer?.toString() !== trainerProfile._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied: this client is not assigned to you.' })
    }

    const plan = await Plan.findOne({ clientId, isActive: true }).sort({ createdAt: -1 }).lean();
    if (!plan) return res.status(200).json({ success: true, data: null });

    const [workouts, diets] = await Promise.all([
      Workout.find({ planId: plan._id }).sort({ dayNumber: 1 }).lean(),
      Diet.find({ planId: plan._id }).sort({ dayNumber: 1 }).lean()
    ])
    
    res.status(200).json({ success: true, data: { plan, workouts, diets } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
