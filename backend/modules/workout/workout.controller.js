import Plan from '../plans/plan.model.js'
import Workout from './workout.model.js'
import Diet from '../plans/diet.model.js'
// 1. Create a new plan with workouts (Trainer use cheyyunnathu)
export const createPlan = async (req, res) => {
  try {
    const { clientId, title, description, type, startDate, workouts, nutritionTargets } = req.body
    const trainerId = req.user.id // Token-il ninnum edukkunnu

    // Pazhaya active plans inactive aakkunnu
    await Plan.updateMany({ clientId, isActive: true }, { $set: { isActive: false } })

    // Adhyam Plan create cheyyunnu
    const newPlan = await Plan.create({
      trainerId,
      clientId,
      title,
      description,
      type,
      startDate,
      nutritionTargets
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

    // Diets save cheyyunnu (if provided)
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
    const clientId = req.user.id
    
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
    const clientId = req.user.id;
    const plan = await Plan.findOne({ clientId, isActive: true }).sort({ createdAt: -1 });
    
    if (!plan) return res.status(404).json({ success: false, message: 'No active plan found' });

    // Ee plan-ile ella workouts-um edukkunnu
    const workouts = await Workout.find({ planId: plan._id }).sort({ dayNumber: 1 });
    
    // Diets edukkunnu
    const diets = await Diet.find({ planId: plan._id }).sort({ dayNumber: 1 });

    res.status(200).json({ success: true, plan, workouts, diets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Get full plan by client ID (Trainer's view)
export const getClientPlan = async (req, res) => {
  try {
    const { clientId } = req.params;
    // req.user.id is the trainer (we could optionally verify they are assigned, but for now we just fetch)
    const plan = await Plan.findOne({ clientId, isActive: true }).sort({ createdAt: -1 });
    
    if (!plan) return res.status(200).json({ success: true, data: null });

    const workouts = await Workout.find({ planId: plan._id }).sort({ dayNumber: 1 });
    const diets = await Diet.find({ planId: plan._id }).sort({ dayNumber: 1 });
    
    res.status(200).json({ success: true, data: { plan, workouts, diets } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
