import mongoose from 'mongoose';

const strengthLogSchema = new mongoose.Schema({
  exercise: { type: String, required: true },
  weight: { type: Number, required: true },
  reps: { type: Number, required: true },
  sets: { type: Number, required: true },
  estimated1RM: { type: Number },
  volume: { type: Number }
});

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // Format: 'YYYY-MM-DD'
  
  // Body Metrics
  weight: { type: Number },
  bodyFat: { type: Number },
  
  // Body Measurements
  measurements: {
    chest: { type: Number },
    waist: { type: Number },
    hips: { type: Number },
    thigh: { type: Number },
    arm: { type: Number },
    neck: { type: Number }
  },
  
  // Strength Logs (Bench Press, Squat, etc)
  strengthLogs: [strengthLogSchema]

}, { timestamps: true });

// Oru divasam oru entry mathram allow cheyyan
progressSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('ProgressLog', progressSchema);
