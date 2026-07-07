import mongoose from 'mongoose'

const workoutSchema = new mongoose.Schema({
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan', // Namukku eath plan-nte workout aanu idhennu ariyan
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String, // Example: "Leg Day", "Chest & Triceps"
    required: true
  },
  dayNumber: {
    type: Number, // Ethamathe divasathe workout aanithu (Day 1, Day 2 etc)
    default: 1
  },
  exercises: [
    {
      name: { type: String, required: true },
      sets: { type: String, required: true }, // Example: "4x8" (4 sets of 8 reps)
      weight: { type: String }, // Optional, example: "20kg"
      isCompleted: { type: Boolean, default: false } // Client ithu cheythu theertho ennu ariyan
    }
  ],
  isCompleted: {
    type: Boolean,
    default: false // Oru divasathe muzhuvan workout completed aayo ennu check cheyyan
  }
}, { timestamps: true })

const Workout = mongoose.model('Workout', workoutSchema)
export default Workout
