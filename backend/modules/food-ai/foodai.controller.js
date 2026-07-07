import { GoogleGenerativeAI } from '@google/generative-ai'
import User from '../users/user.model.js'
import { getGenAI } from '../../config/gemini.js'
import MealLog from './meallog.model.js'


const MONTHLY_LIMIT = 10000

function calculateBodyFat({ gender, height, neck, waist, hip }) {
  if (!neck || !waist || !height) return null
  if (gender === 'Male') {
    const bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450
    return Math.max(2, Math.min(60, Math.round(bf * 10) / 10))
  } else {
    if (!hip) return null
    const bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450
    return Math.max(2, Math.min(60, Math.round(bf * 10) / 10))
  }
}

function buildPrompt(data, estimatedBodyFat, isSubscribed) {
  const { gender, age, height, weight, country, goal, dietPref, measurements } = data

  let mealGuidance = ''
  if (goal === 'gain') {
    mealGuidance = 'This person is BULKING (muscle gain goal). Design 5-6 meals across the day, including a mid-morning snack, a pre-workout snack, and a slow-digesting protein source before bed. Calories should be in a surplus.'
  } else if (goal === 'loss') {
    mealGuidance = 'This person is CUTTING (weight loss goal). Design 3-4 satiating meals spaced through the day with high protein and fiber to control hunger. Calories should be in a deficit.'
  } else {
    mealGuidance = 'This person wants MAINTENANCE. Design 4 balanced meals across the day at maintenance calories.'
  }

  const measurementsText = measurements && (measurements.neck || measurements.waist)
    ? `Body measurements provided: neck ${measurements.neck || 'N/A'}cm, waist ${measurements.waist || 'N/A'}cm, navel ${measurements.navel || 'N/A'}cm, arm ${measurements.arm || 'N/A'}cm, wrist ${measurements.wrist || 'N/A'}cm, hip ${measurements.hip || 'N/A'}cm, thigh ${measurements.thigh || 'N/A'}cm.${estimatedBodyFat ? ` Estimated body fat using Navy method: ${estimatedBodyFat}%.` : ''}`
    : 'No body measurements provided.'

  const planDurationText = isSubscribed 
    ? 'a FULL 7-DAY diet plan since they are a premium subscriber. Provide variety across the 7 days.'
    : 'a ONE-DAY sample diet plan as a free preview/demo for a fitness app. This is meant to showcase quality and entice the user to subscribe for a full 7-day wellness coaching plan.'

  return `You are a professional nutritionist creating ${planDurationText} Make it genuinely excellent, specific, and regionally accurate.

USER PROFILE:
- Gender: ${gender}
- Age: ${age}
- Height: ${height} cm
- Weight: ${weight} kg
- Country: ${country}
- Goal: ${goal === 'gain' ? 'Muscle Gain / Bulking' : goal === 'loss' ? 'Weight Loss / Cutting' : 'Maintenance'}
- Diet Preference: ${dietPref}
- ${measurementsText}

MEAL STRUCTURE GUIDANCE:
${mealGuidance}

CRITICAL REQUIREMENTS:
1. Use foods that are actually common and accessible in ${country}. Do NOT default to generic Western food unless the country is Western. Be authentic to regional cuisine.
2. Strictly respect the diet preference: ${dietPref}.
3. Calculate an accurate daily calorie target using Mifflin-St Jeor BMR formula and an activity multiplier of 1.55 (moderately active), then adjust for the goal (+300-500 kcal for gain, -300-500 kcal for loss, 0 for maintenance).
4. For each meal, give: meal name, time of day, specific food items with quantities, calories, and protein/carbs/fat in grams.
5. If body measurements were provided, include an estimated body fat percentage and a brief note on what it means for their goal.
6. End with a short, motivating 2-3 sentence note.

Respond ONLY in this exact JSON format, no markdown, no backticks, no extra text:
{
  "dailyCalorieTarget": number,
  "macros": { "protein": number, "carbs": number, "fat": number },
  "estimatedBodyFatPercent": number or null,
  "bodyFatNote": string or null,
  "days": [
    {
      "day": "Day 1",
      "meals": [
        { "name": string, "time": string, "items": string, "calories": number, "protein": number, "carbs": number, "fat": number }
      ]
    }
  ],
  "closingNote": string
}
Note: the "days" array should contain exactly ${isSubscribed ? '7' : '1'} object(s) representing the ${isSubscribed ? '7 days' : '1 day'} of meals.`
}

export const generateFreeDietPlan = async (req, res) => {
  try {
    const genAI = getGenAI()
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const now = new Date()
    const resetDate = new Date(user.dietGenerationResetDate)
    const monthsPassed = (now.getFullYear() - resetDate.getFullYear()) * 12 + (now.getMonth() - resetDate.getMonth())

    if (monthsPassed >= 1) {
      user.dietGenerationCount = 0
      user.dietGenerationResetDate = now
    }

    if (user.dietGenerationCount >= MONTHLY_LIMIT) {
      return res.status(403).json({ 
        message: `You've used all ${MONTHLY_LIMIT} free diet plans this month. Upgrade to Wellness for unlimited access.`,
        limitReached: true
      })
    }

    const { gender, age, height, weight, country, goal, dietPref, measurements } = req.body

    if (!gender || !age || !height || !weight || !country || !goal || !dietPref) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const estimatedBodyFat = calculateBodyFat({
      gender,
      height: Number(height),
      neck: Number(measurements?.neck),
      waist: Number(measurements?.waist),
      hip: Number(measurements?.hip)
    })

       const isSubscribed = true // Testing-nu vendi temporary aayi 'true' aakkunnu
     const prompt = buildPrompt({ gender, age, height, weight, country, goal, dietPref, measurements }, estimatedBodyFat, isSubscribed)

    let dietPlan
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })
      const result = await model.generateContent(prompt)
      const text = result.response.text()
      const cleaned = text.replace(/```json|```/g, '').trim()
      dietPlan = JSON.parse(cleaned)
      
      // Legacy compatibility: If AI still returns "meals" instead of "days", wrap it
      if (dietPlan.meals && !dietPlan.days) {
        dietPlan.days = [{ day: "Day 1", meals: dietPlan.meals }]
        delete dietPlan.meals
      }
    } catch (aiError) {
      console.warn("Gemini API call failed, generating locally computed diet plan:", aiError.message)
      
      // Calculate BMR (Mifflin-St Jeor) & Daily Calorie Target
      const wVal = Number(weight) || 70
      const hVal = Number(height) || 170
      const aVal = Number(age) || 25
      
      const bmr = 10 * wVal + 6.25 * hVal - 5 * aVal + (gender === 'Male' ? 5 : -161)
      let calorieTarget = Math.round(bmr * 1.55)
      
      if (goal === 'gain') calorieTarget += 400
      else if (goal === 'loss') calorieTarget -= 400
      
      // Calculate Macros
      const protein = Math.round(wVal * 2)
      const fat = Math.round(wVal * 0.9)
      const carbs = Math.round((calorieTarget - (protein * 4 + fat * 9)) / 4)
      
      // Select appropriate meals based on diet pref and country
      const isIndia = country.toLowerCase() === 'india'
      let mealsList = []
      
      // Split macros per meal: Breakfast (25%), Lunch (35%), Snack (15%), Dinner (25%)
      const breakP = Math.round(protein * 0.25)
      const breakC = Math.round(carbs * 0.25)
      const breakF = Math.round(fat * 0.25)
      const breakCal = Math.round(calorieTarget * 0.25)

      const lunchP = Math.round(protein * 0.35)
      const lunchC = Math.round(carbs * 0.35)
      const lunchF = Math.round(fat * 0.35)
      const lunchCal = Math.round(calorieTarget * 0.35)

      const snackP = Math.round(protein * 0.15)
      const snackC = Math.round(carbs * 0.15)
      const snackF = Math.round(fat * 0.15)
      const snackCal = Math.round(calorieTarget * 0.15)

      const dinnerP = Math.round(protein * 0.25)
      const dinnerC = Math.round(carbs * 0.25)
      const dinnerF = Math.round(fat * 0.25)
      const dinnerCal = Math.round(calorieTarget * 0.25)
      
      if (dietPref === 'veg' || dietPref === 'vegan') {
        if (isIndia) {
          mealsList = [
            { 
              name: 'Breakfast', 
              time: '08:30 AM', 
              items: `Oats porridge (approx. ${Math.round(breakC * 1.5)}g cooked) with low-fat Cottage Cheese (approx. ${Math.round(breakP * 1.5)}g), ${Math.round(breakF * 2.5)}g of chopped almonds, and chia seeds.`, 
              calories: breakCal, protein: breakP, carbs: breakC, fat: breakF 
            },
            { 
              name: 'Lunch', 
              time: '01:30 PM', 
              items: `Brown rice (approx. ${Math.round(lunchC * 2.5)}g cooked) with Yellow Lentil Soup, sautéed Cottage Cheese or Tofu (approx. ${Math.round(lunchP * 3.5)}g), and mixed green salad with ${Math.round(lunchF * 1.2)}ml olive oil.`, 
              calories: lunchCal, protein: lunchP, carbs: lunchC, fat: lunchF 
            },
            { 
              name: 'Snack', 
              time: '05:00 PM', 
              items: `Roasted chickpeas (approx. ${Math.round(snackC * 1.5)}g) with 1 cup skimmed milk (or almond milk) and ${Math.round(snackF * 2)}g walnuts.`, 
              calories: snackCal, protein: snackP, carbs: snackC, fat: snackF 
            },
            { 
              name: 'Dinner', 
              time: '08:30 PM', 
              items: `Whole wheat flatbread (${Math.max(1, Math.round(dinnerC / 20))} pcs) served with Mixed Vegetable Curry, boiled green peas (100g), and thick yogurt (approx. ${Math.round(dinnerP * 4.5)}g).`, 
              calories: dinnerCal, protein: dinnerP, carbs: dinnerC, fat: dinnerF 
            }
          ]
        } else {
          mealsList = [
            { 
              name: 'Breakfast', 
              time: '08:00 AM', 
              items: `Scrambled Tofu (approx. ${Math.round(breakP * 4.5)}g) cooked with nutritional yeast, spinach, and served over sourdough toast (${Math.max(1, Math.round(breakC / 15))} slices).`, 
              calories: breakCal, protein: breakP, carbs: breakC, fat: breakF 
            },
            { 
              name: 'Lunch', 
              time: '01:00 PM', 
              items: `Quinoa and black bean bowl (approx. ${Math.round(lunchC * 2.5)}g quinoa) topped with roasted sweet potatoes, avocado slices (approx. ${Math.round(lunchF * 2.5)}g), and lemon-tahini dressing.`, 
              calories: lunchCal, protein: lunchP, carbs: lunchC, fat: lunchF 
            },
            { 
              name: 'Snack', 
              time: '04:30 PM', 
              items: `Greek yogurt or coconut yogurt (approx. ${Math.round(snackP * 5)}g) topped with mixed organic berries and raw pumpkin seeds.`, 
              calories: snackCal, protein: snackP, carbs: snackC, fat: snackF 
            },
            { 
              name: 'Dinner', 
              time: '07:30 PM', 
              items: `Baked lentil patties (2 pcs) served with steamed broccoli, carrots, and sweet potato mash (approx. ${Math.round(dinnerC * 2)}g).`, 
              calories: dinnerCal, protein: dinnerP, carbs: dinnerC, fat: dinnerF 
            }
          ]
        }
      } else {
        // Non-veg / Eggetarian
        if (isIndia) {
          mealsList = [
            { 
              name: 'Breakfast', 
              time: '08:30 AM', 
              items: `Scrambled Eggs (Indian Style) made of ${Math.max(2, Math.round(breakP / 6))} egg whites and 1 whole egg, served with whole wheat toast (${Math.max(1, Math.round(breakC / 15))} slices) and grilled spinach.`, 
              calories: breakCal, protein: breakP, carbs: breakC, fat: breakF 
            },
            { 
              name: 'Lunch', 
              time: '01:30 PM', 
              items: `Steamed Basmati Rice (approx. ${Math.round(lunchC * 3)}g cooked) with homestyle Chicken Curry (approx. ${Math.round(lunchP * 3.2)}g chicken breast cooked in olive oil) and Cucumber Yogurt Dip.`, 
              calories: lunchCal, protein: lunchP, carbs: lunchC, fat: lunchF 
            },
            { 
              name: 'Snack', 
              time: '05:00 PM', 
              items: `Boiled egg white salad (${Math.max(2, Math.round(snackP / 4))} egg whites) seasoned with black pepper, and served with green tea and ${Math.round(snackF * 1.5)}g almonds.`, 
              calories: snackCal, protein: snackP, carbs: snackC, fat: snackF 
            },
            { 
              name: 'Dinner', 
              time: '08:30 PM', 
              items: `Pan-seared Salmon or King Fish fillet (approx. ${Math.round(dinnerP * 4.5)}g cooked) served with stir-fried beans, broccoli, and mushrooms.`, 
              calories: dinnerCal, protein: dinnerP, carbs: dinnerC, fat: dinnerF 
            }
          ]
        } else {
          mealsList = [
            { 
              name: 'Breakfast', 
              time: '08:00 AM', 
              items: `Smoked salmon scramble (approx. ${Math.round(breakP * 4)}g salmon and 2 eggs) served with sliced avocado and half an English muffin.`, 
              calories: breakCal, protein: breakP, carbs: breakC, fat: breakF 
            },
            { 
              name: 'Lunch', 
              time: '01:00 PM', 
              items: `Grilled chicken breast (approx. ${Math.round(lunchP * 3.2)}g) salad with romaine lettuce, cherry tomatoes, cucumbers, and olive oil vinaigrette.`, 
              calories: lunchCal, protein: lunchP, carbs: lunchC, fat: lunchF 
            },
            { 
              name: 'Snack', 
              time: '04:30 PM', 
              items: `Whey protein shake (1 scoop) blended with unsweetened almond milk and raw almond butter (approx. ${Math.round(snackF * 1.5)}g).`, 
              calories: snackCal, protein: snackP, carbs: snackC, fat: snackF 
            },
            { 
              name: 'Dinner', 
              time: '07:30 PM', 
              items: `Baked Salmon fillet (approx. ${Math.round(dinnerP * 4.5)}g) served over cauliflower mash and roasted asparagus spears with olive oil.`, 
              calories: dinnerCal, protein: dinnerP, carbs: dinnerC, fat: dinnerF 
            }
          ]
        }
      }
      
      // Build days array for fallback
      const days = []
      const numDays = isSubscribed ? 7 : 1
      for (let i = 1; i <= numDays; i++) {
        days.push({
          day: `Day ${i}`,
          meals: mealsList
        })
      }
      
      dietPlan = {
        dailyCalorieTarget: calorieTarget,
        macros: { protein, carbs, fat },
        estimatedBodyFatPercent: estimatedBodyFat || null,
        bodyFatNote: estimatedBodyFat ? `Estimated Navy Body Fat: ${estimatedBodyFat}%. Maintain a clean diet to support goal.` : null,
        days: days,
        closingNote: isSubscribed 
          ? `This is your dynamically scaled 7-day plan tailored to your weight, height, age, and dietary preference.` 
          : `This is a dynamically scaled, locally calculated sample plan matching your weight, height, age, and dietary preference.`
      }
    }

    user.dietGenerationCount += 1
    user.country = country
    user.bodyMetrics = {
      ...user.bodyMetrics,
      height, weight, age, gender, goal,
      calorieTarget: dietPlan.dailyCalorieTarget
    }
    if (measurements) {
      user.measurements = {
        neck: Number(measurements.neck) || undefined,
        waist: Number(measurements.waist) || undefined,
        navel: Number(measurements.navel) || undefined,
        arm: Number(measurements.arm) || undefined,
        wrist: Number(measurements.wrist) || undefined,
        hip: Number(measurements.hip) || undefined,
        thigh: Number(measurements.thigh) || undefined
      }
    }
    await user.save()

    res.json({
      dietPlan,
      generationsRemaining: MONTHLY_LIMIT - user.dietGenerationCount
    })

  } catch (error) {
    console.error('Diet generation error:', error.stack || error)
    res.status(500).json({ 
      message: error.message || 'Failed to generate diet plan. Please try again.',
      error: error.stack || error.toString()
    })
  }
}

console.log("KEY LOADED:", process.env.GEMINI_API_KEY ? "yes, length " + process.env.GEMINI_API_KEY.length : "MISSING");

export const analyzeFoodImage = async (req, res) => {
  try {
    const { imageBase64 } = req.body
    if (!imageBase64) {
      return res.status(400).json({ message: 'No image provided.' })
    }

    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ message: 'Invalid image format. Expected base64 data URI.' })
    }

    const mimeType = matches[1]
    const data = matches[2]

    const genAI = getGenAI()
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })

    const prompt = `You are an expert nutritionist and food recognition AI.
Analyze this image and identify the food. Provide an estimation of the nutritional macros.
Respond ONLY in this exact JSON format, no markdown, no backticks:
{
  "name": "Name of the food (e.g., Grilled Chicken Salad)",
  "calories": 350,
  "macros": {
    "protein": 30,
    "carbs": 10,
    "fat": 15
  }
}`

    const result = await model.generateContent([
      prompt,
      { inlineData: { data, mimeType } }
    ])

    const text = result.response.text()
    const cleaned = text.replace(/```json|```/g, '').trim()
    const analysis = JSON.parse(cleaned)
    res.json({ analysis })

  } catch (error) {
    console.error('Image analysis error:', error)
    res.status(500).json({ message: 'Failed to analyze image.', error: error.toString() })
  }
}




export const logMeal = async (req, res) => {
  try {
    const { name, calories, macros, imageUrl } = req.body

    const meal = await MealLog.create({
      userId: req.user._id,
      name,
      calories,
      macros,
      imageUrl
    })

    res.status(201).json(meal)
  } catch (error) {
    console.error('Error logging meal:', error)
    res.status(500).json({ message: 'Failed to log meal', error: error.message })
  }
}

export const getMealHistory = async (req, res) => {
  try {
    const { date } = req.query
    let query = { userId: req.user._id }

    // Date query vazhi varunnundel aa divasathe data mathram edukkan
    if (date) {
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)
      
      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)

      query.loggedAt = { $gte: startDate, $lte: endDate }
    }

    const meals = await MealLog.find(query).sort({ loggedAt: -1 })
    res.json(meals)
  } catch (error) {
    console.error('Error fetching meal history:', error)
    res.status(500).json({ message: 'Failed to fetch meal history', error: error.message })
  }
}
