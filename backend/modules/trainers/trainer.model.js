import mongoose from 'mongoose'

const trainerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  role: { type: String, enum: ['trainer', 'wellness_coach'], default: 'trainer' },
  bio: { type: String, default: '' },
  specialties: [String],
  languagesSpoken: [String],
  certifications: [String],
  profilePhoto: { type: String, default: '' },
  experience: { type: Number, default: 0 },
  
  // Admin Approval Workflow
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'suspended'], 
    default: 'pending' 
  },
  rejectionReason: { type: String, default: '' },
  reason: { type: String, default: '' }, // For suspension reason
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  subscriptionExpiresAt: { type: Date }, // Free trial or Paid Platform Subscription Expiry
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  suspendedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  suspendedAt: { type: Date },

  pricing: {
    wellnessMonthly: { type: Number, default: 0 },
    personalTrainingMonthly: { type: Number, default: 0 }
  },
  earnings: {
    balance: { type: Number, default: 0 },
    totalEarned: { type: Number, default: 0 },
    withdrawn: { type: Number, default: 0 }
  },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  reviews: [{
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true },
    comment: { type: String, default: '' },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true })

// Index on userId — most frequent query: findOne({ userId: req.user._id })
// Used by getMyTrainerProfile, getTrainerDashboardStats, schedule auth checks
trainerSchema.index({ userId: 1 }, { unique: true })

// Index on status — admin panel and checkout page both filter by status: 'approved'
trainerSchema.index({ status: 1 })

export default mongoose.model('Trainer', trainerSchema)