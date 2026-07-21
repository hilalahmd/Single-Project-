/**
 * Calculates Total Daily Energy Expenditure (TDEE) and dynamic macro targets
 * based on user body metrics and goals.
 *
 * @param {Object} user - The user object from AuthContext
 * @returns {Object} - { targetCalories, targetProtein, targetCarbs, targetFat }
 */
export const calculateDynamicTargets = (user) => {
  // Safe defaults if metrics are missing
  const defaultTargets = {
    targetCalories: 0,
    targetProtein: 0,
    targetCarbs: 0,
    targetFat: 0
  }

  if (!user || !user.bodyMetrics) return defaultTargets

  const { weight, height, age, gender, activityLevel, goal } = user.bodyMetrics

  // Need at least weight and height to do a proper calculation
  if (!weight || !height) return defaultTargets

  const userAge = age || 25
  const userGender = (gender || 'male').toLowerCase()

  // 1. Calculate BMR (Mifflin-St Jeor)
  let bmr = 0
  if (userGender === 'female') {
    bmr = (10 * weight) + (6.25 * height) - (5 * userAge) - 161
  } else {
    bmr = (10 * weight) + (6.25 * height) - (5 * userAge) + 5
  }

  // 2. Activity Multiplier
  let activityMultiplier = 1.2 // sedentary default
  const act = (activityLevel || '').toLowerCase()
  if (act.includes('light')) activityMultiplier = 1.375
  else if (act.includes('moderate')) activityMultiplier = 1.55
  else if (act.includes('very') || act.includes('high')) activityMultiplier = 1.725
  
  const tdee = bmr * activityMultiplier

  // 3. Goal Adjustments
  const userGoal = (goal || 'maintain').toLowerCase()
  let targetCalories = tdee
  let proteinPerKg = 1.8
  let fatPerKg = 1.0

  if (userGoal.includes('muscle') || userGoal.includes('build')) {
    targetCalories = tdee + 500
    proteinPerKg = 2.0 // High protein for building
    fatPerKg = 1.0
  } else if (userGoal.includes('loss') || userGoal.includes('lose') || userGoal.includes('cut')) {
    targetCalories = tdee - 500
    proteinPerKg = 2.2 // Higher protein to preserve muscle in deficit
    fatPerKg = 0.8 // Lower fat in deficit
  }

  // Calculate Macros in Grams
  const targetProtein = weight * proteinPerKg
  const targetFat = weight * fatPerKg
  
  // Carbs fill the remaining calories
  // Protein = 4 kcal/g, Fat = 9 kcal/g, Carb = 4 kcal/g
  const proteinCals = targetProtein * 4
  const fatCals = targetFat * 9
  const remainingCals = targetCalories - proteinCals - fatCals
  
  const targetCarbs = Math.max(0, remainingCals / 4) // Prevent negative carbs

  return {
    targetCalories: Math.round(targetCalories),
    targetProtein: Math.round(targetProtein),
    targetFat: Math.round(targetFat),
    targetCarbs: Math.round(targetCarbs)
  }
}
