import mongoose from 'mongoose'

const mealLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  macros: {
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 }
  },
  imageUrl: {
    type: String, // Base64 image vangan vendi
    default: null
  },
  loggedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })

const MealLog = mongoose.model('MealLog', mealLogSchema)

export default MealLog
