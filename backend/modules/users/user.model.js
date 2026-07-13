  import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'trainer', 'wellness_coach', 'admin'],
    default: 'user'
  },
  adminRole: {
    type: String,
    enum: ['Super Admin', 'Support Manager', 'Finance Manager'],
    // Optional: only used when role is 'admin'
  },
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active'
  },
  subscriptionTier: {
    type: String,
    enum: ['free', 'wellness', 'personal_training'],
    default: 'free'
  },
  avatar: { type: String, default: '' },
  preferredLanguage: { type: String, default: 'English' },
  languagesSpoken: [String],
  
  // ── BODY METRICS (from registration + diet form) ──
  bodyMetrics: {
    height: Number,
    weight: Number,
    age: Number,
    gender: String,
    activityLevel: String,
    goal: String,
    calorieTarget: Number
  },

  // ── NEW: Country for regional diet plans ──
  country: { type: String, default: '' },

  // ── NEW: Optional body measurements for accurate body fat % ──
  measurements: {
    neck: { type: Number },        // cm
    waist: { type: Number },       // cm
    navel: { type: Number },       // cm
    arm: { type: Number },         // cm
    wrist: { type: Number },       // cm
    hip: { type: Number },         // cm
    thigh: { type: Number }        // cm
  },

  assignedTrainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },

  dietGenerationCount: { type: Number, default: 0 },
  dietGenerationResetDate: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiry: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpiry: { type: Date }
}, { timestamps: true })

export default mongoose.model('User', userSchema)