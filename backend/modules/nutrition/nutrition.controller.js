import NutritionLog from './nutrition.model.js';

// Default meals structure used when creating a new log for the day
const defaultMeals = [
  { name: 'Breakfast', items: [] },
  { name: 'Lunch', items: [] },
  { name: 'Dinner', items: [] },
  { name: 'Snacks', items: [] }
];

/**
 * getLogByDate — fetches (or creates) the nutrition log for a specific date.
 * Uses findOne + create instead of findOneAndUpsert to allow setting default meals.
 */
export const getLogByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user._id;

    // Validate date format (YYYY-MM-DD) to prevent injecting arbitrary strings
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    let log = await NutritionLog.findOne({ user: userId, date });

    if (!log) {
      log = await NutritionLog.create({
        user: userId,
        date,
        meals: defaultMeals
      });
    }

    res.status(200).json({ success: true, log });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * addMealItem — adds a food item to a specific meal slot.
 * Validates that all numeric fields are actually numbers and are non-negative.
 * WHY: without this check, a client could send "abc" as calories and NaN
 *      would be stored in MongoDB silently.
 */
export const addMealItem = async (req, res) => {
  try {
    const { date, mealIndex } = req.params;
    const { name, calories, protein, carbs, fat } = req.body;
    const userId = req.user._id;

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    // Validate required fields
    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Food item name is required.' });
    }

    // Validate all macros are non-negative numbers
    // WHY: math on NaN or negative calories would corrupt the user's daily totals
    const macros = { calories, protein, carbs, fat };
    for (const [key, val] of Object.entries(macros)) {
      const num = Number(val);
      if (isNaN(num) || num < 0) {
        return res.status(400).json({ success: false, message: `${key} must be a non-negative number.` });
      }
    }

    const parsedIndex = parseInt(mealIndex);
    const log = await NutritionLog.findOne({ user: userId, date });
    if (!log) {
      return res.status(404).json({ success: false, message: 'Nutrition log not found for this date' });
    }

    if (parsedIndex < 0 || parsedIndex >= log.meals.length) {
      return res.status(400).json({ success: false, message: 'Invalid meal index' });
    }

    log.meals[parsedIndex].items.push({
      name: name.trim(),
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat)
    });
    await log.save();

    res.status(200).json({ success: true, log });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * updateWater — sets the user's water intake for the day.
 * Validates that amount is a non-negative number.
 */
export const updateWater = async (req, res) => {
  try {
    const { date } = req.params;
    const { amount } = req.body;
    const userId = req.user._id;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      return res.status(400).json({ success: false, message: 'amount must be a non-negative number (ml).' });
    }

    const log = await NutritionLog.findOne({ user: userId, date });
    if (!log) {
      return res.status(404).json({ success: false, message: 'Nutrition log not found' });
    }

    log.waterIntake = parsedAmount;
    await log.save();

    res.status(200).json({ success: true, log });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * updateWaterGoal — sets the user's daily water goal.
 * Validates that goal is a positive number (minimum 500ml is reasonable).
 */
export const updateWaterGoal = async (req, res) => {
  try {
    const { date } = req.params;
    const { goal } = req.body;
    const userId = req.user._id;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    const parsedGoal = Number(goal);
    if (isNaN(parsedGoal) || parsedGoal < 500) {
      return res.status(400).json({ success: false, message: 'goal must be a number of at least 500 ml.' });
    }

    const log = await NutritionLog.findOne({ user: userId, date });
    if (!log) {
      return res.status(404).json({ success: false, message: 'Nutrition log not found' });
    }

    log.waterGoal = parsedGoal;
    await log.save();

    res.status(200).json({ success: true, log });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
