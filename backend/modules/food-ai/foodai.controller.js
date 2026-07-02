import { GoogleGenerativeAI } from '@google/generative-ai'
import User from '../users/user.model.js'
import { getGenAI } from '../../config/gemini.js'

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

function buildPrompt(data, estimatedBodyFat) {
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

  return `You are a professional nutritionist creating a ONE-DAY sample diet plan as a free preview/demo for a fitness app. This is meant to showcase quality and entice the user to subscribe for a full 7-day wellness coaching plan, so make it genuinely excellent, specific, and regionally accurate.

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
6. End with a short, motivating 2-3 sentence note encouraging them to unlock the full 7-day plan with a Wellness Coach for personalized recovery and adjustments.

Respond ONLY in this exact JSON format, no markdown, no backticks, no extra text:
{
  "dailyCalorieTarget": number,
  "macros": { "protein": number, "carbs": number, "fat": number },
  "estimatedBodyFatPercent": number or null,
  "bodyFatNote": string or null,
  "meals": [
    { "name": string, "time": string, "items": string, "calories": number, "protein": number, "carbs": number, "fat": number }
  ],
  "closingNote": string
}`
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

    const prompt = buildPrompt({ gender, age, height, weight, country, goal, dietPref, measurements }, estimatedBodyFat)

    let dietPlan
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
      const result = await model.generateContent(prompt)
      const text = result.response.text()
      const cleaned = text.replace(/```json|```/g, '').trim()
      dietPlan = JSON.parse(cleaned)
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
              items: `Oats porridge (approx. ${Math.round(breakC * 1.5)}g cooked) with low-fat paneer (approx. ${Math.round(breakP * 1.5)}g), ${Math.round(breakF * 2.5)}g of chopped almonds, and chia seeds.`, 
              calories: breakCal, protein: breakP, carbs: breakC, fat: breakF 
            },
            { 
              name: 'Lunch', 
              time: '01:30 PM', 
              items: `Brown rice (approx. ${Math.round(lunchC * 2.5)}g cooked) with yellow dal, sautéed Paneer or Tofu (approx. ${Math.round(lunchP * 3.5)}g), and mixed green salad with ${Math.round(lunchF * 1.2)}ml olive oil.`, 
              calories: lunchCal, protein: lunchP, carbs: lunchC, fat: lunchF 
            },
            { 
              name: 'Snack', 
              time: '05:00 PM', 
              items: `Roasted chana (approx. ${Math.round(snackC * 1.5)}g) with 1 cup double-toned milk (or soy/almond milk) and ${Math.round(snackF * 2)}g walnuts.`, 
              calories: snackCal, protein: snackP, carbs: snackC, fat: snackF 
            },
            { 
              name: 'Dinner', 
              time: '08:30 PM', 
              items: `Whole wheat chapati (${Math.max(1, Math.round(dinnerC / 20))} pcs) served with mixed vegetable subji, boiled green peas (100g), and thick curd (approx. ${Math.round(dinnerP * 4.5)}g).`, 
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
              items: `Egg bhurji made of ${Math.max(2, Math.round(breakP / 6))} egg whites and 1 whole egg, served with whole wheat toast (${Math.max(1, Math.round(breakC / 15))} slices) and grilled spinach.`, 
              calories: breakCal, protein: breakP, carbs: breakC, fat: breakF 
            },
            { 
              name: 'Lunch', 
              time: '01:30 PM', 
              items: `Steamed Basmati Rice (approx. ${Math.round(lunchC * 3)}g cooked) with homestyle Chicken Curry (approx. ${Math.round(lunchP * 3.2)}g chicken breast cooked in olive oil) and cucumber raita.`, 
              calories: lunchCal, protein: lunchP, carbs: lunchC, fat: lunchF 
            },
            { 
              name: 'Snack', 
              time: '05:00 PM', 
              items: `Boiled egg white salad (${Math.max(2, Math.round(snackP / 4))} egg whites) seasoned with black pepper, chat masala, and served with green tea and ${Math.round(snackF * 1.5)}g almonds.`, 
              calories: snackCal, protein: snackP, carbs: snackC, fat: snackF 
            },
            { 
              name: 'Dinner', 
              time: '08:30 PM', 
              items: `Pan-seared Salmon or surmai fish fillet (approx. ${Math.round(dinnerP * 4.5)}g cooked) served with stir-fried beans, broccoli, and mushrooms.`, 
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
      
      dietPlan = {
        dailyCalorieTarget: calorieTarget,
        macros: { protein, carbs, fat },
        estimatedBodyFatPercent: estimatedBodyFat || null,
        bodyFatNote: estimatedBodyFat ? `Estimated Navy Body Fat: ${estimatedBodyFat}%. Maintain a clean diet to support goal.` : null,
        meals: mealsList,
        closingNote: `This is a dynamically scaled, locally calculated sample plan matching your weight, height, age, and dietary preference.`
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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

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

export const analyzeTransformation = async (req, res) => {
  try {
    const { images, goal } = req.body
    if (!images || !images.front || !goal) {
      return res.status(400).json({ message: 'Front photo and goal are required.' })
    }

    const frontMatch = images.front.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    if (!frontMatch) {
      return res.status(400).json({ message: 'Invalid front image format.' })
    }
    const frontMime = frontMatch[1]
    const frontData = frontMatch[2]

    const genAI = getGenAI()
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are an expert sports medicine doctor, certified personal trainer, and body composition analyst.
A client has shared their current body photo (front view attached). Their fitness goal is: "${goal}".
Analyze their visible body composition and generate realistic transformation projections for THREE timelines.
Respond ONLY in this exact JSON format (no markdown, no backticks):
{
  "currentAnalysis": {
    "estimatedBodyFat": "~18-22%",
    "bodyType": "Mesomorph / Endomorph",
    "visibleStrengths": "Good shoulder width, moderate muscle base",
    "keyAreas": "Midsection, lower body"
  },
  "timelines": {
    "threeMonths": {
      "label": "3 Months",
      "projectedBodyFat": "~16-18%",
      "projectedMuscleMass": "+1-2 kg lean mass",
      "fatLoss": "-2 to -4%",
      "keyChanges": "Visible waistline reduction, improved muscle definition in shoulders and arms",
      "weeklyCalories": 2200,
      "weeklyProtein": 160,
      "workoutsPerWeek": 4,
      "milestones": ["Noticeable waist reduction", "Improved energy", "Better posture"],
      "motivationNote": "The first 90 days are about building momentum and habits."
    },
    "sixMonths": {
      "label": "6 Months",
      "projectedBodyFat": "~13-15%",
      "projectedMuscleMass": "+3-5 kg lean mass",
      "fatLoss": "-5 to -7%",
      "keyChanges": "Visible abs beginning, strong arms and chest definition, significantly leaner physique",
      "weeklyCalories": 2300,
      "weeklyProtein": 170,
      "workoutsPerWeek": 5,
      "milestones": ["Ab definition visible", "Clothes fit differently", "Significant strength gains"],
      "motivationNote": "Six months of consistency rewrites your physique completely."
    },
    "oneYear": {
      "label": "1 Year",
      "projectedBodyFat": "~10-12%",
      "projectedMuscleMass": "+6-9 kg lean mass",
      "fatLoss": "-8 to -12%",
      "keyChanges": "Competition-level definition, full muscle separation, athletic V-taper, remarkable overall transformation",
      "weeklyCalories": 2400,
      "weeklyProtein": 180,
      "workoutsPerWeek": 5,
      "milestones": ["Full physique transformation", "Athletic performance peak", "Lifestyle completely changed"],
      "motivationNote": "A year from now you will wish you had started today."
    }
  }
}`

    const result = await model.generateContent([prompt, { inlineData: { data: frontData, mimeType: frontMime } }])
    const text = result.response.text()
    const cleaned = text.replace(/\`\`\`json|\`\`\`/g, '').trim()
    const analysis = JSON.parse(cleaned)
    res.json({ analysis })

  } catch (error) {
    console.error('Transformation analysis error:', error)
    res.status(500).json({ message: 'Failed to analyze transformation.', error: error.toString() })
  }
}