import mongoose from 'mongoose'

const planSchema = new mongoose.Schema({
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Ithu trainer-nte ID aayirikkum
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Ithu client-nte ID
    required: true
  },
  title: {
    type: String,
    required: true, // Example: "30 Days Weight Loss Plan"
  },
  description: {
    type: String
  },
  type: {
    type: String,
    enum: ['workout', 'diet', 'hybrid'], // Plan type
    default: 'workout'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true }) // createdAt and updatedAt automatic aayi varum

const Plan = mongoose.model('Plan', planSchema)
export default Plan
