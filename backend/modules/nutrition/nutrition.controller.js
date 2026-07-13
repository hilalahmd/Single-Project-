import NutritionLog from './nutrition.model.js';

// Default meals structure
const defaultMeals = [
  { name: 'Breakfast', items: [] },
  { name: 'Lunch', items: [] },
  { name: 'Dinner', items: [] },
  { name: 'Snacks', items: [] }
];

export const getLogByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id; // from protect middleware

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
    console.error('Error fetching nutrition log:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const addMealItem = async (req, res) => {
  try {
    const { date, mealIndex } = req.params;
    const { name, calories, protein, carbs, fat } = req.body;
    const userId = req.user.id;

    const log = await NutritionLog.findOne({ user: userId, date });
    if (!log) {
      return res.status(404).json({ success: false, message: 'Nutrition log not found for this date' });
    }

    if (mealIndex < 0 || mealIndex >= log.meals.length) {
      return res.status(400).json({ success: false, message: 'Invalid meal index' });
    }

    log.meals[mealIndex].items.push({ name, calories, protein, carbs, fat });
    await log.save();

    res.status(200).json({ success: true, log });
  } catch (error) {
    console.error('Error adding meal item:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const updateWater = async (req, res) => {
  try {
    const { date } = req.params;
    const { amount } = req.body; // absolute new intake value
    const userId = req.user.id;

    const log = await NutritionLog.findOne({ user: userId, date });
    if (!log) {
      return res.status(404).json({ success: false, message: 'Nutrition log not found' });
    }

    log.waterIntake = amount;
    await log.save();

    res.status(200).json({ success: true, log });
  } catch (error) {
    console.error('Error updating water:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const updateWaterGoal = async (req, res) => {
  try {
    const { date } = req.params;
    const { goal } = req.body; 
    const userId = req.user.id;

    const log = await NutritionLog.findOne({ user: userId, date });
    if (!log) {
      return res.status(404).json({ success: false, message: 'Nutrition log not found' });
    }

    log.waterGoal = goal;
    await log.save();

    res.status(200).json({ success: true, log });
  } catch (error) {
    console.error('Error updating water goal:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
