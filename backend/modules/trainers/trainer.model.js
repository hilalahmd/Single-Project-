import mongoose from 'mongoose'

const trainerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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
  reviewCount: { type: Number, default: 0 }
}, { timestamps: true })

export default mongoose.model('Trainer', trainerSchema)