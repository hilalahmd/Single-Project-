import mongoose from 'mongoose'

const dietSchema = new mongoose.Schema({
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan', 
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String, // Example: "High Carb Day"
    required: true
  },
  dayNumber: {
    type: Number, 
    default: 1
  },
  meals: [
    {
      name: { type: String, required: true }, // e.g. "Breakfast"
      foods: { type: String, required: true }, // e.g. "Oats and 2 Eggs"
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      isCompleted: { type: Boolean, default: false }
    }
  ]
}, { timestamps: true })

const Diet = mongoose.model('Diet', dietSchema)
export default Diet
