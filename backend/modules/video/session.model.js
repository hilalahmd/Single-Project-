import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema({
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Session must belong to a client'] 
  },
  trainerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Trainer', 
    required: [true, 'Session must have an assigned trainer'] 
  },
  sessionType: { 
    type: String, 
    enum: ['Form Correction', 'Weekly Check-in', 'Consultation', 'Workout'],
    default: 'Weekly Check-in'
  },
  startTime: { 
    type: Date, 
    required: [true, 'Start time is required'] 
  },
  endTime: { 
    type: Date, 
    required: [true, 'End time is required'] 
  },
  status: { 
    type: String, 
    enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  meetingLink: { 
    type: String, 
    default: '' // Can be updated with a Zoom/Meet link later
  },
  notes: { 
    type: String, 
    default: '' 
  }
}, { timestamps: true })

// 🚀 Optimization: Adding indexes for faster querying
// Ithu vazhi client-neyo trainer-neyo vachu search cheyyumbol DB query valare fast aakum
sessionSchema.index({ clientId: 1, startTime: 1 })
sessionSchema.index({ trainerId: 1, startTime: 1 })
sessionSchema.index({ status: 1 })

export default mongoose.model('Session', sessionSchema)
