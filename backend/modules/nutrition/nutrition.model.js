import mongoose from 'mongoose';

const MealItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true }
});

const MealSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., 'Breakfast', 'Lunch', 'Dinner', 'Snacks'
  items: [MealItemSchema]
});

const NutritionLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // format: 'YYYY-MM-DD'
  meals: [MealSchema],
  waterIntake: { type: Number, default: 0 }, // in ml
  waterGoal: { type: Number, default: 3000 },
  targetCalories: { type: Number, default: 2000 },
  targetProtein: { type: Number, default: 150 },
  targetCarbs: { type: Number, default: 230 },
  targetFat: { type: Number, default: 67 }
}, { timestamps: true });

// Ensure one log per user per date
NutritionLogSchema.index({ user: 1, date: 1 }, { unique: true });

const NutritionLog = mongoose.model('NutritionLog', NutritionLogSchema);

export default NutritionLog;
